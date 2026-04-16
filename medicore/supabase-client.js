// ══════════════════════════════════════════════════════════════════
// MediCore — Supabase Client
// ══════════════════════════════════════════════════════════════════
// 1. Crea tu proyecto gratis en https://supabase.com
// 2. Ve a Project Settings > API
// 3. Copia la URL y la anon/public key aquí abajo
// ══════════════════════════════════════════════════════════════════

const SUPABASE_URL = 'https://uxtmzcojuolnubzbdkld.supabase.co'
const SUPABASE_KEY = 'sb_publishable_Wg4-FN8ChSWMsAhm2SIcxQ_-RC8ov4P'

// ── Cliente Supabase ──
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
})

// ── Estado global ──
let _doctorId = null
let _pendingSync = false

// Indica si las credenciales fueron configuradas
function sbConfigured() {
  return !SUPABASE_URL.includes('TU-PROYECTO') && !SUPABASE_KEY.includes('TU-ANON')
}

// ════════════════════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════════════════════

async function sbLogin(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

async function sbLogout() {
  await sb.auth.signOut()
  _doctorId = null
}

async function sbGetSession() {
  const { data } = await sb.auth.getSession()
  return data.session
}

// Obtiene o crea el perfil del doctor en la BD
async function sbInitDoctor(user) {
  const { data, error } = await sb
    .from('doctores')
    .select('id, nombre, apellido, especialidad, email, telefono, consultorio, direccion, horario')
    .eq('user_id', user.id)
    .single()

  if (data) {
    _doctorId = data.id
    return data
  }

  // Primera vez: crear perfil
  const { data: newDoc, error: err2 } = await sb.from('doctores').insert({
    user_id: user.id,
    nombre: 'Doctor',
    apellido: '',
    email: user.email,
    especialidad: 'Médico General',
  }).select('id').single()

  if (newDoc) _doctorId = newDoc.id
  return newDoc
}

function getDoctorId() { return _doctorId }

// ════════════════════════════════════════════════════════════════
// CARGA DE DATOS
// ════════════════════════════════════════════════════════════════

async function sbLoadAll() {
  if (!_doctorId || !navigator.onLine) return null

  const [pRes, cRes, aRes] = await Promise.all([
    sb.from('pacientes').select('*').eq('doctor_id', _doctorId).order('created_at', { ascending: false }),
    sb.from('consultas').select('*').eq('doctor_id', _doctorId).order('created_at', { ascending: false }),
    sb.from('citas').select('*').eq('doctor_id', _doctorId).order('fecha', { ascending: true }),
  ])

  if (pRes.error || cRes.error || aRes.error) {
    console.warn('Error cargando datos de Supabase:', pRes.error || cRes.error || aRes.error)
    return null
  }

  return {
    patients:      (pRes.data || []).map(mapPatientFromDB),
    consultations: (cRes.data || []).map(mapConsultFromDB),
    appointments:  (aRes.data || []).map(mapApptFromDB),
  }
}

// ════════════════════════════════════════════════════════════════
// GUARDAR PACIENTE
// ════════════════════════════════════════════════════════════════

async function sbSavePatient(patient) {
  if (!_doctorId || !navigator.onLine) return null

  const row = {
    doctor_id:  _doctorId,
    nombre:     patient.nombre,
    apellido:   patient.apellido,
    cedula:     patient.cedula   || null,
    fecha_nac:  patient.nacimiento || null,
    sexo:       patient.sexo     || null,
    telefono:   patient.tel      || null,
    email:      patient.email    || null,
    direccion:  patient.direccion || null,
    alergias:   patient.alergias || null,
    notas:      patient.notas    || null,
    estado:     patient.estado   || 'activo',
  }

  if (isUUID(patient.id)) {
    // Actualizar existente
    await sb.from('pacientes').update(row).eq('id', patient.id)
    return patient.id
  } else {
    // Insertar nuevo → Supabase devuelve el UUID real
    const { data, error } = await sb.from('pacientes').insert(row).select('id').single()
    if (error) { console.warn('Error guardando paciente:', error); return null }
    return data?.id
  }
}

// ════════════════════════════════════════════════════════════════
// ELIMINAR PACIENTE
// ════════════════════════════════════════════════════════════════

async function sbDeletePatient(id) {
  if (!navigator.onLine || !isUUID(id)) return
  await sb.from('pacientes').delete().eq('id', id)
}

// ════════════════════════════════════════════════════════════════
// GUARDAR CONSULTA
// ════════════════════════════════════════════════════════════════

async function sbSaveConsult(consult) {
  if (!_doctorId || !navigator.onLine) return null

  const row = {
    doctor_id:   _doctorId,
    paciente_id: consult.pacienteId,
    tipo:        consult.tipo,
    fecha:       toDateStr(consult.fecha),
    diagnostico: consult.diagnostico,
    tratamiento: consult.tratamiento || null,
    notas:       consult.notas       || null,
    tags:        consult.tags        || [],
    cie10:                  consult.cie10                  || [],
    procedimiento_estetico: consult.procedimientoEstetico  || null,
  }

  if (isUUID(consult.id)) {
    await sb.from('consultas').update(row).eq('id', consult.id)
    return consult.id
  } else {
    const { data, error } = await sb.from('consultas').insert(row).select('id').single()
    if (error) { console.warn('Error guardando consulta:', error); return null }
    return data?.id
  }
}

// ════════════════════════════════════════════════════════════════
// GUARDAR CITA
// ════════════════════════════════════════════════════════════════

async function sbSaveAppt(appt) {
  if (!_doctorId || !navigator.onLine) return null

  const row = {
    doctor_id:   _doctorId,
    paciente_id: appt.pacienteId,
    fecha:       appt.fecha,
    hora:        appt.hora,
    motivo:      appt.motivo  || null,
    estado:      appt.estado  || 'pending',
  }

  if (isUUID(appt.id)) {
    await sb.from('citas').update(row).eq('id', appt.id)
    return appt.id
  } else {
    const { data, error } = await sb.from('citas').insert(row).select('id').single()
    if (error) { console.warn('Error guardando cita:', error); return null }
    return data?.id
  }
}

async function sbUpdateApptStatus(id, status) {
  if (!navigator.onLine || !isUUID(id)) return
  await sb.from('citas').update({ estado: status }).eq('id', id)
}

// ════════════════════════════════════════════════════════════════
// MAPEADORES  (Supabase → formato interno de la app)
// ════════════════════════════════════════════════════════════════

function mapPatientFromDB(p) {
  return {
    id:         p.id,
    nombre:     p.nombre,
    apellido:   p.apellido,
    cedula:     p.cedula      || '',
    nacimiento: p.fecha_nac   || '',
    sexo:       p.sexo        || '',
    tel:        p.telefono    || '',
    email:      p.email       || '',
    direccion:  p.direccion   || '',
    alergias:   p.alergias    || '',
    notas:      p.notas       || '',
    estado:     p.estado      || 'activo',
    creado:     p.created_at,
  }
}

function mapConsultFromDB(c) {
  return {
    id:           c.id,
    pacienteId:   c.paciente_id,
    tipo:         c.tipo,
    fecha:        c.fecha ? c.fecha + 'T00:00:00.000Z' : c.created_at,
    diagnostico:  c.diagnostico,
    tratamiento:  c.tratamiento || '',
    notas:        c.notas       || '',
    tags:         c.tags        || [],
    cie10:                 c.cie10                  || [],
    procedimientoEstetico: c.procedimiento_estetico || null,
  }
}

function mapApptFromDB(a) {
  return {
    id:        a.id,
    pacienteId: a.paciente_id,
    fecha:     a.fecha,
    hora:      a.hora ? a.hora.slice(0, 5) : '08:00',
    motivo:    a.motivo || '',
    estado:    a.estado || 'pending',
  }
}

// ════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════

function isUUID(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
}

function toDateStr(isoOrDate) {
  if (!isoOrDate) return new Date().toISOString().split('T')[0]
  return new Date(isoOrDate).toISOString().split('T')[0]
}

// ════════════════════════════════════════════════════════════════
// STORAGE — IMÁGENES DE CONSULTA
// ════════════════════════════════════════════════════════════════

async function sbUploadImages(consultId, files) {
  const BUCKET = 'medicore-imagenes'
  const urls = []
  for (const file of files) {
    const ext = file.name.split('.').pop().toLowerCase()
    const path = `consultas/${consultId}/${Date.now()}_${Math.random().toString(36).substr(2,6)}.${ext}`
    const { data, error } = await sb.storage.from(BUCKET).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (data) {
      const { data: urlData } = sb.storage.from(BUCKET).getPublicUrl(path)
      urls.push(urlData.publicUrl)
    } else {
      console.warn('Error subiendo imagen:', error?.message)
    }
  }
  return urls
}

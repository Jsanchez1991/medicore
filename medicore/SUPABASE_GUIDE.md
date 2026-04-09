# 🔌 Guía: Conectar MediCore con Supabase

## Paso 1 — Crear cuenta y proyecto en Supabase

1. Ve a https://supabase.com y crea una cuenta gratuita
2. Click en "New Project"
3. Elige un nombre: `medicore`
4. Elige una contraseña segura para la base de datos
5. Selecciona la región más cercana (ej: South America - São Paulo)
6. Espera ~2 minutos a que se cree el proyecto

---

## Paso 2 — Crear las tablas

1. En tu proyecto Supabase, ve a **SQL Editor** (menú izquierdo)
2. Click en **"New Query"**
3. Copia y pega todo el contenido de `supabase/migrations/001_initial_schema.sql`
4. Click en **"Run"** (o Ctrl+Enter)
5. Verifica en **Table Editor** que aparecen las tablas: `doctores`, `pacientes`, `consultas`, `citas`

---

## Paso 3 — Obtener tus credenciales

1. Ve a **Project Settings** > **API**
2. Copia:
   - **Project URL** → es tu `SUPABASE_URL`
   - **anon public key** → es tu `SUPABASE_ANON_KEY`

---

## Paso 4 — Integrar en index.html

Agrega esto dentro de `<head>` en tu `index.html`, **antes** del `</head>`:

```html
<!-- Supabase SDK -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = 'https://TU-PROJECT-ID.supabase.co'
  const SUPABASE_KEY = 'TU-ANON-KEY'
  const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
</script>
```

---

## Paso 5 — Reemplazar localStorage por Supabase

En el archivo `index.html`, localiza el objeto `DB` y reemplaza los métodos:

### Antes (localStorage):
```javascript
save() {
  localStorage.setItem('mc_patients', JSON.stringify(this.patients))
}
load() {
  this.patients = JSON.parse(localStorage.getItem('mc_patients') || '[]')
}
```

### Después (Supabase):
```javascript
async loadPatients() {
  const { data, error } = await _supabase
    .from('pacientes')
    .select('*')
    .order('created_at', { ascending: false })
  if (!error) this.patients = data
}

async savePatient(patient) {
  const { data, error } = await _supabase
    .from('pacientes')
    .upsert(patient)
    .select()
  return { data, error }
}

async deletePatient(id) {
  const { error } = await _supabase
    .from('pacientes')
    .delete()
    .eq('id', id)
  return { error }
}
```

---

## Paso 6 — Autenticación real con Supabase Auth

```javascript
// Registro
const { data, error } = await _supabase.auth.signUp({
  email: 'dr.garcia@consultorio.com',
  password: 'contraseña-segura'
})

// Login
const { data, error } = await _supabase.auth.signInWithPassword({
  email: 'dr.garcia@consultorio.com',
  password: 'contraseña-segura'
})

// Logout
await _supabase.auth.signOut()

// Obtener sesión actual
const { data: { session } } = await _supabase.auth.getSession()
```

---

## Alternativa: Railway

Si prefieres Railway (https://railway.app) como backend:

1. Crea un proyecto en Railway
2. Agrega un plugin de **PostgreSQL**
3. Usa la `DATABASE_URL` que te da Railway
4. Necesitarás un backend (Node.js/Express o similar) como intermediario
5. Railway es mejor si quieres más control del servidor

**Recomendación**: Para empezar, **Supabase es más fácil** porque te da base de datos + autenticación + API REST automática sin escribir backend.

---

## Checklist de Producción

- [ ] Tablas creadas en Supabase
- [ ] RLS (Row Level Security) activado ✓ (ya está en el SQL)
- [ ] Variables de entorno configuradas
- [ ] Credenciales demo eliminadas del código
- [ ] HTTPS activado (Vercel/Netlify lo hacen automático)
- [ ] Service Worker funcionando
- [ ] Probado en móvil (instalación PWA)

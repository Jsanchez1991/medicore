# 🩺 MediCore — Sistema de Gestión para Consultorio Médico

PWA completa para gestión de pacientes, historial médico, agenda y reportes.

## Stack Tecnológico

- **Frontend**: HTML + CSS + JavaScript vanilla (sin frameworks, fácil de mantener)
- **PWA**: Service Worker + Web App Manifest (instalable en móvil/desktop)
- **Base de datos local**: localStorage (demo) → migrar a Supabase
- **Autenticación**: Supabase Auth (por integrar)
- **Hosting recomendado**: Vercel / Netlify / GitHub Pages

---

## Estructura del Proyecto

```
medicore/
├── index.html          # App principal (toda la UI)
├── sw.js               # Service Worker (offline support)
├── manifest.json       # PWA manifest
├── .env.example        # Variables de entorno
├── .gitignore          # Archivos a ignorar en Git
├── README.md           # Este archivo
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql   # Schema de base de datos
```

---

## Inicio Rápido (Demo local)

```bash
# 1. Clonar el repo
git clone https://github.com/tu-usuario/medicore.git
cd medicore

# 2. Abrir con cualquier servidor local
npx serve .
# o simplemente abrir index.html en el navegador
```

---

## Conectar Supabase (Base de Datos Real)

### 1. Crear proyecto en Supabase
- Ve a https://supabase.com
- Crea un nuevo proyecto
- Copia tu `SUPABASE_URL` y `SUPABASE_ANON_KEY`

### 2. Crear las tablas
Ejecuta el archivo `supabase/migrations/001_initial_schema.sql` en el SQL Editor de Supabase.

### 3. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus credenciales de Supabase
```

### 4. Agregar Supabase al proyecto
En `index.html`, agrega antes de cerrar `</head>`:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = 'https://xxxx.supabase.co'
  const SUPABASE_KEY = 'tu-anon-key'
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
</script>
```

---

## Subir a Git

```bash
git init
git add .
git commit -m "feat: MediCore PWA inicial"
git branch -M main
git remote add origin https://github.com/tu-usuario/medicore.git
git push -u origin main
```

---

## Deploy en Vercel (recomendado)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Para producción
vercel --prod
```

O conecta tu repositorio de GitHub directamente en https://vercel.com

---

## Deploy en Netlify

```bash
# Drag & drop la carpeta en https://app.netlify.com
# O con CLI:
npm i -g netlify-cli
netlify deploy --prod --dir .
```

---

## Roadmap / Próximos Pasos

- [ ] Integrar Supabase Auth (login real con email/contraseña)
- [ ] Migrar localStorage → Supabase Database
- [ ] Módulo de Facturación / Pagos
- [ ] Recetas médicas con PDF
- [ ] Notificaciones push para recordatorio de citas
- [ ] Integración WhatsApp (recordatorio de citas)
- [ ] Multi-doctor / Multi-consultorio
- [ ] App móvil nativa (Capacitor)

---

## Credenciales Demo

```
Usuario:    dr.garcia@consultorio.com
Contraseña: medicore2025
```

---

## Licencia

MIT — Libre para uso comercial y personal.

---

## Formulario Público de Citas (booking.html)

Página separada sin login que los pacientes usan para agendar citas.

**URL pública:** `tuconsultorio.com/booking.html`

**Flujo del paciente:**
1. Ingresa su número de celular
2. Sistema detecta si es paciente nuevo o existente
3. Pre-llena sus datos si ya está registrado
4. Elige fecha en calendario (solo días laborables)
5. Elige hora disponible (sin choques automáticos)
6. Confirma → botón de WhatsApp pre-armado al doctor

**Compartir el link con pacientes:**
- Por WhatsApp: envía el link directamente
- En redes sociales
- En la firma de email
- En Google Maps / página web

**Configurar en booking.html:**
```javascript
const CONFIG = {
  doctor: {
    nombre: 'Dr. Tu Nombre',
    tel: '593991234567',     // Tu número de WhatsApp sin + ni espacios
    direccion: 'Tu dirección',
    horario: 'Lun–Vie: 8:00–17:00',
  },
  agenda: {
    horaInicio: 8,           // Hora de inicio de atención
    horaFin: 17,             // Hora de fin
    duracionMin: 30,         // Duración de cada cita en minutos
    diasLaborables: [1,2,3,4,5], // 1=Lun, 2=Mar, 3=Mié, 4=Jue, 5=Vie
  }
}
```

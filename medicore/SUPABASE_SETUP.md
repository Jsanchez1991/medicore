# 🚀 Conectar MediCore a Supabase — Guía Paso a Paso

## ¿Qué necesitas?
- Cuenta gratuita en [supabase.com](https://supabase.com) (no requiere tarjeta)
- 10 minutos

---

## Paso 1 — Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea una cuenta
2. Haz clic en **"New Project"**
3. Ponle nombre: `medicore`
4. Elige una contraseña para la base de datos (guárdala)
5. Selecciona la región más cercana (ej. US East o São Paulo)
6. Clic en **"Create new project"** — tarda ~1 minuto

---

## Paso 2 — Crear las tablas

1. En el panel de Supabase, ve a **SQL Editor** (ícono de terminal)
2. Haz clic en **"New query"**
3. Copia y pega todo el contenido del archivo `supabase/migrations/001_initial_schema.sql`
4. Haz clic en **"Run"** (▶)
5. Deberías ver: `Success. No rows returned`

---

## Paso 3 — Obtener tus credenciales

1. Ve a **Project Settings** → **API**
2. Copia estos dos valores:
   - **Project URL**: algo como `https://abcdefgh.supabase.co`
   - **anon / public key**: una cadena larga que empieza con `eyJ...`

---

## Paso 4 — Configurar MediCore

Abre el archivo `supabase-client.js` y reemplaza las dos líneas del principio:

```javascript
const SUPABASE_URL = 'https://TU-PROYECTO.supabase.co'   // ← pega tu Project URL aquí
const SUPABASE_KEY = 'TU-ANON-PUBLIC-KEY'                 // ← pega tu anon key aquí
```

Ejemplo real:
```javascript
const SUPABASE_URL = 'https://xyzabcdef.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

---

## Paso 5 — Crear tu usuario doctor

1. En Supabase, ve a **Authentication** → **Users**
2. Haz clic en **"Invite user"** o **"Add user"**
3. Ingresa tu email y una contraseña segura
4. Confirma el email si te llega uno

---

## Paso 6 — Probar la app

1. Abre una terminal en la carpeta `medicore`
2. Ejecuta: `python -m http.server 8080`
3. Abre en el navegador: `http://localhost:8080`
4. Inicia sesión con el email y contraseña que creaste en Supabase
5. ¡Listo! Los datos se guardan en la nube

---

## Cómo funciona (offline incluido)

- **Con internet**: los datos se guardan en Supabase Y en localStorage
- **Sin internet**: la app funciona con los datos del localStorage (caché local)
- **Al reconectar**: los cambios pendientes se sincronizan automáticamente

---

## Modo demo (sin Supabase)

Si las credenciales en `supabase-client.js` no están configuradas, la app
funciona en modo demo local con datos de ejemplo:

- **Usuario**: `dr.garcia@consultorio.com`
- **Contraseña**: `medicore2025`

Los datos en modo demo solo se guardan en el navegador (localStorage).

---

## Problemas frecuentes

**"Error: Invalid API key"**
→ Revisa que copiaste la `anon/public key`, NO la `service_role key`

**"Error: relation does not exist"**
→ No se ejecutaron las migraciones. Repite el Paso 2

**"Auth session missing"**
→ Confirma tu email en el enlace que envió Supabase

**La app no carga las tablas**
→ Verifica que el RLS (Row Level Security) esté activado con las políticas del SQL

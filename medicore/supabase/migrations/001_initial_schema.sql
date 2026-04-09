-- ============================================================
-- MediCore — Schema inicial para Supabase
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────
-- TABLA: doctores (perfil del doctor, ligado a auth.users)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS doctores (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  especialidad TEXT DEFAULT 'Médico General',
  cedula_prof TEXT,
  email       TEXT UNIQUE NOT NULL,
  telefono    TEXT,
  consultorio TEXT,
  direccion   TEXT,
  horario     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TABLA: pacientes
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pacientes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id   UUID REFERENCES doctores(id) ON DELETE CASCADE,
  nombre      TEXT NOT NULL,
  apellido    TEXT NOT NULL,
  cedula      TEXT,
  fecha_nac   DATE,
  sexo        CHAR(1) CHECK (sexo IN ('M','F')),
  telefono    TEXT,
  email       TEXT,
  direccion   TEXT,
  alergias    TEXT,
  notas       TEXT,
  estado      TEXT DEFAULT 'nuevo' CHECK (estado IN ('nuevo','activo','inactivo')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TABLA: consultas (historial médico)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS consultas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id   UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  doctor_id     UUID REFERENCES doctores(id) ON DELETE CASCADE,
  tipo          TEXT DEFAULT 'Consulta General'
                  CHECK (tipo IN ('Consulta General','Control','Urgencia','Seguimiento')),
  fecha         DATE NOT NULL DEFAULT CURRENT_DATE,
  diagnostico   TEXT NOT NULL,
  tratamiento   TEXT,
  notas         TEXT,
  tags          TEXT[],  -- Array de etiquetas ej: ['Hipertensión','Losartán']
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- TABLA: citas (agenda)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS citas (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  paciente_id   UUID REFERENCES pacientes(id) ON DELETE CASCADE,
  doctor_id     UUID REFERENCES doctores(id) ON DELETE CASCADE,
  fecha         DATE NOT NULL,
  hora          TIME NOT NULL,
  motivo        TEXT,
  estado        TEXT DEFAULT 'pending'
                  CHECK (estado IN ('pending','confirmed','done','cancelled')),
  notas         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — Cada doctor solo ve sus datos
-- ────────────────────────────────────────────────────────────

-- Habilitar RLS en todas las tablas
ALTER TABLE doctores   ENABLE ROW LEVEL SECURITY;
ALTER TABLE pacientes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultas  ENABLE ROW LEVEL SECURITY;
ALTER TABLE citas      ENABLE ROW LEVEL SECURITY;

-- Políticas: el doctor autenticado solo accede a sus propios datos
CREATE POLICY "doctores_own" ON doctores
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "pacientes_own" ON pacientes
  FOR ALL USING (
    doctor_id IN (SELECT id FROM doctores WHERE user_id = auth.uid())
  );

CREATE POLICY "consultas_own" ON consultas
  FOR ALL USING (
    doctor_id IN (SELECT id FROM doctores WHERE user_id = auth.uid())
  );

CREATE POLICY "citas_own" ON citas
  FOR ALL USING (
    doctor_id IN (SELECT id FROM doctores WHERE user_id = auth.uid())
  );

-- ────────────────────────────────────────────────────────────
-- ÍNDICES para mejor rendimiento
-- ────────────────────────────────────────────────────────────
CREATE INDEX idx_pacientes_doctor   ON pacientes(doctor_id);
CREATE INDEX idx_consultas_paciente ON consultas(paciente_id);
CREATE INDEX idx_consultas_doctor   ON consultas(doctor_id);
CREATE INDEX idx_citas_fecha        ON citas(fecha);
CREATE INDEX idx_citas_doctor       ON citas(doctor_id);

-- ────────────────────────────────────────────────────────────
-- FUNCIÓN: actualizar updated_at automáticamente
-- ────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_doctores_updated
  BEFORE UPDATE ON doctores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_pacientes_updated
  BEFORE UPDATE ON pacientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ────────────────────────────────────────────────────────────
-- DATOS DE EJEMPLO (opcional, para testing)
-- Comentar en producción
-- ────────────────────────────────────────────────────────────
/*
INSERT INTO pacientes (doctor_id, nombre, apellido, cedula, fecha_nac, sexo, telefono, email, alergias, notas, estado)
VALUES
  ('TU-DOCTOR-UUID', 'María',  'González', '1701234567', '1985-03-15', 'F', '+593991111111', 'maria@email.com',  'Aspirina',   'Hipertensión controlada', 'activo'),
  ('TU-DOCTOR-UUID', 'Juan',   'Pérez',    '1702345678', '1972-07-22', 'M', '+593992222222', 'juan@email.com',   '',           'Diabetes tipo 2',         'activo'),
  ('TU-DOCTOR-UUID', 'Ana',    'Torres',   '1703456789', '1990-11-05', 'F', '+593993333333', 'ana@email.com',    'Penicilina', '',                        'activo');
*/

-- ────────────────────────────────────────────────────────────
-- TABLA: horarios_disponibles (configuración del doctor)
-- ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS horarios_disponibles (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id     UUID REFERENCES doctores(id) ON DELETE CASCADE,
  dia_semana    INT CHECK (dia_semana BETWEEN 0 AND 6), -- 0=Dom, 1=Lun...
  hora_inicio   TIME NOT NULL DEFAULT '08:00',
  hora_fin      TIME NOT NULL DEFAULT '17:00',
  duracion_min  INT DEFAULT 30,
  activo        BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE horarios_disponibles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "horarios_own" ON horarios_disponibles
  FOR ALL USING (
    doctor_id IN (SELECT id FROM doctores WHERE user_id = auth.uid())
  );

-- Vista pública para el formulario de booking (sin autenticación)
CREATE OR REPLACE VIEW citas_ocupadas_publicas AS
  SELECT fecha, hora, doctor_id
  FROM citas
  WHERE estado != 'cancelled';

-- Permitir lectura pública de citas ocupadas (solo fecha y hora, no datos del paciente)
GRANT SELECT ON citas_ocupadas_publicas TO anon;

-- ============================================================
-- MediCore — Migración: Días Bloqueados
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS dias_bloqueados (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  doctor_id   UUID REFERENCES doctores(id) ON DELETE CASCADE,
  fecha       DATE NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(doctor_id, fecha) -- Evitar duplicados del mismo día para el mismo doctor
);

-- Habilitar RLS
ALTER TABLE dias_bloqueados ENABLE ROW LEVEL SECURITY;

-- El doctor solo puede ver/modificar sus propios bloqueos
CREATE POLICY "dias_bloqueados_own" ON dias_bloqueados
  FOR ALL USING (
    doctor_id IN (SELECT id FROM doctores WHERE user_id = auth.uid())
  );

-- Vista pública para los bots (sin datos sensibles, solo qué días están bloqueados)
CREATE OR REPLACE VIEW dias_bloqueados_publicos AS
  SELECT fecha, doctor_id
  FROM dias_bloqueados;

GRANT SELECT ON dias_bloqueados_publicos TO anon;

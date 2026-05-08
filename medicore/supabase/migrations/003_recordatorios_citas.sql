-- ============================================================
-- MediCore - Recordatorios automaticos de citas
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

ALTER TABLE citas
  ADD COLUMN IF NOT EXISTS recordatorio_24h_enviado BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS recordatorio_2h_enviado  BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_citas_recordatorio_24h
  ON citas(doctor_id, fecha, recordatorio_24h_enviado)
  WHERE estado != 'cancelled';

CREATE INDEX IF NOT EXISTS idx_citas_recordatorio_2h
  ON citas(doctor_id, fecha, recordatorio_2h_enviado)
  WHERE estado != 'cancelled';

require('dotenv').config({path: './medicore-bot/.env'});
const { createClient } = require('@supabase/supabase-js');

const sb = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
);

async function run() {
  console.log("Checking Supabase connection for cedula 1311381188...");
  
  const clean = "1311381188".replace(/\D/g, '');
  const { data, error } = await sb
    .from('pacientes')
    .select('id, nombre, apellido, cedula, tel, email, nacimiento, sexo, alergias')
    .eq('cedula', clean);
    
  console.log("Result for cedula match:", data);
  if (error) console.error("Error from Supabase:", error);

  const { data: allPacientes } = await sb.from('pacientes').select('id, nombre, apellido, cedula');
  console.log("All pacientes cedulas in DB:", allPacientes?.map(p => p.cedula));
}
run();

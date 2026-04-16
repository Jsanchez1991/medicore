// Catálogo de Procedimientos Estéticos — MediCore
const PROCEDIMIENTOS_ESTETICOS = [
  {
    categoria: "Corporal",
    icono: "🏋️",
    items: [
      { nombre: "Liposucción", tecnicas: ["Liposucción tradicional","VASER (Ultrasonido)","Liposucción láser","Body-Jet (Agua)","MicroLipo"] },
      { nombre: "Abdominoplastia", tecnicas: ["Abdominoplastia completa","Mini abdominoplastia","Fleur-de-lis"] },
      { nombre: "Gluteoplastia", tecnicas: ["Implantes glúteos","Lipotransferencia (BBL)","Relleno con ácido hialurónico"] },
      { nombre: "Mamoplastia de aumento", tecnicas: ["Implantes de silicona","Lipotransferencia"] },
      { nombre: "Mastopexia (levantamiento de mama)", tecnicas: ["Con implante","Sin implante","Periareolar","Vertical","Anchor"] },
      { nombre: "Reducción mamaria", tecnicas: ["Técnica vertical","Técnica en T invertida","Técnica periareolar"] },
      { nombre: "Braquioplastia (brazo)", tecnicas: ["Braquioplastia estándar","Mini braquioplastia"] },
      { nombre: "Cruroplastia (muslos)", tecnicas: ["Cruroplastia interna","Cruroplastia externa"] },
      { nombre: "Lifting corporal", tecnicas: ["Lifting de muslos","Lifting de glúteos","Body lift circular"] },
      { nombre: "Ginecomastia", tecnicas: ["Liposucción","Resección glandular","Combinada"] },
    ]
  },
  {
    categoria: "Íntima Masculina",
    icono: "👨",
    items: [
      { nombre: "Alargamiento peneano", tecnicas: ["Ligamentólisis","Transferencia de grasa","Implante de silicona"] },
      { nombre: "Engrosamiento peneano", tecnicas: ["Lipotransferencia (grasa autóloga)","Ácido hialurónico","Injerto dérmico"] },
      { nombre: "Implante peneano (prótesis)", tecnicas: ["Prótesis maleables","Prótesis inflables de 2 piezas","Prótesis inflables de 3 piezas"] },
      { nombre: "Escroto-plastia", tecnicas: ["Reducción escrotal","Rejuvenecimiento escrotal"] },
      { nombre: "Circuncisión estética", tecnicas: ["Técnica convencional","Técnica con bisturí eléctrico","Técnica con láser"] },
      { nombre: "Frenuloplastia", tecnicas: ["Técnica estándar"] },
      { nombre: "Liposucción pubiana (puboplastia)", tecnicas: ["Liposucción","Lifting púbico"] },
    ]
  },
  {
    categoria: "Íntima Femenina",
    icono: "👩",
    items: [
      { nombre: "Labioplastia (labios menores)", tecnicas: ["Resección lineal","Técnica en cuña","Técnica deepithelización"] },
      { nombre: "Labioplastia (labios mayores)", tecnicas: ["Aumento con grasa","Reducción quirúrgica","Relleno con ácido hialurónico"] },
      { nombre: "Vaginoplastia (rejuvenecimiento vaginal)", tecnicas: ["Colporrafia posterior","Vaginoplastia láser","Radiofrecuencia"] },
      { nombre: "Himen-oplastia", tecnicas: ["Técnica estándar"] },
      { nombre: "Clitoroplastia", tecnicas: ["Reducción clitoral","Capuchón clitoral"] },
      { nombre: "Perineoplastia", tecnicas: ["Técnica estándar"] },
      { nombre: "Liposucción del monte de Venus", tecnicas: ["Liposucción","Lifting del monte"] },
      { nombre: "Rejuvenecimiento íntimo con láser", tecnicas: ["Láser CO2 fraccionado","Fotona"] },
      { nombre: "PRP íntimo femenino (O-Shot)", tecnicas: ["PRP autólogo"] },
    ]
  },
  {
    categoria: "Facial",
    icono: "😊",
    items: [
      { nombre: "Rinoplastia", tecnicas: ["Rinoplastia abierta","Rinoplastia cerrada","Rinoplastia ultrasónica","Rinoplastia con ácido hialurónico"] },
      { nombre: "Bichectomía (bolas de Bichat)", tecnicas: ["Técnica estándar"] },
      { nombre: "Mentoplastia (implante de mentón)", tecnicas: ["Implante sólido","Lipotransferencia"] },
      { nombre: "Otoplastia (orejas)", tecnicas: ["Técnica de Mustardé","Técnica de Furnas"] },
      { nombre: "Blefaroplastia", tecnicas: ["Superior","Inferior","Superior e inferior"] },
      { nombre: "Lifting facial (ritidoplastia)", tecnicas: ["SMAS","Mini lifting","Lifting profundo","Lifting cervicofacial"] },
      { nombre: "Lipectomía cervical (papada)", tecnicas: ["Liposucción","Lipectomía directa"] },
      { nombre: "Lifting de cejas (frontoplastia)", tecnicas: ["Endoscópico","Coronal","Directo"] },
      { nombre: "Implantes malares (pómulos)", tecnicas: ["Implante sólido","Lipotransferencia","Ácido hialurónico"] },
      { nombre: "Labio leporino secundario", tecnicas: ["Rinolabio-plastia"] },
    ]
  },
  {
    categoria: "Mínimamente Invasivo",
    icono: "💉",
    items: [
      { nombre: "Toxina botulínica (Botox)", tecnicas: ["Botox cosmético","Botox hiperhidrosis","Botox maséteros","Botox trampantojo (Nefertiti)"] },
      { nombre: "Rellenos dérmicos", tecnicas: ["Ácido hialurónico labios","Ácido hialurónico surcos","Ácido hialurónico pómulos","Ácido hialurónico mentón","Ácido hialurónico ojeras","Hidroxiapatita cálcica"] },
      { nombre: "Hilos tensores", tecnicas: ["Hilos PDO lisos","Hilos PDO espiculados","Hilos de PLLA","Hilos de PCL"] },
      { nombre: "PRP (Plasma Rico en Plaquetas)", tecnicas: ["PRP facial","PRP capilar","PRP íntimo (P-Shot)","PRP articular"] },
      { nombre: "Mesoterapia", tecnicas: ["Facial rejuvenecedora","Corporal reductiva","Capilar"] },
      { nombre: "Bioestimuladores de colágeno", tecnicas: ["Sculptra (PLLA)","Radiesse","Ellansé"] },
      { nombre: "Lipólisis inyectable", tecnicas: ["Fosfatidilcolina","Ácido desoxicólico (Kybella)"] },
      { nombre: "Carboxiterapia", tecnicas: ["Facial","Corporal","Ojeras"] },
    ]
  },
  {
    categoria: "Láser y Energía",
    icono: "✨",
    items: [
      { nombre: "Láser CO2 fraccionado", tecnicas: ["Rejuvenecimiento facial","Cicatrices acné","Manchas","Estrías"] },
      { nombre: "Láser Nd:YAG", tecnicas: ["Depilación láser","Lesiones vasculares","Rejuvenecimiento"] },
      { nombre: "Láser Alexandrite", tecnicas: ["Depilación","Manchas"] },
      { nombre: "Radiofrecuencia", tecnicas: ["Monopolar (Thermage)","Bipolar","Multipolar","Microneedling RF"] },
      { nombre: "Ultrasonido focalizado (HIFU)", tecnicas: ["Lifting facial","Lifting corporal"] },
      { nombre: "Criolipólisis (CoolSculpting)", tecnicas: ["Abdomen","Flancos","Papada","Brazos","Muslos"] },
      { nombre: "IPL (Luz pulsada intensa)", tecnicas: ["Manchas","Rosácea","Rejuvenecimiento","Depilación"] },
      { nombre: "Peelings químicos", tecnicas: ["Superficial (AHA/BHA)","Medio (TCA 25-35%)","Profundo (Fenol)","Jessner"] },
      { nombre: "Microdermoabrasión", tecnicas: ["Cristales","Punta de diamante"] },
      { nombre: "Microneedling", tecnicas: ["Estándar","Con PRP (Vampiro)","Radiofrecuencia"] },
    ]
  },
  {
    categoria: "Capilar",
    icono: "💇",
    items: [
      { nombre: "Trasplante capilar", tecnicas: ["FUE (Extracción de Unidades Foliculares)","FUT (Tira)","DHI (Direct Hair Implantation)"] },
      { nombre: "PRP capilar", tecnicas: ["PRP autólogo","PRP con microneedling"] },
      { nombre: "Mesoterapia capilar", tecnicas: ["Vitaminas y minerales","Minoxidil tópico"] },
      { nombre: "Exosomas capilares", tecnicas: ["Aplicación tópica","Inyección"] },
      { nombre: "Láser de bajo nivel (LLLT)", tecnicas: ["Casco láser","Peine láser"] },
    ]
  },
  {
    categoria: "Reconstructivo",
    icono: "🏥",
    items: [
      { nombre: "Reconstrucción mamaria", tecnicas: ["Con expansor","Con implante directo","Con colgajo TRAM","Con colgajo DIEP"] },
      { nombre: "Cirugía de cicatrices", tecnicas: ["Escisión directa","Z-plastia","W-plastia","Injerto de piel"] },
      { nombre: "Injerto de piel", tecnicas: ["Injerto de espesor parcial","Injerto de espesor total"] },
      { nombre: "Colgajos locales", tecnicas: ["Colgajo de rotación","Colgajo de avance","Colgajo de transposición"] },
      { nombre: "Cirugía post-bariátrica", tecnicas: ["Abdominoplastia post-bariátrica","Body lift","Braquioplastia post-bariátrica"] },
    ]
  },
];

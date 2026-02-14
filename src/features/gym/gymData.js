// gymData.js — Ejercicios de la Enciclopedia de Musculación
export const EXERCISE_DATABASE = {
  pecho: [
    {
      id: "bench_press", name: "Press de Banca con Barra", nameEn: "Barbell Bench Press",
      musclesPrimary: ["Pectoral Mayor"], musclesSecondary: ["Deltoides Anterior", "Tríceps"],
      equipment: ["barra", "banco"], difficulty: "intermedio", type: "compuesto",
      mechanics: "empuje horizontal",
      tips: ["Mantén los omóplatos retraídos y deprimidos", "Agarre ligeramente más ancho que los hombros", "Baja la barra hasta el pecho de forma controlada", "Empuja la barra en línea recta"],
      setsReps: { hipertrofia: "3-4 x 8-12", fuerza: "5 x 3-5", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 90, fuerza: 180, resistencia: 60 },
      variations: ["press_inclinado", "press_declinado", "press_mancuernas"]
    },
    {
      id: "press_inclinado", name: "Press Inclinado con Barra", nameEn: "Incline Barbell Press",
      musclesPrimary: ["Pectoral Mayor (cabeza clavicular)"], musclesSecondary: ["Deltoides Anterior", "Tríceps"],
      equipment: ["barra", "banco inclinado"], difficulty: "intermedio", type: "compuesto",
      tips: ["Inclinación del banco entre 30° y 45°", "No arquees excesivamente la espalda baja", "Controla la bajada (2-3 segundos)"],
      setsReps: { hipertrofia: "3-4 x 8-12", fuerza: "4 x 6-8", resistencia: "3 x 15" },
      rest: { hipertrofia: 90, fuerza: 180, resistencia: 60 }
    },
    {
      id: "press_mancuernas", name: "Press con Mancuernas", nameEn: "Dumbbell Bench Press",
      musclesPrimary: ["Pectoral Mayor"], musclesSecondary: ["Deltoides Anterior", "Tríceps"],
      equipment: ["mancuernas", "banco"], difficulty: "principiante", type: "compuesto",
      tips: ["Mayor rango de movimiento que con barra", "Las mancuernas permiten trabajo unilateral", "No dejes caer los codos por debajo del banco"],
      setsReps: { hipertrofia: "3-4 x 10-12", fuerza: "4 x 6-8", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 90, fuerza: 150, resistencia: 60 }
    },
    {
      id: "aperturas_mancuernas", name: "Aperturas con Mancuernas", nameEn: "Dumbbell Flyes",
      musclesPrimary: ["Pectoral Mayor"], musclesSecondary: ["Deltoides Anterior"],
      equipment: ["mancuernas", "banco"], difficulty: "principiante", type: "aislamiento",
      tips: ["Ligera flexión en el codo durante todo el movimiento", "No bajes las mancuernas demasiado para proteger el hombro", "Concentrarse en el estiramiento del pectoral"],
      setsReps: { hipertrofia: "3 x 12-15", fuerza: "N/A", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    },
    {
      id: "fondos_pecho", name: "Fondos en Paralelas (pecho)", nameEn: "Chest Dips",
      musclesPrimary: ["Pectoral Mayor (cabeza esternal)"], musclesSecondary: ["Tríceps", "Deltoides Anterior"],
      equipment: ["paralelas"], difficulty: "intermedio", type: "compuesto",
      tips: ["Inclínate hacia adelante para enfocarte en el pecho", "Baja hasta que los brazos estén paralelos al suelo", "Añade peso con cinturón para progresión"],
      setsReps: { hipertrofia: "3-4 x 8-12", fuerza: "4 x 5-8", resistencia: "3 x 12-15" },
      rest: { hipertrofia: 90, fuerza: 180, resistencia: 60 }
    },
    {
      id: "crossover_polea", name: "Crossover en Polea", nameEn: "Cable Crossover",
      musclesPrimary: ["Pectoral Mayor"], musclesSecondary: ["Deltoides Anterior"],
      equipment: ["polea", "gym"], difficulty: "principiante", type: "aislamiento",
      tips: ["Mantén tensión constante durante todo el rango", "Cruza las manos al frente para máxima contracción", "Controla la apertura excéntrica"],
      setsReps: { hipertrofia: "3-4 x 12-15", fuerza: "N/A", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    },
    {
      id: "push_up", name: "Flexiones de Pecho", nameEn: "Push-Up",
      musclesPrimary: ["Pectoral Mayor"], musclesSecondary: ["Tríceps", "Deltoides Anterior", "Core"],
      equipment: ["cuerpo libre"], difficulty: "principiante", type: "compuesto",
      tips: ["Cuerpo en línea recta de cabeza a talones", "Codos a 45° del cuerpo, no 90°", "Bajar hasta casi tocar el suelo"],
      setsReps: { hipertrofia: "3-4 x 15-20", fuerza: "5 x 5-10", resistencia: "3 x AMRAP" },
      rest: { hipertrofia: 60, fuerza: 120, resistencia: 45 }
    }
  ],
  espalda: [
    {
      id: "peso_muerto", name: "Peso Muerto", nameEn: "Deadlift",
      musclesPrimary: ["Erector Espinal", "Glúteos", "Isquiotibiales"], musclesSecondary: ["Trapecios", "Dorsal Ancho", "Cuádriceps"],
      equipment: ["barra"], difficulty: "avanzado", type: "compuesto",
      tips: ["Espalda neutra durante todo el movimiento", "La barra siempre cerca del cuerpo", "Empuja el suelo, no jales la barra", "Bloquea las caderas al final, no hiperextiendas"],
      setsReps: { hipertrofia: "3-4 x 6-8", fuerza: "5 x 3-5", resistencia: "3 x 10-12" },
      rest: { hipertrofia: 180, fuerza: 240, resistencia: 120 }
    },
    {
      id: "dominadas", name: "Dominadas", nameEn: "Pull-Up",
      musclesPrimary: ["Dorsal Ancho", "Redondo Mayor"], musclesSecondary: ["Bíceps", "Braquial", "Romboides"],
      equipment: ["barra de dominadas"], difficulty: "intermedio", type: "compuesto",
      tips: ["Agarre prono (palmas al frente) para espalda", "Retrae los omóplatos antes de subir", "Sube hasta que la barbilla supere la barra", "Baja de forma controlada"],
      setsReps: { hipertrofia: "3-4 x 6-10", fuerza: "5 x 3-6", resistencia: "3 x AMRAP" },
      rest: { hipertrofia: 120, fuerza: 180, resistencia: 90 }
    },
    {
      id: "remo_barra", name: "Remo con Barra", nameEn: "Barbell Row",
      musclesPrimary: ["Dorsal Ancho", "Romboides", "Trapecios"], musclesSecondary: ["Bíceps", "Deltoides Posterior"],
      equipment: ["barra"], difficulty: "intermedio", type: "compuesto",
      tips: ["Espalda casi paralela al suelo (45-70°)", "Tira de la barra hacia el abdomen bajo", "Retrae omóplatos al final del movimiento", "Rodillas ligeramente flexionadas"],
      setsReps: { hipertrofia: "3-4 x 8-12", fuerza: "5 x 4-6", resistencia: "3 x 12-15" },
      rest: { hipertrofia: 120, fuerza: 180, resistencia: 90 }
    },
    {
      id: "remo_mancuerna", name: "Remo con Mancuerna", nameEn: "Dumbbell Row",
      musclesPrimary: ["Dorsal Ancho", "Romboides"], musclesSecondary: ["Bíceps", "Deltoides Posterior"],
      equipment: ["mancuernas", "banco"], difficulty: "principiante", type: "compuesto",
      tips: ["Apoya la rodilla y mano en el banco", "Tira del codo hacia el techo", "No rotar el torso excesivamente", "Trabajo unilateral para corregir desbalances"],
      setsReps: { hipertrofia: "3-4 x 10-12", fuerza: "4 x 6-8", resistencia: "3 x 15" },
      rest: { hipertrofia: 90, fuerza: 150, resistencia: 60 }
    },
    {
      id: "jalon_polea", name: "Jalón al Pecho en Polea", nameEn: "Lat Pulldown",
      musclesPrimary: ["Dorsal Ancho"], musclesSecondary: ["Bíceps", "Redondo Mayor", "Romboides"],
      equipment: ["polea", "gym"], difficulty: "principiante", type: "compuesto",
      tips: ["Agarre prono ligeramente más ancho que hombros", "Inclínate ligeramente hacia atrás", "Jala hacia la clavícula, no al cuello", "Retrae omóplatos durante el movimiento"],
      setsReps: { hipertrofia: "3-4 x 10-12", fuerza: "4 x 6-8", resistencia: "3 x 15" },
      rest: { hipertrofia: 90, fuerza: 150, resistencia: 60 }
    },
    {
      id: "face_pull", name: "Face Pull en Polea", nameEn: "Face Pull",
      musclesPrimary: ["Deltoides Posterior", "Romboides", "Trapecios"], musclesSecondary: ["Manguito Rotador"],
      equipment: ["polea", "gym"], difficulty: "principiante", type: "aislamiento",
      tips: ["Cuerda a la altura de los ojos o arriba", "Tira hacia la cara separando las manos", "Rotación externa al final del movimiento", "Muy útil para salud de hombros"],
      setsReps: { hipertrofia: "3-4 x 15-20", fuerza: "N/A", resistencia: "3 x 20-25" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    }
  ],
  piernas: [
    {
      id: "sentadilla", name: "Sentadilla con Barra", nameEn: "Back Squat",
      musclesPrimary: ["Cuádriceps", "Glúteos"], musclesSecondary: ["Isquiotibiales", "Erector Espinal", "Core"],
      equipment: ["barra", "rack"], difficulty: "avanzado", type: "compuesto",
      tips: ["Pies a la anchura de hombros, ligeramente hacia afuera", "Rodillas siguen la dirección de los pies", "Espalda neutra, pecho arriba", "Profundidad mínima: muslos paralelos al suelo", "Empuja el suelo para subir"],
      setsReps: { hipertrofia: "3-5 x 8-12", fuerza: "5 x 3-5", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 180, fuerza: 240, resistencia: 90 }
    },
    {
      id: "prensa", name: "Prensa de Piernas", nameEn: "Leg Press",
      musclesPrimary: ["Cuádriceps", "Glúteos"], musclesSecondary: ["Isquiotibiales"],
      equipment: ["máquina", "gym"], difficulty: "principiante", type: "compuesto",
      tips: ["Pies a la altura de hombros en la plataforma", "No bloquees las rodillas al extender", "Baja hasta 90° en las rodillas", "Posición alta = más glúteos, baja = más cuádriceps"],
      setsReps: { hipertrofia: "3-4 x 10-15", fuerza: "4 x 8-10", resistencia: "3 x 20" },
      rest: { hipertrofia: 120, fuerza: 180, resistencia: 90 }
    },
    {
      id: "extensiones_cuad", name: "Extensiones de Cuádriceps", nameEn: "Leg Extension",
      musclesPrimary: ["Cuádriceps"], musclesSecondary: [],
      equipment: ["máquina", "gym"], difficulty: "principiante", type: "aislamiento",
      tips: ["Control total en la fase negativa", "Pausa de 1 segundo al extender completamente", "No uses impulso"],
      setsReps: { hipertrofia: "3-4 x 12-15", fuerza: "N/A", resistencia: "3 x 20" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    },
    {
      id: "curl_isquiotibiales", name: "Curl de Isquiotibiales", nameEn: "Leg Curl",
      musclesPrimary: ["Isquiotibiales"], musclesSecondary: ["Gastrocnemio"],
      equipment: ["máquina", "gym"], difficulty: "principiante", type: "aislamiento",
      tips: ["Control en la extensión (fase negativa)", "No levantes las caderas al curvar", "Contrae los glúteos para estabilizar"],
      setsReps: { hipertrofia: "3-4 x 12-15", fuerza: "N/A", resistencia: "3 x 20" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    },
    {
      id: "hip_thrust", name: "Hip Thrust con Barra", nameEn: "Barbell Hip Thrust",
      musclesPrimary: ["Glúteo Mayor"], musclesSecondary: ["Isquiotibiales", "Core"],
      equipment: ["barra", "banco"], difficulty: "intermedio", type: "compuesto",
      tips: ["Banco a la altura de las escápulas", "Pies a la anchura de caderas", "Empuja con los talones, no con los dedos", "Contrae glúteos al máximo arriba", "Barbilla al pecho, no mires al techo"],
      setsReps: { hipertrofia: "3-4 x 10-15", fuerza: "4 x 6-8", resistencia: "3 x 20" },
      rest: { hipertrofia: 90, fuerza: 150, resistencia: 60 }
    },
    {
      id: "zancadas", name: "Zancadas con Mancuernas", nameEn: "Dumbbell Lunges",
      musclesPrimary: ["Cuádriceps", "Glúteos"], musclesSecondary: ["Isquiotibiales", "Core"],
      equipment: ["mancuernas"], difficulty: "principiante", type: "compuesto",
      tips: ["Torso erecto durante el movimiento", "Rodilla delantera no pase el pie", "Rodilla trasera casi toca el suelo", "Paso amplio para énfasis en glúteos"],
      setsReps: { hipertrofia: "3-4 x 10-12 por pierna", fuerza: "4 x 8", resistencia: "3 x 15" },
      rest: { hipertrofia: 90, fuerza: 150, resistencia: 60 }
    },
    {
      id: "gemelo_maquina", name: "Elevación de Talones (Gemelos)", nameEn: "Standing Calf Raise",
      musclesPrimary: ["Gastrocnemio", "Sóleo"], musclesSecondary: [],
      equipment: ["máquina", "gym"], difficulty: "principiante", type: "aislamiento",
      tips: ["Rango completo: baja hasta el estiramiento máximo", "Pausa arriba por 1-2 segundos", "Movimiento lento y controlado"],
      setsReps: { hipertrofia: "4-5 x 15-20", fuerza: "N/A", resistencia: "3 x 25-30" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    }
  ],
  hombros: [
    {
      id: "press_militar", name: "Press Militar con Barra", nameEn: "Overhead Press",
      musclesPrimary: ["Deltoides Anterior", "Deltoides Lateral"], musclesSecondary: ["Trapecios", "Tríceps"],
      equipment: ["barra"], difficulty: "intermedio", type: "compuesto",
      tips: ["De pie o sentado, ambas variantes son válidas", "Barra sube en línea recta sobre la cabeza", "Core apretado, no arquees la espalda baja", "Empuja la cabeza levemente al frente cuando la barra pasa"],
      setsReps: { hipertrofia: "3-4 x 8-12", fuerza: "5 x 3-5", resistencia: "3 x 15" },
      rest: { hipertrofia: 120, fuerza: 180, resistencia: 90 }
    },
    {
      id: "elevaciones_laterales", name: "Elevaciones Laterales", nameEn: "Lateral Raises",
      musclesPrimary: ["Deltoides Lateral"], musclesSecondary: ["Trapecio Superior"],
      equipment: ["mancuernas"], difficulty: "principiante", type: "aislamiento",
      tips: ["Ligera flexión en el codo", "Eleva hasta paralelo al suelo, no más", "El dedo meñique ligeramente más alto (pulgares abajo)", "No uses impulso de caderas"],
      setsReps: { hipertrofia: "3-5 x 12-20", fuerza: "N/A", resistencia: "3 x 20-25" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    },
    {
      id: "elevaciones_frontales", name: "Elevaciones Frontales", nameEn: "Front Raises",
      musclesPrimary: ["Deltoides Anterior"], musclesSecondary: ["Pectoral Mayor (cabeza clavicular)"],
      equipment: ["mancuernas", "barra", "disco"], difficulty: "principiante", type: "aislamiento",
      tips: ["Eleva hasta la altura de los ojos", "No osciles el torso", "Control total en la bajada"],
      setsReps: { hipertrofia: "3 x 12-15", fuerza: "N/A", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    }
  ],
  biceps: [
    {
      id: "curl_barra", name: "Curl con Barra", nameEn: "Barbell Curl",
      musclesPrimary: ["Bíceps Braquial"], musclesSecondary: ["Braquial", "Braquiorradial"],
      equipment: ["barra"], difficulty: "principiante", type: "aislamiento",
      tips: ["Codos pegados a los costados durante todo el movimiento", "Muñecas en posición neutra o supinada", "Contracción completa arriba, extensión completa abajo", "No uses el balanceo del cuerpo"],
      setsReps: { hipertrofia: "3-4 x 8-12", fuerza: "4 x 5-8", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 90, fuerza: 120, resistencia: 60 }
    },
    {
      id: "curl_mancuernas", name: "Curl con Mancuernas", nameEn: "Dumbbell Curl",
      musclesPrimary: ["Bíceps Braquial"], musclesSecondary: ["Braquial", "Braquiorradial"],
      equipment: ["mancuernas"], difficulty: "principiante", type: "aislamiento",
      tips: ["Rota la palma hacia arriba al subir (supinación)", "Trabajo unilateral o alternado", "Rango completo de movimiento"],
      setsReps: { hipertrofia: "3-4 x 10-12", fuerza: "4 x 6-8", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 90, fuerza: 120, resistencia: 60 }
    },
    {
      id: "curl_martillo", name: "Curl Martillo", nameEn: "Hammer Curl",
      musclesPrimary: ["Braquial", "Braquiorradial"], musclesSecondary: ["Bíceps Braquial"],
      equipment: ["mancuernas"], difficulty: "principiante", type: "aislamiento",
      tips: ["Agarre neutro (palmas hacia el cuerpo) durante todo el movimiento", "Trabaja tanto el bíceps como el braquial", "Excelente para engrosar el brazo"],
      setsReps: { hipertrofia: "3-4 x 10-15", fuerza: "N/A", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 90, fuerza: 90, resistencia: 60 }
    },
    {
      id: "curl_concentrado", name: "Curl Concentrado", nameEn: "Concentration Curl",
      musclesPrimary: ["Bíceps Braquial (cabeza larga)"], musclesSecondary: [],
      equipment: ["mancuernas"], difficulty: "principiante", type: "aislamiento",
      tips: ["Codo apoyado en la parte interna del muslo", "Máxima contracción al llegar arriba", "Movimiento puro, sin balanceo"],
      setsReps: { hipertrofia: "3 x 12-15", fuerza: "N/A", resistencia: "3 x 15-20" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    }
  ],
  triceps: [
    {
      id: "press_frances", name: "Press Francés con Barra EZ", nameEn: "Skull Crusher",
      musclesPrimary: ["Tríceps (cabeza larga)"], musclesSecondary: [],
      equipment: ["barra EZ", "banco"], difficulty: "intermedio", type: "aislamiento",
      tips: ["Codos apuntan al techo, no se abren", "Baja la barra hacia la frente o detrás de la cabeza", "Extensión completa sin bloquear los codos"],
      setsReps: { hipertrofia: "3-4 x 8-12", fuerza: "4 x 6-8", resistencia: "3 x 15" },
      rest: { hipertrofia: 90, fuerza: 120, resistencia: 60 }
    },
    {
      id: "fondos_triceps", name: "Fondos para Tríceps", nameEn: "Tricep Dips",
      musclesPrimary: ["Tríceps"], musclesSecondary: ["Deltoides Anterior", "Pectoral"],
      equipment: ["banco", "paralelas"], difficulty: "principiante", type: "compuesto",
      tips: ["Torso recto para énfasis en tríceps", "Codos atrás, no se abren lateralmente", "Bajar hasta 90° en los codos"],
      setsReps: { hipertrofia: "3-4 x 10-15", fuerza: "4 x 6-10", resistencia: "3 x AMRAP" },
      rest: { hipertrofia: 90, fuerza: 150, resistencia: 60 }
    },
    {
      id: "extension_polea", name: "Extensión de Tríceps en Polea", nameEn: "Tricep Pushdown",
      musclesPrimary: ["Tríceps"], musclesSecondary: [],
      equipment: ["polea", "gym"], difficulty: "principiante", type: "aislamiento",
      tips: ["Codos pegados al cuerpo y fijos", "Extensión completa en el punto inferior", "Controla la subida (fase excéntrica)"],
      setsReps: { hipertrofia: "3-4 x 12-15", fuerza: "N/A", resistencia: "3 x 20" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    }
  ],
  abdomen: [
    {
      id: "plancha", name: "Plancha", nameEn: "Plank",
      musclesPrimary: ["Transverso Abdominal", "Recto Abdominal"], musclesSecondary: ["Deltoides", "Glúteos", "Cuádriceps"],
      equipment: ["cuerpo libre"], difficulty: "principiante", type: "estático",
      tips: ["Cuerpo en línea recta, sin elevar cadera", "Contrae abdomen y glúteos", "Respiración normal durante el hold", "Progresión: 30s → 60s → 90s → 120s+"],
      setsReps: { hipertrofia: "3-4 x 30-60s", fuerza: "3 x 60-120s", resistencia: "3 x AMRAP" },
      rest: { hipertrofia: 60, fuerza: 60, resistencia: 45 }
    },
    {
      id: "crunch", name: "Crunch Abdominal", nameEn: "Crunch",
      musclesPrimary: ["Recto Abdominal"], musclesSecondary: ["Oblicuos"],
      equipment: ["cuerpo libre"], difficulty: "principiante", type: "aislamiento",
      tips: ["No jalones el cuello con las manos", "La zona lumbar permanece en el suelo", "Contrae el abdomen, no solo levantes la cabeza"],
      setsReps: { hipertrofia: "3-4 x 15-25", fuerza: "N/A", resistencia: "3 x 30" },
      rest: { hipertrofia: 45, fuerza: 45, resistencia: 30 }
    },
    {
      id: "rueda_abs", name: "Rueda Abdominal (Ab Wheel)", nameEn: "Ab Wheel Rollout",
      musclesPrimary: ["Transverso Abdominal", "Recto Abdominal"], musclesSecondary: ["Dorsales", "Hombros"],
      equipment: ["rueda abdominal"], difficulty: "avanzado", type: "compuesto",
      tips: ["Comienza en rodillas si no tienes fuerza suficiente", "No arquees la espalda al ir al frente", "Regresa usando el abdomen, no los hombros"],
      setsReps: { hipertrofia: "3-4 x 8-12", fuerza: "4 x 6-10", resistencia: "3 x 15" },
      rest: { hipertrofia: 90, fuerza: 120, resistencia: 60 }
    }
  ]
};

// Helper: get all exercises flat
export const getAllExercises = () => {
  return Object.values(EXERCISE_DATABASE).flat();
};

// Helper: find exercise by id
export const findExercise = (id) => {
  return getAllExercises().find(e => e.id === id);
};

// Helper: get exercises by muscle group
export const getExercisesByGroup = (group) => {
  return EXERCISE_DATABASE[group] || [];
};

// Muscle group labels
export const MUSCLE_GROUPS = [
  { id: 'pecho', name: 'Pecho', icon: '🫁', color: '#3B82F6' },
  { id: 'espalda', name: 'Espalda', icon: '🔙', color: '#10B981' },
  { id: 'piernas', name: 'Piernas', icon: '🦵', color: '#F59E0B' },
  { id: 'hombros', name: 'Hombros', icon: '💪', color: '#8B5CF6' },
  { id: 'biceps', name: 'Bíceps', icon: '💪', color: '#EC4899' },
  { id: 'triceps', name: 'Tríceps', icon: '💪', color: '#EF4444' },
  { id: 'abdomen', name: 'Abdomen', icon: '🎯', color: '#06B6D4' },
];

// Routine Templates
export const ROUTINE_TEMPLATES = {
  "3_hipertrofia": {
    name: "Full Body 3x — Hipertrofia",
    days: [
      { name: "Full Body A", focus: "Énfasis Pecho + Espalda", exercises: ["bench_press", "remo_barra", "press_militar", "curl_barra", "extension_polea", "sentadilla", "plancha"] },
      { name: "Full Body B", focus: "Énfasis Piernas + Core", exercises: ["sentadilla", "peso_muerto", "prensa", "hip_thrust", "press_militar", "jalon_polea", "rueda_abs"] },
      { name: "Full Body C", focus: "Énfasis Hombros + Brazos", exercises: ["press_militar", "elevaciones_laterales", "dominadas", "curl_mancuernas", "press_frances", "sentadilla", "gemelo_maquina"] }
    ]
  },
  "4_hipertrofia": {
    name: "Upper/Lower 4x — Hipertrofia",
    days: [
      { name: "Upper A", focus: "Pecho + Espalda (fuerza)", exercises: ["bench_press", "remo_barra", "press_inclinado", "dominadas", "elevaciones_laterales", "curl_barra"] },
      { name: "Lower A", focus: "Piernas (fuerza)", exercises: ["sentadilla", "peso_muerto", "prensa", "hip_thrust", "gemelo_maquina"] },
      { name: "Upper B", focus: "Hombros + Brazos (volumen)", exercises: ["press_militar", "elevaciones_laterales", "remo_mancuerna", "curl_martillo", "press_frances", "extension_polea"] },
      { name: "Lower B", focus: "Piernas (volumen)", exercises: ["sentadilla", "prensa", "extensiones_cuad", "curl_isquiotibiales", "zancadas", "gemelo_maquina"] }
    ]
  },
  "5_hipertrofia": {
    name: "Push/Pull/Legs/Upper/Lower 5x",
    days: [
      { name: "Push", focus: "Pecho + Hombros + Tríceps", exercises: ["bench_press", "press_inclinado", "press_militar", "elevaciones_laterales", "extension_polea", "press_frances"] },
      { name: "Pull", focus: "Espalda + Bíceps", exercises: ["peso_muerto", "dominadas", "remo_barra", "jalon_polea", "face_pull", "curl_barra"] },
      { name: "Legs", focus: "Cuádriceps + Glúteos + Core", exercises: ["sentadilla", "prensa", "extensiones_cuad", "hip_thrust", "gemelo_maquina", "plancha"] },
      { name: "Upper", focus: "Hombros + Brazos", exercises: ["press_militar", "elevaciones_laterales", "remo_mancuerna", "curl_martillo", "press_frances", "face_pull"] },
      { name: "Lower", focus: "Isquiotibiales + Glúteos", exercises: ["peso_muerto", "hip_thrust", "curl_isquiotibiales", "zancadas", "prensa", "gemelo_maquina"] }
    ]
  },
  "6_hipertrofia": {
    name: "Push/Pull/Legs 6x — Hipertrofia",
    days: [
      { name: "Push A", focus: "Pecho + Hombros + Tríceps", exercises: ["bench_press", "press_inclinado", "press_militar", "elevaciones_laterales", "crossover_polea", "extension_polea", "press_frances"] },
      { name: "Pull A", focus: "Espalda + Bíceps", exercises: ["peso_muerto", "dominadas", "remo_barra", "jalon_polea", "face_pull", "curl_barra", "curl_martillo"] },
      { name: "Legs A", focus: "Cuádriceps + Glúteos + Core", exercises: ["sentadilla", "prensa", "extensiones_cuad", "hip_thrust", "gemelo_maquina", "plancha"] },
      { name: "Push B", focus: "Hombros + Pecho + Tríceps", exercises: ["press_militar", "elevaciones_laterales", "press_mancuernas", "aperturas_mancuernas", "fondos_pecho", "extension_polea"] },
      { name: "Pull B", focus: "Espalda + Bíceps (volumen)", exercises: ["remo_mancuerna", "jalon_polea", "face_pull", "dominadas", "curl_concentrado", "curl_mancuernas"] },
      { name: "Legs B", focus: "Isquiotibiales + Glúteos + Pantorrillas", exercises: ["peso_muerto", "curl_isquiotibiales", "hip_thrust", "zancadas", "prensa", "gemelo_maquina"] }
    ]
  }
};

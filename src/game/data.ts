// Datos del juego "Guerra Fría: La Gran Misión 🕶️"
// 7 mundos, cada uno con 4 actividades, desbloqueo secuencial.

export interface Question {
  text: string;
  options: string[]; // 2-4 opciones
  answer: number; // índice de la opción correcta
}

export interface MediaSpec {
  kind: "video" | "listen";
  src: string; // ruta relativa en public/
  gateSeconds: number; // tiempo mínimo para habilitar "Continuar"
  sceneTitle: string; // título del video / instrucción del audio
  caption?: string; // texto que se muestra durante el video
}

export interface Activity {
  id: string;
  kind: "video" | "listen" | "choice" | "tf";
  title: string;
  media?: MediaSpec; // solo video/listen
  questions: Question[]; // video/listen/tf = 1, choice = 2
  explain: string; // explicación tras responder
}

export interface World {
  id: number;
  name: string;
  emoji: string;
  deco: string[]; // emojis decorativos para la escena
  date: string;
  tagline: string;
  summary: string;
  gradient: string; // fondo del nodo / escena
  activities: Activity[];
}

export const POINTS_PER_QUESTION = 100;
export const START_HEARTS = 5;
export const MAX_SCORE = 7 * 5 * POINTS_PER_QUESTION; // 3500

export const WORLDS: World[] = [
  {
    id: 0,
    name: "El Telón de Acero",
    emoji: "🧊",
    deco: ["🕯️", "🕊️", "🗺️", "🛡️"],
    date: "1945 – 1947",
    tagline: "El mundo se divide en dos",
    summary:
      "Tras la Segunda Guerra Mundial, Estados Unidos y la Unión Soviética, antes aliados, se convierten en rivales. Churchill habla de un «telón de acero» que parte Europa. Así nace la Guerra Fría.",
    gradient: "linear-gradient(135deg,#4b6ef5,#6c2bd9)",
    activities: [
      {
        id: "m1a1",
        kind: "video",
        title: "🎬 Video: El nacimiento de la Guerra Fría",
        media: {
          kind: "video",
          src: "audio/audio_m1.mp3",
          gateSeconds: 30,
          sceneTitle: "El Telón de Acero",
          caption: "Churchill, Truman y Stalin: el mundo se divide en dos bloques.",
        },
        questions: [
          {
            text: "Según el video, ¿qué representaba el «Telón de Acero» del que habló Churchill en 1946?",
            options: [
              "La división de Europa entre el bloque capitalista y el comunista",
              "Una muralla física construida en Alemania",
              "Una alianza militar entre EE.UU. y la URSS",
              "La frontera natural entre Europa y Asia",
            ],
            answer: 0,
          },
        ],
        explain:
          "El «Telón de Acero» fue una imagen usada por Churchill para describir la frontera ideológica que dividía a Europa: Occidente capitalista y Oriente comunista.",
      },
      {
        id: "m1a2",
        kind: "listen",
        title: "📻 Escucha el dato clave",
        media: {
          kind: "listen",
          src: "audio/listen/audio_m1.mp3",
          gateSeconds: 11,
          sceneTitle: "🎧 Escucha con atención…",
        },
        questions: [
          {
            text: "Según el audio, ¿cuándo y dónde pronunció Churchill su famoso discurso?",
            options: [
              "El 5 de marzo de 1946, en Fulton",
              "El 20 de julio de 1969, en Washington",
              "El 9 de noviembre de 1989, en Berlín",
              "El 4 de octubre de 1957, en Moscú",
            ],
            answer: 0,
          },
        ],
        explain:
          "Churchill pronunció su discurso del «Telón de Acero» el 5 de marzo de 1946 en Fulton (EE.UU.), marcando simbólicamente el inicio de la Guerra Fría.",
      },
      {
        id: "m1a3",
        kind: "choice",
        title: "🧠 Preguntas de comprensión",
        questions: [
          {
            text: "¿Qué bloque lideraba Estados Unidos durante la Guerra Fría?",
            options: ["El bloque capitalista", "El bloque comunista", "El bloque socialista", "El bloque anarquista"],
            answer: 0,
          },
          {
            text: "¿Qué organización militar creó Occidente en 1949?",
            options: ["OTAN", "ONU", "Pacto de Varsovia", "Liga Árabe"],
            answer: 0,
          },
        ],
        explain:
          "EE.UU. lideró el bloque capitalista y creó la OTAN (1949). La URSS respondió con el Pacto de Varsovia (1955).",
      },
      {
        id: "m1a4",
        kind: "tf",
        title: "✅ ¿Verdadero o falso?",
        questions: [
          {
            text: "La Guerra Fría implicó un enfrentamiento militar directo entre EE.UU. y la URSS.",
            options: ["Falso", "Verdadero"],
            answer: 0,
          },
        ],
        explain:
          "Falso. Fue una «guerra fría»: nunca hubo un choque militar directo entre las dos superpotencias; compitieron por ideología, tecnología y poder de forma indirecta.",
      },
    ],
  },
  {
    id: 1,
    name: "La Carrera al Espacio",
    emoji: "🚀",
    deco: ["🛰️", "🌕", "👨‍🚀", "⭐"],
    date: "1957 – 1969",
    tagline: "Del Sputnik a la Luna",
    summary:
      "La rivalidad se traslada al cielo: la URSS lanza el Sputnik y lleva a Gagarin al espacio. EE.UU. responde con la NASA y, en 1969, el Apolo 11 pisa la Luna.",
    gradient: "linear-gradient(135deg,#0ea5e9,#6366f1)",
    activities: [
      {
        id: "m2a1",
        kind: "video",
        title: "🎬 Video: La carrera espacial",
        media: {
          kind: "video",
          src: "audio/audio_m2.mp3",
          gateSeconds: 34,
          sceneTitle: "Del Sputnik a la Luna",
          caption: "URSS y EE.UU. compiten por conquistar el espacio.",
        },
        questions: [
          {
            text: "Según el video, ¿qué acontecimiento marcó la victoria estadounidense en la carrera espacial?",
            options: [
              "La llegada del Apolo 11 a la Luna en 1969",
              "El lanzamiento del Sputnik en 1957",
              "El primer vuelo de Yuri Gagarin en 1961",
              "La creación de la NASA en 1958",
            ],
            answer: 0,
          },
        ],
        explain:
          "El 20 de julio de 1969, el Apolo 11 logró que Neil Armstrong pisara la Luna, la gran victoria de EE.UU. en la carrera espacial.",
      },
      {
        id: "m2a2",
        kind: "listen",
        title: "📻 Escucha el dato clave",
        media: {
          kind: "listen",
          src: "audio/listen/audio_m2.mp3",
          gateSeconds: 9,
          sceneTitle: "🎧 Escucha con atención…",
        },
        questions: [
          {
            text: "Según el audio, ¿quién fue el primer ser humano en pisar la Luna y en qué año?",
            options: [
              "Neil Armstrong, en 1969",
              "Yuri Gagarin, en 1961",
              "Buzz Aldrin, en 1962",
              "John Kennedy, en 1957",
            ],
            answer: 0,
          },
        ],
        explain:
          "Neil Armstrong pisó la Luna el 20 de julio de 1969 con la misión Apolo 11, junto a Buzz Aldrin y Michael Collins.",
      },
      {
        id: "m2a3",
        kind: "choice",
        title: "🧠 Preguntas de comprensión",
        questions: [
          {
            text: "¿Qué lanzó la URSS en 1957 y sorprendió al mundo?",
            options: ["El Sputnik, el primer satélite artificial", "La misión Apolo 11", "La primera estación espacial", "El primer transbordador tripulado"],
            answer: 0,
          },
          {
            text: "¿Quién fue el primer ser humano en viajar al espacio en 1961?",
            options: ["Yuri Gagarin", "Neil Armstrong", "John Glenn", "Buzz Aldrin"],
            answer: 0,
          },
        ],
        explain:
          "La URSS lanzó el Sputnik (1957) y llevó a Yuri Gagarin al espacio (1961). EE.UU. creó la NASA y respondió con los programas Mercurio, Géminis y Apolo.",
      },
      {
        id: "m2a4",
        kind: "tf",
        title: "✅ ¿Verdadero o falso?",
        questions: [
          {
            text: "El Sputnik fue el primer satélite artificial, lanzado por Estados Unidos.",
            options: ["Falso", "Verdadero"],
            answer: 0,
          },
        ],
        explain:
          "Falso. El Sputnik 1 fue lanzado por la Unión Soviética el 4 de octubre de 1957, sorprendiendo al mundo.",
      },
    ],
  },
  {
    id: 2,
    name: "Misiles en Cuba",
    emoji: "🧨",
    deco: ["⚓", "🌊", "🚢", "☢️"],
    date: "1962",
    tagline: "El mundo al borde del abismo",
    summary:
      "La URSS instala misiles nucleares en Cuba, a solo 150 km de EE.UU. Kennedy ordena un bloqueo naval. Durante 13 días, el mundo estuvo al borde de una guerra nuclear.",
    gradient: "linear-gradient(135deg,#ef4444,#f97316)",
    activities: [
      {
        id: "m3a1",
        kind: "video",
        title: "🎬 Video: Trece días que estremecieron al mundo",
        media: {
          kind: "video",
          src: "audio/audio_m3.mp3",
          gateSeconds: 28,
          sceneTitle: "La Crisis de los Misiles",
          caption: "Misiles soviéticos en Cuba, a 150 km de EE.UU.",
        },
        questions: [
          {
            text: "Según el video, ¿por qué fue tan peligrosa la crisis de los misiles?",
            options: [
              "Porque el mundo estuvo al borde de una guerra nuclear",
              "Porque se hundió una flota entera en el Caribe",
              "Porque la URSS invadió Cuba",
              "Porque estalló una guerra en Europa",
            ],
            answer: 0,
          },
        ],
        explain:
          "Fue el punto más tenso de la Guerra Fría: por primera vez, una guerra nuclear parecía inminente mientras EE.UU. y la URSS se enfrentaban frente a frente.",
      },
      {
        id: "m3a2",
        kind: "listen",
        title: "📻 Escucha el dato clave",
        media: {
          kind: "listen",
          src: "audio/listen/audio_m3.mp3",
          gateSeconds: 12,
          sceneTitle: "🎧 Escucha con atención…",
        },
        questions: [
          {
            text: "Según el audio, ¿qué se acordó para resolver la crisis?",
            options: [
              "La URSS retiró sus misiles de Cuba y EE.UU. no invadiría la isla",
              "EE.UU. entregó misiles a la URSS",
              "Cuba se unió al bloque capitalista",
              "La ONU tomó el control de Cuba",
            ],
            answer: 0,
          },
        ],
        explain:
          "El acuerdo puso fin a la crisis: la URSS retiró los misiles y EE.UU. prometió no invadir Cuba.",
      },
      {
        id: "m3a3",
        kind: "choice",
        title: "🧠 Preguntas de comprensión",
        questions: [
          {
            text: "¿En qué año ocurrió la crisis de los misiles en Cuba?",
            options: ["1962", "1957", "1975", "1989"],
            answer: 0,
          },
          {
            text: "¿Quién ordenó el bloqueo naval a Cuba?",
            options: ["John F. Kennedy", "Winston Churchill", "Mijaíl Gorbachov", "Harry Truman"],
            answer: 0,
          },
        ],
        explain:
          "La crisis ocurrió en octubre de 1962. El presidente de EE.UU., John F. Kennedy, ordenó el bloqueo naval de Cuba.",
      },
      {
        id: "m3a4",
        kind: "tf",
        title: "✅ ¿Verdadero o falso?",
        questions: [
          {
            text: "La crisis de los misiles ocurrió a solo unos 150 kilómetros de Estados Unidos.",
            options: ["Falso", "Verdadero"],
            answer: 1,
          },
        ],
        explain:
          "Verdadero. La cercanía de los misiles soviéticos a EE.UU. fue lo que hizo de la crisis un momento extremadamente peligroso.",
      },
    ],
  },
  {
    id: 3,
    name: "La Guerra de Corea",
    emoji: "🇰🇷",
    deco: ["🎖️", "⚔️", "🗾", "🕊️"],
    date: "1950 – 1953",
    tagline: "La primera guerra del conflicto",
    summary:
      "Corea del Norte invade al Sur. La guerra se internacionaliza: China y la URSS apoyan al norte; EE.UU. y la ONU, al sur. Termina en 1953 con un armisticio que aún divide la península.",
    gradient: "linear-gradient(135deg,#f43f5e,#a855f7)",
    activities: [
      {
        id: "m4a1",
        kind: "video",
        title: "🎬 Video: La guerra que dividió una península",
        media: {
          kind: "video",
          src: "audio/audio_m4.mp3",
          gateSeconds: 30,
          sceneTitle: "La Guerra de Corea",
          caption: "Norte comunista contra Sur capitalista, con apoyo extranjero.",
        },
        questions: [
          {
            text: "Según el video, ¿cómo terminó la Guerra de Corea?",
            options: [
              "Con un armisticio en 1953 que dejó el país dividido por el paralelo 38",
              "Con la unificación de Corea bajo el comunismo",
              "Con una victoria militar de la ONU",
              "Con la disolución de ambos gobiernos",
            ],
            answer: 0,
          },
        ],
        explain:
          "La guerra terminó en 1953 con un armisticio (no un tratado de paz). Corea quedó dividida por el paralelo 38, como sigue hasta hoy.",
      },
      {
        id: "m4a2",
        kind: "listen",
        title: "📻 Escucha el dato clave",
        media: {
          kind: "listen",
          src: "audio/listen/audio_m4.mp3",
          gateSeconds: 9,
          sceneTitle: "🎧 Escucha con atención…",
        },
        questions: [
          {
            text: "Según el audio, ¿en qué año se firmó el armisticio de Corea?",
            options: ["1953", "1945", "1962", "1975"],
            answer: 0,
          },
        ],
        explain:
          "El armisticio se firmó en 1953 y dejó la península dividida por el paralelo 38, situación vigente hasta hoy.",
      },
      {
        id: "m4a3",
        kind: "choice",
        title: "🧠 Preguntas de comprensión",
        questions: [
          {
            text: "¿Qué país invadió a Corea del Sur en 1950?",
            options: ["Corea del Norte", "China", "Japón", "La Unión Soviética"],
            answer: 0,
          },
          {
            text: "¿Qué bloque apoyó militarmente a Corea del Norte?",
            options: ["China y la URSS", "EE.UU. y la ONU", "Francia y el Reino Unido", "Japón y Australia"],
            answer: 0,
          },
        ],
        explain:
          "Corea del Norte invadió al Sur en 1950. China y la URSS apoyaron al norte; EE.UU. y la ONU intervinieron en defensa del sur.",
      },
      {
        id: "m4a4",
        kind: "tf",
        title: "✅ ¿Verdadero o falso?",
        questions: [
          {
            text: "La ONU apoyó militarmente a Corea del Sur durante la guerra.",
            options: ["Falso", "Verdadero"],
            answer: 1,
          },
        ],
        explain:
          "Verdadero. Una fuerza multinacional de la ONU, liderada por EE.UU., intervino en defensa de Corea del Sur.",
      },
    ],
  },
  {
    id: 4,
    name: "Lágrimas en Vietnam",
    emoji: "🌿",
    deco: ["🪖", "🍃", "🏞️", "🕊️"],
    date: "1955 – 1975",
    tagline: "El conflicto más doloroso",
    summary:
      "EE.UU. interviene en Vietnam para frenar el comunismo. Una guerra larga y cruel que causó millones de muertes y una enorme protesta mundial. En 1975, Saigón cae y Vietnam se unifica.",
    gradient: "linear-gradient(135deg,#10b981,#84cc16)",
    activities: [
      {
        id: "m5a1",
        kind: "video",
        title: "🎬 Video: La larga guerra de Vietnam",
        media: {
          kind: "video",
          src: "audio/audio_m5.mp3",
          gateSeconds: 28,
          sceneTitle: "La Guerra de Vietnam",
          caption: "Una guerra de casi veinte años que conmocionó al mundo.",
        },
        questions: [
          {
            text: "Según el video, ¿qué ocurrió en Vietnam en 1975?",
            options: [
              "Cayó Saigón y Vietnam se unificó bajo el comunismo",
              "Estados Unidos capturó Hanói",
              "Se firmó la paz y el país se dividió en tres",
              "La ONU tomó el control de Vietnam",
            ],
            answer: 0,
          },
        ],
        explain:
          "En 1975 cayó Saigón, la capital del sur, y Vietnam quedó unificado bajo el régimen comunista del norte.",
      },
      {
        id: "m5a2",
        kind: "listen",
        title: "📻 Escucha el dato clave",
        media: {
          kind: "listen",
          src: "audio/listen/audio_m5.mp3",
          gateSeconds: 8,
          sceneTitle: "🎧 Escucha con atención…",
        },
        questions: [
          {
            text: "Según el audio, ¿qué hecho marcó el fin de la Guerra de Vietnam en 1975?",
            options: [
              "La caída de Saigón",
              "El bombardeo de Hanói",
              "La firma del armisticio en París",
              "La retirada de la ONU",
            ],
            answer: 0,
          },
        ],
        explain:
          "La caída de Saigón en 1975 terminó la guerra y Vietnam quedó unificado bajo el comunismo.",
      },
      {
        id: "m5a3",
        kind: "choice",
        title: "🧠 Preguntas de comprensión",
        questions: [
          {
            text: "¿Por qué intervino Estados Unidos en Vietnam?",
            options: [
              "Por temor a la expansión del comunismo",
              "Para conquistar nuevas colonias",
              "Para apoyar a Corea del Norte",
              "Para controlar el comercio de arroz",
            ],
            answer: 0,
          },
          {
            text: "¿En qué quedó Vietnam después de la guerra?",
            options: [
              "Unificado bajo el comunismo",
              "Dividido en dos países",
              "Bajo administración de la ONU",
              "Un protectorado de EE.UU.",
            ],
            answer: 0,
          },
        ],
        explain:
          "EE.UU. intervino por la llamada «teoría del dominó»: temía que el comunismo se extendiera por el Sudeste Asiático. Al final, Vietnam quedó unificado bajo el comunismo.",
      },
      {
        id: "m5a4",
        kind: "tf",
        title: "✅ ¿Verdadero o falso?",
        questions: [
          {
            text: "La Guerra de Vietnam duró casi veinte años y causó millones de muertes.",
            options: ["Falso", "Verdadero"],
            answer: 1,
          },
        ],
        explain:
          "Verdadero. Fue un conflicto prolongado y devastador que dejó millones de víctimas y una fuerte protesta mundial.",
      },
    ],
  },
  {
    id: 5,
    name: "El Muro de Berlín",
    emoji: "🧱",
    deco: ["✌️", "🏙️", "🕊️", "🪖"],
    date: "1961 – 1989",
    tagline: "El símbolo de la división",
    summary:
      "En 1961, Alemania Oriental levanta un muro que parte Berlín. Durante 28 años separa familias e ideas. El 9 de noviembre de 1989, tras las presiones populares, el Muro cae: símbolo del fin de la división de Europa.",
    gradient: "linear-gradient(135deg,#64748b,#334155)",
    activities: [
      {
        id: "m6a1",
        kind: "video",
        title: "🎬 Video: La caída del Muro de Berlín",
        media: {
          kind: "video",
          src: "audio/audio_m6.mp3",
          gateSeconds: 29,
          sceneTitle: "El Muro de Berlín",
          caption: "28 años separando a una ciudad y a dos formas de vida.",
        },
        questions: [
          {
            text: "Según el video, ¿qué significó la caída del Muro el 9 de noviembre de 1989?",
            options: [
              "El símbolo del fin de la división de Europa",
              "El inicio de la carrera espacial",
              "La creación de la Unión Soviética",
              "El comienzo de la Guerra Fría",
            ],
            answer: 0,
          },
        ],
        explain:
          "La caída del Muro de Berlín fue el símbolo del fin de la división de Europa y del inicio del fin de la Guerra Fría.",
      },
      {
        id: "m6a2",
        kind: "listen",
        title: "📻 Escucha el dato clave",
        media: {
          kind: "listen",
          src: "audio/listen/audio_m6.mp3",
          gateSeconds: 9,
          sceneTitle: "🎧 Escucha con atención…",
        },
        questions: [
          {
            text: "Según el audio, ¿cuándo cayó el Muro de Berlín?",
            options: [
              "El 9 de noviembre de 1989",
              "El 4 de octubre de 1957",
              "El 20 de julio de 1969",
              "El 5 de marzo de 1946",
            ],
            answer: 0,
          },
        ],
        explain:
          "El Muro de Berlín cayó en la noche del 9 de noviembre de 1989, un momento que celebró la reunificación alemana.",
      },
      {
        id: "m6a3",
        kind: "choice",
        title: "🧠 Preguntas de comprensión",
        questions: [
          {
            text: "¿Por qué se construyó el Muro de Berlín en 1961?",
            options: [
              "Para frenar la fuga de personas del este comunista",
              "Para proteger la ciudad de ataques aéreos",
              "Para dividir el territorio en zonas agrícolas",
              "Para evitar la expansión de Occidente",
            ],
            answer: 0,
          },
          {
            text: "¿Cuántos años permaneció en pie el Muro de Berlín?",
            options: ["28 años", "10 años", "50 años", "5 años"],
            answer: 0,
          },
        ],
        explain:
          "El Muro se construyó para frenar la emigración masiva del este comunista y permaneció en pie 28 años, de 1961 a 1989.",
      },
      {
        id: "m6a4",
        kind: "tf",
        title: "✅ ¿Verdadero o falso?",
        questions: [
          {
            text: "El Muro de Berlín separó la ciudad en dos: el este comunista y el oeste capitalista.",
            options: ["Falso", "Verdadero"],
            answer: 1,
          },
        ],
        explain:
          "Verdadero. El Muro dividió Berlín entre el sector oriental (comunista) y el occidental (capitalista).",
      },
    ],
  },
  {
    id: 6,
    name: "El Fin de la Guerra Fría",
    emoji: "☮️",
    deco: ["🕊️", "🌍", "🎆", "🤝"],
    date: "1985 – 1991",
    tagline: "El muro cae y el mundo cambia",
    summary:
      "Gorbachov impulsa la Perestroika y la Glasnost. Caen los regímenes de Europa del Este, se derrumba el Muro de Berlín y, en diciembre de 1991, la URSS se disuelve. Termina la Guerra Fría.",
    gradient: "linear-gradient(135deg,#22c55e,#14b8a6)",
    activities: [
      {
        id: "m7a1",
        kind: "video",
        title: "🎬 Video: El fin de la Guerra Fría",
        media: {
          kind: "video",
          src: "audio/audio_m7.mp3",
          gateSeconds: 28,
          sceneTitle: "El Fin de la Guerra Fría",
          caption: "Perestroika, Glasnost y la disolución de la URSS en 1991.",
        },
        questions: [
          {
            text: "Según el video, ¿qué fueron la Perestroika y la Glasnost?",
            options: [
              "Reformas impulsadas por Gorbachov para reformar la economía y abrir la transparencia",
              "Nuevos misiles soviéticos",
              "Tratados de paz firmados en 1945",
              "Organizaciones militares de Occidente",
            ],
            answer: 0,
          },
        ],
        explain:
          "La Perestroika (reestructuración) reformó la economía soviética; la Glasnost (transparencia) abrió paso a la información y la crítica.",
      },
      {
        id: "m7a2",
        kind: "listen",
        title: "📻 Escucha el dato clave",
        media: {
          kind: "listen",
          src: "audio/listen/audio_m7.mp3",
          gateSeconds: 9,
          sceneTitle: "🎧 Escucha con atención…",
        },
        questions: [
          {
            text: "Según el audio, ¿cuándo se disolvió la Unión Soviética?",
            options: [
              "En diciembre de 1991",
              "En septiembre de 1945",
              "En noviembre de 1989",
              "En marzo de 1962",
            ],
            answer: 0,
          },
        ],
        explain:
          "La URSS se disolvió en diciembre de 1991. Con su fin terminó oficialmente la Guerra Fría.",
      },
      {
        id: "m7a3",
        kind: "choice",
        title: "🧠 Preguntas de comprensión",
        questions: [
          {
            text: "¿Qué líder soviético impulsó las reformas de fines de los años 80?",
            options: ["Mijaíl Gorbachov", "Yuri Gagarin", "Joseph Stalin", "Nikita Jrushchov"],
            answer: 0,
          },
          {
            text: "¿Con qué hecho terminó oficialmente la Guerra Fría?",
            options: [
              "Con la disolución de la URSS en 1991",
              "Con la caída del Muro en 1989",
              "Con la crisis de los misiles en 1962",
              "Con el armisticio de Corea en 1953",
            ],
            answer: 0,
          },
        ],
        explain:
          "La Guerra Fría terminó oficialmente en diciembre de 1991, con la disolución de la Unión Soviética. La caída del Muro (1989) fue su antesala simbólica.",
      },
      {
        id: "m7a4",
        kind: "tf",
        title: "✅ ¿Verdadero o falso?",
        questions: [
          {
            text: "La Guerra Fría terminó con un enfrentamiento nuclear directo entre las dos potencias.",
            options: ["Falso", "Verdadero"],
            answer: 0,
          },
        ],
        explain:
          "Falso. La Guerra Fría terminó con la disolución de la URSS en 1991, casi sin disparos, sin que hubiera nunca una guerra nuclear directa.",
      },
    ],
  },
];

// Medalla según desempeño (0-3500)
export function medalFor(total: number): { name: string; emoji: string; color: string } {
  if (total >= 3200) return { name: "LEYENDA", emoji: "👑", color: "#f59e0b" };
  if (total >= 2700) return { name: "ORO", emoji: "🥇", color: "#f59e0b" };
  if (total >= 2000) return { name: "PLATA", emoji: "🥈", color: "#94a3b8" };
  if (total >= 1200) return { name: "BRONCE", emoji: "🥉", color: "#b45309" };
  return { name: "RUTA NOVIA", emoji: "🚶", color: "#64748b" };
}

export function accuracyMessage(pct: number): string {
  if (pct >= 90) return "¡Impecable! Dominas la Guerra Fría como un verdadero historiador. 🧠🔥";
  if (pct >= 75) return "¡Excelente trabajo! Tienes muy claro los hechos clave de la Guerra Fría. 🌟";
  if (pct >= 55) return "¡Buen esfuerzo! Ya identificas los hechos más importantes. Sigue repasando. 👍";
  if (pct >= 35) return "Vas por buen camino, pero conviene repasar los videos y audios una vez más. 📚";
  return "No te rindas. Vuelve a escuchar las narraciones y verás cómo mejora tu puntaje. 💪";
}

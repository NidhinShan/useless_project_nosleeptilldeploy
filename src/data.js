export const WORKOUT_SPLITS = {
  chest: {
    id: "chest",
    name: "Chest Day (Pecks of Power)",
    badge: "Chest",
    icon: "🏋️‍♂️",
    description: "Sculpt legendary pectoral dominance purely with your thumb on the Spacebar.",
    flavor: "Arnold Schwarzenegger trained in Austria. Ponjikkara trains on mechanical keyboards.",
    workouts: [
      {
        id: "bench_press",
        name: "Flat Barbell Bench Press",
        type: "bench",
        equipment: "Olympic Barbell (100 KG Virtual Iron)",
        target: "Mid & Lower Pectorals",
        instruction: "Tap SPACE to lower to chest and press up explosively!",
        grunts: ["HRRNGH!", "UP!", "LIGHTWEIGHT!", "EASY MONEY!"]
      },
      {
        id: "dumbbell_fly",
        name: "Incline Dumbbell Flyes",
        type: "fly",
        equipment: "Twin Heavy Dumbbells",
        target: "Upper Chest & Stretch",
        instruction: "Tap SPACE to spread wide and squeeze the pecks at the top!",
        grunts: ["SQUEEZE!", "STRETCH IT!", "FEEL THE TEAR!", "DON'T DROP IT!"]
      },
      {
        id: "pushups",
        name: "Diamond Floor Push-ups",
        type: "pushup",
        equipment: "Gym Carpet & Gravity",
        target: "Inner Chest & Triceps",
        instruction: "Tap SPACE to drop your chest to the floor and push back up!",
        grunts: ["DOWN!", "PUSH!", "FLOOR IS LAVA!", "PONJIKKARA POWER!"]
      }
    ]
  },
  back: {
    id: "back",
    name: "Back Day (Cobra Lat Spread)",
    badge: "Back",
    icon: "🦅",
    description: "Build a wide V-taper without ever leaving your comfortable swivel chair.",
    flavor: "Wings so wide you might catch WiFi signals.",
    workouts: [
      {
        id: "deadlift",
        name: "Barbell Deadlift",
        type: "deadlift",
        equipment: "Loaded Barbell Off The Floor",
        target: "Spinal Erectors & Posterior Chain",
        instruction: "Tap SPACE to hinge and pull the bar straight up to lockout!",
        grunts: ["LIFT IT!", "LOCK OUT!", "SPINE OF TITANIUM!", "UP UP UP!"]
      },
      {
        id: "lat_pulldown",
        name: "Wide-Grip Lat Pulldown",
        type: "pulldown",
        equipment: "Overhead Cable Bar",
        target: "Latissimus Dorsi",
        instruction: "Tap SPACE to pull the overhead bar right to your collarbone!",
        grunts: ["PULL DOWN!", "ELBOWS IN!", "WIDE WINGS!", "FEEL THE PULL!"]
      },
      {
        id: "cable_row",
        name: "Seated Cable Row",
        type: "row",
        equipment: "Low Pulley V-Bar",
        target: "Mid Back & Rhomboids",
        instruction: "Tap SPACE to row into your stomach with maximum back contraction!",
        grunts: ["ROW!", "SQUEEZE SCAPULA!", "DON'T LEAN BACK!", "POWER!"]
      }
    ]
  },
  legs: {
    id: "legs",
    name: "Leg Day (Never Skip Spacebar)",
    badge: "Legs",
    icon: "🦵",
    description: "The most feared day in bodybuilding, now safely performed with zero knee strain.",
    flavor: "Tomorrow you won't be able to walk... or maybe your thumb will be sore.",
    workouts: [
      {
        id: "squat",
        name: "Heavy Barbell Back Squats",
        type: "squat",
        equipment: "Squat Rack & Olympic Iron",
        target: "Quadriceps & Glutes",
        instruction: "Tap SPACE to break parallel and stand up with raw quad force!",
        grunts: ["ASS TO GRASS!", "DRIVE UP!", "NO WEAK KNEES!", "STAND UP!"]
      },
      {
        id: "leg_press",
        name: "45° Incline Leg Press",
        type: "legpress",
        equipment: "Heavy Sled Machine",
        target: "Quad Sweep & Hamstrings",
        instruction: "Tap SPACE to bend knees deep and press the heavy platform!",
        grunts: ["PUSH THE SLED!", "DON'T LOCK KNEES!", "FEEL THE BURN!", "MASSIVE!"]
      },
      {
        id: "calf_raises",
        name: "Standing Heavy Calf Raises",
        type: "calf",
        equipment: "Step Block & Dumbbell",
        target: "Gastrocnemius & Soleus",
        instruction: "Tap SPACE to elevate high on your tiptoes for diamond calves!",
        grunts: ["TIPTOES!", "HOLD IT!", "PEAK CONTRACTION!", "DON'T BOUNCE!"]
      }
    ]
  },
  arms: {
    id: "arms",
    name: "Arm Day (Guns & Triceps)",
    badge: "Arms",
    icon: "💪",
    description: "Rip the sleeves of your t-shirt using pure finger velocity.",
    flavor: "Certified 20-inch biceps powered by USB 3.0.",
    workouts: [
      {
        id: "bicep_curl",
        name: "Heavy Standing EZ-Bar Curls",
        type: "curl",
        equipment: "EZ-Curl Iron Bar",
        target: "Bicep Biceps Brachii",
        instruction: "Tap SPACE to curl the bar to your chin without swinging!",
        grunts: ["CURL IT!", "NO SWINGING!", "PEAK PUMP!", "GUN SHOW!"]
      },
      {
        id: "tricep_extension",
        name: "Overhead Dumbbell Tricep Extension",
        type: "tricep",
        equipment: "Heavy Overhead Dumbbell",
        target: "Long Head Triceps",
        instruction: "Tap SPACE to lower behind your head and extend skyward!",
        grunts: ["LOCK IT OUT!", "HORSESHOE TRICEPS!", "EXTEND!", "CRUSH IT!"]
      },
      {
        id: "hammer_curl",
        name: "Alternating Dumbbell Hammer Curls",
        type: "hammer",
        equipment: "Heavy Hex Dumbbells",
        target: "Brachialis & Forearm Grip",
        instruction: "Tap SPACE to hammer up with an unbreakable neutral grip!",
        grunts: ["HAMMER TIME!", "FOREARM OF STEEL!", "THOR'S MIGHT!", "DONE!"]
      }
    ]
  }
};
export const PONJIKKARA_QUOTES = [
  "\"ഇത് workout ആണെന്ന് officially പ്രഖ്യാപിക്കുന്നു.\"",
  "\"ശരീരം അനങ്ങുന്നുണ്ട്. അതാണ് ഏറ്റവും പ്രധാനപ്പെട്ട കാര്യം.\"",
  "\"ഒരു repetition കൂടി... ഇല്ലെങ്കിൽ വേണ്ട, നിർത്തിക്കോ.\"",
  "\"Attendance പോലെ workout-ഉം regular ആയി maintain ചെയ്യണം.\"",
  "\"ഇന്ന് workout ചെയ്യാം എന്ന് ഇന്നലെ രാത്രി ഉറങ്ങാൻ കിടന്നപ്പോൾ തീരുമാനിച്ചതല്ലേ?\"",
  "\"Assignment എഴുതുന്നതിലും എളുപ്പമാണ് തമ്പ് വെച്ച് Spacebar അടിക്കുന്നത്.\"",
  "\"ഒരു കട്ടൻ ചായ കുടിച്ചിട്ട് ബാക്കി നോക്കാം.\"",
  "\"ഇതിനെ exercise എന്ന് വിളിക്കാൻ നിയമപരമായി സാധിക്കുമോ എന്നതിൽ ചെറിയൊരു തർക്കമുണ്ട്.\"",
  "\"Body is paining, but mind is vibrating!\"",
  "\"One hot black tea and two parotta after this set, strictly prescribed.\"",
  "\"Doctor strictly advised me: no heavy lifting, only keyboard typing.\"",
  "\"Did Arnold Schwarzenegger ever press Spacebar 36 times? History says no.\"",
  "\"Hydrate! You have burned a staggering 0.0012 calories!\"",
  "\"നിങ്ങളുടെ performance system പരിശോധിച്ചു കൊണ്ടിരിക്കുന്നു. ഞങ്ങൾക്കും ചെറിയൊരു സംശയമുണ്ട്.\""
];

export const CINEMA_REACTIONS = {
  FIRST_REP: [
    "ആദ്യത്തേത് കഴിഞ്ഞു! ഇനി രക്ഷയില്ല.",
    "തുടങ്ങി... ഇനി തിരിച്ചു പോക്കില്ല.",
    "ആദ്യത്തെ rep വീണു. ആവേശം തലയ്ക്കു പിടിക്കരുത്!",
    "ആക്ഷൻ! ഒന്നാമത്തെ rep ഭംഗിയായി അഭിനയിച്ചു തീർത്തു."
  ],
  MID_SET: [
    "പകുതിയായി! മുഖത്ത് ചെറിയൊരു വെപ്രാളം കാണുന്നുണ്ട്.",
    "ശ്വാസം വിട് സുഹൃത്തേ... ഇത് കട്ട ലോഡ് ആണ്.",
    "ആറ് കഴിഞ്ഞു! തമ്പ് വേദനിക്കുന്നുണ്ടെങ്കിൽ ചൂടുവെള്ളം വെച്ചോളൂ.",
    "Interval ബ്ലോക്ക് എത്തി! ഇനി ബാക്കി പകുതി."
  ],
  PENULTIMATE: [
    "ഒരൊറ്റ repetition കൂടി... ചരിത്രം വഴിമാറാൻ പോകുന്നു!",
    "പതിനൊന്ന് കഴിഞ്ഞു! അവസാനത്തെ ആഞ്ഞ് ഒരൊറ്റ തട്ട്!",
    "ഇനി ഒരെണ്ണം കൂടി... സംവിധായകൻ കട്ട് പറയാറായി!"
  ],
  SET_DONE: [
    "അങ്ങനെ ആ സെറ്റും തീർത്തു! ഇനി ആരും സംശയം ചോദിക്കരുത്.",
    "സെറ്റ് കംപ്ലീറ്റ്! കട്ടൻ ചായ ഓർഡർ ചെയ്തോളൂ.",
    "ഷോട്ട് ഓക്കെ! അടുത്ത സെറ്റിനായി തയ്യാറെടുക്കുക."
  ],
  IDLE: [
    "ഇവിടെ workout ചെയ്യാനാണോ വന്നത്, അതോ website കാണാനാണോ?",
    "Spacebar തേഞ്ഞു പോവില്ല സുഹൃത്തേ, ഒന്ന് അമർത്ത്...",
    "ചായ കുടിക്കാൻ പോയോ? ഞങ്ങൾ ഇവിടെ കാത്തിരിപ്പാണ്.",
    "ശരീരം അനങ്ങണം, അതാണ് പ്രധാനം!",
    "Workout തുടങ്ങുന്നതിന് മുൻപ് തന്നെ ക്ഷീണിച്ചോ?"
  ],
  SPAM: [
    "ശാന്തമായി... ഇത് Olympic selection അല്ല!",
    "കീബോർഡ് പൊട്ടിച്ചാൽ പുതിയത് വാങ്ങി തരില്ല!",
    "സ്പീഡ് കൂട്ടല്ലേ... ക്യാമറയ്ക്ക് കണ്ണ് കാണുന്നില്ല!"
  ]
};

export const CAMERA_CINEMA_LINES = {
  START: "ശരി... ക്യാമറ ഓണായി. ഇനി അഭിനയിക്കേണ്ട സമയം. 🎬",
  NO_HAND: "ആളെ കാണുന്നില്ല... നിങ്ങൾ എവിടെയാ? 🔍",
  READY: "കൈ റെഡി! ഇനി മുഷ്ടി ചുരുട്ടി കാണിക്ക് ✊",
  REP_PUMP: "അത് കണ്ടു! എന്തായാലും എന്തോ ഒന്ന് ചെയ്തു. 🔥",
  PUMPED_WAIT: "കൈ തുറന്ന് ✋ അടുത്ത rep-ന് തയ്യാറാവൂ!",
  BLOCKED: "ക്യാമറ അനുവാദം തന്നില്ല... വിരോധമില്ല, Spacebar ഉണ്ടല്ലോ!"
};

export const EASTER_EGGS = {
  CHAYA: "കട്ടൻ ചായ റെഡി! രണ്ട് പരിപ്പുവട കൂടി ഓർഡർ ചെയ്യട്ടെ? ☕",
  CLAPBOARD: "Scene 1 • Take 1! 🎬 ഡയലോഗ് മറക്കരുത്, ആക്ഷൻ!",
  SEAL: "ശ്രദ്ധിക്കുക: ഈ സർട്ടിഫിക്കറ്റ് PSC പരീക്ഷയ്ക്കോ കോളേജ് അഡ്മിഷനോ ഉപയോഗിക്കാൻ സാധ്യമല്ല! 🏆",
  LOGO: "പൊഞ്ഞിക്കര ഫിറ്റ്നസ് ക്ലബ്ബ്: വിയർപ്പില്ല, ക്ഷീണമില്ല, വെറും തമാശ!"
};

export const FUNNY_TITLES = [
  "Supreme Keyboard Bodybuilder (പൊഞ്ഞിക്കര ബാച്ച്)",
  "Lord of the 3-Day Spacebar Split",
  "Ponjikkara Gold Medalist in Typing Ergonomics",
  "Master of Zero-Sweat Calisthenics",
  "Grand Champion of Virtual Pectoral Dominance"
];

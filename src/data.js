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
  "\"Body is paining, but mind is vibrating!\"",
  "\"One hot black tea and two parotta after this set, guaranteed.\"",
  "\"Doctor strictly advised me: no heavy lifting, only keyboard typing.\"",
  "\"Did Arnold Schwarzenegger ever press Spacebar 36 times? I don't think so.\"",
  "\"Feel the deep muscular burn... mainly in your right thumb joint.\"",
  "\"My coach told me: Ponjikkara, you have the heart of a lion and the finger of a champion!\"",
  "\"Hydrate! You have burned a staggering 0.0012 calories!\"",
  "\"Gym floor rule #1: Never drop virtual dumbbells on the linoleum!\""
];
export const FUNNY_TITLES = [
  "Supreme Keyboard Bodybuilder",
  "Lord of the 3-Day Spacebar Split",
  "Ponjikkara Gold Medalist in Typing Ergonomics",
  "Master of Zero-Sweat Calisthenics",
  "Grand Champion of Virtual Pectoral Dominance"
];

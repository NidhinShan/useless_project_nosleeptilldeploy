export class CharacterStage {
  constructor(containerElement) {
    this.container = containerElement;
    this.currentWorkout = null;
    this.isPressing = false;
  }
  setWorkout(workout) {
    this.currentWorkout = workout;
    this.render();
  }
  triggerRep(repCount, gruntText) {
    this.isPressing = true;
    const stage = this.container.querySelector(".gym-stage");
    if (!stage) return;
    stage.classList.add("rep-active");
    this.spawnSweat();
    this.spawnGruntFloating(gruntText);
    setTimeout(() => {
      stage.classList.remove("rep-active");
      this.isPressing = false;
    }, 280);
  }
  spawnSweat() {
    const sweatZone = this.container.querySelector(".sweat-zone");
    if (!sweatZone) return;
    for (let i = 0; i < 4; i++) {
      const drop = document.createElement("div");
      drop.className = "sweat-drop";
      const offsetX = (Math.random() - 0.5) * 70;
      const offsetY = -Math.random() * 30;
      drop.style.left = `calc(50% + ${offsetX}px)`;
      drop.style.top = `calc(35% + ${offsetY}px)`;
      sweatZone.appendChild(drop);
      setTimeout(() => drop.remove(), 600);
    }
  }
  spawnGruntFloating(text) {
    if (!text) return;
    const gruntZone = this.container.querySelector(".grunt-zone");
    if (!gruntZone) return;
    const grunt = document.createElement("div");
    grunt.className = "floating-grunt";
    grunt.textContent = text;
    const offsetX = (Math.random() - 0.5) * 80;
    grunt.style.left = `calc(50% + ${offsetX}px)`;
    gruntZone.appendChild(grunt);
    setTimeout(() => grunt.remove(), 750);
  }
  render() {
    if (!this.currentWorkout) return;
    const type = this.currentWorkout.type;
    let svgContent = "";
    switch (type) {
      case "bench":
        svgContent = this.getBenchPressSVG();
        break;
      case "fly":
        svgContent = this.getDumbbellFlySVG();
        break;
      case "pushup":
        svgContent = this.getPushUpSVG();
        break;
      case "squat":
      case "legpress":
      case "calf":
        svgContent = this.getSquatSVG();
        break;
      case "deadlift":
      case "pulldown":
      case "row":
        svgContent = this.getBackWorkoutSVG();
        break;
      case "curl":
      case "tricep":
      case "hammer":
      default:
        svgContent = this.getArmWorkoutSVG();
        break;
    }
    this.container.innerHTML = `
      <div class="gym-stage relative w-full h-80 sm:h-96 flex items-center justify-center select-none overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-amber-500/20 shadow-2xl">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08)_0%,transparent_70%)] pointer-events-none"></div>
        <div class="absolute bottom-0 inset-x-0 h-16 bg-slate-900/80 border-t border-slate-800 flex items-center justify-center text-xs tracking-widest text-slate-600 uppercase font-mono">
          PONJIKKARA IRON GYM FLOOR • MECHANICAL KEYBOARD DIVISION
        </div>
        <div class="sweat-zone absolute inset-0 pointer-events-none z-30"></div>
        <div class="grunt-zone absolute inset-0 pointer-events-none z-30"></div>
        <div class="character-rig relative z-20 flex items-center justify-center transition-transform duration-100 ease-out">
          ${svgContent}
        </div>
      </div>
    `;
  }
  getBenchPressSVG() {
    return `
      <svg class="w-72 h-72 sm:w-84 sm:h-84" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="70" y="270" width="260" height="24" rx="6" fill="#1e293b" stroke="#f59e0b" stroke-width="3" />
        <rect x="110" y="294" width="20" height="60" fill="#0f172a" />
        <rect x="270" y="294" width="20" height="60" fill="#0f172a" />
        <g class="lifter-body">
          <rect x="140" y="240" width="120" height="34" rx="8" fill="#eab308" />
          <text x="200" y="262" font-size="11" font-weight="900" fill="#713f12" text-anchor="middle" font-family="sans-serif">PONJI 007</text>
          <circle cx="120" cy="245" r="22" fill="#fcd34d" />
          <rect x="100" y="230" width="38" height="7" rx="3" fill="#ef4444" />
          <circle class="lifter-eye" cx="125" cy="242" r="3.5" fill="#0f172a" />
          <path d="M 116 254 Q 124 260 134 253 Q 126 250 116 254 Z" fill="#1e293b" />
          <circle class="lifter-mouth" cx="130" cy="258" r="3" fill="#7f1d1d" />
          <rect x="250" y="242" width="45" height="30" rx="4" fill="#3b82f6" />
          <path d="M 290 260 L 320 280 L 320 340" stroke="#fcd34d" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <g class="barbell-arm-group">
          <path class="arm-left" d="M 160 250 L 175 190 L 185 145" stroke="#fcd34d" stroke-width="14" stroke-linecap="round" />
          <path class="arm-right" d="M 230 250 L 220 190 L 215 145" stroke="#fcd34d" stroke-width="14" stroke-linecap="round" />
          <rect x="30" y="135" width="340" height="10" rx="3" fill="#94a3b8" />
          <rect x="45" y="90" width="14" height="100" rx="4" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
          <rect x="62" y="100" width="12" height="80" rx="4" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2" />
          <rect x="76" y="110" width="10" height="60" rx="3" fill="#eab308" />
          <rect x="341" y="90" width="14" height="100" rx="4" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
          <rect x="326" y="100" width="12" height="80" rx="4" fill="#3b82f6" stroke="#1e3a8a" stroke-width="2" />
          <rect x="314" y="110" width="10" height="60" rx="3" fill="#eab308" />
          <text x="52" y="144" font-size="10" font-weight="900" fill="#ffffff" transform="rotate(-90 52 144)" text-anchor="middle">50KG</text>
          <text x="348" y="144" font-size="10" font-weight="900" fill="#ffffff" transform="rotate(90 348 144)" text-anchor="middle">50KG</text>
        </g>
      </svg>
    `;
  }
  getDumbbellFlySVG() {
    return `
      <svg class="w-72 h-72 sm:w-84 sm:h-84" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 90 320 L 290 190" stroke="#1e293b" stroke-width="24" stroke-linecap="round" />
        <rect x="150" y="270" width="20" height="80" fill="#0f172a" />
        <g class="lifter-body">
          <circle cx="260" cy="180" r="24" fill="#fcd34d" />
          <rect x="240" y="165" width="40" height="8" rx="3" fill="#ef4444" />
          <circle class="lifter-eye" cx="268" cy="178" r="3.5" fill="#0f172a" />
          <path d="M 260 190 Q 270 196 280 189 Z" fill="#1e293b" />
          <path d="M 240 200 L 160 260" stroke="#eab308" stroke-width="36" stroke-linecap="round" />
          <text x="195" y="234" font-size="10" font-weight="900" fill="#713f12" transform="rotate(-36 195 234)">PONJI</text>
        </g>
        <g class="fly-arm-left">
          <path d="M 210 215 L 120 160" stroke="#fcd34d" stroke-width="14" stroke-linecap="round" />
          <rect x="80" y="145" width="50" height="10" rx="3" fill="#94a3b8" />
          <rect x="75" y="125" width="15" height="50" rx="4" fill="#f59e0b" />
          <rect x="120" y="125" width="15" height="50" rx="4" fill="#f59e0b" />
        </g>
        <g class="fly-arm-right">
          <path d="M 230 200 L 280 110" stroke="#fcd34d" stroke-width="14" stroke-linecap="round" />
          <rect x="260" y="95" width="50" height="10" rx="3" fill="#94a3b8" />
          <rect x="255" y="75" width="15" height="50" rx="4" fill="#f59e0b" />
          <rect x="300" y="75" width="15" height="50" rx="4" fill="#f59e0b" />
        </g>
      </svg>
    `;
  }
  getPushUpSVG() {
    return `
      <svg class="w-72 h-72 sm:w-84 sm:h-84" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="40" y1="320" x2="360" y2="320" stroke="#f59e0b" stroke-width="4" stroke-dasharray="10 6" />
        <g class="pushup-body-group">
          <circle cx="80" cy="310" r="10" fill="#3b82f6" />
          <path d="M 85 305 L 260 230" stroke="#3b82f6" stroke-width="26" stroke-linecap="round" />
          <path d="M 210 250 L 300 210" stroke="#eab308" stroke-width="32" stroke-linecap="round" />
          <circle cx="325" cy="195" r="22" fill="#fcd34d" />
          <rect x="310" y="180" width="32" height="7" rx="3" fill="#ef4444" />
          <circle class="lifter-eye" cx="333" cy="194" r="3.5" fill="#0f172a" />
          <path d="M 326 204 Q 336 210 344 204 Z" fill="#1e293b" />
          <circle class="lifter-mouth" cx="338" cy="208" r="3.5" fill="#7f1d1d" />
          <path class="pushup-arms" d="M 275 225 L 290 280 L 295 320" stroke="#fcd34d" stroke-width="14" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </svg>
    `;
  }
  getSquatSVG() {
    return `
      <svg class="w-72 h-72 sm:w-84 sm:h-84" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="50" y1="340" x2="350" y2="340" stroke="#334155" stroke-width="6" />
        <g class="squat-body-group">
          <rect x="40" y="150" width="320" height="12" rx="4" fill="#94a3b8" />
          <rect x="50" y="105" width="18" height="100" rx="5" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
          <rect x="70" y="115" width="14" height="80" rx="4" fill="#eab308" />
          <rect x="332" y="105" width="18" height="100" rx="5" fill="#ef4444" stroke="#7f1d1d" stroke-width="2" />
          <rect x="316" y="115" width="14" height="80" rx="4" fill="#eab308" />
          <circle cx="200" cy="130" r="25" fill="#fcd34d" />
          <rect x="178" y="112" width="44" height="8" rx="3" fill="#ef4444" />
          <circle class="lifter-eye" cx="193" cy="128" r="3.5" fill="#0f172a" />
          <circle class="lifter-eye" cx="207" cy="128" r="3.5" fill="#0f172a" />
          <path d="M 188 138 Q 200 146 212 138 Q 200 134 188 138 Z" fill="#1e293b" />
          <circle class="lifter-mouth" cx="200" cy="144" r="4" fill="#7f1d1d" />
          <rect x="175" y="155" width="50" height="60" rx="8" fill="#eab308" />
          <text x="200" y="190" font-size="10" font-weight="900" fill="#713f12" text-anchor="middle">PONJI</text>
          <path class="squat-legs-left" d="M 180 215 L 165 270 L 165 338" stroke="#3b82f6" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
          <path class="squat-legs-right" d="M 220 215 L 235 270 L 235 338" stroke="#3b82f6" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M 175 165 L 140 156" stroke="#fcd34d" stroke-width="12" stroke-linecap="round" />
          <path d="M 225 165 L 260 156" stroke="#fcd34d" stroke-width="12" stroke-linecap="round" />
        </g>
      </svg>
    `;
  }
  getBackWorkoutSVG() {
    return `
      <svg class="w-72 h-72 sm:w-84 sm:h-84" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="50" y1="340" x2="350" y2="340" stroke="#334155" stroke-width="6" />
        <g class="deadlift-group">
          <circle cx="200" cy="120" r="24" fill="#fcd34d" />
          <rect x="180" y="103" width="40" height="8" rx="3" fill="#ef4444" />
          <circle class="lifter-eye" cx="192" cy="118" r="3.5" fill="#0f172a" />
          <circle class="lifter-eye" cx="208" cy="118" r="3.5" fill="#0f172a" />
          <path d="M 188 128 Q 200 136 212 128 Z" fill="#1e293b" />
          <circle class="lifter-mouth" cx="200" cy="134" r="4" fill="#7f1d1d" />
          <polygon points="160,150 240,150 220,225 180,225" fill="#eab308" />
          <text x="200" y="195" font-size="10" font-weight="900" fill="#713f12" text-anchor="middle">COBRA</text>
          <path d="M 185 225 L 180 338" stroke="#3b82f6" stroke-width="18" stroke-linecap="round" />
          <path d="M 215 225 L 220 338" stroke="#3b82f6" stroke-width="18" stroke-linecap="round" />
          <g class="deadlift-barbell">
            <path d="M 170 160 L 160 250" stroke="#fcd34d" stroke-width="12" stroke-linecap="round" />
            <path d="M 230 160 L 240 250" stroke="#fcd34d" stroke-width="12" stroke-linecap="round" />
            <rect x="50" y="250" width="300" height="10" rx="3" fill="#94a3b8" />
            <rect x="65" y="210" width="16" height="90" rx="4" fill="#10b981" />
            <rect x="319" y="210" width="16" height="90" rx="4" fill="#10b981" />
          </g>
        </g>
      </svg>
    `;
  }
  getArmWorkoutSVG() {
    return `
      <svg class="w-72 h-72 sm:w-84 sm:h-84" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="50" y1="340" x2="350" y2="340" stroke="#334155" stroke-width="6" />
        <g class="lifter-arms-stage">
          <circle cx="200" cy="115" r="24" fill="#fcd34d" />
          <rect x="180" y="98" width="40" height="8" rx="3" fill="#ef4444" />
          <circle class="lifter-eye" cx="192" cy="114" r="3.5" fill="#0f172a" />
          <circle class="lifter-eye" cx="208" cy="114" r="3.5" fill="#0f172a" />
          <path d="M 188 124 Q 200 132 212 124 Z" fill="#1e293b" />
          <circle class="lifter-mouth" cx="200" cy="130" r="4" fill="#7f1d1d" />
          <rect x="170" y="142" width="60" height="75" rx="8" fill="#eab308" />
          <text x="200" y="180" font-size="10" font-weight="900" fill="#713f12" text-anchor="middle">GUNS</text>
          <path d="M 182 217 L 175 338" stroke="#3b82f6" stroke-width="18" stroke-linecap="round" />
          <path d="M 218 217 L 225 338" stroke="#3b82f6" stroke-width="18" stroke-linecap="round" />
          <g class="curl-arms-bar">
            <path class="bicep-arm-l" d="M 172 150 L 150 200 L 165 240" stroke="#fcd34d" stroke-width="14" stroke-linecap="round" />
            <path class="bicep-arm-r" d="M 228 150 L 250 200 L 235 240" stroke="#fcd34d" stroke-width="14" stroke-linecap="round" />
            <rect x="80" y="235" width="240" height="10" rx="3" fill="#94a3b8" />
            <rect x="95" y="200" width="16" height="80" rx="4" fill="#8b5cf6" />
            <rect x="289" y="200" width="16" height="80" rx="4" fill="#8b5cf6" />
          </g>
        </g>
      </svg>
    `;
  }
}

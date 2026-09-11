export const SOUND_CONFIG = {
  rep: [
    "/sounds/ayyapa.mp3",
    "/sounds/rep.mp3"
  ],
  setDone: [
    "/sounds/set-done.mp3"
  ],
  exerciseDone: [
    "/sounds/ithokeenth.mp3",
    "/sounds/exercise-done.mp3"
  ],
  victory: [
    "/sounds/victory.mp3",
    "/sounds/congratulations.mp3"
  ],
  click: [
    "/sounds/click.mp3"
  ]
};
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.workingUrls = {};
    this.hasCustomRep = false;
    this.preloadAudio();
  }
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }
  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }
  preloadAudio() {
    SOUND_CONFIG.rep.forEach((url) => {
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener("canplaythrough", () => {
        if (!this.workingUrls.rep) {
          this.workingUrls.rep = url;
          this.hasCustomRep = true;
          console.log("[PONJIKKARA] Successfully detected custom rep sound:", url);
        }
      }, { once: true });
      audio.load();
    });
    SOUND_CONFIG.setDone.forEach((url) => {
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener("canplaythrough", () => {
        if (!this.workingUrls.setDone) {
          this.workingUrls.setDone = url;
        }
      }, { once: true });
      audio.load();
    });
    SOUND_CONFIG.exerciseDone.forEach((url) => {
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener("canplaythrough", () => {
        if (!this.workingUrls.exerciseDone) {
          this.workingUrls.exerciseDone = url;
          console.log("[PONJIKKARA] Successfully detected custom exerciseDone sound:", url);
        }
      }, { once: true });
      audio.load();
    });
    SOUND_CONFIG.victory.forEach((url) => {
      const audio = new Audio();
      audio.src = url;
      audio.addEventListener("canplaythrough", () => {
        if (!this.workingUrls.victory) {
          this.workingUrls.victory = url;
        }
      }, { once: true });
      audio.load();
    });
  }
  playClank() {
    if (this.isMuted) return;
    if (this.workingUrls.rep) {
      const audio = new Audio(this.workingUrls.rep);
      audio.play().catch(() => this.playSynthClank());
      return;
    }
    this.tryPlayList(SOUND_CONFIG.rep, "rep", () => {
      this.playSynthClank();
    });
  }
  playDing(repIndex = 1) {
    if (!this.hasCustomRep && !this.workingUrls.rep) {
      this.playSynthDing(repIndex);
    }
  }
  playGrunt() {
    if (!this.hasCustomRep && !this.workingUrls.rep) {
      this.playSynthGrunt();
    }
  }
  playSetDone() {
    if (this.isMuted) return;
    if (this.workingUrls.setDone) {
      const audio = new Audio(this.workingUrls.setDone);
      audio.play().catch(() => this.playSynthSetDone());
      return;
    }
    this.tryPlayList(SOUND_CONFIG.setDone, "setDone", () => {
      this.playSynthSetDone();
    });
  }
  playExerciseDone() {
    if (this.isMuted) return;
    if (this.workingUrls.exerciseDone) {
      const audio = new Audio(this.workingUrls.exerciseDone);
      audio.play().catch(() => this.playSynthSetDone());
      return;
    }
    this.tryPlayList(SOUND_CONFIG.exerciseDone, "exerciseDone", () => {
      this.playSynthSetDone();
    });
  }
  playVictoryFanfare() {
    if (this.isMuted) return;
    if (this.workingUrls.victory) {
      const audio = new Audio(this.workingUrls.victory);
      audio.play().catch(() => this.playSynthVictoryFanfare());
      return;
    }
    this.tryPlayList(SOUND_CONFIG.victory, "victory", () => {
      this.playSynthVictoryFanfare();
    });
  }
  playClick() {
    if (this.isMuted) return;
    if (this.workingUrls.click) {
      const audio = new Audio(this.workingUrls.click);
      audio.play().catch(() => this.playSynthClick());
      return;
    }
    this.tryPlayList(SOUND_CONFIG.click, "click", () => {
      this.playSynthClick();
    });
  }
  tryPlayList(list, key, fallbackFn) {
    let index = 0;
    const tryNext = () => {
      if (index >= list.length) {
        fallbackFn();
        return;
      }
      const url = list[index++];
      const audio = new Audio(url);
      const promise = audio.play();
      if (promise !== undefined) {
        promise.then(() => {
          this.workingUrls[key] = url;
          if (key === "rep") this.hasCustomRep = true;
        }).catch(() => {
          tryNext();
        });
      } else {
        fallbackFn();
      }
    };
    tryNext();
  }
  playSynthClank() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(820, t);
    osc1.frequency.exponentialRampToValueAtTime(340, t + 0.18);
    gain1.gain.setValueAtTime(0.35, t);
    gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(t);
    osc1.stop(t + 0.22);
    const osc2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(2400, t);
    osc2.frequency.exponentialRampToValueAtTime(1100, t + 0.15);
    gain2.gain.setValueAtTime(0.18, t);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    osc2.connect(gain2);
    gain2.connect(this.ctx.destination);
    osc2.start(t);
    osc2.stop(t + 0.18);
    const bufferSize = this.ctx.sampleRate * 0.08;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 600;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(t);
  }
  playSynthDing(repIndex = 1) {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    const baseFreq = 523.25;
    const pitchMultiplier = 1 + (repIndex - 1) * 0.04;
    osc.frequency.setValueAtTime(baseFreq * pitchMultiplier, t);
    osc.frequency.exponentialRampToValueAtTime((baseFreq * 1.5) * pitchMultiplier, t + 0.12);
    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.2);
  }
  playSynthGrunt() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(55, t + 0.12);
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 350;
    gain.gain.setValueAtTime(0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.12);
  }
  playSynthSetDone() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      const startTime = t + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.16);
    });
  }
  playSynthVictoryFanfare() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const melody = [
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 523.25, d: 0.15 },
      { f: 659.25, d: 0.4 },
      { f: 587.33, d: 0.2 },
      { f: 659.25, d: 0.2 },
      { f: 783.99, d: 0.6 }
    ];
    let curTime = t;
    melody.forEach((note) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(note.f, curTime);
      gain.gain.setValueAtTime(0.3, curTime);
      gain.gain.exponentialRampToValueAtTime(0.01, curTime + note.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(curTime);
      osc.stop(curTime + note.d);
      curTime += note.d * 0.85;
    });
  }
  playSynthClick() {
    if (this.isMuted) return;
    this.init();
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  }
}
export const sound = new SoundSystem();

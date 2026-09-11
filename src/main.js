import './style.css';
import confetti from 'canvas-confetti';
import { WORKOUT_SPLITS, PONJIKKARA_QUOTES, FUNNY_TITLES, CINEMA_REACTIONS, EASTER_EGGS } from './data.js';
import { sound } from './audio.js';
import { CharacterStage } from './character.js';
import { GestureController } from './gesture.js';

class PonjikkaraApp {
  constructor() {
    this.gestureController = null;
    this.currentSplitKey = "chest";
    this.currentSplit = WORKOUT_SPLITS.chest;
    this.workoutIndex = 0;
    this.currentSet = 1;
    this.currentRep = 0;
    this.globalTotalReps = parseInt(localStorage.getItem("ponji_total_reps") || "0", 10);
    this.sessionReps = 0;
    this.isResting = false;
    this.restTimer = null;
    this.restSecondsRemaining = 10;
    this.idleTimer = null;
    this.lastPressTimestamp = 0;
    this.rapidPressCount = 0;
    this.toastTimeout = null;

    this.screenMenu = document.getElementById("screen-menu");
    this.screenPreview = document.getElementById("screen-preview");
    this.screenWorkout = document.getElementById("screen-workout");
    this.screenVictory = document.getElementById("screen-victory");
    this.modalSetDone = document.getElementById("modal-set-done");
    this.modalExerciseDone = document.getElementById("modal-exercise-done");
    this.characterContainer = document.getElementById("character-stage-container");
    this.characterStage = new CharacterStage(this.characterContainer);
    this.init();
  }
  init() {
    this.renderMenuSplits();
    this.bindEvents();
    this.updateGlobalRepCounter();
  }
  bindEvents() {
    document.getElementById("nav-home-btn").addEventListener("click", () => {
      this.showScreen("menu");
    });
    const heroQuickStart = document.getElementById("hero-quick-start-btn");
    if (heroQuickStart) {
      heroQuickStart.addEventListener("click", () => {
        sound.playClick();
        this.openSplitPreview("chest");
      });
    }
    const soundBtn = document.getElementById("sound-toggle-btn");
    const soundIcon = document.getElementById("sound-icon");
    const soundText = document.getElementById("sound-text");
    soundBtn.addEventListener("click", () => {
      const isMuted = sound.toggleMute();
      soundIcon.textContent = isMuted ? "🔇" : "🔊";
      soundText.textContent = isMuted ? "MUTED" : "AUDIO ON";
      if (!isMuted) sound.playClick();
    });
    document.getElementById("exit-workout-btn").addEventListener("click", () => {
      if (confirm("Are you sure you want to give up? Ponjikkara will be slightly disappointed.")) {
        this.showScreen("menu");
      }
    });
    document.getElementById("cancel-preview-btn").addEventListener("click", () => {
      this.showScreen("menu");
    });
    document.getElementById("start-workout-btn").addEventListener("click", () => {
      sound.playClick();
      this.startWorkoutSession();
    });
    const tapBtn = document.getElementById("spacebar-tap-btn");
    tapBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this.handleRepPress();
    });
    window.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        if (!this.screenWorkout.classList.contains("hidden")) {
          e.preventDefault();
          tapBtn.classList.add("pressed");
          this.handleRepPress();
        }
      }
    });
    window.addEventListener("keyup", (e) => {
      if (e.code === "Space") {
        tapBtn.classList.remove("pressed");
      }
    });

    const toggleCamBtn = document.getElementById("toggle-camera-btn");
    const webcamContainer = document.getElementById("webcam-container");
    const toggleCamText = document.getElementById("toggle-camera-text");
    const webcamPlaceholder = document.getElementById("webcam-placeholder");

    this.gestureController = new GestureController({
      videoElement: document.getElementById("webcam-feed"),
      placeholderElement: webcamPlaceholder,
      containerElement: webcamContainer,
      statusBadgeElement: document.getElementById("gesture-status-badge"),
      overlayElement: document.getElementById("gesture-overlay"),
      onRepTriggered: () => {
        if (!this.screenWorkout.classList.contains("hidden") && !this.isResting) {
          tapBtn.classList.add("pressed");
          setTimeout(() => tapBtn.classList.remove("pressed"), 180);
          this.handleRepPress();
        }
      }
    });

    toggleCamBtn.addEventListener("click", async () => {
      sound.playClick();
      if (this.gestureController.isRunning) {
        this.gestureController.stopCamera();
        toggleCamText.textContent = "Enable Webcam";
        if (webcamContainer) webcamContainer.classList.add("hidden");
      } else {
        toggleCamText.textContent = "Connecting...";
        try {
          if (webcamContainer) webcamContainer.classList.remove("hidden");
          await this.gestureController.startCamera();
          toggleCamText.textContent = "Disable Webcam";
        } catch (err) {
          console.error("Camera startup failed:", err);
          toggleCamText.textContent = "Enable Webcam";
          if (webcamContainer) webcamContainer.classList.add("hidden");
        }
      }
    });
    document.getElementById("next-set-btn").addEventListener("click", () => {
      sound.playClick();
      this.proceedToNextSet();
    });
    document.getElementById("give-up-set-btn").addEventListener("click", () => {
      this.closeModal(this.modalSetDone);
      this.showScreen("menu");
    });
    document.getElementById("next-exercise-btn").addEventListener("click", () => {
      sound.playClick();
      this.proceedToNextExercise();
    });
    document.getElementById("print-cert-btn").addEventListener("click", () => {
      window.print();
    });
    document.getElementById("try-another-split-btn").addEventListener("click", () => {
      sound.playClick();
      this.showScreen("menu");
    });

    // Malayalam Cinema Easter Eggs
    const chayaBtn = document.getElementById("easter-egg-chaya");
    if (chayaBtn) {
      chayaBtn.addEventListener("click", () => {
        sound.playClick();
        this.showCinemaToast("☕", EASTER_EGGS.CHAYA);
      });
    }

    const clapBtn = document.getElementById("easter-egg-clap");
    if (clapBtn) {
      clapBtn.addEventListener("click", () => {
        sound.playClick();
        this.showCinemaToast("🎬", EASTER_EGGS.CLAPBOARD);
      });
    }

    const sealBtn = document.getElementById("easter-egg-seal");
    if (sealBtn) {
      sealBtn.addEventListener("click", () => {
        sound.playClick();
        this.showCinemaToast("🏆", EASTER_EGGS.SEAL, 4200);
      });
    }
  }

  showCinemaToast(icon, message, durationMs = 3200) {
    const toast = document.getElementById("cinema-toast");
    const toastIcon = document.getElementById("cinema-toast-icon");
    const toastMsg = document.getElementById("cinema-toast-message");
    if (!toast || !toastMsg) return;
    toastIcon.textContent = icon;
    toastMsg.textContent = message;
    toast.classList.add("visible");
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      toast.classList.remove("visible");
    }, durationMs);
  }

  updateCinemaReaction(text) {
    const bubbleText = document.getElementById("cinema-reaction-text");
    if (bubbleText) {
      bubbleText.textContent = `"${text.replace(/^"|"$/g, '')}"`;
      const container = document.getElementById("cinema-reaction-container");
      if (container) {
        container.classList.remove("animate-scale-in");
        void container.offsetWidth;
        container.classList.add("animate-scale-in");
      }
    }
  }

  resetIdleTimer() {
    clearTimeout(this.idleTimer);
    if (this.screenWorkout.classList.contains("hidden") || this.isResting) return;
    this.idleTimer = setTimeout(() => {
      if (!this.screenWorkout.classList.contains("hidden") && !this.isResting) {
        const idleLines = CINEMA_REACTIONS.IDLE;
        const randomIdle = idleLines[Math.floor(Math.random() * idleLines.length)];
        this.updateCinemaReaction(randomIdle);
      }
    }, 6500);
  }
  renderMenuSplits() {
    const grid = document.getElementById("splits-grid");
    grid.innerHTML = "";
    Object.values(WORKOUT_SPLITS).forEach((split) => {
      const card = document.createElement("div");
      card.className = "group relative p-6 sm:p-7 rounded-3xl bg-white hover:bg-blue-50/20 border border-slate-200/80 hover:border-blue-400/80 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between cursor-pointer";
      card.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl group-hover:scale-105 transition-transform">
                ${split.icon}
              </div>
              <div>
                <h3 class="font-extrabold text-lg sm:text-xl text-slate-900 group-hover:text-blue-600 transition">${split.name}</h3>
                <span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider">${split.badge} SPLIT</span>
              </div>
            </div>
            <span class="text-xs px-2.5 py-1 rounded-full bg-slate-100 font-semibold text-slate-600">
              3 EXERCISES
            </span>
          </div>
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">${split.description}</p>
          <div class="space-y-1.5 pt-2 border-t border-slate-100">
            <span class="text-[10px] font-bold uppercase text-slate-400 tracking-wider">INCLUDED WORKOUTS:</span>
            <div class="space-y-1">
              ${split.workouts.map((w, idx) => `
                <div class="text-xs text-slate-600 font-medium flex items-center gap-2">
                  <span class="text-blue-600 font-bold">${idx + 1}.</span>
                  <span>${w.name}</span>
                </div>
              `).join("")}
            </div>
          </div>
        </div>
        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span class="text-xs text-slate-400 italic truncate max-w-[200px]">"${split.flavor}"</span>
          <span class="px-3.5 py-1.5 rounded-xl bg-blue-50 group-hover:bg-blue-600 text-blue-600 group-hover:text-white font-bold text-xs tracking-wide transition flex items-center gap-1">
            SELECT SPLIT →
          </span>
        </div>
      `;
      card.addEventListener("click", () => {
        sound.playClick();
        this.openSplitPreview(split.id);
      });
      grid.appendChild(card);
    });
  }
  openSplitPreview(splitKey) {
    this.currentSplitKey = splitKey;
    this.currentSplit = WORKOUT_SPLITS[splitKey];
    document.getElementById("preview-badge").textContent = `${this.currentSplit.badge} DAY`;
    document.getElementById("preview-title").textContent = this.currentSplit.name;
    document.getElementById("preview-description").textContent = this.currentSplit.description;
    const list = document.getElementById("preview-workouts-list");
    list.innerHTML = "";
    this.currentSplit.workouts.forEach((w, idx) => {
      const row = document.createElement("div");
      row.className = "flex items-center justify-between p-4 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/60 text-sm transition";
      row.innerHTML = `
        <div class="flex items-center gap-3.5">
          <div class="w-8 h-8 rounded-xl bg-blue-100/70 text-blue-700 font-extrabold text-xs flex items-center justify-center">
            ${idx + 1}
          </div>
          <div>
            <div class="font-bold text-slate-900 text-sm sm:text-base">${w.name}</div>
            <div class="text-xs text-slate-500 font-medium">${w.equipment}</div>
          </div>
        </div>
        <div class="text-right">
          <span class="text-xs font-extrabold text-blue-600 block">3 SETS × 12 REPS</span>
          <span class="text-[11px] text-slate-400 font-medium">${w.target}</span>
        </div>
      `;
      list.appendChild(row);
    });
    this.showScreen("preview");
  }
  startWorkoutSession() {
    this.workoutIndex = 0;
    this.currentSet = 1;
    this.currentRep = 0;
    this.sessionReps = 0;
    this.loadCurrentWorkout();
    this.showScreen("workout");
  }
  loadCurrentWorkout() {
    const workout = this.currentSplit.workouts[this.workoutIndex];
    document.getElementById("workout-number-badge").textContent = `WORKOUT ${this.workoutIndex + 1} / 3`;
    document.getElementById("workout-split-tag").textContent = `${this.currentSplit.badge} DAY`;
    document.getElementById("current-workout-name").textContent = workout.name;
    document.getElementById("current-workout-equipment").textContent = workout.equipment;
    document.getElementById("current-workout-target").textContent = workout.target;
    document.getElementById("workout-instruction").textContent = workout.instruction;
    this.characterStage.setWorkout(workout);
    this.updateWorkoutUI();
    this.updateCinemaReaction(`ആക്ഷൻ! Spacebar അടിച്ച് ${workout.name} തുടങ്ങിക്കോളൂ.`);
    this.resetIdleTimer();
  }
  handleRepPress() {
    if (this.isResting) return;
    if (this.currentRep >= 12) return;
    this.currentRep++;
    this.globalTotalReps++;
    this.sessionReps++;
    localStorage.setItem("ponji_total_reps", this.globalTotalReps.toString());
    sound.playClank();
    sound.playGrunt();
    sound.playDing(this.currentRep);
    const workout = this.currentSplit.workouts[this.workoutIndex];
    const grunt = workout.grunts[Math.floor(Math.random() * workout.grunts.length)];
    this.characterStage.triggerRep(this.currentRep, grunt);
    this.updateWorkoutUI();
    this.updateGlobalRepCounter();

    // Contextual Malayalam Cinema Reaction
    const now = Date.now();
    if (now - this.lastPressTimestamp < 160) {
      this.rapidPressCount++;
    } else {
      this.rapidPressCount = 0;
    }
    this.lastPressTimestamp = now;

    if (this.rapidPressCount >= 4) {
      const spamLines = CINEMA_REACTIONS.SPAM;
      this.updateCinemaReaction(spamLines[Math.floor(Math.random() * spamLines.length)]);
    } else if (this.currentRep === 1) {
      const lines = CINEMA_REACTIONS.FIRST_REP;
      this.updateCinemaReaction(lines[Math.floor(Math.random() * lines.length)]);
    } else if (this.currentRep === 6) {
      const lines = CINEMA_REACTIONS.MID_SET;
      this.updateCinemaReaction(lines[Math.floor(Math.random() * lines.length)]);
    } else if (this.currentRep === 11) {
      const lines = CINEMA_REACTIONS.PENULTIMATE;
      this.updateCinemaReaction(lines[Math.floor(Math.random() * lines.length)]);
    }
    this.resetIdleTimer();

    if (this.currentRep >= 12) {
      this.handleSetFinished();
    }
  }
  handleSetFinished() {
    this.isResting = true;
    clearTimeout(this.idleTimer);
    const lines = CINEMA_REACTIONS.SET_DONE;
    this.updateCinemaReaction(lines[Math.floor(Math.random() * lines.length)]);
    if (this.currentSet >= 3) {
      sound.playExerciseDone();
      setTimeout(() => {
        this.openExerciseDoneModal();
      }, 400);
    } else {
      sound.playSetDone();
      setTimeout(() => {
        this.openSetDoneModal();
      }, 400);
    }
  }
  openSetDoneModal() {
    const quote = PONJIKKARA_QUOTES[Math.floor(Math.random() * PONJIKKARA_QUOTES.length)];
    document.getElementById("modal-set-title").textContent = `SET ${this.currentSet} OF 3 COMPLETED!`;
    document.getElementById("modal-set-quote").textContent = quote;
    this.startRestTimer();
    this.openModal(this.modalSetDone);
  }
  startRestTimer() {
    clearInterval(this.restTimer);
    this.restSecondsRemaining = 10;
    const countdownEl = document.getElementById("rest-timer-countdown");
    countdownEl.textContent = this.restSecondsRemaining;
    this.restTimer = setInterval(() => {
      this.restSecondsRemaining--;
      countdownEl.textContent = this.restSecondsRemaining;
      if (this.restSecondsRemaining <= 0) {
        clearInterval(this.restTimer);
      }
    }, 1000);
  }
  proceedToNextSet() {
    clearInterval(this.restTimer);
    this.currentSet++;
    this.currentRep = 0;
    this.isResting = false;
    this.closeModal(this.modalSetDone);
    this.updateWorkoutUI();
    const quote = PONJIKKARA_QUOTES[Math.floor(Math.random() * PONJIKKARA_QUOTES.length)];
    document.getElementById("coach-flavor-quote").textContent = quote;
    this.updateCinemaReaction(`സെറ്റ് ${this.currentSet} ആരംഭിക്കുന്നു. ആക്ഷൻ! ⚡`);
    this.resetIdleTimer();
  }
  openExerciseDoneModal() {
    const workout = this.currentSplit.workouts[this.workoutIndex];
    document.getElementById("modal-exercise-title").textContent = `${workout.name} CONQUERED!`;
    if (this.workoutIndex < this.currentSplit.workouts.length - 1) {
      const nextWorkout = this.currentSplit.workouts[this.workoutIndex + 1];
      document.getElementById("modal-next-workout-name").textContent = nextWorkout.name;
      document.getElementById("modal-next-workout-target").textContent = nextWorkout.target;
      document.getElementById("next-exercise-btn").textContent = "PROCEED TO NEXT WORKOUT 🚀";
    } else {
      document.getElementById("modal-next-workout-name").textContent = "All 3 Workouts Finished!";
      document.getElementById("modal-next-workout-target").textContent = "Prepare for your Grand Victory Certificate!";
      document.getElementById("next-exercise-btn").textContent = "CLAIM PONJIKKARA VICTORY 👑";
    }
    this.openModal(this.modalExerciseDone);
  }
  proceedToNextExercise() {
    this.closeModal(this.modalExerciseDone);
    if (this.workoutIndex < this.currentSplit.workouts.length - 1) {
      this.workoutIndex++;
      this.currentSet = 1;
      this.currentRep = 0;
      this.isResting = false;
      this.loadCurrentWorkout();
    } else {
      this.triggerVictory();
    }
  }
  triggerVictory() {
    this.showScreen("victory");
    sound.playVictoryFanfare();
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    const randomTitle = FUNNY_TITLES[Math.floor(Math.random() * FUNNY_TITLES.length)];
    document.getElementById("cert-title").textContent = randomTitle;
    document.getElementById("cert-split-name").textContent = this.currentSplit.name;
    const cals = (this.sessionReps * 0.0001).toFixed(4);
    document.getElementById("cert-total-reps").textContent = this.sessionReps;
    document.getElementById("cert-total-cals").textContent = `${cals} kcal`;
    document.getElementById("cert-sweat-lost").textContent = `${(this.sessionReps * 0.02).toFixed(2)} ml`;
  }
  updateWorkoutUI() {
    document.getElementById("current-rep-display").textContent = this.currentRep;
    const circle = document.getElementById("rep-progress-circle");
    const circumference = 264;
    const progress = this.currentRep / 12;
    const offset = circumference - progress * circumference;
    circle.style.strokeDashoffset = offset;
    document.getElementById("current-set-display").textContent = this.currentSet;
    for (let s = 1; s <= 3; s++) {
      const chip = document.getElementById(`chip-set-${s}`);
      const statusText = chip.querySelector(".status-text");
      if (s < this.currentSet) {
        chip.className = "flex-1 py-1.5 px-3 rounded-full border border-emerald-500/50 bg-emerald-50 text-center transition";
        statusText.textContent = "DONE";
        statusText.className = "text-[10px] font-bold text-emerald-600 status-text ml-1";
      } else if (s === this.currentSet) {
        chip.className = "flex-1 py-1.5 px-3 rounded-full border border-blue-500 bg-blue-50 text-center transition";
        statusText.textContent = "ACTIVE";
        statusText.className = "text-[10px] font-bold text-blue-600 status-text ml-1";
      } else {
        chip.className = "flex-1 py-1.5 px-3 rounded-full border border-slate-200 bg-slate-50 text-center opacity-60 transition";
        statusText.textContent = "WAITING";
        statusText.className = "text-[10px] font-medium text-slate-400 status-text ml-1";
      }
    }
    const cals = (this.sessionReps * 0.0001).toFixed(4);
    document.getElementById("active-calories-burned").textContent = `${cals} kcal`;
  }
  updateGlobalRepCounter() {
    const el = document.getElementById("global-rep-counter");
    if (el) el.textContent = this.globalTotalReps;
  }
  showScreen(screenName) {
    this.screenMenu.classList.add("hidden");
    this.screenPreview.classList.add("hidden");
    this.screenWorkout.classList.add("hidden");
    this.screenVictory.classList.add("hidden");
    const exitBtn = document.getElementById("exit-workout-btn");
    if (screenName === "menu") {
      this.screenMenu.classList.remove("hidden");
      exitBtn.classList.add("hidden");
    } else if (screenName === "preview") {
      this.screenPreview.classList.remove("hidden");
      exitBtn.classList.add("hidden");
    } else if (screenName === "workout") {
      this.screenWorkout.classList.remove("hidden");
      exitBtn.classList.remove("hidden");
    } else if (screenName === "victory") {
      this.screenVictory.classList.remove("hidden");
      exitBtn.classList.add("hidden");
    }

    if (screenName !== "workout" && this.gestureController && this.gestureController.isRunning) {
      this.gestureController.stopCamera();
      const toggleCamText = document.getElementById("toggle-camera-text");
      if (toggleCamText) toggleCamText.textContent = "Enable Webcam";
      const webcamContainer = document.getElementById("webcam-container");
      if (webcamContainer) webcamContainer.classList.add("hidden");
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  openModal(modal) {
    modal.classList.remove("hidden");
  }
  closeModal(modal) {
    modal.classList.add("hidden");
  }
}
window.addEventListener("DOMContentLoaded", () => {
  new PonjikkaraApp();
});

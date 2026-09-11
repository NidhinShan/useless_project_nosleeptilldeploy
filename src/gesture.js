import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

export class GestureController {
  /**
   * @param {Object} config
   * @param {HTMLVideoElement} config.videoElement
   * @param {HTMLElement} config.containerElement
   * @param {HTMLElement} config.statusBadgeElement
   * @param {HTMLElement} config.overlayElement
   * @param {Function} config.onRepTriggered
   */
  constructor({ videoElement, containerElement, statusBadgeElement, overlayElement, onRepTriggered }) {
    this.video = videoElement;
    this.container = containerElement;
    this.statusBadge = statusBadgeElement;
    this.overlay = overlayElement;
    this.onRepTriggered = onRepTriggered;

    this.recognizer = null;
    this.stream = null;
    this.isRunning = false;
    this.animationFrameId = null;

    // Gym Rep State Machine: 'SEARCHING' -> 'READY' -> 'PUMPED'
    this.state = "SEARCHING";
    this.lastRepTimestamp = 0;
    this.minRepCooldownMs = 350; // Minimum time between reps
    this.openFramesCount = 0; // Debounce for open hand
    this.fistFramesCount = 0; // Debounce for fist detection
  }

  async init() {
    if (this.recognizer) return;

    this.updateStatus("LOADING AI...", "bg-amber-500/20 text-amber-400 border-amber-500/30");
    if (this.overlay) this.overlay.textContent = "Loading gesture vision model...";

    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm"
      );

      this.recognizer = await GestureRecognizer.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numHands: 1
      });

      this.updateStatus("MODEL READY", "bg-emerald-500/20 text-emerald-400 border-emerald-500/30");
      if (this.overlay) this.overlay.textContent = "Model ready! Starting camera...";
    } catch (err) {
      console.error("Failed to initialize MediaPipe GestureRecognizer:", err);
      this.updateStatus("LOAD ERROR", "bg-red-500/20 text-red-400 border-red-500/30");
      if (this.overlay) this.overlay.textContent = "Failed to load gesture model. Try refreshing.";
      throw err;
    }
  }

  async startCamera() {
    try {
      await this.init();

      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 480 },
          height: { ideal: 360 },
          facingMode: "user"
        },
        audio: false
      });

      this.video.srcObject = this.stream;
      await this.video.play();

      this.isRunning = true;
      this.state = "SEARCHING";
      this.updateStatus("ACTIVE 🟢", "bg-emerald-500/20 text-emerald-400 border-emerald-500/30");
      if (this.overlay) this.overlay.textContent = "🔍 Show your hand in frame";

      this.detectLoop();
    } catch (err) {
      console.error("Failed to start webcam:", err);
      this.updateStatus("CAM BLOCKED", "bg-red-500/20 text-red-400 border-red-500/30");
      if (this.overlay) this.overlay.textContent = "Camera access denied. Use spacebar!";
      this.stopCamera();
      throw err;
    }
  }

  stopCamera() {
    this.isRunning = false;

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.video) {
      this.video.srcObject = null;
    }

    this.state = "SEARCHING";
    this.updateStatus("OFF", "bg-slate-800 text-slate-400 border-slate-700");
    if (this.overlay) this.overlay.textContent = "Camera disabled";
  }

  detectLoop() {
    if (!this.isRunning) return;

    if (this.recognizer && this.video.readyState >= 2) {
      try {
        const now = performance.now();
        const results = this.recognizer.recognizeForVideo(this.video, now);

        this.handleResults(results);
      } catch (err) {
        console.warn("Gesture recognition frame error:", err);
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.detectLoop());
  }

  handleResults(results) {
    if (!results.gestures || results.gestures.length === 0) {
      this.openFramesCount = 0;
      this.fistFramesCount = 0;
      if (this.state !== "SEARCHING") {
        this.state = "SEARCHING";
        if (this.overlay) this.overlay.textContent = "🔍 Show hand to resume";
      }
      return;
    }

    const topGesture = results.gestures[0][0];
    const category = topGesture.categoryName;
    const score = topGesture.score;

    if (score < 0.55) {
      return;
    }

    const now = Date.now();

    // Hand is clenched into a fist or flexing pump
    if (category === "Closed_Fist" || category === "Thumb_Up") {
      this.fistFramesCount++;
      this.openFramesCount = 0;

      if (
        this.state === "READY" &&
        this.fistFramesCount >= 2 &&
        now - this.lastRepTimestamp > this.minRepCooldownMs
      ) {
        // Trigger Rep!
        this.state = "PUMPED";
        this.lastRepTimestamp = now;

        if (this.overlay) {
          this.overlay.textContent = "✊ REP! Ponjikkara Iron Lifted!";
        }

        this.triggerFlashEffect();

        if (this.onRepTriggered) {
          this.onRepTriggered();
        }
      } else if (this.state === "PUMPED") {
        if (this.overlay) {
          this.overlay.textContent = "✊ Open hand ✋ to prepare next rep";
        }
      } else if (this.state === "SEARCHING") {
        if (this.overlay) {
          this.overlay.textContent = "✋ Open hand first to prepare rep";
        }
      }
    } else {
      // Hand is open / relaxed (Open_Palm, Pointing_Up, Victory, None, etc.)
      this.openFramesCount++;
      this.fistFramesCount = 0;

      if (this.openFramesCount >= 2) {
        this.state = "READY";
        if (this.overlay) {
          this.overlay.textContent = "✋ READY! Clench fist ✊ to rep!";
        }
      }
    }
  }

  triggerFlashEffect() {
    if (!this.container) return;
    this.container.classList.add("rep-flash");
    setTimeout(() => {
      this.container.classList.remove("rep-flash");
    }, 250);
  }

  updateStatus(text, classes) {
    if (!this.statusBadge) return;
    this.statusBadge.textContent = text;
    this.statusBadge.className = `text-[10px] font-mono px-2.5 py-0.5 rounded border transition-colors ${classes}`;
  }
}

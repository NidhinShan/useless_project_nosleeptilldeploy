import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";

export class GestureController {
  /**
   * @param {Object} config
   * @param {HTMLVideoElement} config.videoElement
   * @param {HTMLElement} config.containerElement
   * @param {HTMLElement} config.statusBadgeElement
   * @param {HTMLElement} config.overlayElement
   * @param {HTMLElement} [config.gaugeFillElement]
   * @param {Function} config.onRepTriggered
   */
  constructor({ videoElement, containerElement, statusBadgeElement, overlayElement, gaugeFillElement, onRepTriggered }) {
    this.video = videoElement;
    this.container = containerElement;
    this.statusBadge = statusBadgeElement;
    this.overlay = overlayElement;
    this.gaugeFill = gaugeFillElement;
    this.onRepTriggered = onRepTriggered;

    this.recognizer = null;
    this.stream = null;
    this.isRunning = false;
    this.animationFrameId = null;

    // Gym Rep State Machine: 'SEARCHING' -> 'ARM_DOWN' -> 'ARM_UP'
    this.state = "SEARCHING";
    this.lastRepTimestamp = 0;
    this.minRepCooldownMs = 380; // Minimum time between reps

    // Vertical curl motion tracking (normalized Y coords: 0 top, 1 bottom)
    this.baselineBottomY = 0.58;
    this.baselineTopY = 0.36;
    this.smoothedHandY = null;
    this.fistFramesCount = 0;
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
      this.smoothedHandY = null;
      this.updateStatus("ACTIVE 🟢", "bg-emerald-500/20 text-emerald-400 border-emerald-500/30");
      if (this.overlay) this.overlay.textContent = "🔍 Show open hand ✋ in frame";

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

    if (this.gaugeFill) {
      this.gaugeFill.style.height = "0%";
    }

    this.state = "SEARCHING";
    this.smoothedHandY = null;
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
    const hasHand = results.landmarks && results.landmarks.length > 0;

    if (!hasHand) {
      this.fistFramesCount = 0;
      if (this.gaugeFill) this.gaugeFill.style.height = "0%";

      if (this.state !== "SEARCHING") {
        this.state = "SEARCHING";
        if (this.overlay) this.overlay.textContent = "🔍 Show open hand ✋ to start curling";
      }
      return;
    }

    const landmarks = results.landmarks[0];
    const wrist = landmarks[0];
    const middleMcp = landmarks[9];
    const middleTip = landmarks[12];

    // Hand vertical center in normalized frame (0 = top, 1 = bottom)
    const rawHandY = (wrist.y + middleMcp.y) / 2;
    if (this.smoothedHandY === null) {
      this.smoothedHandY = rawHandY;
    } else {
      this.smoothedHandY = this.smoothedHandY * 0.45 + rawHandY * 0.55;
    }
    const handY = this.smoothedHandY;

    // Check categorized gestures
    let category = "None";
    let score = 0;
    if (results.gestures && results.gestures.length > 0 && results.gestures[0].length > 0) {
      category = results.gestures[0][0].categoryName;
      score = results.gestures[0][0].score;
    }

    // Hand landmark checks: open hand has fingertips extended outward from wrist
    const tipDist = Math.hypot(middleTip.x - wrist.x, middleTip.y - wrist.y);
    const mcpDist = Math.hypot(middleMcp.x - wrist.x, middleMcp.y - wrist.y);
    const isExtendedFingers = tipDist > mcpDist * 1.25;
    const isCategoryFist = category === "Closed_Fist" && score > 0.6;
    const isOpenHand = isExtendedFingers && !isCategoryFist;

    // Dynamically adapt baseline if hand is held lower down
    if (handY > this.baselineBottomY) {
      this.baselineBottomY = Math.min(0.78, handY);
      this.baselineTopY = Math.max(0.20, this.baselineBottomY - 0.22);
    }

    // Calculate vertical curl progress (0 = arm down/extended, 1 = curled up)
    const curlRange = Math.max(0.16, this.baselineBottomY - this.baselineTopY);
    let progress = (this.baselineBottomY - handY) / curlRange;
    progress = Math.max(0, Math.min(1, progress));
    const progressPercent = Math.round(progress * 100);

    if (this.gaugeFill) {
      this.gaugeFill.style.height = `${progressPercent}%`;
    }

    const now = Date.now();

    // 1. OPEN-HAND BICEP CURL LOGIC
    // Hand lowered down -> Ready to curl
    if (progress <= 0.32 || handY >= this.baselineBottomY - 0.05) {
      if (this.state !== "ARM_DOWN") {
        this.state = "ARM_DOWN";
        this.fistFramesCount = 0;
      }
      if (this.overlay) {
        this.overlay.textContent = isOpenHand
          ? "✋ Open Hand Down - Now Curl UP! 💪"
          : "⬇️ Hand Down - Now Curl UP! 💪";
      }
    }
    // Hand curled up to top of motion
    else if (progress >= 0.72) {
      if (this.state === "ARM_DOWN" && (now - this.lastRepTimestamp > this.minRepCooldownMs)) {
        this.state = "ARM_UP";
        this.lastRepTimestamp = now;

        if (this.overlay) {
          this.overlay.textContent = isOpenHand
            ? "💪 OPEN-HAND CURL! PEAK PUMP! 🔥"
            : "💪 BICEP CURL REP! PUMPED! 🔥";
        }

        this.triggerFlashEffect();
        if (this.onRepTriggered) this.onRepTriggered();
      } else if (this.state === "ARM_UP") {
        if (this.overlay) {
          this.overlay.textContent = "⬇️ Lower hand back down for next curl";
        }
      }
    }
    else {
      // In mid-curl transit
      if (this.state === "ARM_DOWN" && this.overlay) {
        this.overlay.textContent = isOpenHand
          ? "✋ Curling up... Keep going! ⬆️"
          : "⬆️ Pull it all the way up!";
      }
    }

    // 2. ALSO SUPPORT CLENCHED FIST PUMP
    if (isCategoryFist) {
      this.fistFramesCount++;
      if (
        this.state !== "ARM_UP" &&
        this.fistFramesCount >= 2 &&
        (now - this.lastRepTimestamp > this.minRepCooldownMs)
      ) {
        this.state = "ARM_UP";
        this.lastRepTimestamp = now;
        if (this.overlay) this.overlay.textContent = "✊ FIST PUMP REP! IRON CRUSHED! 🔥";
        this.triggerFlashEffect();
        if (this.onRepTriggered) this.onRepTriggered();
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

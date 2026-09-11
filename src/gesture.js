import { FilesetResolver, GestureRecognizer } from "@mediapipe/tasks-vision";
import { CAMERA_CINEMA_LINES } from "./data.js";

export class GestureController {
  /**
   * @param {Object} config
   * @param {HTMLVideoElement} config.videoElement
   * @param {HTMLElement} config.placeholderElement
   * @param {HTMLElement} config.overlayElement
   * @param {HTMLElement} config.statusBadgeElement
   * @param {HTMLElement} config.containerElement
   * @param {Function} config.onRepTriggered
   */
  constructor({
    videoElement,
    placeholderElement,
    overlayElement,
    statusBadgeElement,
    containerElement,
    onRepTriggered
  }) {
    this.video = videoElement;
    this.placeholder = placeholderElement;
    this.overlay = overlayElement;
    this.statusBadge = statusBadgeElement;
    this.container = containerElement;
    this.onRepTriggered = onRepTriggered;

    this.recognizer = null;
    this.stream = null;
    this.isRunning = false;
    this.animationFrameId = null;

    // Rep State Machine: 'SEARCHING' -> 'READY' -> 'PUMPED'
    this.state = "SEARCHING";
    this.lastRepTimestamp = 0;
    this.minRepCooldownMs = 350;
    this.openFramesCount = 0;
    this.fistFramesCount = 0;
  }

  async init() {
    if (this.recognizer) return;

    this.updateStatus("LOADING AI...", "bg-blue-50 text-blue-600 border-blue-200");
    if (this.overlay) {
      this.overlay.textContent = "AI ആലോചിച്ചു കൊണ്ടിരിക്കുകയാണ്...";
      this.overlay.classList.remove("hidden");
    }

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

      this.updateStatus("MODEL READY", "bg-emerald-50 text-emerald-700 border-emerald-200");
    } catch (err) {
      console.error("Failed to initialize GestureRecognizer:", err);
      this.updateStatus("LOAD ERROR", "bg-rose-50 text-rose-700 border-rose-200");
      if (this.overlay) this.overlay.textContent = "സിസ്റ്റത്തിനും ചെറിയൊരു confusion ഉണ്ട്.";
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

      if (this.placeholder) this.placeholder.classList.add("hidden");
      if (this.video) this.video.classList.remove("hidden");
      if (this.overlay) {
        this.overlay.classList.remove("hidden");
        this.overlay.textContent = CAMERA_CINEMA_LINES.START;
      }

      this.isRunning = true;
      this.state = "SEARCHING";
      this.updateStatus("ACTIVE 🟢", "bg-emerald-50 text-emerald-700 border-emerald-200 font-bold");

      this.detectLoop();
    } catch (err) {
      console.error("Failed to start webcam:", err);
      this.updateStatus("CAM BLOCKED", "bg-rose-50 text-rose-700 border-rose-200");
      if (this.overlay) this.overlay.textContent = CAMERA_CINEMA_LINES.BLOCKED;
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
      this.video.classList.add("hidden");
    }

    if (this.placeholder) {
      this.placeholder.classList.remove("hidden");
    }

    if (this.overlay) {
      this.overlay.classList.add("hidden");
    }

    this.state = "SEARCHING";
    this.updateStatus("OFF", "bg-slate-100 text-slate-500 border-slate-200");
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
        if (this.overlay) this.overlay.textContent = CAMERA_CINEMA_LINES.NO_HAND;
      }
      return;
    }

    const topGesture = results.gestures[0][0];
    const category = topGesture.categoryName;
    const score = topGesture.score;

    if (score < 0.55) return;

    const now = Date.now();

    // Clenched fist or thumbs up -> triggers rep
    if (category === "Closed_Fist" || category === "Thumb_Up") {
      this.fistFramesCount++;
      this.openFramesCount = 0;

      if (
        this.state === "READY" &&
        this.fistFramesCount >= 2 &&
        now - this.lastRepTimestamp > this.minRepCooldownMs
      ) {
        this.state = "PUMPED";
        this.lastRepTimestamp = now;

        if (this.overlay) {
          this.overlay.textContent = CAMERA_CINEMA_LINES.REP_PUMP;
        }

        this.triggerFlashEffect();

        if (this.onRepTriggered) {
          this.onRepTriggered();
        }
      } else if (this.state === "PUMPED") {
        if (this.overlay) {
          this.overlay.textContent = CAMERA_CINEMA_LINES.PUMPED_WAIT;
        }
      } else if (this.state === "SEARCHING") {
        if (this.overlay) {
          this.overlay.textContent = CAMERA_CINEMA_LINES.READY;
        }
      }
    } else {
      // Open hand / relaxed posture -> Ready to pump
      this.openFramesCount++;
      this.fistFramesCount = 0;

      if (this.openFramesCount >= 2) {
        this.state = "READY";
        if (this.overlay) {
          this.overlay.textContent = CAMERA_CINEMA_LINES.READY;
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
    this.statusBadge.className = `text-[10px] font-mono px-2.5 py-0.5 rounded-full border transition-colors ${classes}`;
  }
}

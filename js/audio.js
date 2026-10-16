/**
 * ============================================================================
 * FocusFlow - Audio Engine (Synthesized Web Audio API)
 * Zero external audio assets required. 100% self-contained and offline-ready.
 * ============================================================================
 * Implements subtle auditory feedback for:
 * 1. Focus session start/pause/complete transitions.
 * 2. Persuasive reinforcement (reward arpeggio for streak milestones).
 * 3. Soothing continuous ambient noise generator for acoustic masking.
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.ambientNode = null;
    this.ambientGain = null;
    this.isAmbientPlaying = false;
  }

  /**
   * Initializes AudioContext upon user gesture (browser security policy).
   */
  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Toggles master mute state.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && this.isAmbientPlaying) {
      this.stopAmbientSound();
    }
    return this.isMuted;
  }

  /**
   * Generates a soft tactile click on interaction.
   */
  playTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Harmonious warm chime when a focus session starts.
   */
  playStartChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 (Major triad)
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);

        const startTime = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Soothing Tibetan singing bowl style completion gong for session completion.
   * HCI Goal: Non-jarring, relaxing transition indicating goal attainment.
   */
  playCompletionGong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const freqs = [440, 880, 1320]; // Fundamental + harmonics
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const amp = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(amp, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.5);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Ascending celebratory chime for streak reward (Persuasive Gamification).
   */
  playStreakCelebration() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const scale = [440, 554.37, 659.25, 880, 1108.73]; // A major arpeggio
      scale.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const start = this.ctx.currentTime + idx * 0.09;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Subtle alert ping for psychological nudges.
   */
  playNudgeAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, this.ctx.currentTime);
      osc.frequency.setValueAtTime(980, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.38);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Toggle gentle pink/brown ambient noise for cognitive masking during focus.
   */
  toggleAmbientSound() {
    if (this.isAmbientPlaying) {
      this.stopAmbientSound();
      return false;
    } else {
      this.startAmbientSound();
      return true;
    }
  }

  startAmbientSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      // Buffer of pink noise synthesized algorithmically
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.035;
        b6 = white * 0.115926;
      }

      this.ambientNode = this.ctx.createBufferSource();
      this.ambientNode.buffer = noiseBuffer;
      this.ambientNode.loop = true;

      // Lowpass filter to make it sound like gentle ambient rain / soft coffee shop murmur
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, this.ctx.currentTime);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 1.2);

      this.ambientNode.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientNode.start();
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn('Ambient sound start error:', e);
      this.isAmbientPlaying = false;
    }
  }

  stopAmbientSound() {
    if (!this.ambientNode || !this.ctx) return;
    try {
      this.ambientGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      setTimeout(() => {
        if (this.ambientNode) {
          try { this.ambientNode.stop(); } catch (_) {}
          this.ambientNode.disconnect();
          this.ambientNode = null;
        }
      }, 700);
    } catch (e) {
      console.warn('Ambient sound stop error:', e);
    }
    this.isAmbientPlaying = false;
  }
}

// Attach globally
window.AudioEngine = new AudioEngine();

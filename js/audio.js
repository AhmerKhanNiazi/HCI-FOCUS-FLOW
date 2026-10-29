class AudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterGain = null;
    this.ambientNode = null;
    this.ambientGain = null;
    this.ambientExtraNodes = [];
    this.isAmbientPlaying = false;
    this.currentSoundscape = 'rain';
    this.masterVolume = 0.8;
    this.ambientVolume = 0.35;
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(level) {
    this.masterVolume = Math.max(0, Math.min(1, level));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  setAmbientVolume(level) {
    this.ambientVolume = Math.max(0, Math.min(1, level));
    if (this.ambientGain && this.ctx && this.isAmbientPlaying) {
      this.ambientGain.gain.setValueAtTime(this.ambientVolume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
    if (this.isMuted && this.isAmbientPlaying) {
      this.stopAmbientSound(true);
    }
    return this.isMuted;
  }

  playTick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.035);
    } catch (e) {}
  }

  playStartChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        const startTime = this.ctx.currentTime + idx * 0.08;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.65);
      });
    } catch (e) {}
  }

  playCompletionGong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const freqs = [440, 880, 1320];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const amp = 0.12 / (idx + 1);
        gain.gain.setValueAtTime(amp, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(this.ctx.currentTime + 2.5);
      });
    } catch (e) {}
  }

  playStreakCelebration() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const scale = [440, 554.37, 659.25, 880, 1108.73];
      scale.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        const start = this.ctx.currentTime + idx * 0.09;
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.09, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + 0.5);
      });
    } catch (e) {}
  }

  playNudgeAlert() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(740, this.ctx.currentTime);
      osc.frequency.setValueAtTime(980, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.38);
    } catch (e) {}
  }

  setSoundscape(name) {
    this.currentSoundscape = name;
    if (this.isAmbientPlaying) {
      this.stopAmbientSound(true);
      this.startAmbientSound();
    }
  }

  toggleAmbientSound() {
    if (this.isAmbientPlaying) {
      this.stopAmbientSound(false);
      return false;
    } else {
      this.startAmbientSound();
      return true;
    }
  }

  startAmbientSound() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      this.stopAmbientSound(true);

      if (this.currentSoundscape === 'binaural') {
        this.startBinauralBeats();
      } else {
        this.startNoiseSoundscape(this.currentSoundscape);
      }
      this.isAmbientPlaying = true;
    } catch (e) {
      this.isAmbientPlaying = false;
    }
  }

  startBinauralBeats() {
    const carrier = 160;
    const gammaDiff = 40;

    const oscLeft = this.ctx.createOscillator();
    const oscRight = this.ctx.createOscillator();
    oscLeft.type = 'sine';
    oscRight.type = 'sine';
    oscLeft.frequency.setValueAtTime(carrier, this.ctx.currentTime);
    oscRight.frequency.setValueAtTime(carrier + gammaDiff, this.ctx.currentTime);

    const merger = this.ctx.createChannelMerger(2);
    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(380, this.ctx.currentTime);
    merger.connect(lowpass);

    const noiseBuffer = this.createPinkNoiseBuffer();
    const noiseNode = this.ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(450, this.ctx.currentTime);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.04, this.ctx.currentTime);
    noiseNode.connect(noiseFilter);
    noiseFilter.connect(noiseGain);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(this.ambientVolume * 0.45, this.ctx.currentTime + 0.8);

    lowpass.connect(this.ambientGain);
    noiseGain.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    oscLeft.start();
    oscRight.start();
    noiseNode.start();

    this.ambientNode = oscLeft;
    this.ambientExtraNodes = [oscRight, merger, lowpass, noiseNode, noiseFilter, noiseGain];
  }

  createPinkNoiseBuffer() {
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
    return noiseBuffer;
  }

  startNoiseSoundscape(type) {
    let noiseBuffer;
    if (type === 'whitenoise') {
      const bufferSize = 2 * this.ctx.sampleRate;
      noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.025;
      }
    } else {
      noiseBuffer = this.createPinkNoiseBuffer();
    }

    this.ambientNode = this.ctx.createBufferSource();
    this.ambientNode.buffer = noiseBuffer;
    this.ambientNode.loop = true;

    const filter = this.ctx.createBiquadFilter();
    if (type === 'waves') {
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(2.2, this.ctx.currentTime);
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.setValueAtTime(0.1, this.ctx.currentTime);
      lfoGain.gain.setValueAtTime(320, this.ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      this.ambientExtraNodes.push(lfo, lfoGain);
    } else if (type === 'whitenoise') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1100, this.ctx.currentTime);
      filter.Q.setValueAtTime(0.7, this.ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(700, this.ctx.currentTime);
    }

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(this.ambientVolume, this.ctx.currentTime + 0.8);

    this.ambientNode.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    this.ambientNode.start();
    this.ambientExtraNodes.push(filter);
  }

  stopAmbientSound(immediate = false) {
    if (!this.isAmbientPlaying && !this.ambientNode && this.ambientExtraNodes.length === 0) return;

    const oldNode = this.ambientNode;
    const oldExtras = [...this.ambientExtraNodes];
    const oldGain = this.ambientGain;

    this.ambientNode = null;
    this.ambientExtraNodes = [];
    this.ambientGain = null;
    this.isAmbientPlaying = false;

    if (immediate || !this.ctx || !oldGain) {
      try { if (oldNode) { oldNode.stop(); oldNode.disconnect(); } } catch (_) {}
      oldExtras.forEach(n => {
        try { if (n.stop) n.stop(); n.disconnect(); } catch (_) {}
      });
    } else {
      try {
        oldGain.gain.setValueAtTime(oldGain.gain.value, this.ctx.currentTime);
        oldGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);
      } catch (_) {}
      setTimeout(() => {
        try { if (oldNode) { oldNode.stop(); oldNode.disconnect(); } } catch (_) {}
        oldExtras.forEach(n => {
          try { if (n.stop) n.stop(); n.disconnect(); } catch (_) {}
        });
      }, 300);
    }
  }
}

window.AudioEngine = new AudioEngine();

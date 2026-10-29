class AccessibilityEngine {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.highContrast = false;
    this.fontSizes = ['normal', 'large', 'xlarge'];
    this.currentFontIndex = 0;
    this.lastAnnouncedMinute = null;
    this.srAnnouncer = null;
    this.srAlert = null;
    this.voiceStatusBadge = null;
    this.voiceTranscriptBadge = null;
  }

  init() {
    this.cacheDOM();
    this.initSpeechRecognition();
    this.loadPreferences();
    this.bindUI();
    this.announce('FocusFlow accessibility engine active. Press question mark for accessibility and voice command help.');
  }

  cacheDOM() {
    this.srAnnouncer = document.getElementById('sr-announcer');
    this.srAlert = document.getElementById('sr-alert');
    this.voiceStatusBadge = document.getElementById('voice-status-indicator');
    this.voiceTranscriptBadge = document.getElementById('voice-transcript');
  }

  loadPreferences() {
    const savedContrast = localStorage.getItem('focusflow_high_contrast');
    if (savedContrast === 'true') {
      this.toggleHighContrast(true);
    }
    const savedFontSize = localStorage.getItem('focusflow_font_size');
    if (savedFontSize && this.fontSizes.includes(savedFontSize)) {
      this.currentFontIndex = this.fontSizes.indexOf(savedFontSize);
      this.applyFontSize(savedFontSize);
    }
  }

  initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('SpeechRecognition API not supported in this browser.');
      return;
    }

    try {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.updateVoiceUI(true);
        this.announce('Voice recognition active. Listening for commands.');
      };

      this.recognition.onresult = (event) => {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
        this.handleVoiceCommand(transcript);
      };

      this.recognition.onerror = (event) => {
        if (event.error !== 'no-speech') {
          console.warn('Speech recognition error:', event.error);
        }
      };

      this.recognition.onend = () => {
        if (this.isListening) {
          try {
            this.recognition.start();
          } catch (e) {
            this.isListening = false;
            this.updateVoiceUI(false);
          }
        } else {
          this.updateVoiceUI(false);
        }
      };
    } catch (e) {
      console.warn('Failed to initialize SpeechRecognition:', e);
    }
  }

  toggleVoiceControl(forceState) {
    if (!this.recognition) {
      this.announce('Web Speech API is not supported in this browser. Please use Chrome or Edge.', 'assertive');
      alert('Voice Recognition is not supported by this browser. Please use Google Chrome or Microsoft Edge.');
      return false;
    }

    const shouldListen = typeof forceState === 'boolean' ? forceState : !this.isListening;
    if (shouldListen) {
      try {
        this.isListening = true;
        this.recognition.start();
      } catch (e) {
        this.isListening = false;
        this.updateVoiceUI(false);
      }
    } else {
      this.isListening = false;
      try {
        this.recognition.stop();
      } catch (e) {}
      this.updateVoiceUI(false);
      this.announce('Voice control deactivated.');
    }
    return this.isListening;
  }

  updateVoiceUI(active) {
    const toggleBtn = document.getElementById('voice-toggle-btn');
    const statusWrap = document.getElementById('voice-live-badge');
    const statusText = document.getElementById('voice-status-text');

    if (toggleBtn) {
      toggleBtn.setAttribute('aria-pressed', active ? 'true' : 'false');
      if (active) {
        toggleBtn.classList.add('bg-rose-500/30', 'border-rose-400', 'text-rose-200');
        toggleBtn.classList.remove('text-slate-300');
      } else {
        toggleBtn.classList.remove('bg-rose-500/30', 'border-rose-400', 'text-rose-200');
        toggleBtn.classList.add('text-slate-300');
      }
    }

    if (statusWrap) {
      statusWrap.classList.toggle('hidden', !active);
    }

    if (statusText) {
      statusText.textContent = active ? 'Listening...' : 'Voice Off';
    }
  }

  handleVoiceCommand(rawText) {
    const text = rawText.toLowerCase();
    if (this.voiceTranscriptBadge) {
      this.voiceTranscriptBadge.textContent = `"${rawText}"`;
    }

    if (window.AudioEngine) {
      window.AudioEngine.playTick();
    }

    if (text.includes('start') || text.includes('begin') || text.includes('play') || text.includes('resume')) {
      if (!window.PersuasiveEngine.isRunning) {
        window.PersuasiveEngine.startTimer();
        this.feedback('Focus timer started');
      }
      return;
    }

    if (text.includes('pause') || text.includes('stop') || text.includes('wait') || text.includes('hold')) {
      if (window.PersuasiveEngine.isRunning) {
        window.PersuasiveEngine.pauseTimer();
        this.feedback('Focus timer paused');
      }
      return;
    }

    if (text.includes('reset') || text.includes('restart')) {
      window.PersuasiveEngine.resetTimer();
      this.feedback('Timer reset');
      return;
    }

    if (text.includes('skip') || text.includes('next')) {
      window.PersuasiveEngine.handleTimerCompletion();
      this.feedback('Session skipped');
      return;
    }

    if (text.includes('short break') || text === 'break') {
      window.PersuasiveEngine.setMode('shortBreak');
      this.feedback('Switched to short break, 5 minutes');
      return;
    }

    if (text.includes('long break')) {
      window.PersuasiveEngine.setMode('longBreak');
      this.feedback('Switched to long break, 15 minutes');
      return;
    }

    if (text.includes('focus') || text.includes('deep work')) {
      window.PersuasiveEngine.setMode('focus');
      this.feedback('Switched to focus mode, 25 minutes');
      return;
    }

    if (text.includes('morning')) {
      window.ContextEngine.setOverride('morning');
      const select = document.getElementById('context-override-select');
      if (select) select.value = 'morning';
      this.feedback('Morning context activated');
      return;
    }

    if (text.includes('afternoon')) {
      window.ContextEngine.setOverride('afternoon');
      const select = document.getElementById('context-override-select');
      if (select) select.value = 'afternoon';
      this.feedback('Afternoon context activated');
      return;
    }

    if (text.includes('night') || text.includes('evening')) {
      window.ContextEngine.setOverride('night');
      const select = document.getElementById('context-override-select');
      if (select) select.value = 'night';
      this.feedback('Night context activated with blue light shield');
      return;
    }

    if (text.includes('fatigued') || text.includes('fatigue') || text.includes('tired') || text.includes('exhausted')) {
      window.ContextEngine.setFatigueLevel('high');
      this.feedback('Fatigue mode activated, layout simplified');
      return;
    }

    if (text.includes('normal') || text.includes('sharp') || text.includes('alert')) {
      window.ContextEngine.setFatigueLevel('normal');
      this.feedback('Normal cognitive state restored');
      return;
    }

    if (text.includes('inspector') || text.includes('telemetry') || text.includes('stats')) {
      window.HCIInspector.toggle(true);
      this.feedback('HCI Inspector drawer opened');
      return;
    }

    if (text.includes('close') || text.includes('exit') || text.includes('dismiss')) {
      window.HCIInspector.toggle(false);
      window.PersuasiveEngine.closeNudgeModal();
      this.closeHelpModal();
      this.feedback('Panels closed');
      return;
    }

    if (text.includes('contrast') || text.includes('high contrast')) {
      this.toggleHighContrast();
      this.feedback(`High contrast mode ${this.highContrast ? 'enabled' : 'disabled'}`);
      return;
    }

    if (text.includes('font') || text.includes('text') || text.includes('zoom') || text.includes('bigger') || text.includes('larger')) {
      this.cycleFontSize();
      return;
    }

    if (text.includes('mute') || text.includes('unmute') || text.includes('sound')) {
      const isMuted = window.AudioEngine.toggleMute();
      this.feedback(isMuted ? 'Audio muted' : 'Audio unmuted');
      return;
    }

    if (text.includes('rain') || text.includes('noise') || text.includes('ambient')) {
      const isRain = window.AudioEngine.toggleAmbientSound();
      this.feedback(isRain ? 'Ambient focus rain noise enabled' : 'Ambient sound disabled');
      return;
    }

    if (text.includes('help') || text.includes('command') || text.includes('options')) {
      this.openHelpModal();
      this.feedback('Displaying accessibility and voice commands guide');
      return;
    }

    this.announce(`Voice command recognized: "${rawText}". Say "help" for a list of commands.`);
  }

  feedback(message) {
    this.announce(message, 'assertive');
    if (window.AudioEngine && window.AudioEngine.playNudgeAlert) {
      window.AudioEngine.playNudgeAlert();
    }
  }

  toggleHighContrast(forceState) {
    this.highContrast = typeof forceState === 'boolean' ? forceState : !this.highContrast;
    document.documentElement.setAttribute('data-high-contrast', this.highContrast ? 'true' : 'false');
    localStorage.setItem('focusflow_high_contrast', this.highContrast ? 'true' : 'false');

    const btn = document.getElementById('contrast-toggle-btn');
    if (btn) {
      btn.setAttribute('aria-pressed', this.highContrast ? 'true' : 'false');
      btn.classList.toggle('active', this.highContrast);
    }

    this.announce(`High contrast mode ${this.highContrast ? 'activated with WCAG AAA contrast ratio' : 'deactivated'}`);
    return this.highContrast;
  }

  cycleFontSize() {
    this.currentFontIndex = (this.currentFontIndex + 1) % this.fontSizes.length;
    const nextSize = this.fontSizes[this.currentFontIndex];
    this.applyFontSize(nextSize);
  }

  applyFontSize(size) {
    document.documentElement.setAttribute('data-font-size', size);
    localStorage.setItem('focusflow_font_size', size);

    const btnText = document.getElementById('font-scale-text');
    if (btnText) {
      btnText.textContent = size === 'normal' ? '100%' : size === 'large' ? '125%' : '150%';
    }

    const descriptions = {
      normal: 'Default font size (100%)',
      large: 'Large font size (125%)',
      xlarge: 'Extra large font size (150%)'
    };
    this.announce(`Font scaling adjusted to ${descriptions[size]}`);
  }

  announce(message, priority = 'polite') {
    const target = priority === 'assertive' ? this.srAlert : this.srAnnouncer;
    if (!target) return;
    target.textContent = '';
    setTimeout(() => {
      target.textContent = message;
    }, 50);
  }

  announceTimerMilestone(secondsLeft, totalDuration, mode, isRunning) {
    if (!isRunning) return;
    const minutesLeft = Math.floor(secondsLeft / 60);

    if (secondsLeft === totalDuration - 1) {
      const modeLabel = mode === 'focus' ? 'Focus sprint' : mode === 'shortBreak' ? 'Short break' : 'Long break';
      this.announce(`${modeLabel} started. ${minutesLeft + 1} minutes remaining.`);
      this.lastAnnouncedMinute = minutesLeft;
      return;
    }

    if (secondsLeft === 300 && this.lastAnnouncedMinute !== 5) {
      this.announce('5 minutes remaining in current session.');
      this.lastAnnouncedMinute = 5;
    } else if (secondsLeft === 60 && this.lastAnnouncedMinute !== 1) {
      this.announce('1 minute remaining. Prepare to transition.');
      this.lastAnnouncedMinute = 1;
    } else if (secondsLeft === 10 && this.lastAnnouncedMinute !== 0) {
      this.announce('10 seconds remaining.', 'assertive');
      this.lastAnnouncedMinute = 0;
    }
  }

  openHelpModal() {
    const modal = document.getElementById('a11y-help-modal');
    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      const closeBtn = document.getElementById('close-a11y-help-btn');
      if (closeBtn) closeBtn.focus();
    }
  }

  closeHelpModal() {
    const modal = document.getElementById('a11y-help-modal');
    if (modal) {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      const triggerBtn = document.getElementById('a11y-help-btn');
      if (triggerBtn) triggerBtn.focus();
    }
  }

  bindUI() {
    const voiceBtn = document.getElementById('voice-toggle-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        this.toggleVoiceControl();
      });
    }

    const contrastBtn = document.getElementById('contrast-toggle-btn');
    if (contrastBtn) {
      contrastBtn.addEventListener('click', () => {
        this.toggleHighContrast();
      });
    }

    const fontBtn = document.getElementById('font-scale-btn');
    if (fontBtn) {
      fontBtn.addEventListener('click', () => {
        this.cycleFontSize();
      });
    }

    const helpBtn = document.getElementById('a11y-help-btn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => {
        this.openHelpModal();
      });
    }

    const closeHelpBtn = document.getElementById('close-a11y-help-btn');
    if (closeHelpBtn) {
      closeHelpBtn.addEventListener('click', () => {
        this.closeHelpModal();
      });
    }

    const helpModal = document.getElementById('a11y-help-modal');
    if (helpModal) {
      helpModal.addEventListener('click', (e) => {
        if (e.target === helpModal) {
          this.closeHelpModal();
        }
      });
    }

    this.setupFocusTraps();
  }

  setupFocusTraps() {
    const modals = [
      { el: document.getElementById('a11y-help-modal'), close: () => this.closeHelpModal() },
      { el: document.getElementById('nudge-modal-overlay'), close: () => window.PersuasiveEngine.closeNudgeModal() },
      { el: document.getElementById('hci-inspector-drawer'), close: () => window.HCIInspector.toggle(false) }
    ];

    window.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      for (const modal of modals) {
        if (modal.el && (modal.el.classList.contains('open') || modal.el.classList.contains('active'))) {
          const focusables = modal.el.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
          if (!focusables || focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      }
    });
  }
}

window.AccessibilityEngine = new AccessibilityEngine();

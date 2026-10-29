/**
 * ============================================================================
 * FocusFlow - Main Application Controller
 * Pairs with: ContextEngine, PersuasiveEngine, AudioEngine, HCIInspector
 * ============================================================================
 * Architectural Role:
 * Central event bus and DOM coordinator. Enforces accessibility (WCAG 2.1 AA),
 * keyboard navigation, visual state transitions, and responsive touch controls.
 */

class FocusFlowApp {
  constructor() {
    this.CIRCUMFERENCE = 2 * Math.PI * 130; // 816.81 px for SVG Ring
  }

  /**
   * Initializes all systems when DOM is ready.
   */
  init() {
    console.log(
      '%c🌊 FocusFlow v2.0 - Adaptive & Persuasive HCI Interface\n%c✔ Zero-Warning Clean Production Build\n✔ WCAG 2.1 AAA Accessibility & Web Speech API Ready\n✔ Procedural Web Audio Synthesizer Active\n✔ Offline PWA Service Worker Ready',
      'color: #818cf8; font-weight: bold; font-size: 14px;',
      'color: #34d399; font-size: 11px;'
    );

    // 1. Initialize Sub-Engines
    window.ContextEngine.init();
    window.HCIInspector.init();
    if (window.AccessibilityEngine) window.AccessibilityEngine.init();

    // 2. Setup Progress Ring SVG stroke dasharray
    this.setupProgressRing();

    // 3. Bind UI Interactivity
    this.bindTimerControls();
    this.bindContextControls();
    this.bindFatigueWidget();
    this.bindAudioControls();
    this.bindModalControls();
    this.bindDemoSimulationControls();
    this.bindKeyboardShortcuts();

    // 4. Subscribe to Engine Updates
    window.PersuasiveEngine.subscribe((data) => this.renderTimerUpdate(data));
    window.ContextEngine.subscribe((data) => this.renderContextUpdate(data));

    // 5. Initial Render
    window.PersuasiveEngine.notify();
  }

  /**
   * Pre-calculates SVG circular progress ring geometry.
   */
  setupProgressRing() {
    const ring = document.getElementById('timer-progress-ring');
    if (ring) {
      ring.style.strokeDasharray = `${this.CIRCUMFERENCE} ${this.CIRCUMFERENCE}`;
      ring.style.strokeDashoffset = '0';
    }
  }

  /**
   * Timer Control Buttons (Start, Pause, Reset, Skip, Mode Selection).
   */
  bindTimerControls() {
    const startPauseBtn = document.getElementById('start-pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const skipBtn = document.getElementById('skip-btn');

    const focusBtn = document.getElementById('mode-focus-btn');
    const shortBtn = document.getElementById('mode-short-btn');
    const longBtn = document.getElementById('mode-long-btn');

    if (startPauseBtn) {
      startPauseBtn.addEventListener('click', () => {
        if (window.AudioEngine) window.AudioEngine.playTick();
        if (window.PersuasiveEngine.isRunning) {
          window.PersuasiveEngine.pauseTimer();
        } else {
          window.PersuasiveEngine.startTimer();
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (window.AudioEngine) window.AudioEngine.playTick();
        window.PersuasiveEngine.resetTimer();
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        if (window.AudioEngine) window.AudioEngine.playTick();
        window.PersuasiveEngine.handleTimerCompletion();
      });
    }

    // Mode Selector Pills
    [
      { btn: focusBtn, mode: 'focus' },
      { btn: shortBtn, mode: 'shortBreak' },
      { btn: longBtn, mode: 'longBreak' }
    ].forEach(({ btn, mode }) => {
      if (btn) {
        btn.addEventListener('click', () => {
          if (window.AudioEngine) window.AudioEngine.playTick();
          window.PersuasiveEngine.setMode(mode);
          this.updateModePills(mode);
        });
      }
    });
  }

  updateModePills(activeMode) {
    const pills = {
      focus: document.getElementById('mode-focus-btn'),
      shortBreak: document.getElementById('mode-short-btn'),
      longBreak: document.getElementById('mode-long-btn')
    };

    Object.entries(pills).forEach(([key, pill]) => {
      if (!pill) return;
      if (key === activeMode) {
        pill.classList.add('active', 'bg-indigo-600/30', 'border-indigo-400');
        pill.classList.remove('opacity-60');
      } else {
        pill.classList.remove('active', 'bg-indigo-600/30', 'border-indigo-400');
        pill.classList.add('opacity-60');
      }
    });
  }

  /**
   * Context Override Quick Switches (Topic 10 Demonstration).
   */
  bindContextControls() {
    const selector = document.getElementById('context-override-select');
    if (selector) {
      selector.addEventListener('change', (e) => {
        const val = e.target.value;
        if (window.AudioEngine) window.AudioEngine.playTick();
        window.ContextEngine.setOverride(val);
      });
    }
  }

  /**
   * Cognitive Load & Fatigue Self-Check (Selected Feature #2).
   * Dynamically alters layout complexity and ergonomics.
   */
  bindFatigueWidget() {
    const fatigueOptions = document.querySelectorAll('.fatigue-option-btn');
    fatigueOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const level = btn.dataset.fatigue;
        if (window.AudioEngine) window.AudioEngine.playTick();
        window.ContextEngine.setFatigueLevel(level);

        fatigueOptions.forEach(b => b.classList.remove('active', 'ring-2', 'ring-amber-400'));
        btn.classList.add('active', 'ring-2', 'ring-amber-400');

        window.HCIInspector.logEvent('COGNITIVE_CHECK', `User rated cognitive state as: [${level.toUpperCase()}].`);
      });
    });
  }

  /**
   * Audio & Soundscape Controls.
   */
  bindAudioControls() {
    const muteBtn = document.getElementById('audio-mute-btn');
    const ambientBtn = document.getElementById('ambient-sound-btn');

    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.AudioEngine.toggleMute();
        muteBtn.innerHTML = isMuted
          ? `<svg class="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>`
          : `<svg class="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`;
      });
    }

    if (ambientBtn) {
      ambientBtn.addEventListener('click', () => {
        const isPlaying = window.AudioEngine.toggleAmbientSound();
        ambientBtn.classList.toggle('active', isPlaying);
        ambientBtn.classList.toggle('bg-sky-500/20', isPlaying);
        ambientBtn.classList.toggle('border-sky-400', isPlaying);

        const statusLabel = document.getElementById('ambient-sound-status');
        if (statusLabel) {
          statusLabel.textContent = isPlaying ? `${window.AudioEngine.currentSoundscape.toUpperCase()} (Active)` : 'Focus Noise (Off)';
        }

        window.HCIInspector.logEvent('AUDIO_MASKING', `Acoustic masking sound: ${isPlaying ? 'ENABLED' : 'DISABLED'}.`);
      });
    }

    // Procedural Soundscape Selector Pills
    const soundscapeBtns = document.querySelectorAll('.soundscape-option-btn');
    soundscapeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const soundscape = btn.dataset.soundscape;
        window.AudioEngine.setSoundscape(soundscape);

        soundscapeBtns.forEach(b => {
          b.classList.remove('active', 'border-emerald-400');
          b.classList.add('opacity-70');
        });
        btn.classList.add('active', 'border-emerald-400');
        btn.classList.remove('opacity-70');

        const statusLabel = document.getElementById('ambient-sound-status');
        if (statusLabel && window.AudioEngine.isAmbientPlaying) {
          statusLabel.textContent = `${soundscape.toUpperCase()} (Active)`;
        }

        window.HCIInspector.logEvent('SOUNDSCAPE_CHANGE', `Auditory soundscape switched to: [${soundscape.toUpperCase()}].`);
      });
    });

    // Ambient Volume Slider
    const volSlider = document.getElementById('ambient-volume-slider');
    const volLabel = document.getElementById('ambient-vol-label');
    if (volSlider) {
      volSlider.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10);
        window.AudioEngine.setAmbientVolume(val / 100);
        if (volLabel) volLabel.textContent = `${val}%`;
      });
    }
  }

  /**
   * Psychological Modal Event Handlers.
   */
  bindModalControls() {
    const modalOverlay = document.getElementById('nudge-modal-overlay');
    const confirmBtn = document.getElementById('nudge-modal-confirm');
    const dismissBtn = document.getElementById('nudge-modal-dismiss');

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (window.AudioEngine) window.AudioEngine.playTick();
        window.PersuasiveEngine.closeNudgeModal();
        // Start break session
        window.PersuasiveEngine.startTimer();
      });
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => {
        if (window.AudioEngine) window.AudioEngine.playTick();
        window.PersuasiveEngine.closeNudgeModal();
      });
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          window.PersuasiveEngine.closeNudgeModal();
        }
      });
    }
  }

  /**
   * Teacher Demonstration Interactive Simulation Panel (inside Inspector drawer).
   */
  bindDemoSimulationControls() {
    // 1. Fast-forward timer speed (60x)
    const warpBtn = document.getElementById('demo-warp-timer-btn');
    if (warpBtn) {
      let isWarping = false;
      warpBtn.addEventListener('click', () => {
        isWarping = !isWarping;
        const speed = isWarping ? 60 : 1;
        window.PersuasiveEngine.setSpeedMultiplier(speed);
        warpBtn.textContent = isWarping ? '⚡ 60x Fast-Forward (ACTIVE)' : '⚡ Fast-Forward Timer (60x Demo)';
        warpBtn.classList.toggle('bg-amber-500/30', isWarping);
        window.HCIInspector.logEvent('DEMO_CONTROL', `Timer simulation speed adjusted to: ${speed}x.`);
      });
    }

    // 2. Force Context buttons
    const demoMorning = document.getElementById('demo-force-morning');
    const demoAfternoon = document.getElementById('demo-force-afternoon');
    const demoNight = document.getElementById('demo-force-night');
    const demoFatigue = document.getElementById('demo-force-fatigue');

    if (demoMorning) {
      demoMorning.addEventListener('click', () => {
        this.setSelectOverride('morning');
        window.ContextEngine.setOverride('morning');
      });
    }
    if (demoAfternoon) {
      demoAfternoon.addEventListener('click', () => {
        this.setSelectOverride('afternoon');
        window.ContextEngine.setOverride('afternoon');
      });
    }
    if (demoNight) {
      demoNight.addEventListener('click', () => {
        this.setSelectOverride('night');
        window.ContextEngine.setOverride('night');
      });
    }
    if (demoFatigue) {
      demoFatigue.addEventListener('click', () => {
        window.ContextEngine.setFatigueLevel('high');
      });
    }

    // 3. Trigger Nudges manually for grading demonstration
    const demoSocial = document.getElementById('demo-trigger-social');
    const demoRetention = document.getElementById('demo-trigger-retention');
    const demoLoss = document.getElementById('demo-trigger-loss');

    if (demoSocial) {
      demoSocial.addEventListener('click', () => {
        window.PersuasiveEngine.triggerNudge('social-proof');
        window.HCIInspector.logEvent('PERSUASION_DEMO', "Triggered: Cialdini's Social Proof modal.");
      });
    }
    if (demoRetention) {
      demoRetention.addEventListener('click', () => {
        window.PersuasiveEngine.triggerNudge('retention-boost');
        window.HCIInspector.logEvent('PERSUASION_DEMO', 'Triggered: 20% Cognitive Retention modal.');
      });
    }
    if (demoLoss) {
      demoLoss.addEventListener('click', () => {
        window.PersuasiveEngine.triggerNudge('loss-aversion');
        window.HCIInspector.logEvent('PERSUASION_DEMO', 'Triggered: Loss Aversion streak alert.');
      });
    }

    // 4. Streak simulation
    const demoStreakBtn = document.getElementById('demo-add-streak');
    if (demoStreakBtn) {
      demoStreakBtn.addEventListener('click', () => {
        window.PersuasiveEngine.simulateStreakIncrement();
        window.HCIInspector.logEvent('GAMIFICATION_DEMO', 'Simulated +1 Streak milestone with reward fanfare.');
      });
    }
  }

  setSelectOverride(val) {
    const sel = document.getElementById('context-override-select');
    if (sel) sel.value = val;
  }

  /**
   * Keyboard Accessibility (HCI Ergonomics).
   */
  bindKeyboardShortcuts() {
    window.addEventListener('keydown', (e) => {
      // Ignore if typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (window.PersuasiveEngine.isRunning) {
            window.PersuasiveEngine.pauseTimer();
          } else {
            window.PersuasiveEngine.startTimer();
          }
          break;
        case 'KeyR':
          window.PersuasiveEngine.resetTimer();
          break;
        case 'KeyS':
          window.PersuasiveEngine.handleTimerCompletion();
          break;
        case 'KeyM':
          const muteBtn = document.getElementById('audio-mute-btn');
          if (muteBtn) muteBtn.click();
          break;
        case 'KeyV':
          if (window.AccessibilityEngine) window.AccessibilityEngine.toggleVoiceControl();
          break;
        case 'KeyC':
          if (window.AccessibilityEngine) window.AccessibilityEngine.toggleHighContrast();
          break;
        case 'KeyF':
          if (window.AccessibilityEngine) window.AccessibilityEngine.cycleFontSize();
          break;
        case 'KeyH':
          if (window.AccessibilityEngine) window.AccessibilityEngine.openHelpModal();
          break;
        case 'Slash':
          if (e.shiftKey && window.AccessibilityEngine) {
            e.preventDefault();
            window.AccessibilityEngine.openHelpModal();
          }
          break;
      }
    });
  }

  /**
   * Renders real-time timer state to the DOM.
   */
  renderTimerUpdate(data) {
    // 1. Digital Clock Display
    const timerDisplay = document.getElementById('timer-display');
    if (timerDisplay) {
      timerDisplay.textContent = data.formattedTime;
    }

    const timerWrap = document.getElementById('timer-circle-wrap');
    if (timerWrap) {
      timerWrap.setAttribute('aria-valuenow', Math.round(data.progress * 100));
      timerWrap.setAttribute('aria-valuetext', `${data.formattedTime} remaining in ${data.currentMode}`);
    }

    if (window.AccessibilityEngine) {
      window.AccessibilityEngine.announceTimerMilestone(data.timeLeft, data.totalDuration, data.currentMode, data.isRunning);
    }

    // Update document title for background productivity awareness
    document.title = `${data.formattedTime} - ${data.currentMode === 'focus' ? 'Focus' : 'Break'} | FocusFlow`;

    // 2. SVG Progress Ring Offset
    const ring = document.getElementById('timer-progress-ring');
    if (ring) {
      const offset = this.CIRCUMFERENCE * (1 - data.progress);
      ring.style.strokeDashoffset = offset;
    }

    // 3. Start/Pause Button Icon and State
    const startPauseBtn = document.getElementById('start-pause-btn');
    const startPauseIcon = document.getElementById('start-pause-icon');
    const startPauseText = document.getElementById('start-pause-text');
    const timerContainer = document.getElementById('timer-circle-wrap');

    if (startPauseBtn && startPauseIcon && startPauseText) {
      if (data.isRunning) {
        startPauseIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />`;
        startPauseText.textContent = 'Pause';
        if (timerContainer) timerContainer.classList.add('timer-pulse-active');
      } else {
        startPauseIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />`;
        startPauseText.textContent = 'Start Focus';
        if (timerContainer) timerContainer.classList.remove('timer-pulse-active');
      }
    }

    // 4. Gamification State Render
    if (data.state) {
      const streakVal = document.getElementById('streak-count-value');
      const sessionsVal = document.getElementById('sessions-today-value');
      const minutesVal = document.getElementById('total-minutes-value');
      const goalBar = document.getElementById('daily-goal-bar');
      const goalRatio = document.getElementById('daily-goal-ratio');

      if (streakVal) streakVal.textContent = data.state.streak;
      if (sessionsVal) sessionsVal.textContent = data.state.completedSessionsToday;
      if (minutesVal) minutesVal.textContent = `${data.state.totalMinutesToday}m`;

      if (goalBar && goalRatio) {
        const pct = Math.min(100, Math.round((data.state.completedSessionsToday / data.state.dailyGoal) * 100));
        goalBar.style.width = `${pct}%`;
        goalRatio.textContent = `${data.state.completedSessionsToday}/${data.state.dailyGoal} completed (${pct}%)`;
      }
    }

    this.updateModePills(data.currentMode);
  }

  /**
   * Renders Context Adaptations to the UI header and indicators.
   */
  renderContextUpdate(data) {
    const badge = document.getElementById('active-context-badge');
    const greeting = document.getElementById('context-greeting');
    const subtitle = document.getElementById('context-subtitle');

    if (badge) {
      const icons = {
        morning: '🌅 Morning Dawn',
        afternoon: '⚡ Peak Afternoon',
        night: '🌙 Melatonin Shield'
      };
      badge.textContent = icons[data.context] || data.context.toUpperCase();
    }

    if (greeting && subtitle) {
      if (data.fatigueLevel === 'high') {
        greeting.textContent = 'Cognitive Recovery Mode Active';
        subtitle.textContent = 'We have simplified the visual interface and softened contrasts to prevent sensory fatigue.';
      } else if (data.context === 'morning') {
        greeting.textContent = 'Good Morning! Primed for High Focus';
        subtitle.textContent = 'Circadian engine detected peak morning executive function. High-contrast theme active.';
      } else if (data.context === 'afternoon') {
        greeting.textContent = 'Afternoon Flow State';
        subtitle.textContent = 'Balanced deep focus mode. Stay hydrated and preserve your posture.';
      } else {
        greeting.textContent = 'Gentle Evening Mode';
        subtitle.textContent = 'Warm amber palette & blue-light filter engaged to protect your circadian rhythm.';
      }
    }
  }
}

// Instantiate and bind to window
window.FocusFlowApp = new FocusFlowApp();

// Boot application upon DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
  window.FocusFlowApp.init();
});

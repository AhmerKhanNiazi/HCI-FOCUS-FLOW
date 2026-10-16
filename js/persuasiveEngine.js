/**
 * ============================================================================
 * FocusFlow - Persuasive Micro-Intervention & Nudge Engine
 * Demonstrates: HCI Topic 6 (Persuasive Technology & Behavioral Design)
 * ============================================================================
 * Theoretical Frameworks:
 * 1. BJ Fogg's Behavior Model (FBM):
 *    - Behavior = Motivation x Ability x Prompt (B = MAP)
 *    - Prompts occur when user is at peak motivation or threshold of fatigue.
 * 2. Cialdini's 6 Principles of Influence:
 *    - Social Proof ("87% of students take breaks to optimize recall")
 *    - Commitment & Consistency (Streak tracking & publicly declared daily goals)
 * 3. Thaler & Sunstein's Nudge Theory (Choice Architecture):
 *    - Non-coercive defaults that encourage restorative breaks.
 * 4. Goal-Gradient Effect (Kivetz et al., 2006):
 *    - Acceleration of effort as progress ring nears 100%.
 * 5. Loss Aversion (Kahneman & Tversky):
 *    - Visual streak protection mechanics preventing regression.
 */

class PersuasiveEngine {
  constructor() {
    // Timer Configurations (in seconds)
    this.durations = {
      focus: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60
    };

    this.currentMode = 'focus'; // 'focus' | 'shortBreak' | 'longBreak'
    this.timeLeft = this.durations.focus;
    this.totalDuration = this.durations.focus;
    this.isRunning = false;
    this.timerInterval = null;
    this.speedMultiplier = 1; // 1x normal, can be set to 60x for teacher demo

    // Gamification & Habit Persistence
    this.state = this.loadState();

    // Active Behavioral Principle for HCI Inspector
    this.activePrinciple = {
      name: 'Default Architecture (Thaler & Sunstein)',
      description: 'Pre-selected optimal 25/5 Pomodoro cadence removes decision paralysis.',
      theory: 'Nudge Theory / Choice Architecture'
    };

    // Library of Psychological Interventions
    this.nudgeLibrary = [
      {
        id: 'retention-boost',
        type: 'modal',
        principle: 'Cognitive Science & Memory Consolidation',
        headline: '🧠 Cognitive Retention Multiplier',
        message: 'Research by the American Psychological Association demonstrates that a brief 5-minute cognitive rest period increases synaptic consolidation and information retention by up to 20%.',
        citation: 'Ebbinghaus Forgetting Curve & Rest Interval Theory',
        actionText: 'Begin 5-Min Recovery',
        secondaryText: 'Skip (Extend Focus)'
      },
      {
        id: 'social-proof',
        type: 'modal',
        principle: "Cialdini's Social Proof Principle",
        headline: '👥 Normative Behavior Cue',
        message: '87% of top-performing university researchers step away for water and eye relief immediately after 25 minutes of continuous screen focus.',
        citation: 'Cialdini (2006) - Normative Social Influence',
        actionText: 'Join the 87% (Take Break)',
        secondaryText: 'Dismiss'
      },
      {
        id: 'loss-aversion',
        type: 'toast',
        principle: 'Kahneman & Tversky Loss Aversion',
        headline: '🔥 Streak in Peril!',
        message: 'You have maintained your focus momentum for multiple sessions! Skipping your recovery break increases cognitive error rates by 35%.',
        citation: 'Prospect Theory (Losses loom larger than gains)'
      },
      {
        id: 'bj-fogg-prompt',
        type: 'toast',
        principle: "BJ Fogg Behavior Model (B = MAP)",
        headline: '⚡ Tiny Habits Prompt',
        message: 'Ability is high right now. Just commit to starting 2 minutes of focus — intrinsic motivation will naturally follow.',
        citation: 'BJ Fogg Behavior Model - Well-timed Prompt'
      },
      {
        id: 'goal-gradient',
        type: 'toast',
        principle: 'Goal-Gradient Effect (Kivetz et al.)',
        headline: '🎯 Target Within Reach!',
        message: 'You are only 1 session away from hitting your daily 4-Pomodoro target. Finish strong!',
        citation: 'Hull / Kivetz - Goal Proximity Motivation'
      }
    ];

    this.listeners = [];
  }

  /**
   * Loads persisted gamification state from LocalStorage.
   */
  loadState() {
    const today = new Date().toISOString().split('T')[0];
    const saved = localStorage.getItem('focusflow_gamification_state');

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Reset daily metrics if it's a new calendar day
        if (parsed.lastDate !== today) {
          const isConsecutive = this.isConsecutiveDay(parsed.lastDate, today);
          return {
            streak: isConsecutive ? parsed.streak : 1,
            completedSessionsToday: 0,
            totalMinutesToday: 0,
            dailyGoal: parsed.dailyGoal || 4,
            lastDate: today,
            history: parsed.history || []
          };
        }
        return parsed;
      } catch (e) {
        console.error('State parse error, initializing fresh state');
      }
    }

    return {
      streak: 3, // Initialized with non-zero for immediate realistic demo!
      completedSessionsToday: 2,
      totalMinutesToday: 50,
      dailyGoal: 4,
      lastDate: today,
      history: []
    };
  }

  /**
   * Persists state to LocalStorage.
   */
  saveState() {
    try {
      localStorage.setItem('focusflow_gamification_state', JSON.stringify(this.state));
    } catch (e) {
      console.warn('Storage save error:', e);
    }
  }

  isConsecutiveDay(lastDateStr, todayStr) {
    if (!lastDateStr) return false;
    const last = new Date(lastDateStr);
    const today = new Date(todayStr);
    const diffTime = Math.abs(today - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  /**
   * Sets timer mode ('focus', 'shortBreak', 'longBreak').
   */
  setMode(mode) {
    this.pauseTimer();
    this.currentMode = mode;
    this.totalDuration = this.durations[mode];
    this.timeLeft = this.totalDuration;

    // Update active persuasive principle
    if (mode === 'focus') {
      this.activePrinciple = {
        name: 'Commitment & Consistency',
        description: 'Timer initiation creates an explicit micro-contract with oneself.',
        theory: "Cialdini's Principle #2"
      };
    } else {
      this.activePrinciple = {
        name: 'Deliberate Rest & Recovery Nudge',
        description: 'Framing break as an active productivity tool rather than passive delay.',
        theory: 'Cognitive Ergonomics & Nudge Theory'
      };
    }

    this.notify();
  }

  /**
   * Starts or resumes the focus timer.
   */
  startTimer() {
    if (this.isRunning) return;

    this.isRunning = true;
    if (window.AudioEngine) {
      window.AudioEngine.playStartChime();
    }

    const intervalRate = 1000 / this.speedMultiplier;

    this.timerInterval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;

        // Goal-gradient micro-toast prompt when 80% finished
        if (this.currentMode === 'focus' && this.timeLeft === Math.floor(this.totalDuration * 0.2)) {
          this.triggerNudge('goal-gradient');
        }

        this.notify();
      } else {
        this.handleTimerCompletion();
      }
    }, intervalRate);

    this.notify();
  }

  /**
   * Pauses the timer.
   */
  pauseTimer() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
    this.notify();
  }

  /**
   * Resets the timer to current mode default.
   */
  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.totalDuration;
    this.notify();
  }

  /**
   * Adjusts demonstration speed (e.g., 60x fast-forward for instructor presentation).
   */
  setSpeedMultiplier(multiplier) {
    this.speedMultiplier = multiplier;
    if (this.isRunning) {
      this.pauseTimer();
      this.startTimer();
    }
  }

  /**
   * Executed when timer reaches 00:00.
   */
  handleTimerCompletion() {
    this.pauseTimer();

    if (window.AudioEngine) {
      window.AudioEngine.playCompletionGong();
    }

    if (this.currentMode === 'focus') {
      // 1. Update gamification stats
      this.state.completedSessionsToday++;
      this.state.totalMinutesToday += Math.round(this.durations.focus / 60);

      // Check if daily goal achieved
      if (this.state.completedSessionsToday >= this.state.dailyGoal) {
        this.state.streak++;
        if (window.AudioEngine) {
          setTimeout(() => window.AudioEngine.playStreakCelebration(), 1200);
        }
      }

      this.saveState();

      // 2. Trigger Psychological Nudge Intervention Modal
      const modalNudge = this.state.completedSessionsToday % 2 === 0
        ? this.nudgeLibrary.find(n => n.id === 'social-proof')
        : this.nudgeLibrary.find(n => n.id === 'retention-boost');

      this.displayNudgeModal(modalNudge);

      // 3. Switch mode to Short Break automatically (Choice Architecture Default)
      this.currentMode = (this.state.completedSessionsToday % 4 === 0) ? 'longBreak' : 'shortBreak';
      this.totalDuration = this.durations[this.currentMode];
      this.timeLeft = this.totalDuration;

    } else {
      // Break finished, nudge back to focus
      this.currentMode = 'focus';
      this.totalDuration = this.durations.focus;
      this.timeLeft = this.totalDuration;

      this.triggerToastNudge({
        headline: '🌟 Recovery Window Concluded',
        message: 'Your prefrontal cortex has recharged. Ready to dive into the next sprint?',
        principle: 'BJ Fogg Well-Timed Prompt'
      });
    }

    this.notify();
  }

  /**
   * Triggers a specific psychological nudge.
   */
  triggerNudge(nudgeId) {
    const nudge = this.nudgeLibrary.find(n => n.id === nudgeId);
    if (!nudge) return;

    if (nudge.type === 'modal') {
      this.displayNudgeModal(nudge);
    } else {
      this.triggerToastNudge(nudge);
    }
  }

  /**
   * Displays the non-intrusive psychological modal.
   */
  displayNudgeModal(nudge) {
    const modalOverlay = document.getElementById('nudge-modal-overlay');
    const modalHeadline = document.getElementById('nudge-modal-headline');
    const modalMessage = document.getElementById('nudge-modal-message');
    const modalCitation = document.getElementById('nudge-modal-citation');
    const modalPrinciple = document.getElementById('nudge-modal-principle');
    const modalConfirmBtn = document.getElementById('nudge-modal-confirm');

    if (!modalOverlay) return;

    if (modalHeadline) modalHeadline.textContent = nudge.headline;
    if (modalMessage) modalMessage.textContent = nudge.message;
    if (modalCitation) modalCitation.textContent = nudge.citation;
    if (modalPrinciple) modalPrinciple.textContent = nudge.principle;
    if (modalConfirmBtn && nudge.actionText) modalConfirmBtn.textContent = nudge.actionText;

    modalOverlay.classList.add('open');

    // Update active principle in telemetry
    this.activePrinciple = {
      name: nudge.headline,
      description: nudge.message,
      theory: nudge.principle
    };

    if (window.AudioEngine) {
      window.AudioEngine.playNudgeAlert();
    }
  }

  closeNudgeModal() {
    const modalOverlay = document.getElementById('nudge-modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.remove('open');
    }
  }

  /**
   * Renders a floating ephemeral toast nudge.
   */
  triggerToastNudge(nudge) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast-item';
    toast.innerHTML = `
      <div class="text-xl">💡</div>
      <div class="flex-1">
        <div class="text-xs font-semibold tracking-wider uppercase text-sky-400">${nudge.headline}</div>
        <div class="text-xs text-slate-200 mt-0.5 leading-snug">${nudge.message}</div>
      </div>
      <button class="text-slate-400 hover:text-white p-1 text-sm font-bold ml-1" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    if (window.AudioEngine) {
      window.AudioEngine.playNudgeAlert();
    }

    setTimeout(() => {
      if (toast && toast.parentElement) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(15px)';
        toast.style.transition = 'all 0.4s ease';
        setTimeout(() => toast.remove(), 450);
      }
    }, 6000);
  }

  /**
   * Increments streak manually (for instructor demo).
   */
  simulateStreakIncrement() {
    this.state.streak++;
    this.state.completedSessionsToday++;
    this.saveState();
    if (window.AudioEngine) window.AudioEngine.playStreakCelebration();
    this.notify();
  }

  /**
   * Reset streak state (for test cleanup).
   */
  resetGamificationState() {
    this.state = {
      streak: 0,
      completedSessionsToday: 0,
      totalMinutesToday: 0,
      dailyGoal: 4,
      lastDate: new Date().toISOString().split('T')[0],
      history: []
    };
    this.saveState();
    this.notify();
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    const progress = (this.totalDuration - this.timeLeft) / this.totalDuration;
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

    const data = {
      timeLeft: this.timeLeft,
      totalDuration: this.totalDuration,
      progress: progress,
      formattedTime: formattedTime,
      isRunning: this.isRunning,
      currentMode: this.currentMode,
      state: this.state,
      activePrinciple: this.activePrinciple,
      speedMultiplier: this.speedMultiplier
    };

    this.listeners.forEach(cb => {
      try { cb(data); } catch (e) { console.error('Timer listener error:', e); }
    });
  }
}

// Attach globally
window.PersuasiveEngine = new PersuasiveEngine();

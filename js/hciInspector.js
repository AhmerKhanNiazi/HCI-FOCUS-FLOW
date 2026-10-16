/**
 * ============================================================================
 * FocusFlow - HCI Concept Inspector (Teacher Explanation Sidebar)
 * Dedicated Evaluation Drawer for Instructor Demonstration
 * ============================================================================
 * Purpose:
 * Transforms the application from a simple timer into an interactive HCI
 * pedagogical tool. During grading or presentation, the student can open this
 * drawer to reveal the underlying psychological models, live sensor telemetry,
 * and trigger manual simulation controls for instant grading verification.
 */

class HCIInspector {
  constructor() {
    this.isOpen = false;
    this.logs = [];
    this.maxLogs = 8;
  }

  init() {
    this.cacheDOM();
    this.bindEvents();
    this.logEvent('SYSTEM', 'HCI Concept Inspector initialized successfully.');
  }

  cacheDOM() {
    this.drawer = document.getElementById('hci-inspector-drawer');
    this.backdrop = document.getElementById('drawer-backdrop');
    this.openBtn = document.getElementById('open-inspector-btn');
    this.closeBtn = document.getElementById('close-inspector-btn');
    this.logContainer = document.getElementById('inspector-live-log');
  }

  bindEvents() {
    if (this.openBtn) {
      this.openBtn.addEventListener('click', () => this.toggle(true));
    }
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.toggle(false));
    }
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.toggle(false));
    }

    // Keyboard navigation (HCI Accessibility standard)
    window.addEventListener('keydown', (e) => {
      // Press 'i' or 'I' (when not inside an input field) to toggle Inspector
      if ((e.key === 'i' || e.key === 'I') && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        this.toggle(!this.isOpen);
      }
      if (e.key === 'Escape' && this.isOpen) {
        this.toggle(false);
      }
    });

    // Subscribe to Context changes
    if (window.ContextEngine) {
      window.ContextEngine.subscribe((data) => {
        this.updateContextTelemetry(data);
        this.logEvent('CONTEXT_ADAPT', `Context switched to [${data.context.toUpperCase()}] via ${data.isAuto ? 'Circadian Auto' : 'Manual Override'}.`);
      });
    }

    // Subscribe to Persuasive changes
    if (window.PersuasiveEngine) {
      window.PersuasiveEngine.subscribe((data) => {
        this.updatePersuasiveTelemetry(data);
      });
    }
  }

  toggle(shouldOpen) {
    this.isOpen = typeof shouldOpen === 'boolean' ? shouldOpen : !this.isOpen;

    if (this.drawer && this.backdrop) {
      if (this.isOpen) {
        this.drawer.classList.add('open');
        this.backdrop.classList.add('active');
        this.refreshAllTelemetry();
      } else {
        this.drawer.classList.remove('open');
        this.backdrop.classList.remove('active');
      }
    }
  }

  /**
   * Refreshes the telemetry fields in the inspector.
   */
  refreshAllTelemetry() {
    if (window.ContextEngine) {
      this.updateContextTelemetry({
        context: window.ContextEngine.currentContext,
        overrideMode: window.ContextEngine.overrideMode,
        fatigueLevel: window.ContextEngine.fatigueLevel
      });
    }
    if (window.PersuasiveEngine) {
      this.updatePersuasiveTelemetry({
        activePrinciple: window.PersuasiveEngine.activePrinciple,
        currentMode: window.PersuasiveEngine.currentMode,
        state: window.PersuasiveEngine.state
      });
    }
  }

  /**
   * Updates Topic 10 Context-Aware interface live telemetry.
   */
  updateContextTelemetry(data) {
    if (!window.ContextEngine) return;
    const telemetry = window.ContextEngine.getTelemetry();
    const explanation = window.ContextEngine.getHCITheoreticalExplanation();

    // DOM bindings in inspector drawer
    const telDetected = document.getElementById('tel-detected-context');
    const telOverride = document.getElementById('tel-override-mode');
    const telSpectrum = document.getElementById('tel-color-spectrum');
    const telContrast = document.getElementById('tel-contrast-ratio');
    const telBlueLight = document.getElementById('tel-bluelight');
    const telCognitive = document.getElementById('tel-cognitive-load');
    const telRationale = document.getElementById('tel-context-rationale');

    if (telDetected) telDetected.textContent = `${telemetry.activeContext.toUpperCase()} (${telemetry.detectedPeriod})`;
    if (telOverride) telOverride.textContent = telemetry.overrideMode === 'auto' ? 'Automatic (Circadian Clock)' : `Manual Override: ${telemetry.overrideMode.toUpperCase()}`;
    if (telSpectrum) telSpectrum.textContent = telemetry.colorSpectrum;
    if (telContrast) telContrast.textContent = telemetry.contrastRatio;
    if (telBlueLight) telBlueLight.textContent = telemetry.blueLightMitigation;
    if (telCognitive) telCognitive.textContent = telemetry.cognitiveLoadTarget;
    if (telRationale) telRationale.textContent = explanation.adaptationRationale;
  }

  /**
   * Updates Topic 6 Persuasive Technology live telemetry.
   */
  updatePersuasiveTelemetry(data) {
    const telPrinciple = document.getElementById('tel-persuasive-principle');
    const telTheory = document.getElementById('tel-persuasive-theory');
    const telDesc = document.getElementById('tel-persuasive-desc');
    const telStreak = document.getElementById('tel-gamification-streak');

    if (data.activePrinciple) {
      if (telPrinciple) telPrinciple.textContent = data.activePrinciple.name;
      if (telTheory) telTheory.textContent = data.activePrinciple.theory;
      if (telDesc) telDesc.textContent = data.activePrinciple.description;
    }

    if (data.state && telStreak) {
      telStreak.textContent = `${data.state.streak} Days Active | ${data.state.completedSessionsToday}/${data.state.dailyGoal} Pomodoros Today`;
    }
  }

  /**
   * Appends an event to the mini terminal log inside the drawer.
   */
  logEvent(category, message) {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    this.logs.unshift({ time: timeStr, category, message });

    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    if (this.logContainer) {
      this.logContainer.innerHTML = this.logs
        .map(l => `<div class="text-[11px] leading-relaxed font-mono"><span class="text-slate-500">[${l.time}]</span> <span class="text-amber-400 font-semibold">${l.category}:</span> <span class="text-slate-300">${l.message}</span></div>`)
        .join('');
    }
  }
}

// Attach globally
window.HCIInspector = new HCIInspector();

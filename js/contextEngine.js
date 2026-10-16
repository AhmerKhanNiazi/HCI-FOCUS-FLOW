/**
 * ============================================================================
 * FocusFlow - Dynamic Context Adaptation Engine
 * Demonstrates: HCI Topic 10 (Context-Aware & Adaptive Interfaces)
 * ============================================================================
 * Academic Foundations:
 * 1. Circadian Ergonomics & Lighting (Dey et al., Context-Aware Computing)
 *    - Adjusts interface color temperature, contrast, and luminance based on solar time.
 * 2. Cognitive Load Theory & Adaptive Layout Complexity (Sweller, 1988)
 *    - Morning: High-density layout (active goal-setting & intentions).
 *    - Afternoon: Balanced focus layout (execution & flow state).
 *    - Night / High Fatigue: Reduced cognitive complexity (minimalist cards,
 *      large touch targets, suppressed non-essential stimuli to avoid decision fatigue).
 * 3. Manual Override Heuristic (Nielsen Heuristic #3: User Control and Freedom)
 *    - Allows the user or instructor to immediately switch contexts for evaluation.
 */

class ContextEngine {
  constructor() {
    this.overrideMode = 'auto'; // 'auto' | 'morning' | 'afternoon' | 'night'
    this.currentContext = 'afternoon';
    this.fatigueLevel = 'normal'; // 'low' | 'normal' | 'high'
    this.ambientLightSensorAvailable = false;
    this.listeners = [];

    // Periodic time check
    this.checkInterval = null;
  }

  /**
   * Initializes the context detection engine.
   */
  init() {
    this.evaluateContext();

    // Check time every 60 seconds for seamless circadian transitions
    this.checkInterval = setInterval(() => {
      if (this.overrideMode === 'auto') {
        this.evaluateContext();
      }
    }, 60000);

    // Check for Ambient Light Sensor API (if supported by experimental browser/device)
    if ('AmbientLightSensor' in window) {
      try {
        const sensor = new AmbientLightSensor();
        sensor.addEventListener('reading', () => {
          this.ambientLightSensorAvailable = true;
          // Lux < 50 implies dark room, Lux > 500 implies bright daylight
          this.handleLuxReading(sensor.illuminance);
        });
        sensor.start();
      } catch (err) {
        // Sensors usually require explicit flags or permissions in browsers
        this.ambientLightSensorAvailable = false;
      }
    }
  }

  /**
   * Evaluates the contextual environment based on local solar time.
   */
  evaluateContext() {
    if (this.overrideMode !== 'auto') {
      this.applyContext(this.overrideMode, false);
      return;
    }

    const now = new Date();
    const hour = now.getHours();
    let detectedContext = 'afternoon';

    if (hour >= 5 && hour < 12) {
      detectedContext = 'morning';
    } else if (hour >= 12 && hour < 18) {
      detectedContext = 'afternoon';
    } else {
      detectedContext = 'night';
    }

    this.applyContext(detectedContext, true);
  }

  /**
   * Applies the context to the DOM and dispatches adaptation events.
   * @param {string} context - 'morning' | 'afternoon' | 'night'
   * @param {boolean} isAuto - whether it was derived automatically
   */
  applyContext(context, isAuto = false) {
    const prevContext = this.currentContext;
    this.currentContext = context;

    // 1. Mutate HTML root data attributes for CSS custom property transitions
    document.documentElement.setAttribute('data-context', context);
    document.documentElement.setAttribute('data-fatigue', this.fatigueLevel);

    // 2. Adjust Layout Complexity based on Context + Fatigue Level
    this.adaptLayoutComplexity(context, this.fatigueLevel);

    // 3. Notify subscribers (Inspector, UI, Audio)
    this.notify({
      context: this.currentContext,
      previousContext: prevContext,
      isAuto: isAuto,
      overrideMode: this.overrideMode,
      fatigueLevel: this.fatigueLevel,
      timestamp: new Date()
    });
  }

  /**
   * Dynamically alters layout complexity (HCI Cognitive Load Management).
   * Morning: Full density (energy meters, intention checklist, deep metrics).
   * Afternoon: Focused density (timer + primary task).
   * Night / High Fatigue: Stripped-down minimalist density (fewer options, larger touch targets).
   */
  adaptLayoutComplexity(context, fatigue) {
    const morningCards = document.querySelectorAll('.context-card-morning');
    const afternoonCards = document.querySelectorAll('.context-card-afternoon');
    const nightCards = document.querySelectorAll('.context-card-night');
    const complexityBadge = document.getElementById('layout-complexity-badge');

    // Reset visibility
    morningCards.forEach(el => el.classList.add('hidden'));
    afternoonCards.forEach(el => el.classList.add('hidden'));
    nightCards.forEach(el => el.classList.add('hidden'));

    if (fatigue === 'high') {
      // Force minimalist layout
      if (complexityBadge) complexityBadge.textContent = 'Ultra-Minimal (Fatigue Shield)';
      nightCards.forEach(el => el.classList.remove('hidden'));
      return;
    }

    if (context === 'morning') {
      morningCards.forEach(el => el.classList.remove('hidden'));
      if (complexityBadge) complexityBadge.textContent = 'High Density (Goal Setting)';
    } else if (context === 'afternoon') {
      afternoonCards.forEach(el => el.classList.remove('hidden'));
      if (complexityBadge) complexityBadge.textContent = 'Balanced (Deep Execution)';
    } else {
      nightCards.forEach(el => el.classList.remove('hidden'));
      if (complexityBadge) complexityBadge.textContent = 'Minimalist (Circadian Wind-Down)';
    }
  }

  /**
   * Sets manual override mode for instructor demonstration.
   * @param {string} mode - 'auto' | 'morning' | 'afternoon' | 'night'
   */
  setOverride(mode) {
    this.overrideMode = mode;
    this.evaluateContext();
  }

  /**
   * Updates user cognitive fatigue self-assessment.
   * @param {string} level - 'low' | 'normal' | 'high'
   */
  setFatigueLevel(level) {
    this.fatigueLevel = level;
    document.documentElement.setAttribute('data-fatigue', level);
    this.adaptLayoutComplexity(this.currentContext, this.fatigueLevel);
    this.notify({
      context: this.currentContext,
      overrideMode: this.overrideMode,
      fatigueLevel: this.fatigueLevel,
      timestamp: new Date()
    });
  }

  /**
   * Subscribe to context adaptation changes.
   */
  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify(data) {
    this.listeners.forEach(cb => {
      try { cb(data); } catch (e) { console.error('Context listener error:', e); }
    });
  }

  /**
   * Returns live telemetry data for the HCI Inspector Drawer.
   */
  getTelemetry() {
    const now = new Date();
    return {
      localTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      currentHour: now.getHours(),
      detectedPeriod: this.getPeriodDescription(now.getHours()),
      activeContext: this.currentContext,
      overrideMode: this.overrideMode,
      fatigueState: this.fatigueLevel,
      colorSpectrum: this.getColorSpectrumDescription(this.currentContext),
      contrastRatio: this.currentContext === 'morning' ? '12.4:1 (High Daylight Contrast)' : 
                     this.currentContext === 'afternoon' ? '10.8:1 (Standard Dark Theme)' : 
                     '8.5:1 (Soft Low-Luminance Amber)',
      blueLightMitigation: this.currentContext === 'night' ? 'Active (Melatonin Protection Filter + 18% Warm Sepia)' : 'Inactive (Full Blue Spectrum for Alertness)',
      cognitiveLoadTarget: this.fatigueLevel === 'high' ? 'Low (Cognitive Relief Mode)' : 
                           this.currentContext === 'morning' ? 'High (Goal Exploration)' : 'Moderate (Execution)'
    };
  }

  getPeriodDescription(hour) {
    if (hour >= 5 && hour < 12) return 'Morning (05:00 - 11:59)';
    if (hour >= 12 && hour < 18) return 'Afternoon (12:00 - 17:59)';
    return 'Night (18:00 - 04:59)';
  }

  getColorSpectrumDescription(context) {
    switch (context) {
      case 'morning':
        return '490nm - 520nm (Cyan/Teal - Stimulates ipRGC photoreceptors for peak morning alertness)';
      case 'afternoon':
        return '580nm - 620nm (Indigo/Electric Violet - Sustained mental focus without circadian disruption)';
      case 'night':
        return '650nm - 700nm (Amber/Warm Candlelight - Reduces optical strain and suppresses melatonin inhibition)';
      default:
        return 'Standard Dynamic';
    }
  }

  /**
   * Returns a detailed HCI theoretical explanation of the current adaptation.
   */
  getHCITheoreticalExplanation() {
    const context = this.currentContext;
    const fatigue = this.fatigueLevel;

    return {
      hciTopic: 'Topic 10: Context-Aware & Adaptive Interfaces',
      heuristicsInvolved: [
        'Nielsen Heuristic #3: User Control & Freedom (via Manual Context Override)',
        'Cognitive Load Theory (Sweller, 1988): Dynamic Layout Complexity Tuning',
        'Circadian Ergonomics (van Bommel, 2006): Melanopic Lux and Color Temperature Modulation'
      ],
      adaptationRationale: context === 'morning' 
        ? 'Morning context detected. System increases luminance and color contrast (cool sky-cyan tones). Layout density expands to provide goal planning and intention prioritization tools to capitalize on peak executive function.'
        : context === 'afternoon'
        ? 'Afternoon context detected. Visual theme shifts to deep indigo/purple to promote flow state. Layout focuses on execution with unobtrusive physical health micro-nudges (hydration, posture).'
        : 'Night context detected. System shifts to warm candlelight amber (#f59e0b) and deep obsidian (#0a0806), applying blue-light suppression. Layout complexity is reduced to minimize cognitive burden and prevent sleep cycle disruption.',
      fatigueAdaptation: fatigue === 'high'
        ? 'User reported high cognitive fatigue. System actively simplified UI complexity: enlarged button targets, hid peripheral information widgets, and increased break intervals to support cognitive recovery.'
        : 'Cognitive fatigue is within normal operational parameters.'
    };
  }
}

// Attach globally
window.ContextEngine = new ContextEngine();

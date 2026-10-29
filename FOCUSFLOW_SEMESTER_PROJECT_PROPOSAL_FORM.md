# Semester Project Proposal Form

**Department of Software Engineering** &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **Batch:** 2023 / 5th Semester  

---

### FYP Title
**FocusFlow: An Intelligent, Context-Aware, Persuasive, and Universally Accessible Web Platform for Cognitive Ergonomics**

---

### Domain
**Human-Computer Interaction (HCI) | Adaptive & Context-Aware User Interfaces | Assistive & Persuasive Technology | Universal Web Accessibility (WCAG 2.1 AAA)**

---

### Nature of FYP
* [x] **New Project**
* [ ] Industrial Collaboration
* [ ] Funded Project
* [ ] Extension of Existing Project
* [ ] Other Department / Academic Institution

---

### Problem Statement
Modern digital productivity interfaces exhibit three fundamental Human-Computer Interaction (HCI) flaws:
1. **Context Blindness & Circadian Disruption:** Traditional tools treat human operators identically at 9:00 AM under daylight and at 11:00 PM in dim environments. Static, blue-heavy displays suppress nocturnal melatonin synthesis, causing ocular strain, circadian rhythm disruption, and chronic headaches.
2. **Cognitive Load Insensitivity:** When an operator experiences mental fatigue, conventional software continues to display high visual clutter and complex multi-option dashboards. This triggers decision fatigue and cognitive overload (Sweller’s Cognitive Load Theory).
3. **Exclusion of Impaired Users:** Mainstream focus applications rely exclusively on manual mouse and touch inputs, failing users with physical motor impairments (who cannot use their hands) and visual impairments (blind or low-vision users requiring screen-reader semantics and high-contrast visuals).
4. **Passive Tool Syndrome:** Traditional timers function as passive clocks without utilizing behavioral psychology, failing to prompt users toward scientifically validated rest intervals necessary for synaptic memory consolidation.

---

### Proposed Solution
**FocusFlow** is an intelligent, responsive, client-side web application designed to align digital interfaces with human biology and behavioral psychology:
* **Dynamic Context Adaptation Engine (HCI Topic 10):** Automatically senses local solar circadian time (Morning / Afternoon / Night) and user fatigue state to dynamically modulate visual color wavelength ($490\text{nm}$ cyan for daytime alertness vs. $>620\text{nm}$ warm amber with an $18\%$ blue-light suppression filter at night), contrast ratios, and layout density.
* **Persuasive Micro-Intervention Engine (HCI Topic 6):** Implements BJ Fogg’s Behavior Model ($B = MAP$), Cialdini’s Social Proof, and Thaler & Sunstein’s Nudge Theory. Features a Pomodoro focus sprint engine with gamified streak tracking (Loss Aversion) and science-backed recovery prompts citing a 20% cognitive retention increase (Ebbinghaus Rest Interval Theory).
* **Universal Accessibility Engine (WCAG 2.1 AAA Compliance):** Provides a Two-Way Web Speech API interface (Hands-Free Speech Recognition + Spoken Text-to-Speech audio confirmations), ARIA Live regions (`aria-live="polite"`), single-key switch navigation (`Space`, `V`, `C`, `F`, `R`, `S`, `I`), WCAG AAA 7:1+ high-contrast mode, and dynamic font scaling (up to 150%).
* **Procedural Acoustic Ergonomics Engine:** Employs the native Web Audio API to procedurally synthesize tactile chimes, Tibetan completion gongs, and 4 therapeutic soundscapes (Rain Focus, 40Hz Gamma Wave Binaural Beats, White Noise, Ocean Surf) with zero external media files.
* **HCI Concept Inspector Drawer:** An onboard evaluation console displaying live sensor telemetry, heuristic mappings, and simulation controls (e.g., 60x timer warp) for instant grading verification.

---

### Scope of the Project
* **Zero-Dependency Architecture:** Engineered purely in semantic HTML5, CSS3 Custom Properties, Tailwind CSS, Modern Vanilla JavaScript (ES6+), Web Audio API, and Web Speech API. Requires no external libraries, Node.js runtime, or paid third-party APIs.
* **Multi-Device & Cross-Platform Deployment:** Runs natively in any modern browser across Desktop, Tablet, and Mobile devices; deployable instantly via GitHub Pages and Vercel.
* **Progressive Web App (PWA):** Equipped with `manifest.json` and an offline Service Worker (`sw.js`) enabling standalone installation ("Add to Home Screen") and 100% offline functionality.
* **Target Audience:** University students, academic researchers, neurodivergent individuals (ADHD/autism requiring low-distraction environments), low-vision users, and operators with motor disabilities requiring hands-free speech operation.

---

### Development / Research Methodology
The project employs an **Iterative User-Centered Design (UCD) & Agile Methodology**:
1. **Requirements & Theoretical Foundation:** Literature review of Dey & Abowd’s Context-Aware Computing, van Bommel’s Circadian Ergonomics, Sweller’s Cognitive Load Theory, and BJ Fogg’s Behavior Model.
2. **Prototyping & Architectural Separation:** Modular decoupling into isolated engines (`contextEngine.js`, `persuasiveEngine.js`, `accessibilityEngine.js`, `audio.js`, `hciInspector.js`, `app.js`).
3. **Accessibility Engineering:** Implementation and audit against W3C WCAG 2.1 Level AAA success criteria, including keyboard navigation, color contrast analyzers, and screen reader testing (NVDA / ChromeVox).
4. **Evaluation & Verification:** Heuristic Evaluation using Jakob Nielsen’s 10 Usability Heuristics, cognitive walkthroughs, and automated performance auditing (Lighthouse 100/100 targets).

---

### Resources Involved
* **Hardware:** Standard PC / Laptop with microphone input and audio output devices (speakers/headphones).
* **Software Tools:** Modern Web Browsers (Google Chrome, Microsoft Edge), Visual Studio Code, Git Version Control, GitHub.
* **Technologies & Standards:** HTML5, CSS3, Tailwind CSS CDN (with production clean interceptor), Web Audio API, Web Speech API (SpeechRecognition & SpeechSynthesis), WAI-ARIA 1.2, Service Workers.

---

### Final Outcome / Deliverables
1. **Production-Ready Web Application:** Fully responsive, zero-error web prototype deployed live on GitHub Pages:  
   👉 `https://ahmerkhanniazi.github.io/HCI-FOCUS-FLOW/`
2. **Source Code Repository:** Clean, version-controlled GitHub repository:  
   👉 `https://github.com/AhmerKhanNiazi/HCI-FOCUS-FLOW`
3. **Progressive Web App (PWA) Package:** Installable offline bundle with `manifest.json`, high-resolution icons (`favicon.svg`, `favicon.ico`), and Service Worker caching.
4. **Academic Project Documentation & Defense Manual:** Comprehensive viva guide and second-by-second presentation script (`DEMO_SCRIPT_MASTER_MANUAL.md` and `PROJECT_PRESENTATION_&_VIVA_GUIDE.md`).
5. **HCI Theoretical Mapping Report:** Full evaluation matrix mapping features to ACM Knowledge Areas, Complex Computing Problems (CCP), and UN Sustainable Development Goals (SDGs).

---

### Learning Outcomes
* Practical competency in designing adaptive and context-aware systems that dynamically alter user interfaces based on temporal and cognitive metrics.
* Deep understanding of behavioral psychology, ethical persuasive design, choice architecture (nudges), and habit-formation mechanics.
* Comprehensive implementation of modern web accessibility standards (WCAG 2.1 AAA, WAI-ARIA landmarks, keyboard switch navigation).
* Advanced proficiency in client-side hardware APIs: Web Audio API (real-time procedural signal processing) and Web Speech API (speech recognition and synthesis).
* Software engineering best practices: decoupled modular architecture, zero-dependency engineering, and progressive web application deployment.

---

### Industrial Support (if any)
*Academic Open-Source Project &mdash; Developed under Software Engineering / HCI Departmental Guidelines.*

---

### FYP Team Members:
| S. No. | Name of the Student | IU Regn No | CGPA | Signature |
| :---: | :--- | :---: | :---: | :---: |
| 1 | Ahmer Khan Niazi | [Your Regn No] | [CGPA] | ______________ |
| 2 | [Team Member 2 if any] | [Regn No] | [CGPA] | ______________ |

---

### Details of Supervisor / Industrial Advisor:
| Role | Name | Designation & Department | Contact No. | Signature |
| :--- | :--- | :--- | :--- | :--- |
| **Supervisor** | Dr. Rizwan Munir | Assistant Professor (CS) | +92 3456550019 | ______________ |
| **Co-Supervisor (if any)** | | | | ______________ |
| **Industrial Advisor (if any)** | | | | ______________ |

---

## Project Schedule & Milestones

| S. No. | Weeks | Milestones | Deliverables |
| :---: | :---: | :--- | :--- |
| **1** | Week 1–2 | Problem definition, literature review of HCI Topics 6 & 10, target audience profiling, scope freeze | Project Proposal, SRS Document, Success Criteria Matrix |
| **2** | Week 3–4 | Architectural design, modular decomposition, UI/UX wireframing, circadian color palette selection | Architecture Diagram, Wireframes, WCAG Contrast Palettes |
| **3** | Week 5–6 | Core UI implementation; Tailwind CSS setup; custom glassmorphism stylesheet; responsive layout | Base HTML5/CSS3 prototype with responsive layout |
| **4** | Week 7–9 | Dynamic Context Adaptation Engine; solar clock detection; circadian theme switcher; manual override | `contextEngine.js` prototype; Circadian UI transitions |
| **5** | Week 10–13 | Persuasive Pomodoro Timer; SVG progress ring mathematics; gamified streak tracking; loss aversion | `persuasiveEngine.js`; Interactive focus timer & streak system |
| **6** | Week 14–16 | Psychological nudge engine; modal prompts; 20% retention claim; midterm project demonstration | Integrated Context & Persuasive Prototype; Midterm Presentation |
| **7** | Week 17–20 | Web Audio API synthesizer; procedural chime, Tibetan gong, and 4 sensory soundscapes (Rain, Gamma, White Noise, Waves) | `audio.js`; Zero-asset procedural audio engine |
| **8** | Week 21–25 | Universal Accessibility Engine; Web Speech API (Two-Way Voice Recognition + Speech Synthesis); WCAG AAA High Contrast; Font Scaling | `accessibilityEngine.js`; Hands-free voice control & accessible UI |
| **9** | Week 26–29 | HCI Concept Inspector drawer; live telemetry logging; 60x timer fast-forward; PWA Service Worker offline caching | Live Inspector Console; `manifest.json`; `sw.js`; PWA package |
| **10** | Week 30–32 | Heuristic evaluation; user testing; final report; GitHub Pages / Vercel deployment; defense presentation & viva | Final Project Package, Live Deployment, Final Presentation |

---

## Gantt Chart

```text
Task / Milestone                     W1-4   W5-8   W9-12  W13-16 W17-20 W21-24 W25-28 W29-32
-----------------------------------------------------------------------------------------
1. Literature Review & SRS           [====]
2. UI/UX Wireframes & Themes                [====]
3. Base UI & Responsive Layout              [====]
4. Context Adaptation Engine                       [====]
5. Persuasive Engine & Gamification                       [====]
6. Midterm Demo & Nudge Modals                            [====]
7. Web Audio Synthesizer Engine                                  [====]
8. Two-Way Voice & Accessibility                                        [====]
9. HCI Inspector & PWA Caching                                                 [====]
10. Testing, Deployment & Viva Prep                                                   [====]
```

---

## FYP to Sustainable Development Goals (SDGs) Mapping

| SDGs | Mapping | Description |
| :--- | :---: | :--- |
| **SDG 01. No poverty** | | |
| **SDG 02. Zero hunger** | | |
| **SDG 03. Good health and well-being** | **✓** | Supports Target 3.4 (mental health and well-being) by mitigating digital screen fatigue, preventing burnout, reducing ocular strain, and preserving circadian sleep health via blue-light suppression. |
| **SDG 04. Quality education** | **✓** | Supports Target 4.5 (inclusive education) by providing university students and neurodivergent learners with focus tools that improve information retention by 20% through structured cognitive rest. |
| **SDG 05. Gender equality** | | |
| **SDG 06. Clean water and sanitation** | | |
| **SDG 07. Affordable and clean energy** | | |
| **SDG 08. Decent work and economic growth** | **✓** | Promotes safe, ergonomic, and sustained digital work environments, fostering productive deep work without cognitive exhaustion. |
| **SDG 09. Industry, innovation, and infrastructure** | **✓** | Delivers an open-source, zero-dependency, and accessible software framework leveraging modern browser hardware APIs (Web Audio and Web Speech). |
| **SDG 10. Reduced inequalities** | **✓** | Directly supports disability inclusion by enabling individuals with physical motor impairments (hands-free speech) and visual impairments (screen readers and high contrast) to operate productivity tools with full equity. |
| **SDG 11. Sustainable cities and communities** | **✓** | Supports human-centric digital workplace ergonomics in knowledge-driven urban communities. |
| **SDG 12. Responsible consumption and production** | | |
| **SDG 13. Climate action** | | |
| **SDG 14. Life below water** | | |
| **SDG 15. Life on land** | | |
| **SDG 16. Peace, justice and strong institutions** | | |
| **SDG 17. Partnerships for the goals** | | |

---

## FYP to Complex Computing Problem (CCP) Mapping

| CCP Attribute | WP Characteristic | FYPD to CCP Mapping: How it is Addressed in FocusFlow |
| :--- | :--- | :--- |
| **Depth of knowledge required** | **WP1:** One or more of ACM Knowledge Areas | Requires deep cross-disciplinary knowledge in Human-Computer Interaction, photobiological ergonomics, cognitive psychology (Cognitive Load Theory), digital signal processing (Web Audio API synthesis), and Natural Language Speech Recognition (Web Speech API). |
| **Range of conflicting requirements** | **WP2:** Wide-ranging or conflicting technical, engineering/computing and other issues | Balances modern high-aesthetic glassmorphism against strict WCAG AAA 7:1+ contrast requirements; reconciles autonomous system context adaptation with Jakob Nielsen’s Heuristic #3 (User Control & Freedom); balances hands-free continuous speech recognition with browser resource efficiency. |
| **Depth of analysis required** | **WP3:** No obvious solution | No standardized framework exists for integrating circadian color shifts, persuasive cognitive nudges, and two-way voice accessibility into a zero-dependency client-side architecture. Requires algorithmic modeling of solar circadian intervals and mathematical SVG circular rendering without heavy third-party libraries. |
| **Familiarity of issues** | **WP4:** Involve infrequently encountered issues | Combining circadian photobiological ergonomics with procedural Web Audio synthesis (such as 40Hz Gamma wave binaural entrainment and resonant LFO ocean waves) is rarely attempted in conventional productivity software. |
| **Extent of applicable codes** | **WP5:** Outside problems encompassed by standards and codes of practice | Implements and validates against W3C WCAG 2.1 Level AAA, WAI-ARIA 1.2 Authoring Practices, Jakob Nielsen’s 10 Usability Heuristics, and ethical persuasive technology guidelines (preventing deceptive dark patterns). |
| **Extent of stakeholder involvement & conflicting requirements** | **WP6:** Diverse groups of stakeholders with widely varying needs | Caters to diverse user groups: university students needing study sprints, neurodivergent operators needing sensory reduction, motor-impaired users needing hands-free speech control, and blind users requiring clean screen-reader announcements. |
| **Interdependence** | **WP7:** Many component parts or sub-problems | The `ContextEngine`, `PersuasiveEngine`, `AccessibilityEngine`, `AudioEngine`, and `HCIInspector` are highly interdependent, synchronizing via a decoupled reactive event-bus pattern. |

---

### For Office Use Only:

* [ ] Proposal Approved  
* [ ] Not Approved  
* [ ] Returned for Clarification / Modification  

**Comments (if any):**  
____________________________________________________________________________________________________  
____________________________________________________________________________________________________  

**Project Serial No.:** _______________ &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **Date:** _______________  

&emsp;&emsp;&emsp;_________________________ &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; _________________________  
&emsp;&emsp;&emsp;&emsp;**Signature FYP Coordinator** &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp; **Signature Chairperson**  

&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;___________________________________  
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;**Signature Associate Dean / Dean**  

---

## Annexure – A: Knowledge Areas in ACM Mapping

| # | ACM Knowledge Area | Your Project Mapping to ACM Knowledge Area |
| :---: | :--- | :--- |
| **1** | **AL - Algorithms and Complexity** | Circular SVG progress stroke offset algorithms ($2\pi r$ calculation); real-time countdown precision scheduling; fuzzy voice command matching. |
| **2** | **AR - Architecture and Organization** | Decoupled client-side component architecture; event bus pub/sub pattern between context, persuasive, audio, and accessibility engines. |
| **3** | **CN - Computational Science** | Mathematical modeling of circadian solar time; algorithmic generation of pink and white noise using stochastic distribution polynomials. |
| **4** | **DS - Discrete Structures** | Finite State Machine (FSM) managing timer states (`idle`, `running`, `paused`, `completed`) and multi-tier cognitive fatigue levels. |
| **5** | **GV - Graphics and Visualization** | Hardware-accelerated CSS glassmorphism, dynamic SVG rendering, ambient mesh gradient animation, and real-time visual progress telemetry. |
| **6** | **HCI - Human-Computer Interaction** | **Core Focus:** Topic 10 (Context-Aware Interfaces) and Topic 6 (Persuasive Technology); Cognitive Load Theory; Circadian Ergonomics; Nielsen Heuristics; Fitts’s Law. |
| **7** | **IAS - Information Assurance & Security** | Client-side privacy by design (zero tracking of user voice data or personal analytics; local storage encryption; no server telemetry leaks). |
| **8** | **IM - Information Management** | Client-side LocalStorage schema for streak tracking, session counts, daily targets, and user accessibility preferences. |
| **9** | **IS - Intelligent Systems** | Natural language voice command recognition via Web Speech API; dynamic rule-based context adaptation engine. |
| **10** | **NC - Networking and Communication** | Offline-first Service Worker architecture (`sw.js`) intercepting network fetch requests to enable 100% disconnected operation. |
| **11** | **OS - Operating Systems** | Browser hardware API integration (AudioContext hardware thread management, SpeechRecognition worker threads). |
| **12** | **PBD - Platform-Based Development** | Modern Web Platform APIs (Web Audio API, Web Speech API, Service Workers, Progressive Web App manifest). |
| **13** | **PD - Parallel and Distributed Computing** | Asynchronous non-blocking web audio audio-buffer processing and Service Worker background caching threads. |
| **14** | **PL - Programming Languages** | Modern ECMAScript (ES6+) object-oriented class architecture, arrow functions, DOM manipulation, and asynchronous promises. |
| **15** | **SDF - Software Development Fundamentals** | Version control with Git/GitHub, modular code structure, defensive programming, and zero-warning console output. |
| **16** | **SE - Software Engineering** | Requirements analysis, accessible UI/UX specification, component decoupling, automated testing, continuous deployment to GitHub Pages. |
| **17** | **SF - Systems Fundamentals** | Resource management, browser event loop optimization, memory leak prevention during continuous audio oscillator playback. |
| **18** | **SP - Social Issues and Professional Practice** | Ethical persuasive design (avoidance of dark patterns and addictive loops); universal accessibility inclusion for individuals with disabilities (SDG 10). |

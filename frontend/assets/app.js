
(() => {
  const KEY = "ghosttrace_v1";

  const STEPS = [
    { id: "intro", label: "Intro", href: "index.html" },
    { id: "pre", label: "Pre-Quiz", href: "pre-quiz.html" },
    { id: "b1", label: "Browse 1", href: "browse1.html" },
    { id: "r1", label: "Report 1", href: "report1.html" },
    { id: "b2", label: "Browse 2", href: "browse2.html" },
    { id: "r2", label: "Report 2", href: "report2.html" },
    { id: "post", label: "Post-Quiz", href: "post-quiz.html" },
    { id: "compare", label: "Compare", href: "quiz_comparison.html" },
    { id: "resources", label: "Resources", href: "resources.html" },
  ];

  // ---------- helpers ----------
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function safeParse(json, fallback) {
    try {
      return JSON.parse(json);
    } catch {
      return fallback;
    }
  }

  function loadState() {
    const raw = localStorage.getItem(KEY);
    return raw ? safeParse(raw, defaultState()) : defaultState();
  }

  function saveState(next) {
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function defaultState() {
    return {
      intro: { done: false },
      preQuiz: { done: false, score: 0, total: 8, answers: [] },
      browse1: {
        done: false,
        clicks: 0,
        articlesOpened: 0,
        hoverEvents: 0,
        timeSpentSec: 0,
        categories: 0,
        topics: [],
        exposureScore: 0,
      },
      report1: { done: false },
      browse2: {
        done: false,
        clicks: 0,
        articlesOpened: 0,
        hoverEvents: 0,
        timeSpentSec: 0,
        categories: 0,
        topics: [],
        exposureScore: 0,
      },
      report2: { done: false },
      postQuiz: { done: false, score: 0, total: 8, answers: [] },
      compare: { done: false },
      resources: { done: false },
    };
  }

  function setDone(stepId, done = true) {
    const s = loadState();
    if (!s[stepId]) s[stepId] = {};
    s[stepId].done = done;
    saveState(s);
  }

  function currentPathName() {
    const p = location.pathname.split("/").pop();
    return p || "index.html";
  }

  // ---------- fixed header padding fix ----------
  function applyTopbarPaddingFix() {
  const top =
    qs(".top-progress") ||
    qs(".topbar") ||
    qs("header.top-progress") ||
    qs("header.topbar");

  if (!top) return;

  const h = Math.ceil(top.getBoundingClientRect().height || 78);
  document.documentElement.style.setProperty("--topbar-h", `${h}px`);
  document.body.classList.add("has-fixed-topbar");
  }

  window.addEventListener("resize", applyTopbarPaddingFix);

  // ---------- stepper ----------
  function renderStepper(activeId) {
    applyTopbarPaddingFix();

    const el = qs("[data-stepper]");
    if (!el) return;

    const s = loadState();
    el.innerHTML = "";

    STEPS.forEach((step) => {
      const a = document.createElement("a");
      a.href = step.href;
      a.className = "step";
      a.dataset.step = step.id;

      const dot = document.createElement("span");
      dot.className = "dot";

      const label = document.createElement("span");
      label.className = "label";
      label.textContent = step.label;

      a.appendChild(dot);
      a.appendChild(label);

      const isActive = step.id === activeId;
      const isDone = !!s[step.id]?.done;

      if (isActive) a.classList.add("active");
      if (isDone) a.classList.add("done");

      el.appendChild(a);
    });
  }

  // ---------- INTRO ----------
  function initIntro() {
    applyTopbarPaddingFix();
    renderStepper("intro");

    const btn = qs("[data-begin]");
    if (btn) {
      btn.addEventListener("click", () => {
        setDone("intro", true);
        window.location.href = "pre-quiz.html";
      });
    }
  }

  // ---------- QUIZ ----------
  const QUIZ = [
    {
      q: "Which of the following actions can a website track even if you don't click anything?",
      options: [
        "Only button clicks",
        "Mouse movements, scroll positions, and time spent on page",
        "Nothing unless you submit a form",
        "Only your location",
      ],
      correct: 1,
      explain:
        "Sites can log passive signals like scroll depth, pointer movement, and dwell time — even without clicks.",
    },
    {
      q: "What is a tracking pixel?",
      options: [
        "A visible banner that asks for consent",
        "A tiny invisible image or script that reports when a page/email is viewed",
        "A password stored in cookies",
        "A VPN feature",
      ],
      correct: 1,
      explain:
        "Tracking pixels are tiny (often 1×1) assets used to notify a server that content was viewed.",
    },
    {
      q: "Why do companies care about time spent on a page?",
      options: [
        "It reveals interest/engagement and helps predict what you might want",
        "It only helps speed up your internet",
        "It has no value unless you buy something",
        "It is illegal to track",
      ],
      correct: 0,
      explain:
        "Longer dwell time can be interpreted as stronger interest — useful for inference and targeting.",
    },
    {
      q: "What is browser fingerprinting?",
      options: [
        "Saving your password in the browser",
        "A method that combines device/browser traits to identify you",
        "Blocking all ads",
        "A feature only on phones",
      ],
      correct: 1,
      explain:
        "Fingerprinting uses many small signals (fonts, screen size, APIs, etc.) to create a unique profile.",
    },
    {
      q: "Which best describes a data broker?",
      options: [
        "A company that sells laptops",
        "A company that collects and sells personal/behavioral data",
        "A social media influencer",
        "A cybersecurity tool",
      ],
      correct: 1,
      explain:
        "Data brokers aggregate data from many sources and sell it to advertisers, insurers, etc.",
    },
    {
      q: "Cookies are mainly used to…",
      options: [
        "Make your keyboard faster",
        "Remember sessions/preferences and track behavior across visits",
        "Encrypt messages end-to-end",
        "Disable websites",
      ],
      correct: 1,
      explain:
        "Cookies store small identifiers and preferences; third-party cookies can track you across sites.",
    },
    {
      q: "Which action most reduces tracking during browsing?",
      options: [
        "Opening more tabs",
        "Using a tracker blocker / privacy-focused browser",
        "Increasing screen brightness",
        "Logging out of Wi-Fi",
      ],
      correct: 1,
      explain:
        "Tracker blockers and privacy browsers limit third-party scripts and storage methods.",
    },
    {
      q: "Even if you never type personal info, companies can still infer…",
      options: [
        "Nothing at all",
        "Interests, habits, and likely demographics from behavior signals",
        "Your bank PIN",
        "Your exact thoughts",
      ],
      correct: 1,
      explain:
        "Behavior signals (clicks, dwell time, categories) are enough to infer many traits probabilistically.",
    },
  ];

  function initQuiz(kindOrOpts) {
    applyTopbarPaddingFix();
    const opts =
      typeof kindOrOpts === "string"
        ? { kind: kindOrOpts }
        : (kindOrOpts || {});
    const kind = opts.kind || "pre";

    const root =
      qs("[data-quiz]") ||
      qs("[data-quiz-root]") ||
      qs(".quiz-wrap") ||
      document.body;

    // Guard: prevent double-init
    if (root.dataset.gtWiredQuiz === kind) return;
    root.dataset.gtWiredQuiz = kind;

    renderStepper(kind === "pre" ? "pre" : "post");

    const s = loadState();
    const stateKey = kind === "pre" ? "preQuiz" : "postQuiz";
    const total = QUIZ.length;

    // Mark totals in state (keeps consistent)
    s[stateKey].total = total;
    saveState(s);

    // --- Variant A (new markup: pre-quiz.html) ---
    const elQTitle = qs("[data-qtitle]");
    const elOptions = qs("[data-options]");
    const elKicker = qs("[data-qkicker]");
    const elCount = qs("[data-qcount]");
    const elPercent = qs("[data-qpercent]");
    const elFill = qs("[data-qfill]");
    const elFeedback = qs("[data-feedback]");
    const elFbTitle = qs("[data-feedback-title]");
    const elFbText = qs("[data-feedback-text]");

    // --- Variant B (older markup: post-quiz.html) ---
    const bTitle = qs("[data-q-title]");
    const bOptions = qs("[data-q-options]");
    const bIndex = qs("[data-q-index]");
    const bProg = qs("[data-q-progress]");
    const bBar = qs("[data-qbar] > div") || qs("[data-qbar] div");
    const bFeedback = qs("[data-feedback]");
    const bPrev = qs("[data-prev]");
    const bSubmit = qs("[data-submit]");

    // Determine which variant to render
    const useA = !!(elQTitle && elOptions);
    const useB = !!(bTitle && bOptions);

    // internal runtime
    let idx = 0;
    const answers = Array(total).fill(null);

    function setProgress() {
      const pct = Math.round((idx / total) * 100);
      const shown = idx + 1;
      if (useA) {
        if (elCount) elCount.textContent = `Question ${shown} of ${total}`;
        if (elPercent) elPercent.textContent = `${Math.round((idx / total) * 100)}% complete`;
        if (elFill) elFill.style.width = `${(idx / total) * 100}%`;
      }
      if (useB) {
        if (bIndex) bIndex.textContent = `Question ${shown} of ${total}`;
        if (bProg) bProg.textContent = `${Math.round((idx / total) * 100)}% complete`;
        if (bBar) bBar.style.width = `${(idx / total) * 100}%`;
      }
    }

    function renderQuestion() {
      const item = QUIZ[idx];

      setProgress();

      if (useA) {
        if (elKicker) elKicker.textContent = `Question ${idx + 1}`;
        if (elQTitle) elQTitle.textContent = item.q;

        elOptions.innerHTML = "";
        item.options.forEach((opt, oi) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "quiz-option";
          btn.innerHTML = `<span class="opt-letter">${String.fromCharCode(
            65 + oi
          )}</span><span class="opt-text">${opt}</span>`;
          btn.addEventListener("click", () => selectOption(oi));
          elOptions.appendChild(btn);
        });

        if (elFeedback) elFeedback.hidden = true;
      }

      if (useB) {
        bTitle.textContent = item.q;
        bOptions.innerHTML = "";
        item.options.forEach((opt, oi) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "optBtn";
          btn.innerHTML = `<span class="optKey">${String.fromCharCode(
            65 + oi
          )}</span><span>${opt}</span>`;
          btn.addEventListener("click", () => selectOption(oi));
          bOptions.appendChild(btn);
        });

        if (bFeedback) bFeedback.innerHTML = "";
        if (bSubmit) {
          bSubmit.style.display = idx === total - 1 ? "" : "none";
          bSubmit.disabled = true;
        }
      }
    }

    function showFeedback(isCorrect, explainText) {
      if (useA && elFeedback) {
        elFeedback.hidden = false;
        if (elFbTitle)
          elFbTitle.textContent = isCorrect ? "Correct" : "Not quite";
        if (elFbText) elFbText.textContent = explainText;
      }
      if (useB && bFeedback) {
        bFeedback.innerHTML = `
          <div class="fb ${isCorrect ? "good" : "bad"}">
            <div class="fbTitle">${isCorrect ? "Correct" : "Not quite"}</div>
            <div class="fbText">${explainText}</div>
          </div>`;
      }
    }

    function selectOption(choice) {
      answers[idx] = choice;

      const item = QUIZ[idx];
      const isCorrect = choice === item.correct;

      showFeedback(isCorrect, item.explain);

      // advance automatically in Variant A
      if (useA) {
        setTimeout(() => {
          if (idx < total - 1) {
            idx += 1;
            renderQuestion();
          } else {
            finishQuiz();
          }
        }, 550);
      }

      // Variant B: enable submit on last question
      if (useB && bSubmit && idx === total - 1) {
        bSubmit.disabled = false;
      }
    }

    function computeScore() {
      let score = 0;
      for (let i = 0; i < total; i++) {
        if (answers[i] === QUIZ[i].correct) score += 1;
      }
      return score;
    }

    function finishQuiz() {
      const score = computeScore();

      const st = loadState();
      st[stateKey] = {
        done: true,
        score,
        total,
        answers: answers.slice(),
      };
      setDone(kind === "pre" ? "pre" : "post", true);
      saveState(st);

      // route
      if (kind === "pre") {
        window.location.href = "browse1_intro.html";
      } else {
        window.location.href = "quiz_comparison.html";
      }
    }

    // Variant B extra controls
    if (useB) {
      if (bPrev) {
        bPrev.addEventListener("click", () => {
          if (idx > 0) {
            idx -= 1;
            renderQuestion();
          }
        });
      }

      if (bSubmit) {
        bSubmit.addEventListener("click", (e) => {
          e.preventDefault();
          finishQuiz();
        });
      }
    }

    renderQuestion();
  }

  // alias requested by your pre-quiz page
  function initQuizV2(opts) {
    const kind = typeof opts === "string" ? opts : (opts?.kind || "pre");
    return initQuiz(kind);
  }

  // ---------- BROWSE ----------
  // ---------- BROWSE ----------
function initBrowse(round) {
  applyTopbarPaddingFix();

  const root = qs("[data-browse]") || document.body;
  const pageRound = Number(root.dataset.round || round || 1);
  const key = pageRound === 1 ? "browse1" : "browse2";

  if (root.dataset.gtWiredBrowse === String(pageRound)) return;
  root.dataset.gtWiredBrowse = String(pageRound);

  renderStepper(pageRound === 1 ? "b1" : "b2");

  const startTime = Date.now();
  let clicks = 0;
  let opened = 0;
  let hoverCount = 0;
  const openedTopics = new Set();

  // ── Privacy state ──────────────────────────────────────
  const privacy = {
    vpn: false,
    blocker: false,
    cookiesAccepted: null, // 'all' | 'custom' | 'essential'
    cookieScore: 0,        // penalty added to exposure
    blockerBlocked: 0,
    adHoverCount: 0,
  };
  window._gtPrivacy = privacy;

  // ── Stat refs ──────────────────────────────────────────
  const elClicks   = qs("[data-clicks]");
  const elArticles = qs("[data-articles]");
  const elTime     = qs("[data-time]");
  const elTip      = qs("[data-tip]");

  function updateTopStats() {
    if (elClicks)   elClicks.textContent   = String(clicks);
    if (elArticles) elArticles.textContent = String(opened);
    if (elTime) {
      const sec = Math.floor((Date.now() - startTime) / 1000);
      elTime.textContent = `${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
    }
  }
  const timer = setInterval(updateTopStats, 1000);

  // ── Card interactions ──────────────────────────────────
  function wireCards() {
    qsa("[data-card]").forEach(card => {
      let entered = false;
      card.addEventListener("mouseenter", () => {
        if (entered) return;
        entered = true;
        hoverCount++;

        // Ad hover hint (round 1 only, non-blocker)
        if (pageRound === 1 && !privacy.blocker && card.classList.contains("sponsored")) {
          privacy.adHoverCount++;
          if (privacy.adHoverCount === 2) showBlockerHint();
        }

        // Tracker dot (round 1 only, no blocker, accept-all cookies)
        if (pageRound === 1 && !privacy.blocker && privacy.cookiesAccepted === "all") {
          spawnTrackerDot();
        }
      });

      card.addEventListener("click", () => {
        clicks++;
        opened++;
        const topic = card.dataset.topic ||
          card.querySelector(".pill")?.textContent?.trim() || "General";
        openedTopics.add(topic);
        if (elTip && pageRound === 2) {
          elTip.classList.add("show");
          setTimeout(() => elTip.classList.remove("show"), 2500);
        }
        updateTopStats();
      });
    });
  }

  // ── Tracker dot visual ─────────────────────────────────
  function spawnTrackerDot() {
    const d = document.createElement("div");
    d.className = "tracker-dot";
    d.style.left = (Math.random() * window.innerWidth)  + "px";
    d.style.top  = (Math.random() * window.innerHeight) + "px";
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 1800);
  }

  // ── Browser chrome ─────────────────────────────────────
  function buildBrowserChrome() {
    const existing = qs(".browser-chrome");
    if (existing) return; // already built by HTML

    const trackingBar = qs(".tracking-bar");
    const chrome = document.createElement("div");
    chrome.className = "browser-chrome";
    chrome.innerHTML = `
      <div class="browser-chrome-inner">
        <div class="browser-address-bar">
          <span class="browser-lock">🔒</span>
          <span class="browser-url">newsfeed.example.com</span>
        </div>
        <div class="browser-chips">
          <span class="browser-chip" id="chip-vpn" title="VPN / Secure tunnel">🛡 VPN</span>
          <div class="ext-wrap">
            <span class="browser-chip" id="chip-ext" title="Extensions">🧩 Extensions</span>
            <div class="ext-dropdown" id="ext-dropdown">
              <div class="ext-dropdown-title">Browser extensions</div>
              <div class="ext-row" id="ext-blocker-row">
                <div class="ext-row-left">
                  <div class="ext-icon">🛡</div>
                  <div>
                    <div class="ext-name">Shield Blocker</div>
                    <div class="ext-desc">Block ads &amp; trackers</div>
                  </div>
                </div>
                <button class="ext-toggle" id="ext-blocker-toggle" title="Toggle blocker"></button>
              </div>
            </div>
          </div>
          <span class="browser-chip" id="chip-cookies" title="Cookie status">🍪 Cookies</span>
        </div>
      </div>`;

    if (trackingBar) {
      trackingBar.insertAdjacentElement("afterend", chrome);
    } else {
      document.body.prepend(chrome);
    }

    // VPN chip click
    qs("#chip-vpn").addEventListener("click", () => {
      if (pageRound === 1) {
        // Round 1 — VPN wasn't enabled at Wi-Fi step, show reminder
        showToast("Enable a secure connection before browsing — try Round 2.", "info");
        return;
      }
      privacy.vpn = !privacy.vpn;
      qs("#chip-vpn").classList.toggle("chip-active-vpn", privacy.vpn);
      qs("#chip-vpn").textContent = privacy.vpn ? "🛡 Secure tunnel active" : "🛡 VPN";
      showToast(privacy.vpn ? "Secure tunnel active — IP masked." : "VPN disconnected.", privacy.vpn ? "ok" : "info");
    });

    // Extensions dropdown toggle
    qs("#chip-ext").addEventListener("click", (e) => {
      e.stopPropagation();
      qs("#ext-dropdown").classList.toggle("open");
    });
    document.addEventListener("click", () => qs("#ext-dropdown")?.classList.remove("open"));

    // Ad blocker toggle
    const blockerToggle = qs("#ext-blocker-toggle");
    blockerToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      privacy.blocker = !privacy.blocker;
      blockerToggle.classList.toggle("on", privacy.blocker);
      qs("#chip-ext").classList.toggle("chip-active-block", privacy.blocker);
      applyBlocker();
      showToast(
        privacy.blocker
          ? `Blocker ON — ${countBlockable()} items hidden.`
          : "Blocker disabled — ads and trackers restored.",
        privacy.blocker ? "ok" : "info"
      );
    });
  }

  function applyBlocker() {
    qsa(".ad-slot, .article-card.sponsored").forEach(el => {
      if (privacy.blocker) {
        el.classList.add("blocked");
        privacy.blockerBlocked++;
      } else {
        el.classList.remove("blocked");
      }
    });
    // Update cookie chip
    updateCookieChip();
  }

  function countBlockable() {
    return qsa(".ad-slot, .article-card.sponsored").length;
  }

  function updateCookieChip() {
    const chip = qs("#chip-cookies");
    if (!chip) return;
    if (privacy.cookiesAccepted === "all") {
      chip.className = "browser-chip chip-active-cookies";
      chip.textContent = "🍪 All cookies active";
    } else if (privacy.cookiesAccepted === "essential") {
      chip.className = "browser-chip chip-active-vpn";
      chip.textContent = "🍪 Essential only";
    } else if (privacy.cookiesAccepted === "custom") {
      chip.className = "browser-chip";
      chip.textContent = "🍪 Custom cookies";
    } else {
      chip.className = "browser-chip";
      chip.textContent = "🍪 Cookies";
    }
  }

  // ── Toast helper ───────────────────────────────────────
  function showToast(msg, type) {
    let t = qs(".gt-toast");
    if (!t) {
      t = document.createElement("div");
      t.className = "gt-toast";
      t.style.cssText = `
        position:fixed;bottom:90px;left:50%;transform:translateX(-50%);
        padding:10px 18px;border-radius:10px;font-size:13px;font-weight:700;
        z-index:9000;pointer-events:none;transition:opacity 0.3s;
        font-family:ui-monospace,monospace;letter-spacing:0.06em;`;
      document.body.appendChild(t);
    }
    const colors = {
      ok:   "background:#0d2e1a;border:1px solid #22c55e;color:#22c55e;",
      info: "background:#0d1117;border:1px solid rgba(255,255,255,0.15);color:rgba(255,255,255,0.75);",
      warn: "background:#2e1a0d;border:1px solid #fbbf24;color:#fbbf24;",
    };
    t.style.cssText += colors[type] || colors.info;
    t.textContent = msg;
    t.style.opacity = "1";
    clearTimeout(t._timer);
    t._timer = setTimeout(() => { t.style.opacity = "0"; }, 2800);
  }

  // ── Cookie banner ──────────────────────────────────────
  function buildCookieBanner() {
    const banner = document.createElement("div");
    banner.className = "cookie-banner";
    banner.id = "cookie-banner";
    banner.innerHTML = `
      <div class="cookie-banner-top">
        <div>
          <div class="cookie-banner-title">🍪 This site uses cookies</div>
          <p class="cookie-banner-text">
            We use cookies and similar technologies to personalise content, analyse traffic,
            serve targeted ads, and improve your experience. By clicking "Accept All" you
            consent to our use of all cookies.
          </p>
        </div>
      </div>
      <div class="cookie-btn-row">
        <button class="cookie-accept-all" id="cookie-accept-all">Accept All</button>
        <button class="cookie-manage" id="cookie-manage">Manage Preferences</button>
        <button class="cookie-reject" id="cookie-reject">Reject non-essential</button>
      </div>`;
    document.body.appendChild(banner);

    // Prefs modal
    const prefsOverlay = document.createElement("div");
    prefsOverlay.className = "cookie-prefs-overlay";
    prefsOverlay.id = "cookie-prefs-overlay";
    prefsOverlay.innerHTML = `
      <div class="cookie-prefs-modal">
        <div class="cookie-prefs-title">Cookie Preferences</div>
        <p class="cookie-prefs-sub">
          Manage which cookies you allow. Note: turning off analytics and advertising
          cookies takes a few extra steps — just like real consent flows.
        </p>
        <div class="cookie-pref-row">
          <div>
            <div class="cookie-pref-label">Strictly Necessary</div>
            <div class="cookie-pref-desc">Required for the site to function. Cannot be disabled.</div>
          </div>
          <button class="cookie-pref-toggle on" disabled></button>
        </div>
        <div class="cookie-pref-row">
          <div>
            <div class="cookie-pref-label">Analytics Cookies</div>
            <div class="cookie-pref-desc">Help us understand how visitors interact with the site.</div>
          </div>
          <button class="cookie-pref-toggle on" id="pref-analytics"></button>
        </div>
        <div class="cookie-pref-row">
          <div>
            <div class="cookie-pref-label">Advertising Cookies</div>
            <div class="cookie-pref-desc">Used to serve personalised advertisements.</div>
          </div>
          <button class="cookie-pref-toggle on" id="pref-ads"></button>
        </div>
        <div class="cookie-pref-row">
          <div>
            <div class="cookie-pref-label">Social Media Cookies</div>
            <div class="cookie-pref-desc">Enable sharing features and social platform tracking.</div>
          </div>
          <button class="cookie-pref-toggle on" id="pref-social"></button>
        </div>
        <button class="cookie-prefs-save" id="cookie-prefs-save">Save Preferences</button>
      </div>`;
    document.body.appendChild(prefsOverlay);

    // Wire toggles inside prefs
    ["pref-analytics","pref-ads","pref-social"].forEach(id => {
      const btn = qs("#" + id);
      btn.addEventListener("click", () => btn.classList.toggle("on"));
    });

    setTimeout(() => banner.classList.add("show"), 1200);

    qs("#cookie-accept-all").addEventListener("click", () => {
      privacy.cookiesAccepted = "all";
      privacy.cookieScore = 30; // big exposure penalty
      banner.classList.remove("show");
      updateCookieChip();
      showToast("All cookies accepted. Tracking scripts active.", "warn");
      if (pageRound === 1) {
        setTimeout(() => showNewsletterPopup(), 6000);
      }
    });

    qs("#cookie-manage").addEventListener("click", () => {
      prefsOverlay.classList.add("show");
    });

    qs("#cookie-reject").addEventListener("click", () => {
      privacy.cookiesAccepted = "essential";
      privacy.cookieScore = 0;
      banner.classList.remove("show");
      updateCookieChip();
      showToast("Non-essential cookies rejected. Good choice.", "ok");
    });

    qs("#cookie-prefs-save").addEventListener("click", () => {
      const analytics = qs("#pref-analytics").classList.contains("on");
      const ads       = qs("#pref-ads").classList.contains("on");
      const social    = qs("#pref-social").classList.contains("on");
      const anyOn     = analytics || ads || social;
      privacy.cookiesAccepted = anyOn ? "custom" : "essential";
      privacy.cookieScore = (analytics ? 10 : 0) + (ads ? 12 : 0) + (social ? 8 : 0);
      prefsOverlay.classList.remove("show");
      banner.classList.remove("show");
      updateCookieChip();
      showToast(
        anyOn
          ? `Saved — ${[analytics && "analytics", ads && "ads", social && "social"].filter(Boolean).join(", ")} cookies active.`
          : "All optional cookies disabled.",
        anyOn ? "info" : "ok"
      );
    });
  }

  // ── Newsletter popup (round 1, after accept all) ───────
  function showNewsletterPopup() {
    if (privacy.blocker) return;
    const popup = document.createElement("div");
    popup.className = "newsletter-popup show";
    popup.innerHTML = `
      <button class="newsletter-close" id="nl-close">✕</button>
      <div class="newsletter-title">📬 Stay in the loop!</div>
      <p class="newsletter-text">Get breaking news and personalised recommendations delivered daily.</p>
      <input class="newsletter-input" type="email" placeholder="your@email.com" />
      <button class="newsletter-sub">Subscribe Free</button>`;
    document.body.appendChild(popup);
    qs("#nl-close").addEventListener("click", () => popup.remove());
    setTimeout(() => popup.remove(), 12000);

    // Hint for round 1
    setTimeout(showBlockerHint, 3000);
  }

  // ── Blocker hint ───────────────────────────────────────
  let hintShown = false;
  function showBlockerHint() {
    if (hintShown || privacy.blocker) return;
    hintShown = true;
    const h = document.createElement("div");
    h.className = "blocker-hint show";
    h.textContent = "Too many popups? Check browser extensions 🧩";
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 5000);
  }

  // ── Wi-Fi modal ────────────────────────────────────────
  function showWifiModal(onConnect) {
    const overlay = document.createElement("div");
    overlay.className = "wifi-overlay";

    if (pageRound === 1) {
      overlay.innerHTML = `
        <div class="wifi-modal">
          <div class="wifi-modal-icon">📶</div>
          <div class="wifi-modal-title">Join Network</div>
          <p class="wifi-modal-sub">A network is available in your area.</p>
          <div class="wifi-network-row">
            <div>
              <div class="wifi-network-name">CoffeeShop_Free_WiFi</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.40);margin-top:2px;">No password required</div>
            </div>
            <span class="wifi-network-tag wifi-tag-open">OPEN</span>
          </div>
          <div class="wifi-btn-row">
            <button class="wifi-btn-connect" id="wifi-join">Connect Now</button>
            <p class="wifi-btn-note">Traffic on this network may be visible to others</p>
          </div>
        </div>`;
      overlay.querySelector("#wifi-join").addEventListener("click", () => {
        privacy.vpn = false;
        overlay.remove();
        onConnect();
      });
    } else {
      overlay.innerHTML = `
        <div class="wifi-modal">
          <div class="wifi-modal-icon">📶</div>
          <div class="wifi-modal-title">Join Network</div>
          <p class="wifi-modal-sub">The same open network is available. How do you want to connect?</p>
          <div class="wifi-network-row">
            <div>
              <div class="wifi-network-name">CoffeeShop_Free_WiFi</div>
              <div style="font-size:12px;color:rgba(255,255,255,0.40);margin-top:2px;">No password required · Open network</div>
            </div>
            <span class="wifi-network-tag wifi-tag-open">OPEN</span>
          </div>
          <div class="wifi-btn-row">
            <button class="wifi-btn-secure" id="wifi-secure">🛡 Secure connection first</button>
            <button class="wifi-btn-connect" id="wifi-insecure">Connect without VPN</button>
          </div>
        </div>`;
      overlay.querySelector("#wifi-secure").addEventListener("click", () => {
        privacy.vpn = true;
        overlay.remove();
        onConnect();
        setTimeout(() => {
          const chip = qs("#chip-vpn");
          if (chip) {
            chip.classList.add("chip-active-vpn");
            chip.textContent = "🛡 Secure tunnel active";
          }
          showToast("VPN active — your traffic is encrypted and your IP is masked.", "ok");
        }, 300);
      });
      overlay.querySelector("#wifi-insecure").addEventListener("click", () => {
        privacy.vpn = false;
        overlay.remove();
        onConnect();
      });
    }

    document.body.appendChild(overlay);
  }

  // ── Round 2 hint bar ───────────────────────────────────
  function injectR2HintBar() {
    if (pageRound !== 2) return;
    const bar = document.createElement("div");
    bar.className = "r2-hint-bar";
    bar.textContent = "▲ Round 2 — Try the VPN, blocker, and cookie settings to reduce your exposure";
    const trackingBar = qs(".tracking-bar");
    if (trackingBar) trackingBar.insertAdjacentElement("afterend", bar);
    else document.body.prepend(bar);
  }

  // ── Inject ad slots into feed ──────────────────────────
  function injectAdSlots() {
    const grid = qs(".feed-grid");
    if (!grid) return;

    const adData = [
      { content: "✦ Sponsored: VPN deals tailored to your browsing — Save 60% today", badge: "Ad" },
      { content: "✦ Promoted: Based on your interests — Shop the latest tech", badge: "Sponsored" },
    ];

    adData.forEach((ad, i) => {
      const slot = document.createElement("div");
      slot.className = "ad-slot";
      slot.setAttribute("data-ad", "1");
      slot.innerHTML = `
        <div>
          <div class="ad-slot-label">Advertisement</div>
          <div class="ad-slot-content">${ad.content}</div>
        </div>
        <span class="ad-slot-badge">${ad.badge}</span>`;
      // Insert after card 2 and card 5
      const cards = qsa("[data-card]", grid);
      const after = cards[i === 0 ? 1 : 4];
      if (after) after.insertAdjacentElement("afterend", slot);
      else grid.appendChild(slot);
    });

    // Mark a card as sponsored
    const firstCard = qs("[data-card]", grid);
    if (firstCard) {
      firstCard.classList.add("sponsored");
      const tag = document.createElement("span");
      tag.className = "sponsored-tag";
      tag.textContent = "Sponsored";
      firstCard.style.position = "relative";
      firstCard.appendChild(tag);
    }
  }

  // ── Finish ─────────────────────────────────────────────
  const btnFinish = qs("[data-finish]");
  if (btnFinish) {
    btnFinish.addEventListener("click", () => {
      clearInterval(timer);

      const sec = Math.floor((Date.now() - startTime) / 1000);
      const topics = Array.from(openedTopics);
      const categories = topics.length;

      // Base score
      let exposureScore = Math.round(
        clicks * 12 + opened * 14 + hoverCount * 4 + sec * 0.16 + categories * 10
      );

      // Cookie penalty
      exposureScore += privacy.cookieScore;

      // VPN reduction
      if (privacy.vpn) exposureScore = Math.round(exposureScore * 0.72);

      // Blocker reduction
      if (privacy.blocker) exposureScore = Math.round(exposureScore * 0.78);

      // Essential-only cookies reduction
      if (privacy.cookiesAccepted === "essential") exposureScore = Math.round(exposureScore * 0.85);

      exposureScore = Math.min(100, Math.max(0, exposureScore));

      const st = loadState();
      st[key] = {
        done: true,
        clicks,
        articlesOpened: opened,
        hoverEvents: hoverCount,
        timeSpentSec: sec,
        categories,
        topics,
        exposureScore,
        privacy: {
          vpn: privacy.vpn,
          blocker: privacy.blocker,
          cookiesAccepted: privacy.cookiesAccepted,
          blockerBlocked: privacy.blockerBlocked,
          cookieScore: privacy.cookieScore,
        },
      };
      saveState(st);
      setDone(pageRound === 1 ? "b1" : "b2", true);
      window.location.href = pageRound === 1 ? "report1.html" : "report2.html";
    });
  }

  // ── Boot sequence ──────────────────────────────────────
  showWifiModal(() => {
    buildBrowserChrome();
    injectR2HintBar();
    injectAdSlots();
    wireCards();
    buildCookieBanner();
    updateTopStats();
  });
}

  // ---------- REPORT ----------
  function clamp(n, a, b) {
    return Math.max(a, Math.min(b, n));
  }

  function exposureLevel(score) {
    if (score >= 70) return { label: "High", tone: "high" };
    if (score >= 40) return { label: "Moderate", tone: "mid" };
    return { label: "Low", tone: "low" };
  }

  function inferredBadgesFromSession(session) {
    // very simple heuristics
    const badges = [];
    const time = session.timeSpentSec || 0;
    const clicks = session.clicks || 0;
    const topics = session.topics || [];
    const categories = session.categories || 0;

    if (time >= 300) badges.push({ title: "Deep reader / engaged user", conf: "High confidence" });
    else if (time >= 120) badges.push({ title: "Skimmer", conf: "Medium confidence" });
    else badges.push({ title: "Quick scanner", conf: "Medium confidence" });

    if (topics.some((t) => /social/i.test(t))) badges.push({ title: "Socially connected user", conf: "High confidence" });
    if (topics.some((t) => /finance/i.test(t))) badges.push({ title: "Financially aware professional", conf: "Medium confidence" });
    if (categories <= 1 && clicks <= 1) badges.push({ title: "Low interaction footprint", conf: "High confidence" });

    // de-dupe by title
    const seen = new Set();
    return badges.filter((b) => (seen.has(b.title) ? false : (seen.add(b.title), true))).slice(0, 2);
  }

  function initReport(round) {
    applyTopbarPaddingFix();

    const root = qs("[data-report]") || document.body;
    const pageRound = Number(root.dataset.round || round || 1);

    if (root.dataset.gtWiredReport === String(pageRound)) return;
    root.dataset.gtWiredReport = String(pageRound);

    renderStepper(pageRound === 1 ? "r1" : "r2");

    const st = loadState();
    const session = st[pageRound === 1 ? "browse1" : "browse2"] || {};

    const score = Number(session.exposureScore || 0);

    function exposureLabel(n) {
      if (n >= 70) return "High Data Exposure";
      if (n >= 40) return "Moderate Data Exposure";
      return "Low Data Exposure";
    }

    function formatTime(sec) {
      const s = Number(sec || 0);
      const mm = String(Math.floor(s / 60));
      const ss = String(s % 60).padStart(2, "0");
      return `${mm}:${ss}`;
    }

    // round label
    const roundLabel = qs("[data-round-label]");
    if (roundLabel) roundLabel.textContent = `ROUND ${pageRound} REPORT`;

    // gauge / score
    const gaugeVal = qs("[data-gauge-value]");
    const gaugeText = qs("[data-gauge-text]");
    if (gaugeVal) gaugeVal.textContent = String(score);
    if (gaugeText) gaugeText.textContent = exposureLabel(score);

    // signals
    const setText = (selector, value) => {
      const el = qs(selector);
      if (el) el.textContent = value;
    };

    setText("[data-s-clicks]", String(session.clicks ?? 0));
    setText("[data-s-articles]", String(session.articlesOpened ?? 0));
    setText("[data-s-time]", formatTime(session.timeSpentSec ?? 0));
    setText("[data-s-cats]", String(session.categories ?? 0));

    // topics
    const topicsWrap = qs("[data-topics]");
    if (topicsWrap) {
      topicsWrap.innerHTML = "";
      const topics = session.topics || [];

      if (!topics.length) {
        const pill = document.createElement("span");
        pill.className = "topicPill muted";
        pill.textContent = "No clear topic signal yet";
        topicsWrap.appendChild(pill);
      } else {
        topics.forEach((topic) => {
          const pill = document.createElement("span");
          pill.className = "topicPill";
          pill.textContent = topic;
          topicsWrap.appendChild(pill);
        });
      }
    }

    // simple inference cards
    const inferWrap = qs("[data-infer]");
    if (inferWrap) {
      inferWrap.innerHTML = "";

      const cards = [];

      if ((session.timeSpentSec || 0) >= 180) {
        cards.push(["Engaged Reader", "High confidence"]);
      } else {
        cards.push(["Quick Scanner", "Medium confidence"]);
      }

      if ((session.categories || 0) <= 1) {
        cards.push(["Low interaction footprint", "High confidence"]);
      } else {
        cards.push(["Broad interest pattern", "Medium confidence"]);
      }

      cards.forEach(([title, conf]) => {
        const card = document.createElement("div");
        card.className = "infer-card";
        card.innerHTML = `
          <div class="infer-ic">◎</div>
          <div>
            <div class="infer-title">${title}</div>
            <div class="infer-pill">${conf}</div>
          </div>
        `;
        inferWrap.appendChild(card);
      });
    }

    // report2 comparison section
    if (pageRound === 2) {
      const b1 = st.browse1 || {};
      const b2 = st.browse2 || {};

      const r1Score = Number(b1.exposureScore || 0);
      const r2Score = Number(b2.exposureScore || 0);
      const delta = r1Score - r2Score;

      setText("[data-r1-score]", `${r1Score}/100`);
      setText("[data-r2-score]", `${r2Score}/100`);
      setText("[data-delta]", `${delta > 0 ? "+" : ""}${delta} points`);

      const summaryEl = qs("[data-compare-summary]");
      if (summaryEl) {
        if (delta > 0) summaryEl.textContent = `You reduced exposure by ${delta} points in Round 2.`;
        else if (delta === 0) summaryEl.textContent = "Same exposure both rounds.";
        else summaryEl.textContent = `Exposure increased by ${Math.abs(delta)} points in Round 2.`;
      }

      const metricMap = {
        "clicks-r1": b1.clicks ?? 0,
        "clicks-r2": b2.clicks ?? 0,
        "articles-r1": b1.articlesOpened ?? 0,
        "articles-r2": b2.articlesOpened ?? 0,
        "time-r1": b1.timeSpentSec ?? 0,
        "time-r2": b2.timeSpentSec ?? 0,
        "hover-r1": b1.hoverEvents ?? 0,
        "hover-r2": b2.hoverEvents ?? 0,
        "cats-r1": b1.categories ?? 0,
        "cats-r2": b2.categories ?? 0,
      };

      qsa("[data-metric]").forEach((el) => {
        const key = el.dataset.metric;
        const value = metricMap[key];

        if (key?.includes("time-")) {
          el.textContent = String(value);
        } else {
          el.textContent = String(value ?? 0);
        }
      });
    }

    setDone(pageRound === 1 ? "r1" : "r2", true);

    const btn = qs("[data-next]");
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href =
          pageRound === 1 ? "report1_explain.html" : "post-quiz.html";
      });
    }
  }

  // ---------- REPORT 1 EXPLAIN ----------
  function initReport1Explain() {
    applyTopbarPaddingFix();

    const __gtRoot = qs(".report-explain-page") || document.body;
    const __gtKey = "gtWiredReportExplain";
    if (__gtRoot.dataset[__gtKey] === "1") return;
    __gtRoot.dataset[__gtKey] = "1";

    renderStepper("r1");

    const btn = qs("[data-next]") || qs("[data-cta]") || qs(".btn.btn-primary") || qs(".btn-primary");
    if (btn) {
      btn.addEventListener("click", () => {
        window.location.href = "browse2_intro.html";
      });
    }
  }

  // ---------- QUIZ COMPARISON (Compare page) ----------
  function initQuizComparison() {
    applyTopbarPaddingFix();

    const __gtRoot = qs(".compare-page") || document.body;
    const __gtKey = "gtWiredCompare";
    if (__gtRoot.dataset[__gtKey] === "1") return;
    __gtRoot.dataset[__gtKey] = "1";

    renderStepper("compare");

    const st = loadState();
    const pre = st.preQuiz || { score: 0, total: QUIZ.length };
    const post = st.postQuiz || { score: 0, total: QUIZ.length };
    const delta = (post.score || 0) - (pre.score || 0);

    const elPre = qs("[data-pre-score]");
    const elPost = qs("[data-post-score]");
    const elDelta = qs("[data-delta]");
    const elDeltaMsg = qs("[data-delta-msg]");

    if (elPre) elPre.textContent = `${pre.score}/${pre.total}`;
    if (elPost) elPost.textContent = `${post.score}/${post.total}`;

    if (elDelta) elDelta.textContent = `${delta >= 0 ? "+" : ""}${delta} questions`;

    if (elDeltaMsg) {
      if (delta > 0) elDeltaMsg.textContent = "Nice — your understanding improved.";
      else if (delta === 0) elDeltaMsg.textContent = "Same score. Awareness is the first step.";
      else elDeltaMsg.textContent = "Don’t worry — awareness takes time to build.";
    }

    // CTA to recommendations
    const btn = qs("[data-next]") || qs("[data-cta]") || qs(".btn.btn-primary") || qs(".btn-primary");
    if (btn) {
      btn.addEventListener("click", () => {
        setDone("compare", true);
        window.location.href = "recommendation.html";
      });
    }
  }

  // ---------- RECOMMENDATION ----------
  function initRecommendations() {
    applyTopbarPaddingFix();

    const __gtRoot = qs(".recommendation-page") || document.body;
    const __gtKey = "gtWiredReco";
    if (__gtRoot.dataset[__gtKey] === "1") return;
    __gtRoot.dataset[__gtKey] = "1";

    renderStepper("compare");

    const btn = qs("[data-next]") || qs("[data-cta]") || qs(".btn.btn-primary") || qs(".btn-primary");
    if (btn) {
      btn.addEventListener("click", () => {
        setDone("compare", true);
        window.location.href = "resources.html";
      });
    }
  }

  // ---------- RESOURCES ----------
  function initResources() {
    applyTopbarPaddingFix();

    const __gtRoot = qs("main") || document.body;
    const __gtKey = "gtWiredResources";
    if (__gtRoot.dataset[__gtKey] === "1") return;
    __gtRoot.dataset[__gtKey] = "1";

    renderStepper("resources");
    setDone("resources", true);

    const btn = qs("[data-start-over]");
    if (btn) {
      btn.addEventListener("click", () => {
        localStorage.removeItem(KEY);
        window.location.href = "index.html";
      });
    }
  }

  // -------------------------------------------------------
  // Auto-init safety net:
  // If a page forgot to call GT.init* in its inline script, this will wire it up once.
  document.addEventListener("DOMContentLoaded", () => {
    try {
      applyTopbarPaddingFix();

      const p = currentPathName();

      if (p === "index.html" || p === "") {
        initIntro();
      } else if (p === "pre-quiz.html") {
        initQuiz("pre");
      } else if (p === "post-quiz.html") {
        initQuiz("post");
      } else if (p === "browse1_intro.html") {
        initMissionScreen("b1", "browse1.html");
      } else if (p === "browse2_intro.html") {
        initMissionScreen("b2", "browse2.html");
      } else if (p === "browse1.html") {
        initBrowse(1);
      } else if (p === "browse2.html") {
        initBrowse(2);
      } else if (p === "report1.html") {
        initReport(1);
      } else if (p === "report2.html") {
        initReport(2);
      } else if (p === "report1_explain.html") {
        renderStepper("r1");
        const btn = qs("[data-next]");
        if (btn) {
          btn.addEventListener("click", () => {
            window.location.href = "browse2_intro.html";
          });
        }
      } else if (p === "quiz_comparison.html") {
        initQuizComparison();
      } else if (p === "recommendation.html") {
        initRecommendations();
      } else if (p === "resources.html") {
        initResources();
      }
    } catch (err) {
      console.warn("[GT] auto-init error:", err);
    }
  });

  // ---------- SESSION LOG ----------
function initSessionLog() {
  const body    = document.getElementById('sr-body');
  const counter = document.getElementById('sr-count');
  const evCount = document.getElementById('sr-ev-count');
  const cx      = document.getElementById('sr-cx');
  const cy      = document.getElementById('sr-cy');

  if (!body) return;

  const startTime = Date.now();
  let eventCount  = 0;
  const lastLog   = { mouse: 0, scroll: 0, hover: 0 };
  const THROTTLE  = { mouse: 5000, scroll: 1200, hover: 5000 };

  function fmtTime(ms) {
    const cs  = Math.floor(ms / 10) % 100;
    const sec = Math.floor(ms / 1000) % 60;
    const min = Math.floor(ms / 60000);
    return [min, sec, cs].map(n => String(n).padStart(2, '0')).join(':');
  }

  function addEntry(type, message) {
    eventCount++;
    const ts  = fmtTime(Date.now() - startTime);
    const row = document.createElement('div');
    row.className = 'sr-row';
    row.innerHTML =
      `<span class="sr-ts">${ts}</span>` +
      `<span class="sr-type sr-type-${type}">(${type})</span>` +
      `<span class="sr-msg">${message}</span>`;
    const cursor = body.querySelector('.sr-cursor-blink');
    body.insertBefore(row, cursor);
    body.scrollTop = body.scrollHeight;
    if (counter) counter.textContent = eventCount + ' event' + (eventCount === 1 ? '' : 's');
    if (evCount) evCount.textContent = eventCount;
  }

  setTimeout(() => addEntry('INIT',  'Session replay initialized...'), 80);
  setTimeout(() => addEntry('LOAD',  'Page fully loaded'), 480);
  setTimeout(() => addEntry('TRACK', 'Mouse tracking enabled'), 820);

  window.addEventListener('mousemove', function(e) {
    if (cx) cx.textContent = Math.round(e.clientX);
    if (cy) cy.textContent = Math.round(e.clientY);
    const now = Date.now();
    if (now - lastLog.mouse >= THROTTLE.mouse) {
      lastLog.mouse = now;
      addEntry('MOUSE', 'cursor at (' + e.clientX + ', ' + e.clientY + ')');
    }
  }, { passive: true });

  window.addEventListener('click', function(e) {
    addEntry('CLICK', 'clicked at (' + e.clientX + ', ' + e.clientY + ')');
  });

  window.addEventListener('scroll', function() {
    const now = Date.now();
    if (now - lastLog.scroll >= THROTTLE.scroll) {
      lastLog.scroll = now;
      addEntry('SCROLL', 'scroll offset ' + Math.round(window.scrollY) + 'px');
    }
  }, { passive: true });

  document.addEventListener('mouseenter', function(e) {
    const tag = e.target?.tagName?.toLowerCase();
    if (!['a','button','input','select','textarea'].includes(tag)) return;
    const now = Date.now();
    if (now - lastLog.hover >= THROTTLE.hover) {
      lastLog.hover = now;
      const label = (e.target.textContent || '').trim().slice(0, 30) || tag;
      addEntry('HOVER', 'hovering "' + label + '"');
    }
  }, true);
}

// ---------- INTRO ----------
function initIntro() {
  applyTopbarPaddingFix();
  renderStepper("intro");
  initSessionLog();

  const btn = qs("[data-begin]");
  if (btn) {
    btn.addEventListener("click", () => {
      setDone("intro", true);
      window.location.href = "pre-quiz.html";
    });
  }
}

  // ---------- expose API ----------
  const GT = {
    renderStepper,
    initIntro,
    initQuiz,
    initQuizV2,
    initBrowse,
    initReport,
    initReport1Explain,
    initQuizComparison,
    initRecommendations,
    initResources,
    initSessionLog,
    loadState,
    saveState,
    setDone,
    applyTopbarPaddingFix,
  };

  window.GT = GT;

  // Backward-compat aliases (some pages still call these)
  window.renderStepper = renderStepper;
  window.initQuiz = (kind) => initQuiz(kind);
  window.initReport = (round = 1) => initReport(Number(round) || 1);
  window.initBrowse = (round = 1) => initBrowse(Number(round) || 1);
})();


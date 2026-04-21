/* assets/app.js */
const KEY = "ghosttrace_v1";

const STEPS = [
  { id: "intro", label: "Intro", href: "index.html" },
  { id: "pre", label: "Pre-Quiz", href: "pre-quiz.html" },
  { id: "b1", label: "Browse 1", href: "browse1_intro.html" },
  { id: "r1", label: "Report 1", href: "report1.html" },
  { id: "b2", label: "Browse 2", href: "browse2_intro.html" },
  { id: "r2", label: "Report 2", href: "report2.html" },
  { id: "post", label: "Post-Quiz", href: "post-quiz.html" },
];

function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      return {
        done: {},
        preQuiz: { answers: Array(8).fill(null), score: 0 },
        postQuiz: { answers: Array(8).fill(null), score: 0 },
        round1: null,
        round2: null,
      };
    }
    return JSON.parse(raw);
  } catch {
    return {
      done: {},
      preQuiz: { answers: Array(8).fill(null), score: 0 },
      postQuiz: { answers: Array(8).fill(null), score: 0 },
      round1: null,
      round2: null,
    };
  }
}
function saveState(s) {
  localStorage.setItem(KEY, JSON.stringify(s));
}
function setDone(stepId, value = true) {
  const s = loadState();
  s.done[stepId] = value;
  saveState(s);
}

function qs(sel, root = document) { return root.querySelector(sel); }
function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }
function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }
function now() { return Date.now(); }

function renderStepper(activeId) {
  const el = qs("[data-stepper]");
  if (!el) return;
  const s = loadState();

  el.innerHTML = STEPS.map((st, idx) => {
    const done = !!s.done[st.id];
    const active = st.id === activeId;

    const cls = ["step", done ? "done" : "", active ? "active" : ""].filter(Boolean).join(" ");
    const dot = done ? "✓" : (idx + 1);
    return `
      <a class="${cls}" href="${st.href}">
        <span class="dot">${dot}</span>
        <span>${st.label}</span>
      </a>
    `;
  }).join("");
}

/* QUIZ (Pre/Post) */

const QUIZ_QUESTIONS = [
  {
    q: "Which of the following actions can websites track even if you don't click anything?",
    options: [
      "Only button clicks",
      "Mouse movements, scroll position, and time spent on page",
      "Nothing unless you submit a form",
      "Only your location"
    ],
    correct: 1
  },
  {
    q: "What can be inferred from how long you stay on a specific article?",
    options: [
      "Your exact age",
      "Your interest level and engagement with that topic",
      "Your credit card number",
      "Nothing meaningful"
    ],
    correct: 1
  },
  {
    q: "What is a tracking pixel?",
    options: [
      "A dead pixel on your monitor",
      "A tiny invisible image that records when you view content",
      "A type of camera",
      "A privacy protection tool"
    ],
    correct: 1
  },
  {
    q: "Which behavior reduces the amount of behavioral data collected about you?",
    options: [
      "Clicking on every interesting article",
      "Hovering over content to read previews",
      "Quickly skimming headlines without lingering",
      "Scrolling to the very bottom of every page"
    ],
    correct: 2
  },
  {
    q: "When does website tracking typically begin?",
    options: [
      "Only after you log in",
      "Only when you make a purchase",
      "As soon as the page starts loading",
      "Only if you accept cookies"
    ],
    correct: 2
  },
  {
    q: "What is browser fingerprinting?",
    options: [
      "A security feature that protects your browser",
      "A technique to identify users by their unique browser/device characteristics",
      "The browser’s password manager",
      "A type of cookie"
    ],
    correct: 1
  },
  {
    q: "How can scroll depth be used to profile users?",
    options: [
      "It can’t reveal anything useful",
      "It shows how engaged you are and which content sections interest you most",
      "It only measures page length",
      "It’s purely for accessibility"
    ],
    correct: 1
  },
  {
    q: "What type of data do advertisers typically use to build interest profiles?",
    options: [
      "Only information you explicitly provide",
      "Browsing history, clicks, hovers, and time spent on different content",
      "Only your name and email",
      "Government records"
    ],
    correct: 1
  }
];

function initQuiz(kind /* "pre" | "post" */) {
  const box = qs("[data-quiz]");
  if (!box) return;

  const state = loadState();
  const slot = kind === "pre" ? "preQuiz" : "postQuiz";

  let index = 0;

  function render() {
    const total = QUIZ_QUESTIONS.length;
    const q = QUIZ_QUESTIONS[index];

    qs("[data-q-index]").textContent = `Question ${index + 1} of ${total}`;
    qs("[data-q-progress]").textContent = `${Math.round(((index + 1) / total) * 100)}% complete`;
    qs("[data-qbar] > div").style.width = `${((index + 1) / total) * 100}%`;
    qs("[data-q-title]").textContent = q.q;

    const selected = state[slot].answers[index];
    const options = q.options.map((txt, i) => {
      const sel = selected === i ? "selected" : "";
      return `
        <div class="option ${sel}" data-opt="${i}">
          <span class="radio"></span>
          <div class="optionText">${txt}</div>
        </div>
      `;
    }).join("");
    qs("[data-q-options]").innerHTML = options;

    qs("[data-prev]").disabled = index === 0;
    const isLast = index === total - 1;
    qs("[data-next]").textContent = isLast ? "Submit Quiz" : "Next →";
  }

  function computeScore() {
    let correct = 0;
    for (let i = 0; i < QUIZ_QUESTIONS.length; i++) {
      if (state[slot].answers[i] === QUIZ_QUESTIONS[i].correct) correct++;
    }
    state[slot].score = correct;
    saveState(state);
    return correct;
  }

  box.addEventListener("click", (e) => {
    const opt = e.target.closest("[data-opt]");
    if (opt) {
      const i = Number(opt.getAttribute("data-opt"));
      state[slot].answers[index] = i;
      saveState(state);
      render();
    }
  });

  qs("[data-prev]").addEventListener("click", () => {
    index = Math.max(0, index - 1);
    render();
  });

  qs("[data-next]").addEventListener("click", () => {
    const isLast = index === QUIZ_QUESTIONS.length - 1;
    if (!isLast) {
      index++;
      render();
      return;
    }
    // submit
    computeScore();
    setDone(kind === "pre" ? "pre" : "post", true);

    // routing
    if (kind === "pre") window.location.href = "browse1_intro.html";
    else window.location.href = "index.html";
  });

  render();
}

/* BROWSE (Round 1 / 2) */
function initBrowse(round /* 1 or 2 */) {
  const root = qs("[data-browse]");
  if (!root) return;

  const state = loadState();
  const slot = round === 1 ? "round1" : "round2";

  const startTs = now();
  let clicks = 0;

  // hover tracking per card
  const hover = {};
  let currentHoverId = null;
  let hoverStart = 0;

  function getScrollPct() {
    const doc = document.documentElement;
    const max = (doc.scrollHeight - doc.clientHeight);
    if (max <= 0) return 0;
    return clamp((doc.scrollTop / max) * 100, 0, 100);
  }

  function setTopbar() {
    qs("[data-round-label]").textContent = `Round ${round}`;
  }

  function tick() {
    const elapsed = (now() - startTs) / 1000;
    qs("[data-elapsed]").textContent = `${elapsed.toFixed(0)}s`;
    qs("[data-scroll]").textContent = `${getScrollPct().toFixed(0)}%`;
    requestAnimationFrame(tick);
  }

  function finalizeAndGoReport() {
    if (currentHoverId) {
      hover[currentHoverId] = (hover[currentHoverId] || 0) + (now() - hoverStart);
    }

    const totalHoverMs = Object.values(hover).reduce((a, b) => a + b, 0);
    const elapsedMs = now() - startTs;
    const scrollPct = getScrollPct();

    state[slot] = {
      startedAt: startTs,
      timeMs: elapsedMs,
      scrollPct,
      clicks,
      hoverMs: totalHoverMs,
      hoverByCard: hover,
    };

    setDone(round === 1 ? "b1" : "b2", true);
    saveState(state);

    window.location.href = round === 1 ? "report1.html" : "report2.html";
  }

  root.addEventListener("click", (e) => {
    const card = e.target.closest("[data-card-id]");
    if (card) {
      clicks++;
      card.classList.add("selected");
    }

    const finish = e.target.closest("[data-finish]");
    if (finish) finalizeAndGoReport();
  });

  qsa("[data-card-id]").forEach((el) => {
    const id = el.getAttribute("data-card-id");
    el.addEventListener("mouseenter", () => {
      currentHoverId = id;
      hoverStart = now();
    });
    el.addEventListener("mouseleave", () => {
      if (currentHoverId !== id) return;
      hover[id] = (hover[id] || 0) + (now() - hoverStart);
      currentHoverId = null;
      hoverStart = 0;
    });
  });

  setTopbar();
  tick();
}

/* REPORT (Round 1 / 2) */
function computeExposure(metrics) {
  const timeS = (metrics?.timeMs || 0) / 1000;
  const scroll = metrics?.scrollPct || 0;
  const hoverS = (metrics?.hoverMs || 0) / 1000;
  const clicks = metrics?.clicks || 0;

  const raw =
    (timeS * 0.9) +
    (hoverS * 1.2) +
    (clicks * 6) +
    (scroll * 0.25);

  const score = clamp(Math.round(raw), 0, 100);
  const level = score < 25 ? "Low" : score < 50 ? "Moderate" : score < 75 ? "High" : "Very High";
  return { score, level };
}

function initReport(round /* 1 or 2 */) {
  const root = qs("[data-report]");
  if (!root) return;

  const state = loadState();
  const slot = round === 1 ? "round1" : "round2";
  const metrics = state[slot];

  const exp = computeExposure(metrics);

  // render
  qs("[data-score]").textContent = `${exp.score}`;
  qs("[data-level]").textContent = `EXPOSURE LEVEL: ${exp.level}`;
  qs("[data-time]").textContent = `${((metrics?.timeMs || 0) / 1000).toFixed(1)}s`;
  qs("[data-scroll]").textContent = `${(metrics?.scrollPct || 0).toFixed(0)}%`;
  qs("[data-clicks]").textContent = `${metrics?.clicks || 0}`;
  qs("[data-hover]").textContent = `${((metrics?.hoverMs || 0) / 1000).toFixed(1)}s`;

  // slider fill
  qs("[data-slider] > div").style.width = `${clamp(exp.score, 0, 100)}%`;
  qs("[data-slider] > div").style.background =
    exp.level === "Low" ? "rgba(48,214,124,.65)"
    : exp.level === "Moderate" ? "rgba(32,243,223,.55)"
    : exp.level === "High" ? "rgba(241,200,75,.55)"
    : "rgba(255,90,90,.55)";

  // persist exposure back to state for compare screen
  metrics.exposure = exp;
  state[slot] = metrics;
  saveState(state);

  // mark report done
  setDone(round === 1 ? "r1" : "r2", true);

  // next button
  qs("[data-next]").addEventListener("click", () => {
    if (round === 1) window.location.href = "browse2_intro.html";
    else window.location.href = "post-quiz.html";
  });

  // back
  qs("[data-back]").addEventListener("click", () => {
    window.location.href = round === 1 ? "browse1.html" : "browse2.html";
  });

  // improvement banner (only for round2 compare)
  if (round === 2) {
    const r1 = state.round1?.exposure?.score ?? null;
    const r2 = state.round2?.exposure?.score ?? null;
    if (r1 != null && r2 != null) {
      const diff = r2 - r1;
      const msgEl = qs("[data-diff-msg]");
      const diffEl = qs("[data-diff]");
      diffEl.textContent = `${diff > 0 ? "+" : ""}${diff}`;
      if (diff < 0) {
        msgEl.textContent = "Nice — your exposure decreased. Your changes had an impact.";
      } else if (diff === 0) {
        msgEl.textContent = "Room for improvement — changing habits takes practice.";
      } else {
        msgEl.textContent = "Your exposure increased — try browsing more mindfully next time.";
      }
    }
  }
}

/* INTRO page helpers */
function initIntro() {
  const btn = qs("[data-start]");
  if (!btn) return;
  btn.addEventListener("click", () => {
    setDone("intro", true);
    window.location.href = "pre-quiz.html";
  });

  const reset = qs("[data-reset]");
  if (reset) {
    reset.addEventListener("click", () => {
      localStorage.removeItem(KEY);
      window.location.reload();
    });
  }
}

/* PAGE BOOTSTRAP */
window.GT = {
  renderStepper,
  initIntro,
  initQuiz,
  initBrowse,
  initReport,
  loadState,
  saveState,
};
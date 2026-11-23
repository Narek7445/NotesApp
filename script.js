/**
 * CYBERQUEST — Դուրս արի թվային լաբիրինթոսից
 * Educational game about cyberbullying & online safety
 */

(function () {
  "use strict";

  // ────────────────────────────────────────────────────────────
  // Default content (Armenian)
  // ────────────────────────────────────────────────────────────
  const DEFAULT_CONFIG = {
    gameTitle: "CYBERQUEST",
    gameSubtitle: "Դուրս արի թվային լաբիրինթոսից",
    victoryMessage: "Դուք հաջողությամբ դուրս եկաք թվային լաբիրինթոսից։ Այժմ դուք գիտեք, թե ինչպես պաշտպանվել կիբերբուլինգից և անվտանգ մնալ առցանց։",
    showScore: true,
    stages: [
      {
        id: 1,
        title: "Ի՞նչ է կիբերբուլինգը",
        category: "Ճանաչում",
        icon: "👁️",
        question: "Ո՞րն է կիբերբուլինգի ամենաճիշտ սահմանումը։",
        options: [
          "Միայն ֆիզիկական բռնություն դպրոցում",
          "Կրկնվող վիրավորական կամ սպառնալից վարք առցանց",
          "Ցանկացած կատակ ընկերների միջև",
          "Միայն անանուն մեկնաբանություններ"
        ],
        correctIndex: 1,
        explanation: "Կիբերբուլինգը կրկնվող, միտումնավոր վիրավորական կամ սպառնալից վարք է, որը տեղի է ունենում թվային միջոցներով (սոցիալական ցանցեր, հաղորդագրություններ, խաղեր)։",
        hint: "Ուշադրություն դարձրեք «կրկնվող» և «առցանց» բառերին։"
      },
      {
        id: 2,
        title: "Անձնական տվյալների պաշտպանություն",
        category: "Գաղտնիություն",
        icon: "🔒",
        question: "Որ տվյալները չպետք է հրապարակեք սոցիալական ցանցերում կամ անծանոթներին։",
        options: [
          "Ձեր սիրելի գույնը և ֆիլմը",
          "Տան հասցեն, հեռախոսահամարը և դպրոցի անունը",
          "Ձեր հոբբիները",
          "Ձեր սիրելի սպորտաձևը"
        ],
        correctIndex: 1,
        explanation: "Անձնական տվյալները (հասցե, հեռախոս, դպրոց, գտնվելու վայր) կարող են օգտագործվել չարամիտ նպատակներով։ Պահպանեք դրանք գաղտնի։",
        hint: "Մտածեք, թե ինչ տեղեկություն կարող է օգտագործվել ձեզ գտնելու կամ վնասելու համար։"
      },
      {
        id: 3,
        title: "Կասկածելի հաղորդագրություններ",
        category: "Անվտանգություն",
        icon: "📩",
        question: "Դուք ստանում եք հաղորդագրություն անծանոթից՝ «Հաղթել եք մրցանակ։ Սեղմեք հղումը և մուտքագրեք տվյալները»։ Ի՞նչ անել։",
        options: [
          "Անմիջապես սեղմել հղումը և մուտքագրել ամեն ինչ",
          "Չսեղմել հղումը, արգելափակել ուղարկողին և տեղեկացնել մեծահասակին",
          "Պատասխանել և հարցնել՝ ի՞նչ մրցանակ է",
          "Փոխանցել ընկերներին, որ նրանք էլ փորձեն"
        ],
        correctIndex: 1,
        explanation: "Սա դասական ֆիշինգ կամ խարդախություն է։ Երբեք մի սեղմեք կասկածելի հղումներ և մի տվեք անձնական տվյալներ անծանոթներին։",
        hint: "Եթե ինչ-որ բան «շատ լավ է թվում», հավանաբար խաբեություն է։"
      },
      {
        id: 4,
        title: "Ինչպես արձագանքել հետապնդմանը",
        category: "Արձագանք",
        icon: "🛡️",
        question: "Ինչ-որ մեկը սկսել է ձեզ վիրավորել և սպառնալ առցանց։ Որն է ամենաանվտանգ առաջին քայլը։",
        options: [
          "Անմիջապես պատասխանել նույն ոճով",
          "Արգելափակել, պահպանել ապացույցները և տեղեկացնել վստահելի մեծահասակին",
          "Ջնջել բոլոր հաշիվները և այլևս չօգտվել ինտերնետից",
          "Անտեսել և հույս ունենալ, որ կանցնի"
        ],
        correctIndex: 1,
        explanation: "Արգելափակումը դադարեցնում է շփումը, ապացույցները կարևոր են, իսկ մեծահասակի օգնությունը կարող է կանխել հետագա վտանգը։",
        hint: "Մի մտեք վեճի մեջ։ Պաշտպանեք ձեզ և խնդրեք օգնություն։"
      },
      {
        id: 5,
        title: "Ինչպես օգնել որպես ականատես",
        category: "Աջակցություն",
        icon: "🤝",
        question: "Դուք տեսնում եք, որ ձեր ընկերոջը վիրավորում են խմբային չաթում։ Ի՞նչ կարող եք անել։",
        options: [
          "Միանալ վիրավորանքներին, որպեսզի չդառնաք հաջորդը",
          "Աջակցել ընկերոջը, արգելափակել ագրեսորին և անհրաժեշտության դեպքում տեղեկացնել մեծահասակին",
          "Պարզապես դիտել և ոչինչ չասել",
          "Հեռացնել ընկերոջը ձեր ընկերների ցուցակից"
        ],
        correctIndex: 1,
        explanation: "Ականատեսի աջակցությունը շատ կարևոր է։ Զոհը պետք է զգա, որ մենակ չէ։ Անվտանգ միջամտությունը կարող է կանգնեցնել կիբերբուլինգը։",
        hint: "Լավ ընկերը չի լռում, երբ տեսնում է անարդարություն։"
      },
      {
        id: 6,
        title: "Գաղտնի բառը",
        category: "Խորություն",
        icon: "🔑",
        question: "Որ բառն է ամենալավ նկարագրում այն սկզբունքը, որ պետք է հետևել առցանց վարքագծին։",
        options: [
          "Անտեսում",
          "Հարգանք",
          "Լռություն",
          "Վրեժ"
        ],
        correctIndex: 1,
        explanation: "Հարգանքը հիմքն է առողջ առցանց շփման։ Եթե չեք ասի ինչ-որ բան դեմ առ դեմ, մի ասեք նաև առցանց։",
        hint: "Մտածեք այն մասին, թե ինչպես եք ցանկանում, որ մյուսները վարվեն ձեզ հետ։"
      },
      {
        id: 7,
        title: "Երեք կանոն",
        category: "Կանոններ",
        icon: "📋",
        question: "Որո՞նք են կիբերանվտանգության երեք կարևոր կանոնները։",
        options: [
          "Կիսվել ամեն ինչով, վստահել բոլորին, չպատմել մեծահասակներին",
          "Պահպանել գաղտնիությունը, մտածել նախքան գրելը, խնդրել օգնություն անհրաժեշտության դեպքում",
          "Օգտագործել նույն գաղտնաբառը ամենուր, սեղմել բոլոր հղումները, չարգելափակել ոչ մեկին",
          "Միայն գիշերները մտնել ինտերնետ, չխոսել ընկերների հետ, ջնջել հաշիվները"
        ],
        correctIndex: 1,
        explanation: "1) Պահպանեք անձնական տվյալները գաղտնի։ 2) Մտածեք նախքան հրապարակելը կամ պատասխանելը։ 3) Երբեք մի վարանեք օգնություն խնդրել վստահելի մեծահասակից։",
        hint: "Ընտրեք այն տարբերակը, որը պաշտպանում է և օգնում է։"
      },
      {
        id: 8,
        title: "Վերջնական մարտահրավեր",
        category: "Եզրափակում",
        icon: "🏆",
        question: "Ի՞նչ պետք է անեք, եթե տեսնեք կամ զգաք կիբերբուլինգ։",
        options: [
          "Լռել և սպասել, որ ինքն իրեն կանցնի",
          "Պահպանել ապացույցները, արգելափակել, տեղեկացնել վստահելի մեծահասակին կամ համապատասխան ծառայությանը",
          "Վրեժ լուծել նույն մեթոդներով",
          "Փոխել դպրոցը անմիջապես"
        ],
        correctIndex: 1,
        explanation: "Ճիշտ գործողությունների հաջորդականությունը՝ ապացույցներ պահել → արգելափակել → օգնություն խնդրել։ Դուք մենակ չեք, և կան մարդիկ ու ծառայություններ, որոնք կարող են օգնել։",
        hint: "Գործեք անվտանգ և խելամտորեն, ոչ թե իմպուլսիվ։"
      }
    ]
  };

  // ────────────────────────────────────────────────────────────
  // State
  // ────────────────────────────────────────────────────────────
  let config = null;
  let currentStageIndex = 0;
  let score = 0;
  let mistakes = 0;
  let completedStages = new Set();
  let answeredCorrectly = false;

  // ────────────────────────────────────────────────────────────
  // DOM refs
  // ────────────────────────────────────────────────────────────
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  const els = {
    gameTitle: $("#game-title"),
    gameSubtitle: $("#game-subtitle"),
    scoreValue: $("#score-value"),
    scoreValueMobile: $("#score-value-mobile"),
    scoreDisplay: $("#score-display"),
    currentStage: $("#current-stage"),
    currentStageMobile: $("#current-stage-mobile"),
    mazeMap: $("#maze-map"),
    visualMaze: $("#visual-maze"),
    progressBar: $("#progress-bar"),
    progressPercent: $("#progress-percent"),
    stageIcon: $("#stage-icon"),
    stageCategory: $("#stage-category"),
    stageTitle: $("#stage-title"),
    questionText: $("#question-text"),
    options: $("#options"),
    feedback: $("#feedback"),
    feedbackIcon: $("#feedback-icon"),
    feedbackText: $("#feedback-text"),
    continueBtn: $("#continue-btn"),
    hintBox: $("#hint-box"),
    hintText: $("#hint-text"),
    victoryOverlay: $("#victory-overlay"),
    victoryMessage: $("#victory-message"),
    finalScore: $("#final-score"),
    finalMistakes: $("#final-mistakes"),
    restartBtn: $("#restart-btn"),
    settingsOverlay: $("#settings-overlay"),
    settingsBody: $("#settings-body"),
    closeSettings: $("#close-settings"),
    saveSettings: $("#save-settings"),
    resetSettings: $("#reset-settings"),
    confirmOverlay: $("#confirm-overlay"),
    cancelReset: $("#cancel-reset"),
    confirmReset: $("#confirm-reset")
  };

  // ────────────────────────────────────────────────────────────
  // Storage
  // ────────────────────────────────────────────────────────────
  const STORAGE_KEY = "cyberquest_config_v1";

  function loadConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Basic validation
        if (parsed && Array.isArray(parsed.stages) && parsed.stages.length === 8) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to load config from localStorage", e);
    }
    return structuredClone(DEFAULT_CONFIG);
  }

  function saveConfig(cfg) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    } catch (e) {
      console.warn("Failed to save config", e);
    }
  }

  // ────────────────────────────────────────────────────────────
  // Safe text rendering (prevent XSS from settings)
  // ────────────────────────────────────────────────────────────
  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function setText(el, text) {
    if (el) el.textContent = text ?? "";
  }

  // ────────────────────────────────────────────────────────────
  // Visual maze (SVG) + stage list
  // ────────────────────────────────────────────────────────────
  function renderVisualMaze() {
    const container = els.visualMaze;
    if (!container) return;

    // Classic square maze style, blue borders, enlarged ~40%
    const cell = 42;
    const cols = 9;
    const rows = 9;
    const pad = 16;
    const W = cols * cell + pad * 2;
    const H = rows * cell + pad * 2;
    const n = config.stages.length;

    // Wall segments in cell units [c1,r1,c2,r2] — classic geometric maze
    const walls = [
      // Outer border
      [0,0,9,0],[0,0,0,9],[9,0,9,9],[0,9,9,9],
      // Internal walls
      [0,1,2,1],[3,0,3,2],[4,1,6,1],[7,0,7,2],[8,1,9,1],
      [1,2,1,4],[2,2,2,3],[4,2,4,4],[5,2,5,3],[6,2,8,2],[8,2,8,4],
      [0,3,1,3],[2,3,3,3],[3,3,3,5],[5,3,6,3],[6,3,6,5],[7,3,7,4],
      [1,4,2,4],[4,4,5,4],[8,4,9,4],
      [0,5,2,5],[2,5,2,7],[4,5,4,6],[5,5,5,7],[7,5,9,5],[7,5,7,7],
      [1,6,1,8],[3,6,4,6],[6,6,6,8],[8,6,8,8],
      [0,7,1,7],[3,7,3,9],[4,7,5,7],[5,7,5,8],[8,7,9,7],
      [2,8,3,8],[4,8,6,8],[7,8,8,8]
    ];

    // True solution path (row, col) — checkpoints for 8 stages + approach to exit
    const solutionCells = [
      [0, 0],
      [0, 2],
      [1, 3],
      [2, 5],
      [3, 6],
      [5, 4],
      [6, 2],
      [7, 4],
      [8, 7]
    ];
    const stageCells = solutionCells.slice(0, 8);

    // Dead ends (false ways)
    const deadEnds = [
      [0, 4], [1, 7], [2, 1], [4, 2], [5, 8], [7, 1], [8, 3]
    ];

    const exitCell = [8, 8];
    const startCell = [0, 0];

    function cx(c) { return pad + c * cell + cell / 2; }
    function cy(r) { return pad + r * cell + cell / 2; }
    function wx(c) { return pad + c * cell; }
    function wy(r) { return pad + r * cell; }

    const wallColor = "#0090e0";
    const wallWidth = 5;

    let svg = `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">`;
    svg += `<defs>
      <filter id="glow"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>`;

    svg += `<rect x="${pad - 2}" y="${pad - 2}" width="${cols * cell + 4}" height="${rows * cell + 4}" rx="6" fill="#f0f7fc"/>`;

    // Walls
    walls.forEach(([c1, r1, c2, r2]) => {
      svg += `<line x1="${wx(c1)}" y1="${wy(r1)}" x2="${wx(c2)}" y2="${wy(r2)}"
        stroke="${wallColor}" stroke-width="${wallWidth}" stroke-linecap="square"/>`;
    });

    // True path highlight
    for (let i = 0; i < solutionCells.length - 1; i++) {
      const [r1, c1] = solutionCells[i];
      const [r2, c2] = solutionCells[i + 1];
      const done = i < completedStages.size;
      const color = done ? "#00c9a7" : "rgba(0,180,255,0.18)";
      const width = done ? 6 : 4;
      svg += `<line x1="${cx(c1)}" y1="${cy(r1)}" x2="${cx(c2)}" y2="${cy(r2)}"
        stroke="${color}" stroke-width="${width}" stroke-linecap="round" opacity="${done ? 0.85 : 0.5}"/>`;
    }

    // Dead-end X marks
    deadEnds.forEach(([r, c]) => {
      const x = cx(c), y = cy(r);
      const s = 5;
      svg += `<g opacity="0.55">
        <line x1="${x - s}" y1="${y - s}" x2="${x + s}" y2="${y + s}" stroke="#e63950" stroke-width="2.2" stroke-linecap="round"/>
        <line x1="${x + s}" y1="${y - s}" x2="${x - s}" y2="${y + s}" stroke="#e63950" stroke-width="2.2" stroke-linecap="round"/>
      </g>`;
    });

    // Start
    {
      const [r, c] = startCell;
      svg += `<circle cx="${cx(c)}" cy="${cy(r)}" r="7" fill="#0090e0" opacity="0.85"/>`;
    }

    // Stage nodes
    stageCells.forEach(([r, c], idx) => {
      let fill = "#d0e8f8";
      let stroke = "rgba(0,144,224,0.35)";
      let radius = 11;
      let extra = "";

      if (completedStages.has(idx)) {
        fill = "#00c9a7";
        stroke = "#00a88a";
      } else if (idx === currentStageIndex) {
        fill = "#00b4ff";
        stroke = "#0090e0";
        radius = 13;
        extra = `filter="url(#glow)"`;
      }

      svg += `<circle cx="${cx(c)}" cy="${cy(r)}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="2.5" ${extra}/>`;

      if (completedStages.has(idx)) {
        svg += `<text x="${cx(c)}" y="${cy(r) + 4}" text-anchor="middle" font-size="11" font-weight="700" fill="#fff" font-family="system-ui">✓</text>`;
      } else {
        svg += `<text x="${cx(c)}" y="${cy(r) + 4}" text-anchor="middle" font-size="10" font-weight="600"
          fill="${idx === currentStageIndex ? "#fff" : "#5a7a9a"}" font-family="system-ui">${idx + 1}</text>`;
      }
    });

    // Exit
    {
      const [r, c] = exitCell;
      const reached = completedStages.size === n;
      svg += `<circle cx="${cx(c)}" cy="${cy(r)}" r="13" fill="${reached ? "#ff6b1a" : "#ffe0c8"}" stroke="#ff6b1a" stroke-width="2.5"/>`;
      svg += `<text x="${cx(c)}" y="${cy(r) + 5}" text-anchor="middle" font-size="13" fill="${reached ? "#fff" : "#ff6b1a"}" font-family="system-ui">⚑</text>`;
    }

    // Pulse on current
    if (currentStageIndex < n) {
      const [r, c] = stageCells[currentStageIndex];
      svg += `<circle cx="${cx(c)}" cy="${cy(r)}" r="18" fill="none" stroke="#00b4ff" stroke-width="1.5" opacity="0.4">
        <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.45;0.12;0.45" dur="2s" repeatCount="indefinite"/>
      </circle>`;
    }

    svg += `</svg>`;
    container.innerHTML = svg;
  }

  function renderMaze() {
    renderVisualMaze();

    const map = els.mazeMap;
    map.innerHTML = "";

    config.stages.forEach((stage, idx) => {
      const node = document.createElement("div");
      node.className = "maze-node";
      node.setAttribute("role", "listitem");
      node.dataset.index = idx;

      let state = "locked";
      if (completedStages.has(idx)) state = "completed";
      else if (idx === currentStageIndex) state = "current";

      node.classList.add(state);

      const icon = document.createElement("div");
      icon.className = "node-icon";
      icon.textContent = state === "completed" ? "✓" : stage.icon;

      const label = document.createElement("div");
      label.className = "node-label";
      label.textContent = stage.title;

      node.appendChild(icon);
      node.appendChild(label);
      map.appendChild(node);
    });

    const progress = (completedStages.size / config.stages.length) * 100;
    els.progressBar.style.width = `${progress}%`;
    setText(els.progressPercent, Math.round(progress));
  }

  // ────────────────────────────────────────────────────────────
  // Stage rendering
  // ────────────────────────────────────────────────────────────
  function renderStage() {
    const stage = config.stages[currentStageIndex];
    if (!stage) return;

    answeredCorrectly = false;
    setText(els.currentStage, currentStageIndex + 1);
    setText(els.currentStageMobile, currentStageIndex + 1);
    setText(els.stageIcon, stage.icon);
    setText(els.stageCategory, stage.category);
    setText(els.stageTitle, stage.title);
    setText(els.questionText, stage.question);

    els.feedback.hidden = true;
    els.hintBox.hidden = true;
    els.feedback.classList.remove("error-state");

    const optionsEl = els.options;
    optionsEl.innerHTML = "";

    const letters = ["Ա", "Բ", "Գ", "Դ"];
    stage.options.forEach((opt, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.dataset.index = i;
      btn.setAttribute("role", "option");

      const letter = document.createElement("span");
      letter.className = "option-letter";
      letter.textContent = letters[i] || String(i + 1);

      const text = document.createElement("span");
      text.textContent = opt;

      btn.appendChild(letter);
      btn.appendChild(text);
      btn.addEventListener("click", () => handleAnswer(i));
      optionsEl.appendChild(btn);
    });

    renderMaze();
    updateScoreDisplay();
  }

  // ────────────────────────────────────────────────────────────
  // Answer handling
  // ────────────────────────────────────────────────────────────
  function handleAnswer(selectedIndex) {
    if (answeredCorrectly) return;

    const stage = config.stages[currentStageIndex];
    const buttons = $$(".option-btn");
    const isCorrect = selectedIndex === stage.correctIndex;

    buttons.forEach((btn) => {
      btn.disabled = true;
      const idx = Number(btn.dataset.index);
      if (idx === selectedIndex) {
        btn.classList.add(isCorrect ? "correct" : "incorrect");
      }
    });

    if (isCorrect) {
      answeredCorrectly = true;
      score += 10;
      completedStages.add(currentStageIndex);
      updateScoreDisplay();
      renderMaze();

      els.feedback.hidden = false;
      els.feedback.classList.remove("error-state");
      setText(els.feedbackIcon, "✅");
      setText(els.feedbackText, stage.explanation);
      setText(els.continueBtn, currentStageIndex === config.stages.length - 1 ? "Ավարտել" : "Հաջորդ փուլ");
      els.hintBox.hidden = true;
    } else {
      mistakes += 1;
      els.feedback.hidden = false;
      els.feedback.classList.add("error-state");
      setText(els.feedbackIcon, "❌");
      setText(els.feedbackText, "Սխալ պատասխան։ Փորձեք կրկին։");
      setText(els.continueBtn, "Փորձել կրկին");
      els.hintBox.hidden = false;
      setText(els.hintText, stage.hint);

      // Re-enable after short delay so user can try again
      setTimeout(() => {
        buttons.forEach((btn) => {
          btn.disabled = false;
          btn.classList.remove("incorrect", "selected");
        });
      }, 900);
    }
  }

  function continueAfterFeedback() {
    if (!answeredCorrectly) {
      // Just hide feedback and let them try again
      els.feedback.hidden = true;
      els.hintBox.hidden = true;
      return;
    }

    if (currentStageIndex >= config.stages.length - 1) {
      showVictory();
    } else {
      currentStageIndex += 1;
      renderStage();
    }
  }

  // ────────────────────────────────────────────────────────────
  // Score & Victory
  // ────────────────────────────────────────────────────────────
  function updateScoreDisplay() {
    setText(els.scoreValue, score);
    setText(els.scoreValueMobile, score);
    setText(els.currentStageMobile, currentStageIndex + 1);
    if (config.showScore === false) {
      if (els.scoreDisplay) els.scoreDisplay.style.display = "none";
      document.querySelectorAll(".stats-header-mobile .stat").forEach((el, i) => {
        if (i === 0) el.style.display = "none";
      });
    } else {
      if (els.scoreDisplay) els.scoreDisplay.style.display = "";
    }
  }

  function showVictory() {
    setText(els.victoryMessage, config.victoryMessage);
    setText(els.finalScore, score);
    setText(els.finalMistakes, mistakes);
    els.victoryOverlay.hidden = false;
  }

  function restartGame() {
    currentStageIndex = 0;
    score = 0;
    mistakes = 0;
    completedStages.clear();
    answeredCorrectly = false;
    els.victoryOverlay.hidden = true;
    renderStage();
  }

  // ────────────────────────────────────────────────────────────
  // Settings UI
  // ────────────────────────────────────────────────────────────
  function openSettings() {
    buildSettingsForm();
    els.settingsOverlay.hidden = false;
  }

  function closeSettings() {
    els.settingsOverlay.hidden = true;
  }

  function buildSettingsForm() {
    const body = els.settingsBody;
    body.innerHTML = "";

    // General
    const general = document.createElement("div");
    general.className = "settings-section";
    general.innerHTML = `
      <h3>Ընդհանուր</h3>
      <div class="form-group">
        <label for="set-title">Խաղի վերնագիր</label>
        <input type="text" id="set-title" value="${escapeHtml(config.gameTitle)}" />
      </div>
      <div class="form-group">
        <label for="set-subtitle">Ենթավերնագիր</label>
        <input type="text" id="set-subtitle" value="${escapeHtml(config.gameSubtitle)}" />
      </div>
      <div class="form-group">
        <label for="set-victory">Հաղթանակի հաղորդագրություն</label>
        <textarea id="set-victory">${escapeHtml(config.victoryMessage)}</textarea>
      </div>
      <div class="checkbox-row">
        <input type="checkbox" id="set-show-score" ${config.showScore !== false ? "checked" : ""} />
        <label for="set-show-score">Ցուցադրել միավորները</label>
      </div>
    `;
    body.appendChild(general);

    // Stages
    const stagesSec = document.createElement("div");
    stagesSec.className = "settings-section";
    stagesSec.innerHTML = "<h3>Փուլեր</h3>";

    config.stages.forEach((stage, idx) => {
      const box = document.createElement("div");
      box.className = "stage-settings";
      box.dataset.stage = idx;

      const optionsHtml = stage.options
        .map(
          (o, i) => `
        <div class="form-group">
          <label>Տարբերակ ${i + 1}</label>
          <input type="text" class="set-option" data-opt="${i}" value="${escapeHtml(o)}" />
        </div>`
        )
        .join("");

      box.innerHTML = `
        <h4>Փուլ ${idx + 1}</h4>
        <div class="form-group">
          <label>Վերնագիր</label>
          <input type="text" class="set-stage-title" value="${escapeHtml(stage.title)}" />
        </div>
        <div class="form-group">
          <label>Կատեգորիա</label>
          <input type="text" class="set-stage-category" value="${escapeHtml(stage.category)}" />
        </div>
        <div class="form-group">
          <label>Պատկերակ (emoji)</label>
          <input type="text" class="set-stage-icon" value="${escapeHtml(stage.icon)}" maxlength="4" />
        </div>
        <div class="form-group">
          <label>Հարց</label>
          <textarea class="set-stage-question">${escapeHtml(stage.question)}</textarea>
        </div>
        ${optionsHtml}
        <div class="form-group">
          <label>Ճիշտ պատասխանի համար (0–3)</label>
          <input type="number" class="set-correct" min="0" max="3" value="${stage.correctIndex}" />
        </div>
        <div class="form-group">
          <label>Բացատրություն (ճիշտից հետո)</label>
          <textarea class="set-explanation">${escapeHtml(stage.explanation)}</textarea>
        </div>
        <div class="form-group">
          <label>Հուշում (սխալից հետո)</label>
          <textarea class="set-hint">${escapeHtml(stage.hint)}</textarea>
        </div>
      `;
      stagesSec.appendChild(box);
    });

    body.appendChild(stagesSec);
  }

  function collectSettingsFromForm() {
    const newConfig = {
      gameTitle: $("#set-title").value.trim() || DEFAULT_CONFIG.gameTitle,
      gameSubtitle: $("#set-subtitle").value.trim() || DEFAULT_CONFIG.gameSubtitle,
      victoryMessage: $("#set-victory").value.trim() || DEFAULT_CONFIG.victoryMessage,
      showScore: $("#set-show-score").checked,
      stages: []
    };

    $$(".stage-settings").forEach((box, idx) => {
      const options = [];
      box.querySelectorAll(".set-option").forEach((inp) => {
        options.push(inp.value.trim() || `Տարբերակ ${options.length + 1}`);
      });
      while (options.length < 4) options.push(`Տարբերակ ${options.length + 1}`);

      let correct = parseInt(box.querySelector(".set-correct").value, 10);
      if (isNaN(correct) || correct < 0 || correct > 3) correct = 0;

      newConfig.stages.push({
        id: idx + 1,
        title: box.querySelector(".set-stage-title").value.trim() || `Փուլ ${idx + 1}`,
        category: box.querySelector(".set-stage-category").value.trim() || "Կատեգորիա",
        icon: box.querySelector(".set-stage-icon").value.trim() || "❓",
        question: box.querySelector(".set-stage-question").value.trim() || "Հարց",
        options,
        correctIndex: correct,
        explanation: box.querySelector(".set-explanation").value.trim() || "",
        hint: box.querySelector(".set-hint").value.trim() || ""
      });
    });

    return newConfig;
  }

  function applySettings(newConfig) {
    config = newConfig;
    saveConfig(config);
    setText(els.gameTitle, config.gameTitle);
    setText(els.gameSubtitle, config.gameSubtitle);
    // Keep current progress if possible
    if (currentStageIndex >= config.stages.length) {
      currentStageIndex = 0;
      completedStages.clear();
    }
    renderStage();
    closeSettings();
  }

  // ────────────────────────────────────────────────────────────
  // Event listeners
  // ────────────────────────────────────────────────────────────
  function bindEvents() {
    els.continueBtn.addEventListener("click", continueAfterFeedback);
    els.restartBtn.addEventListener("click", restartGame);
    els.closeSettings.addEventListener("click", closeSettings);
    els.saveSettings.addEventListener("click", () => {
      const newCfg = collectSettingsFromForm();
      applySettings(newCfg);
    });
    els.resetSettings.addEventListener("click", () => {
      els.confirmOverlay.hidden = false;
    });
    els.cancelReset.addEventListener("click", () => {
      els.confirmOverlay.hidden = true;
    });
    els.confirmReset.addEventListener("click", () => {
      els.confirmOverlay.hidden = true;
      config = structuredClone(DEFAULT_CONFIG);
      saveConfig(config);
      setText(els.gameTitle, config.gameTitle);
      setText(els.gameSubtitle, config.gameSubtitle);
      restartGame();
      closeSettings();
    });

    // Close overlays on backdrop click
    els.settingsOverlay.addEventListener("click", (e) => {
      if (e.target === els.settingsOverlay) closeSettings();
    });
    els.confirmOverlay.addEventListener("click", (e) => {
      if (e.target === els.confirmOverlay) els.confirmOverlay.hidden = true;
    });

    // Keyboard: Numpad 9 opens settings
    document.addEventListener("keydown", (e) => {
      if (e.code === "Numpad9" || (e.key === "9" && e.location === 3)) {
        e.preventDefault();
        if (els.settingsOverlay.hidden) openSettings();
        else closeSettings();
      }
      if (e.key === "Escape") {
        if (!els.confirmOverlay.hidden) {
          els.confirmOverlay.hidden = true;
        } else if (!els.settingsOverlay.hidden) {
          closeSettings();
        }
      }
    });
  }

  // ────────────────────────────────────────────────────────────
  // Init
  // ────────────────────────────────────────────────────────────
  function init() {
    config = loadConfig();
    setText(els.gameTitle, config.gameTitle);
    setText(els.gameSubtitle, config.gameSubtitle);
    bindEvents();
    renderStage();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

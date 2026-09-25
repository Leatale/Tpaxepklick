// ===== Персонажи =====
const BODIES = [
  "Kreo♀️", "Power♂️", "Denisochka♂️", "Hingers♂️", "Melancholic♀️",
  "Grenka♀️", "Lapa♂️", "Naeni♀️", "Arwexs♀️", "Sekc typoy♂️",
  "Xevo♂️", "Vitalik♂️", "Nelon♀️", "Dead♂️", "Des♂️",
  "Zmey♀️", "Katyasol♀️", "Daud♂️", "Oksy♀️", "Glavstroy♂️",
  "Hise♀️", "Kera♀️", "False♂️", "Alexander♂️", "Felix♂️",
  "Splean♂️", "Nishy777♀️", "Model♂️", "Abonent♂️", "Nexo4ka♀️",
  "Philip♂️", "Yaponec♂️", "Spirtov♂️", "Monacha♀️", "Wexe♂️"
];

const CLICK_GAIN = 130;
const STORAGE_KEY = "tpaxepklick_save_v1";

// ===== Состояние =====
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // валидация: убеждаемся, что все персонажи есть в объекте
      const amounts = parsed.amounts || {};
      BODIES.forEach(b => {
        if (typeof amounts[b] !== "number") amounts[b] = 0;
      });
      const current = BODIES.includes(parsed.current) ? parsed.current : BODIES[0];
      return { amounts, current };
    }
  } catch (e) {
    console.warn("Не удалось загрузить сохранение:", e);
  }
  // дефолт
  const amounts = {};
  BODIES.forEach(b => amounts[b] = 0);
  return { amounts, current: BODIES[0] };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn("Не удалось сохранить:", e);
  }
}

// ===== DOM =====
const currentBodyEl   = document.getElementById("currentBody");
const currentAmountEl = document.getElementById("currentAmount");
const barFill         = document.getElementById("barFill");
const mainBtn         = document.getElementById("mainBtn");
const bodyList        = document.getElementById("bodyList");
const statsList       = document.getElementById("statsList");

// «Мягкий» максимум шкалы — просто для визуальной ширины бара.
// Реальные значения не ограничены.
function getBarPercent(value) {
  const SOFT_MAX = 5000;
  const pct = Math.min(100, (value / SOFT_MAX) * 100);
  return pct;
}

// ===== Отрисовка =====
function renderCurrent() {
  currentBodyEl.textContent = state.current;
  const amount = state.amounts[state.current] || 0;
  currentAmountEl.textContent = amount;
  barFill.style.width = getBarPercent(amount) + "%";
}

function renderBodies() {
  bodyList.innerHTML = "";
  BODIES.forEach(name => {
    const btn = document.createElement("button");
    btn.className = "body-btn" + (name === state.current ? " selected" : "");
    btn.textContent = name;
    btn.addEventListener("click", () => {
      state.current = name;
      saveState();
      renderCurrent();
      renderBodies();
    });
    bodyList.appendChild(btn);
  });
}

function renderStats() {
  statsList.innerHTML = "";

  // сортируем по убыванию влитого
  const sorted = [...BODIES].sort(
    (a, b) => (state.amounts[b] || 0) - (state.amounts[a] || 0)
  );

  let total = 0;
  sorted.forEach(name => {
    const value = state.amounts[name] || 0;
    total += value;

    const row = document.createElement("div");
    row.className = "stat-row";

    const nameEl = document.createElement("span");
    nameEl.className = "stat-name";
    nameEl.textContent = name;

    const valEl = document.createElement("span");
    valEl.className = "stat-value";
    valEl.textContent = value;

    row.appendChild(nameEl);
    row.appendChild(valEl);
    statsList.appendChild(row);
  });

  const totalEl = document.createElement("div");
  totalEl.className = "stat-total";
  totalEl.textContent = `Всего: ${total} 🥛`;
  statsList.appendChild(totalEl);
}

// ===== Клик =====
mainBtn.addEventListener("click", () => {
  state.amounts[state.current] = (state.amounts[state.current] || 0) + CLICK_GAIN;
  saveState();
  renderCurrent();
  renderStats();
});

// ===== Табы =====
document.querySelectorAll(".tab").forEach(tab => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(tab.dataset.tab).classList.add("active");
    if (tab.dataset.tab === "stats") renderStats();
  });
});

// ===== Инициализация =====
renderCurrent();
renderBodies();
renderStats();

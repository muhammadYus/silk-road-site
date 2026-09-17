// ---------- Звёздное небо на canvas ----------
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeStars() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.floor((canvas.offsetWidth * canvas.offsetHeight) / 3500);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.offsetWidth,
    y: Math.random() * canvas.offsetHeight * 0.8,
    r: Math.random() * 1.3 + 0.2,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.02 + 0.005,
  }));
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
  for (const s of stars) {
    s.phase += s.speed;
    ctx.globalAlpha = 0.35 + Math.sin(s.phase) * 0.35 + 0.3;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = "#fff8e6";
    ctx.fill();
  }
  requestAnimationFrame(drawStars);
}

resizeStars();
drawStars();
window.addEventListener("resize", resizeStars);

// ---------- Навигация: фон при прокрутке и бургер ----------
const nav = document.getElementById("nav");
const links = document.querySelector(".nav-links");
window.addEventListener("scroll", () => nav.classList.toggle("scrolled", window.scrollY > 40));
document.getElementById("burger").addEventListener("click", () => links.classList.toggle("open"));
links.addEventListener("click", (e) => e.target.tagName === "A" && links.classList.remove("open"));

// ---------- Появление блоков и счётчики ----------
function countUp(el) {
  const target = Number(el.dataset.count);
  const start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / 1600, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString("ru-RU");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    const counter = entry.target.querySelector("[data-count]");
    if (counter) countUp(counter);
    observer.unobserve(entry.target);
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
  observer.observe(el);
});

// ---------- Сезоны ----------
const seasons = {
  spring: { temp: "+22°", months: "апрель — май", title: "Лучшее время", comfort: 95,
    text: "Цветут сады, днём тепло, вечером свежо. Навруз в конце марта — праздник по всей стране." },
  summer: { temp: "+38°", months: "июнь — август", title: "Жарко, но пусто", comfort: 45,
    text: "Туристов меньше, цены ниже. Гулять — рано утром и после заката, днём — в тени медресе." },
  autumn: { temp: "+24°", months: "сентябрь — октябрь", title: "Сезон дынь и винограда", comfort: 90,
    text: "Мягкое солнце, базары ломятся от урожая. Идеально для длинного маршрута до Хивы." },
  winter: { temp: "+5°", months: "декабрь — февраль", title: "Тихо и атмосферно", comfort: 55,
    text: "Иногда снег на бирюзовых куполах. Отличные фото без толп, но короткий световой день." },
};

const panel = document.getElementById("season-panel");
function showSeason(key) {
  const s = seasons[key];
  panel.innerHTML = `
    <div class="season-temp">${s.temp}<small>${s.months}</small></div>
    <div>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
      <div class="meter"><i style="width:0"></i></div>
      <p style="margin:8px 0 0;font-size:13px">Комфорт для прогулок: ${s.comfort}%</p>
    </div>`;
  panel.classList.remove("fade");
  void panel.offsetWidth;
  panel.classList.add("fade");
  requestAnimationFrame(() => (panel.querySelector(".meter i").style.width = s.comfort + "%"));
}

document.querySelectorAll(".tab").forEach((tab) =>
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    showSeason(tab.dataset.season);
  })
);
showSeason("spring");

// ---------- Планировщик ----------
const form = document.getElementById("plan-form");
function updatePlan() {
  const checked = [...form.querySelectorAll("input:checked")];
  const days = checked.reduce((sum, c) => sum + Number(c.value), 0);
  document.getElementById("plan-days").textContent = days;
  document.getElementById("plan-route").textContent =
    checked.length ? checked.map((c) => c.dataset.name).join(" → ") : "Выберите хотя бы один город";
}
form.addEventListener("change", updatePlan);
updatePlan();

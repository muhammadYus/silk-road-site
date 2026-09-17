// ================= Утилиты =================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const PAGE = document.body.dataset.page;
const REPO_URL = "https://github.com/muhammadYus/silk-road-site";

const PHOTO = Object.fromEntries(PHOTOS.map((p) => [p.id, p]));
const CITY = Object.fromEntries(CITIES.map((c) => [c.id, c]));
const PLACE = Object.fromEntries(PLACES.map((p) => [p.id, p]));
const TOUR = Object.fromEntries(TOURS.map((t) => [t.id, t]));

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
const plural = (n, one, few, many) => {
  const m10 = n % 10, m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};
const daysWord = (n) => `${n} ${plural(n, "день", "дня", "дней")}`;
const params = new URLSearchParams(location.search);

// localStorage может быть недоступен (приватный режим) — сайт работает и без него
const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* без сохранения */ }
  },
};

function haversine(a, b) {
  const R = 6371, rad = (x) => (x * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const mapSrc = (lat, lon, z = 16) => `https://maps.google.com/maps?q=${lat},${lon}&z=${z}&hl=ru&output=embed`;
const gmapsSearch = (p) => `https://www.google.com/maps/search/?api=1&query=${p.lat},${p.lon}`;
const gmapsRoute = (p) => `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lon}`;

const ICON = {
  heart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-10-9.3C.4 8.4 2.4 4 6.5 4c2.2 0 3.7 1.2 4.5 2.4h2C13.8 5.2 15.3 4 17.5 4 21.6 4 23.6 8.4 22 11.7 19.5 16.4 12 21 12 21z"/></svg>',
  heartO: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 20s-7-4.3-9.3-8.7C1.3 8.3 3.1 5 6.5 5c2 0 3.4 1.1 4.2 2.3h2.6C14.1 6.1 15.5 5 17.5 5c3.4 0 5.2 3.3 3.8 6.3C19 15.7 12 20 12 20z"/></svg>',
  sun: '<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  moon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  arrow: "→",
};

// ================= Тосты =================
function toast(text, icon = "✓") {
  let box = $(".toasts");
  if (!box) { box = document.createElement("div"); box.className = "toasts"; box.setAttribute("aria-live", "polite"); document.body.append(box); }
  const t = document.createElement("div");
  t.className = "toast";
  t.innerHTML = `<span>${icon}</span><span>${esc(text)}</span>`;
  box.append(t);
  setTimeout(() => { t.classList.add("out"); t.addEventListener("animationend", () => t.remove()); }, 2600);
}

// ================= Шапка и подвал =================
function renderLayout() {
  const onDark = !["map", "404"].includes(PAGE);
  const cityLinks = CITIES.map((c) =>
    `<a href="${c.id}.html"><img src="img/${c.hero}.jpg" alt="" loading="lazy">${c.name}</a>`).join("");
  const link = (href, page, text) => `<a href="${href}" class="${PAGE === page ? "active" : ""}">${text}</a>`;

  document.body.insertAdjacentHTML("afterbegin", `
    <div class="progress" id="progress"></div>
    <header class="header ${onDark ? "on-dark" : "solid"}" id="header">
      <a class="logo" href="index.html"><span class="logo-mark">◈</span> Шёлковый путь</a>
      <nav class="nav" id="nav" aria-label="Основное меню">
        ${link("index.html", "home", "Главная")}
        <div class="dropdown ${PAGE === "city" ? "active" : ""}">
          <button type="button" aria-haspopup="true">Города ▾</button>
          <div class="dropdown-menu">${cityLinks}</div>
        </div>
        ${link("tours.html", "tours", "Маршруты")}
        ${link("map.html", "map", "Карта")}
        ${link("gallery.html", "gallery", "Галерея")}
        ${link("planner.html", "planner", "Планировщик")}
        ${link("contacts.html", "contacts", "Контакты")}
      </nav>
      <div class="header-actions">
        <a class="btn-icon" href="planner.html#favorites" aria-label="Избранное" title="Избранное">${ICON.heartO}<span class="badge" id="fav-count"></span></a>
        <button class="btn-icon" id="theme-toggle" type="button" aria-label="Сменить тему" title="Сменить тему"></button>
        <button class="btn-icon burger" id="burger" type="button" aria-label="Меню" aria-expanded="false">☰</button>
      </div>
    </header>`);

  document.body.insertAdjacentHTML("beforeend", `
    <footer class="footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <a class="logo" href="index.html"><span class="logo-mark">◈</span> Шёлковый путь</a>
            <p class="muted" style="max-width:320px;font-size:15px">Путеводитель по Узбекистану: города, маршруты, карта и планировщик поездки.</p>
          </div>
          <div><h4>Города</h4><ul>${CITIES.map((c) => `<li><a href="${c.id}.html">${c.name}</a></li>`).join("")}</ul></div>
          <div><h4>Разделы</h4><ul>
            <li><a href="tours.html">Маршруты</a></li><li><a href="map.html">Карта</a></li>
            <li><a href="gallery.html">Галерея</a></li><li><a href="planner.html">Планировщик</a></li><li><a href="contacts.html">Контакты</a></li>
          </ul></div>
          <div><h4>Проект</h4><ul>
            <li><a href="${REPO_URL}" target="_blank" rel="noopener">Код на GitHub ↗</a></li>
            <li><a href="gallery.html#credits">Авторы фотографий</a></li>
            <li><a href="contacts.html#faq">Вопросы и ответы</a></li>
          </ul></div>
        </div>
        <div class="footer-bottom">
          <span>Учебный проект, 2026. Цены туров — демонстрационные.</span>
          <span>Фото: <a href="gallery.html#credits">Wikimedia Commons</a>, свободные лицензии</span>
        </div>
      </div>
    </footer>
    <button class="btn-icon to-top" id="to-top" type="button" aria-label="Наверх">↑</button>`);

  // Тема
  const themeBtn = $("#theme-toggle");
  const paintTheme = () => {
    const light = document.documentElement.dataset.theme === "light";
    themeBtn.innerHTML = light ? ICON.moon : ICON.sun;
  };
  paintTheme();
  themeBtn.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    store.set("sr.theme", next);
    paintTheme();
    toast(next === "light" ? "Светлая тема" : "Тёмная тема", next === "light" ? "☀" : "☾");
  });

  // Мобильное меню
  const nav = $("#nav"), burger = $("#burger");
  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    burger.textContent = open ? "✕" : "☰";
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  $(".dropdown > button").addEventListener("click", (e) => e.currentTarget.parentElement.classList.toggle("open"));

  // Прокрутка: шапка, прогресс, кнопка наверх
  const header = $("#header"), progress = $("#progress"), toTop = $("#to-top");
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    header.classList.toggle("scrolled", y > 30);
    progress.style.width = max > 0 ? `${(y / max) * 100}%` : "0";
    toTop.classList.toggle("show", y > 700);
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

  updateFavBadge(false);
}

// ================= Анимации =================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    $$("[data-count]", entry.target).concat(entry.target.matches("[data-count]") ? [entry.target] : []).forEach(countUp);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

function observeReveal(root = document) {
  $$(".reveal:not(.visible)", root).forEach((el, i) => {
    if (!el.style.transitionDelay) el.style.transitionDelay = `${(i % 4) * 80}ms`;
    revealObserver.observe(el);
  });
}

function countUp(el) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = Number(el.dataset.count), start = performance.now();
  const step = (now) => {
    const p = Math.min((now - start) / 1600, 1);
    const v = Math.round(target * (1 - (1 - p) ** 3)); el.textContent = el.dataset.plain !== undefined ? v : v.toLocaleString("ru-RU");
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

// Плавный уход со страницы при переходе по внутренней ссылке
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[href]");
  if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin || !url.pathname.endsWith(".html") && !url.pathname.endsWith("/")) return;
  if (url.pathname === location.pathname && url.search === location.search) return; // якорь на этой же странице
  e.preventDefault();
  document.body.classList.add("leaving");
  setTimeout(() => (location.href = a.href), 240);
});
addEventListener("pageshow", (e) => e.persisted && document.body.classList.remove("leaving"));

// Волна на кнопках
document.addEventListener("pointerdown", (e) => {
  const btn = e.target.closest(".btn");
  if (!btn) return;
  const r = btn.getBoundingClientRect(), size = Math.max(r.width, r.height);
  const span = document.createElement("span");
  span.className = "ripple";
  Object.assign(span.style, { width: `${size}px`, height: `${size}px`, left: `${e.clientX - r.left - size / 2}px`, top: `${e.clientY - r.top - size / 2}px` });
  btn.append(span);
  setTimeout(() => span.remove(), 600);
});

// Параллакс фона в шапке страницы
const heroBg = $(".page-hero-bg");
if (heroBg) addEventListener("scroll", () => { if (scrollY < innerHeight) heroBg.style.transform = `translateY(${scrollY * 0.25}px)`; }, { passive: true });

// ================= Избранное =================
const getFavs = () => store.get("sr.favs", []).filter((id) => PLACE[id]);

function updateFavBadge(bump = true) {
  const badge = $("#fav-count");
  if (!badge) return;
  const n = getFavs().length;
  badge.textContent = n || "";
  if (bump) { badge.classList.remove("bump"); void badge.offsetWidth; badge.classList.add("bump"); }
}

function paintFavButtons() {
  const favs = getFavs();
  $$("[data-fav]").forEach((b) => {
    const on = favs.includes(b.dataset.fav);
    b.classList.toggle("active", on);
    b.innerHTML = on ? ICON.heart : ICON.heartO;
    b.setAttribute("aria-pressed", on);
    b.title = on ? "Убрать из избранного" : "В избранное";
  });
}

function toggleFav(id) {
  let favs = getFavs();
  const on = !favs.includes(id);
  favs = on ? [...favs, id] : favs.filter((x) => x !== id);
  store.set("sr.favs", favs);
  paintFavButtons();
  updateFavBadge();
  toast(on ? `«${PLACE[id].name}» в избранном` : `«${PLACE[id].name}» убрано из избранного`, on ? "♥" : "♡");
  document.dispatchEvent(new CustomEvent("favs-changed"));
}

document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-fav]");
  if (!b) return;
  e.preventDefault();
  b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
  toggleFav(b.dataset.fav);
});

// ================= Лайтбокс =================
const lightbox = (() => {
  let list = [], index = 0, box;
  function build() {
    box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = `
      <div class="lb-stage">
        <span class="lb-count"></span>
        <img alt="">
        <button class="lb-btn lb-prev" type="button" aria-label="Предыдущее фото">‹</button>
        <button class="lb-btn lb-next" type="button" aria-label="Следующее фото">›</button>
        <button class="lb-btn lb-close" type="button" aria-label="Закрыть">✕</button>
      </div>
      <div class="lb-caption"></div>`;
    document.body.append(box);
    $(".lb-prev", box).onclick = () => go(-1);
    $(".lb-next", box).onclick = () => go(1);
    $(".lb-close", box).onclick = close;
    box.addEventListener("click", (e) => { if (e.target.classList.contains("lb-stage")) close(); });
    let x0 = null;
    box.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
    box.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      x0 = null;
    });
    document.addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    });
  }
  function show(animate) {
    const p = PHOTO[list[index]], img = $("img", box);
    const apply = () => {
      img.src = p.src; img.alt = p.caption;
      img.onload = () => img.classList.remove("switching");
      $(".lb-count", box).textContent = `${index + 1} / ${list.length}`;
      const lic = p.licenseUrl ? `<a href="${p.licenseUrl}" target="_blank" rel="noopener">${esc(p.license)}</a>` : esc(p.license);
      $(".lb-caption", box).innerHTML = `${esc(p.caption)}<small>Фото: ${esc(p.author)} · ${lic} · <a href="${p.source}" target="_blank" rel="noopener">источник</a></small>`;
    };
    if (animate) { img.classList.add("switching"); setTimeout(apply, 180); } else apply();
    const single = list.length < 2;
    $(".lb-prev", box).hidden = single; $(".lb-next", box).hidden = single;
  }
  function go(d) { index = (index + d + list.length) % list.length; show(true); }
  function open(ids, start = 0) {
    if (!box) build();
    list = ids; index = Math.max(0, start);
    show(false);
    box.classList.add("open");
    document.body.style.overflow = "hidden";
    $(".lb-close", box).focus();
  }
  function close() { box.classList.remove("open"); document.body.style.overflow = ""; }
  return { open };
})();

// Любой элемент с data-photo открывает лайтбокс внутри своей группы data-group
document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-photo]");
  if (!el) return;
  const group = el.dataset.group;
  const items = group ? $$(`[data-photo][data-group="${group}"]`).filter((x) => !x.closest(".hide")) : [el];
  const ids = items.map((x) => x.dataset.photo);
  lightbox.open(ids, items.indexOf(el));
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.matches("[data-photo]")) e.target.click();
});

// ================= Общие шаблоны =================
function placeCard(p, group = "places") {
  const city = CITY[p.city];
  return `
    <article class="place-card reveal">
      <div class="place-photo" data-photo="${p.photo}" data-group="${group}" tabindex="0" role="button" aria-label="Открыть фото: ${esc(p.name)}">
        <img src="img/${p.photo}.jpg" alt="${esc(p.name)}" loading="lazy">
        <span class="place-type">${esc(p.type)} · ${city.name}</span>
      </div>
      <div class="place-body">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.text)}</p>
        <div class="place-actions">
          <a class="btn btn-small btn-ghost" href="map.html?place=${p.id}">${ICON.pin} На карте</a>
          <button class="btn-icon fav-btn" type="button" data-fav="${p.id}"></button>
        </div>
      </div>
    </article>`;
}

function accordion(items, openFirst = false) {
  return `<div class="accordion">${items.map(([q, a], i) => `
    <div class="acc-item ${openFirst && i === 0 ? "open" : ""}">
      <button class="acc-head" type="button" aria-expanded="${openFirst && i === 0}">${esc(q)}<span class="plus">+</span></button>
      <div class="acc-body" ${openFirst && i === 0 ? 'style="height:auto"' : ""}><div>${a}</div></div>
    </div>`).join("")}</div>`;
}

function toggleAcc(item, force) {
  const body = $(".acc-body", item);
  const open = force ?? !item.classList.contains("open");
  if (open === item.classList.contains("open")) return;
  body.style.height = `${body.scrollHeight}px`;
  if (!open) { void body.offsetHeight; body.style.height = "0"; }
  item.classList.toggle("open", open);
  $(".acc-head", item).setAttribute("aria-expanded", open);
  if (open) body.addEventListener("transitionend", () => { if (item.classList.contains("open")) body.style.height = "auto"; }, { once: true });
}
document.addEventListener("click", (e) => {
  const head = e.target.closest(".acc-head");
  if (head) toggleAcc(head.closest(".acc-item"));
});

function pageHero({ photo, eyebrow, title, lead, crumbs = [], chips = [], actions = "", short = false }) {
  return `
    <section class="page-hero ${short ? "short" : ""}">
      <div class="page-hero-bg" style="background-image:url('img/${photo}.jpg')"></div>
      <div class="container" style="width:100%">
        <div class="breadcrumbs reveal"><a href="index.html">Главная</a>${crumbs.map((c) => ` / ${c}`).join("")}</div>
        ${eyebrow ? `<p class="eyebrow reveal">${eyebrow}</p>` : ""}
        <h1 class="reveal">${title}</h1>
        ${lead ? `<p class="lead reveal">${lead}</p>` : ""}
        ${chips.length ? `<div class="chips reveal">${chips.map((c) => `<span class="chip">${c}</span>`).join("")}</div>` : ""}
        ${actions ? `<div class="hero-cta reveal" style="justify-content:flex-start;margin-top:26px">${actions}</div>` : ""}
      </div>
    </section>`;
}

// ================= Планировщик: общее состояние =================
const defaultPlan = () => ({ stops: CITIES.map((c) => ({ city: c.id, days: c.days, on: c.id !== "khiva" })), level: "comfort" });
function getPlan() {
  const p = store.get("sr.plan", null);
  if (!p || !Array.isArray(p.stops)) return defaultPlan();
  const known = p.stops.filter((s) => CITY[s.city]);
  CITIES.forEach((c) => { if (!known.some((s) => s.city === c.id)) known.push({ city: c.id, days: c.days, on: false }); });
  return { stops: known, level: p.level || "comfort" };
}
const savePlan = (p) => store.set("sr.plan", p);

function addCityToPlan(cityId) {
  const plan = getPlan();
  const stop = plan.stops.find((s) => s.city === cityId);
  const wasOn = stop.on;
  stop.on = true;
  savePlan(plan);
  toast(wasOn ? `${CITY[cityId].name} уже в плане` : `${CITY[cityId].name} добавлен в план`, "✈");
}

// ================= Страница: Главная =================
function pageHome() {
  // Звёзды
  const canvas = $("#stars"), ctx = canvas.getContext("2d");
  let stars = [];
  const resize = () => {
    const dpr = devicePixelRatio || 1, w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    stars = Array.from({ length: Math.floor((w * h) / 3200) }, () => ({
      x: Math.random() * w, y: Math.random() * h * 0.85, r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * 6.28, speed: Math.random() * 0.02 + 0.004,
    }));
  };
  let shooting = null;
  const draw = () => {
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff8e6";
    for (const s of stars) {
      s.phase += s.speed;
      ctx.globalAlpha = 0.3 + (Math.sin(s.phase) + 1) * 0.35;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.28); ctx.fill();
    }
    // Падающая звезда
    if (!shooting && Math.random() < 0.004) shooting = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.3, life: 0 };
    if (shooting) {
      shooting.life += 1;
      const t = shooting.life / 40, x = shooting.x + t * 260, y = shooting.y + t * 110;
      const g = ctx.createLinearGradient(x - 90, y - 38, x, y);
      g.addColorStop(0, "rgba(255,248,230,0)"); g.addColorStop(1, "rgba(255,248,230,.9)");
      ctx.globalAlpha = 1 - t; ctx.strokeStyle = g; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(x - 90, y - 38); ctx.lineTo(x, y); ctx.stroke();
      if (shooting.life > 40) shooting = null;
    }
    requestAnimationFrame(draw);
  };
  resize(); draw();
  addEventListener("resize", resize);

  // Меняющееся слово в заголовке
  const rot = $(".rotator"), words = ["звёзды", "купола", "базары", "рассветы"];
  let wi = 0;
  setInterval(() => {
    rot.classList.add("out");
    setTimeout(() => { wi = (wi + 1) % words.length; rot.textContent = words[wi]; rot.classList.remove("out"); }, 350);
  }, 2600);

  // Города
  $("#home-cities").innerHTML = CITIES.map((c) => `
    <a class="city-card reveal" href="${c.id}.html">
      <img src="img/${c.hero}.jpg" alt="${c.name}" loading="lazy">
      <span class="arrow">↗</span>
      <div><h3>${c.name}</h3><p>${c.tagline}</p></div>
    </a>`).join("");

  // Карусель мест
  const car = $("#home-places");
  car.innerHTML = PLACES.map((p) => placeCard(p, "home")).join("");
  $("#car-prev").onclick = () => car.scrollBy({ left: -car.clientWidth * 0.8, behavior: "smooth" });
  $("#car-next").onclick = () => car.scrollBy({ left: car.clientWidth * 0.8, behavior: "smooth" });
  let drag = null;
  car.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") drag = { x: e.clientX, left: car.scrollLeft, moved: false }; });
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5) { drag.moved = true; car.classList.add("dragging"); }
    car.scrollLeft = drag.left - dx;
  });
  addEventListener("pointerup", () => { if (drag) { setTimeout(() => car.classList.remove("dragging"), 0); drag = null; } });

  // Хронология: линия заполняется по мере прокрутки
  const tl = $(".timeline"), fill = $(".line-fill", tl);
  addEventListener("scroll", () => {
    const r = tl.getBoundingClientRect();
    const p = Math.min(Math.max((innerHeight * 0.7 - r.top) / r.height, 0), 1);
    fill.style.height = `${p * (r.height - 16)}px`;
  }, { passive: true });

  // Сезоны
  const seasons = {
    spring: { temp: "+22°", months: "апрель — май", title: "Лучшее время", comfort: 95, text: "Цветут сады, днём тепло, вечером свежо. Навруз 21 марта — праздник по всей стране." },
    summer: { temp: "+38°", months: "июнь — август", title: "Жарко, но пусто", comfort: 45, text: "Туристов меньше. Гулять — рано утром и после заката, днём прятаться в тени медресе." },
    autumn: { temp: "+24°", months: "сентябрь — октябрь", title: "Сезон дынь и винограда", comfort: 90, text: "Мягкое солнце, базары ломятся от урожая. Идеально для длинного маршрута до Хивы." },
    winter: { temp: "+5°", months: "декабрь — февраль", title: "Тихо и атмосферно", comfort: 55, text: "Иногда снег на бирюзовых куполах. Фото без толп, но короткий световой день." },
  };
  const panel = $("#season-panel");
  const show = (key) => {
    const s = seasons[key];
    panel.innerHTML = `
      <div class="season-temp">${s.temp}<small>${s.months}</small></div>
      <div><h3>${s.title}</h3><p>${s.text}</p>
        <div class="meter"><i></i></div><p style="margin:8px 0 0;font-size:13px">Комфорт для прогулок: ${s.comfort}%</p></div>`;
    panel.classList.remove("fade"); void panel.offsetWidth; panel.classList.add("fade");
    requestAnimationFrame(() => requestAnimationFrame(() => ($(".meter i", panel).style.width = `${s.comfort}%`)));
  };
  $$(".tab[data-season]").forEach((t) => t.addEventListener("click", () => {
    $$(".tab[data-season]").forEach((x) => x.classList.toggle("active", x === t));
    show(t.dataset.season);
  }));
  show("spring");

  // Туры
  $("#home-tours").innerHTML = TOURS.slice(0, 3).map((t) => `
    <a class="place-card reveal" href="tours.html#${t.id}">
      <div class="place-photo" style="cursor:pointer"><img src="img/${t.cover}.jpg" alt="${esc(t.name)}" loading="lazy"><span class="place-type">${daysWord(t.days)}</span></div>
      <div class="place-body"><h3>${esc(t.name)}</h3><p>${esc(t.summary)}</p>
        <span class="btn btn-small btn-ghost" style="align-self:flex-start">Подробнее ${ICON.arrow}</span></div>
    </a>`).join("");
}

// ================= Страница: Город =================
function pageCity() {
  const c = CITY[document.body.dataset.city];
  const places = PLACES.filter((p) => p.city === c.id);
  const photos = PHOTOS.filter((p) => p.city === c.id);
  const i = CITIES.indexOf(c);
  const prev = CITIES[(i - 1 + CITIES.length) % CITIES.length], next = CITIES[(i + 1) % CITIES.length];

  $("#app").innerHTML = `
    ${pageHero({
      photo: c.hero, eyebrow: "Город маршрута", title: c.name, lead: c.tagline, crumbs: ["Города", c.name],
      chips: [`🗓 ${daysWord(c.days)}`, `☀ ${c.best}`, `📍 ${places.length} ${plural(places.length, "место", "места", "мест")}`],
      actions: `<button class="btn" id="add-plan" type="button">＋ Добавить в план</button>
                <a class="btn btn-ghost" style="color:#fff;border-color:rgba(255,255,255,.3)" href="map.html?city=${c.id}">${ICON.pin} На карте</a>`,
    })}

    <section class="section">
      <div class="container two-col">
        <div class="reveal">
          <p class="eyebrow">О городе</p>
          <h2 style="font-size:clamp(34px,4vw,50px);margin-bottom:20px">${c.tagline}</h2>
          <div class="prose">${c.about.map((p) => `<p>${p}</p>`).join("")}</div>
          <div class="notice"><span>🚆</span><span><b>Как добраться.</b> ${c.getThere}</span></div>
        </div>
        <div class="city-map reveal">
          <div class="map-loader" id="city-map-loader"><div><div class="spinner"></div>Загружаем карту…</div></div>
          <iframe title="Карта: ${c.name}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="${mapSrc(c.lat, c.lon, 13)}"></iframe>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head left reveal">
          <div><p class="eyebrow">Что посмотреть</p><h2>Главные места</h2></div>
          <span class="muted">Нажмите на фото, чтобы открыть его крупно</span>
        </div>
        <div class="place-grid">${places.map((p) => placeCard(p, "city-places")).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="container two-col">
        <div class="reveal"><p class="eyebrow">Советы</p><h2 style="font-size:clamp(34px,4vw,50px)">Как провести время лучше</h2>
          <p class="muted">Небольшие подсказки, которые сложно найти в обычных путеводителях.</p></div>
        <div class="reveal">${accordion(c.tips, true)}</div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head reveal"><p class="eyebrow">Галерея</p><h2>${c.name} в кадре</h2></div>
        <div class="masonry">${photos.map((p) => `
          <figure class="reveal" data-photo="${p.id}" data-group="city-gallery" tabindex="0">
            <img src="${p.src}" alt="${esc(p.caption)}" loading="lazy"><figcaption>${esc(p.caption)}</figcaption>
          </figure>`).join("")}</div>
      </div>
    </section>

    <section class="section">
      <div class="container city-nav">
        <a href="${prev.id}.html" class="reveal"><img src="img/${prev.hero}.jpg" alt="" loading="lazy"><small>← Предыдущий город</small><b>${prev.name}</b></a>
        <a href="${next.id}.html" class="reveal"><img src="img/${next.hero}.jpg" alt="" loading="lazy"><small>Следующий город →</small><b>${next.name}</b></a>
      </div>
    </section>`;

  $(".city-map iframe").addEventListener("load", () => $("#city-map-loader").classList.add("hidden"));
  $("#add-plan").addEventListener("click", () => addCityToPlan(c.id));
  document.title = `${c.name} — Шёлковый путь`;
}

// ================= Страница: Маршруты =================
function pageTours() {
  $("#app").innerHTML = `
    ${pageHero({ photo: "bukhara", eyebrow: "Готовые маршруты", title: "Маршруты", short: true, crumbs: ["Маршруты"],
      lead: "Выберите готовую программу, добавьте её в планировщик или оставьте заявку." })}
    <section class="section">
      <div class="container">
        <div class="toolbar reveal">
          <div class="filter-chips" id="f-days">
            <button class="fchip active" data-days="all" type="button">Все</button>
            <button class="fchip" data-days="short" type="button">До 5 дней</button>
            <button class="fchip" data-days="long" type="button">6+ дней</button>
          </div>
          <div class="filter-chips">
            <select class="select" id="f-city" aria-label="Город">
              <option value="all">Любой город</option>${CITIES.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
            </select>
            <select class="select" id="f-sort" aria-label="Сортировка">
              <option value="default">Сначала популярные</option><option value="price-asc">Дешевле</option>
              <option value="price-desc">Дороже</option><option value="days-asc">Короче</option><option value="days-desc">Длиннее</option>
            </select>
          </div>
        </div>
        <p class="muted" id="tour-count" style="margin:-12px 0 20px;font-size:14px"></p>
        <div class="tour-list" id="tour-list"></div>
      </div>
    </section>`;

  const state = { days: "all", city: "all", sort: "default" };
  const list = $("#tour-list");

  function render() {
    let items = TOURS.filter((t) =>
      (state.days === "all" || (state.days === "short" ? t.days <= 5 : t.days >= 6)) &&
      (state.city === "all" || t.cities.includes(state.city)));
    const [key, dir] = state.sort.split("-");
    if (state.sort !== "default") items = [...items].sort((a, b) => (a[key] - b[key]) * (dir === "asc" ? 1 : -1));

    $("#tour-count").textContent = `Найдено: ${items.length} ${plural(items.length, "маршрут", "маршрута", "маршрутов")}`;
    if (!items.length) {
      list.innerHTML = `<div class="empty"><b>Ничего не нашлось</b>Попробуйте другие фильтры.<br><br><button class="btn btn-small" id="reset-filters" type="button">Сбросить фильтры</button></div>`;
      $("#reset-filters").onclick = () => { Object.assign(state, { days: "all", city: "all", sort: "default" }); syncControls(); render(); };
      return;
    }
    list.innerHTML = items.map((t) => `
      <article class="tour reveal" id="${t.id}">
        <div class="tour-cover" data-photo="${t.cover}" style="cursor:zoom-in"><img src="img/${t.cover}.jpg" alt="${esc(t.name)}" loading="lazy"><span class="tour-days">${daysWord(t.days)} · ${t.level}</span></div>
        <div class="tour-body">
          <div class="tour-top">
            <div><h3>${esc(t.name)}</h3><p class="muted" style="margin:6px 0 0">${esc(t.summary)}</p></div>
            <div class="price"><b>от $${t.price}</b><small>на человека · демо-цена</small></div>
          </div>
          <div class="route">${t.cities.map((id) => `<span>${CITY[id].name}</span>`).join("<i>→</i>")}</div>
          <div class="acc-item" style="background:none">
            <button class="acc-head" type="button" aria-expanded="false" style="padding:12px 0">Программа по дням<span class="plus">+</span></button>
            <div class="acc-body"><div style="padding:0 0 10px"><ol class="days-list">${t.plan.map((d) => `<li><span>${esc(d)}</span></li>`).join("")}</ol></div></div>
          </div>
          <div class="tour-actions">
            <a class="btn" href="contacts.html?tour=${t.id}">Оставить заявку</a>
            <button class="btn btn-ghost" type="button" data-to-plan="${t.id}">В планировщик</button>
          </div>
        </div>
      </article>`).join("");
    observeReveal(list);
  }
  function syncControls() {
    $$("#f-days .fchip").forEach((b) => b.classList.toggle("active", b.dataset.days === state.days));
    $("#f-city").value = state.city; $("#f-sort").value = state.sort;
  }

  $("#f-days").addEventListener("click", (e) => { const b = e.target.closest(".fchip"); if (!b) return; state.days = b.dataset.days; syncControls(); render(); });
  $("#f-city").addEventListener("change", (e) => { state.city = e.target.value; render(); });
  $("#f-sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });

  list.addEventListener("click", (e) => {
    const b = e.target.closest("[data-to-plan]");
    if (!b) return;
    const t = TOUR[b.dataset.toPlan];
    // Дни тура распределяем по городам пропорционально их рекомендуемой длительности
    const base = t.cities.reduce((s, id) => s + CITY[id].days, 0);
    const plan = getPlan();
    plan.stops = [
      ...t.cities.map((id) => ({ city: id, days: Math.max(1, Math.round((CITY[id].days / base) * t.days)), on: true })),
      ...plan.stops.filter((s) => !t.cities.includes(s.city)).map((s) => ({ ...s, on: false })),
    ];
    savePlan(plan);
    toast(`«${t.name}» перенесён в планировщик`, "✈");
    setTimeout(() => (location.href = "planner.html"), 700);
  });

  render();
  // Переход по якорю с главной: прокрутить к туру и раскрыть программу
  const target = location.hash && $(location.hash);
  if (target) setTimeout(() => { target.scrollIntoView({ behavior: "smooth" }); toggleAcc($(".acc-item", target), true); }, 400);
}

// ================= Страница: Карта =================
function pageMap() {
  $("#app").innerHTML = `
    <div class="map-layout">
      <aside class="map-side">
        <div class="map-side-head">
          <h1>Карта мест</h1>
          <input class="input" id="map-search" type="search" placeholder="Найти место…" autocomplete="off">
          <div class="filter-chips" id="map-cities">
            <button class="fchip active" data-city="all" type="button">Все</button>
            ${CITIES.map((c) => `<button class="fchip" data-city="${c.id}" type="button">${c.name}</button>`).join("")}
          </div>
          <a class="btn btn-small btn-ghost" target="_blank" rel="noopener" href="https://www.google.com/maps/dir/Tashkent/Samarkand/Bukhara/Khiva">Весь маршрут в Google Картах ↗</a>
        </div>
        <div class="map-list" id="map-list"></div>
      </aside>
      <div class="map-main">
        <div class="map-loader" id="map-loader"><div><div class="spinner"></div>Загружаем карту…</div></div>
        <iframe id="map-frame" title="Google Карта" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
        <div class="map-card" id="map-card"></div>
      </div>
    </div>`;

  const frame = $("#map-frame"), loader = $("#map-loader");
  frame.addEventListener("load", () => loader.classList.add("hidden"));
  let city = CITY[params.get("city")] ? params.get("city") : "all";
  let current = PLACE[params.get("place")] || PLACES.find((p) => city === "all" || p.city === city);
  if (params.get("place") && current) city = "all";

  function renderList() {
    const q = $("#map-search").value.trim().toLowerCase();
    const items = PLACES.filter((p) => (city === "all" || p.city === city) &&
      (!q || p.name.toLowerCase().includes(q) || CITY[p.city].name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)));
    $$("#map-cities .fchip").forEach((b) => b.classList.toggle("active", b.dataset.city === city));
    $("#map-list").innerHTML = items.length ? items.map((p) => {
      const d = current && current.id !== p.id ? Math.round(haversine(current, p)) : null;
      return `<button class="map-item ${current?.id === p.id ? "active" : ""}" data-id="${p.id}" type="button">
        <img src="img/${p.photo}.jpg" alt="" loading="lazy">
        <span><b>${esc(p.name)}</b><small>${CITY[p.city].name} · ${esc(p.type)}</small></span>
        <span class="dist">${d === null ? "📍 здесь" : `${d.toLocaleString("ru-RU")} км`}</span>
      </button>`;
    }).join("") : `<div class="empty" style="margin:10px"><b>Не нашли</b>Попробуйте другой запрос.</div>`;
  }

  function select(p, scroll = true) {
    current = p;
    loader.classList.remove("hidden");
    frame.src = mapSrc(p.lat, p.lon, 16);
    $("#map-card").innerHTML = `
      <img src="img/${p.photo}.jpg" alt="${esc(p.name)}" data-photo="${p.photo}" style="cursor:zoom-in">
      <div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.text)}</p>
        <div class="place-actions">
          <a class="btn btn-small" target="_blank" rel="noopener" href="${gmapsRoute(p)}">Проложить маршрут ↗</a>
          <a class="btn btn-small btn-ghost" href="${p.city}.html">${CITY[p.city].name}</a>
          <button class="btn-icon fav-btn mini" type="button" data-fav="${p.id}"></button>
        </div>
      </div>`;
    const card = $("#map-card");
    card.classList.remove("fade"); void card.offsetWidth; card.classList.add("fade");
    paintFavButtons();
    renderList();
    history.replaceState(null, "", `?place=${p.id}`);
    if (scroll) $(`.map-item[data-id="${p.id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    if (innerWidth <= 960 && scroll) scrollTo({ top: 0, behavior: "smooth" });
  }

  $("#map-list").addEventListener("click", (e) => { const b = e.target.closest(".map-item"); if (b) select(PLACE[b.dataset.id]); });
  $("#map-cities").addEventListener("click", (e) => {
    const b = e.target.closest(".fchip"); if (!b) return;
    city = b.dataset.city;
    const first = PLACES.find((p) => city === "all" || p.city === city);
    if (city !== "all" && current.city !== city) select(first, false); else renderList();
  });
  $("#map-search").addEventListener("input", renderList);
  select(current, false);
}

// ================= Страница: Галерея =================
function pageGallery() {
  const counts = Object.fromEntries(CITIES.map((c) => [c.id, PHOTOS.filter((p) => p.city === c.id).length]));
  $("#app").innerHTML = `
    ${pageHero({ photo: "shahizinda", eyebrow: `${PHOTOS.length} фотографий`, title: "Галерея", short: true, crumbs: ["Галерея"],
      lead: "Настоящие фотографии с Wikimedia Commons. Нажмите на снимок — откроется просмотр, листать можно стрелками или свайпом." })}
    <section class="section">
      <div class="container">
        <div class="tabs-wrap reveal"><div class="filter-chips" id="g-filter" style="justify-content:center">
          <button class="fchip active" data-city="all" type="button">Все · ${PHOTOS.length}</button>
          ${CITIES.map((c) => `<button class="fchip" data-city="${c.id}" type="button">${c.name} · ${counts[c.id]}</button>`).join("")}
        </div></div>
        <div class="masonry" id="g-grid">${PHOTOS.map((p) => `
          <figure class="reveal" data-city="${p.city}" data-photo="${p.id}" data-group="gallery" tabindex="0">
            <img src="${p.src}" alt="${esc(p.caption)}" loading="lazy"><figcaption>${esc(p.caption)} · ${CITY[p.city].name}</figcaption>
          </figure>`).join("")}</div>
      </div>
    </section>
    <section class="section section-alt" id="credits">
      <div class="container">
        <div class="section-head reveal"><p class="eyebrow">Лицензии</p><h2>Авторы фотографий</h2>
          <p class="sub">Все снимки взяты с Wikimedia Commons под свободными лицензиями. Автор, лицензия и ссылка на оригинал — для каждого фото.</p></div>
        <div class="table-wrap reveal"><table class="credits-table">
          <thead><tr><th>Фото</th><th>Автор</th><th>Лицензия</th><th>Оригинал</th></tr></thead>
          <tbody>${PHOTOS.map((p) => `<tr>
            <td>${esc(p.caption)}</td><td>${esc(p.author)}</td>
            <td>${p.licenseUrl ? `<a href="${p.licenseUrl}" target="_blank" rel="noopener">${esc(p.license)}</a>` : esc(p.license)}</td>
            <td><a href="${p.source}" target="_blank" rel="noopener">Commons ↗</a></td></tr>`).join("")}</tbody>
        </table></div>
      </div>
    </section>`;

  $("#g-filter").addEventListener("click", (e) => {
    const b = e.target.closest(".fchip"); if (!b) return;
    $$("#g-filter .fchip").forEach((x) => x.classList.toggle("active", x === b));
    $$("#g-grid figure").forEach((f, i) => {
      const show = b.dataset.city === "all" || f.dataset.city === b.dataset.city;
      f.classList.toggle("hide", !show);
      if (show) { f.classList.remove("visible"); f.style.transitionDelay = `${(i % 6) * 40}ms`; requestAnimationFrame(() => requestAnimationFrame(() => f.classList.add("visible"))); }
    });
  });
}

// ================= Страница: Планировщик =================
function pagePlanner() {
  const RATES = { economy: 60, comfort: 120, premium: 250 };
  const LEVELS = { economy: "Эконом", comfort: "Комфорт", premium: "Премиум" };

  // План из ссылки вида #plan=samarkand:3,bukhara:2&level=comfort
  let plan = getPlan();
  const hash = new URLSearchParams(location.hash.slice(1));
  if (hash.get("plan")) {
    const parsed = hash.get("plan").split(",").map((x) => x.split(":")).filter(([id, d]) => CITY[id] && Number(d) > 0);
    if (parsed.length) {
      plan = {
        stops: [...parsed.map(([id, d]) => ({ city: id, days: Math.min(14, Number(d)), on: true })),
          ...CITIES.filter((c) => !parsed.some(([id]) => id === c.id)).map((c) => ({ city: c.id, days: c.days, on: false }))],
        level: RATES[hash.get("level")] ? hash.get("level") : "comfort",
      };
      savePlan(plan);
      history.replaceState(null, "", location.pathname);
      setTimeout(() => toast("План загружен из ссылки", "🔗"), 500);
    }
  }

  $("#app").innerHTML = `
    ${pageHero({ photo: "itchankala", eyebrow: "Планировщик", title: "Соберите поездку", short: true, crumbs: ["Планировщик"],
      lead: "Включайте города, меняйте порядок и число дней — итог и ориентировочный бюджет пересчитываются сразу. План сохраняется в браузере." })}
    <section class="section">
      <div class="container planner">
        <div style="display:grid;gap:28px">
          <div class="panel reveal">
            <h2>Маршрут</h2><p class="muted">Порядок городов — порядок поездки.</p>
            <ul class="stop-list" id="stops"></ul>
          </div>
          <div class="panel reveal" id="favorites">
            <h2>Избранные места</h2><p class="muted">Отмечайте места сердечком на страницах городов и на карте.</p>
            <div class="fav-list" id="fav-list"></div>
          </div>
        </div>
        <aside class="panel sticky reveal" id="summary"></aside>
      </div>
    </section>`;

  function save() { savePlan(plan); }
  const active = () => plan.stops.filter((s) => s.on);

  function renderStops() {
    $("#stops").innerHTML = plan.stops.map((s, i) => {
      const c = CITY[s.city];
      return `<li class="stop ${s.on ? "on" : ""}" data-i="${i}">
        <img src="img/${c.hero}.jpg" alt="">
        <div><b>${c.name}</b><br><small class="muted">рекомендуем ${daysWord(c.days)}</small></div>
        <div class="stop-controls">
          <div class="stepper" aria-label="Дни">
            <button type="button" data-act="minus" aria-label="Меньше дней">−</button><output>${s.days}</output><button type="button" data-act="plus" aria-label="Больше дней">+</button>
          </div>
          <button class="btn-icon mini" type="button" data-act="up" aria-label="Выше" ${i === 0 ? "disabled" : ""}>↑</button>
          <button class="btn-icon mini" type="button" data-act="down" aria-label="Ниже" ${i === plan.stops.length - 1 ? "disabled" : ""}>↓</button>
          <label class="switch" title="Включить в поездку"><input type="checkbox" data-act="toggle" ${s.on ? "checked" : ""} aria-label="${c.name} в поездке"><span></span></label>
        </div>
      </li>`;
    }).join("");
  }

  function renderSummary() {
    const on = active();
    const days = on.reduce((s, x) => s + x.days, 0);
    let km = 0;
    for (let i = 1; i < on.length; i++) km += haversine(CITY[on[i - 1].city], CITY[on[i].city]);
    const budget = days * RATES[plan.level];
    $("#summary").innerHTML = `
      <p class="eyebrow">Итог</p>
      <div class="summary-big"><b>${days}</b><span class="muted">${plural(days, "день", "дня", "дней")}</span></div>
      <div class="route" style="margin:14px 0 6px">${on.length ? on.map((s) => `<span>${CITY[s.city].name}</span>`).join("<i>→</i>") : '<span class="muted">Включите хотя бы один город</span>'}</div>
      <div class="summary-row"><span class="muted">Городов</span><span>${on.length}</span></div>
      <div class="summary-row"><span class="muted">Между городами по прямой</span><span>≈ ${Math.round(km).toLocaleString("ru-RU")} км</span></div>
      <div class="summary-row"><span class="muted">Мест в избранном</span><span>${getFavs().length}</span></div>
      <div class="segmented" role="group" aria-label="Уровень поездки">
        ${Object.entries(LEVELS).map(([k, v]) => `<button type="button" data-level="${k}" class="${plan.level === k ? "active" : ""}">${v}</button>`).join("")}
      </div>
      <div class="summary-row" style="border:0"><span class="muted">Бюджет на человека*</span><span style="font-size:22px;color:var(--gold)">≈ $${budget.toLocaleString("ru-RU")}</span></div>
      <small class="muted">* условный расчёт: $${RATES[plan.level]} в день для уровня «${LEVELS[plan.level]}», без перелёта.</small>
      <div class="stack no-print">
        <button class="btn" type="button" id="p-request" ${on.length ? "" : "disabled"}>Отправить заявку по плану</button>
        <button class="btn btn-ghost" type="button" id="p-share" ${on.length ? "" : "disabled"}>🔗 Скопировать ссылку на план</button>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" type="button" id="p-print" style="flex:1">🖨 Печать</button>
          <button class="btn btn-ghost" type="button" id="p-reset" style="flex:1">↺ Сбросить</button>
        </div>
      </div>`;
  }

  function renderFavs() {
    const favs = getFavs();
    $("#fav-list").innerHTML = favs.length ? favs.map((id) => {
      const p = PLACE[id];
      return `<div class="fav-item">
        <img src="img/${p.photo}.jpg" alt="" data-photo="${p.photo}" data-group="favs" style="cursor:zoom-in">
        <div><b>${esc(p.name)}</b><small>${CITY[p.city].name} · ${esc(p.type)}</small></div>
        <div class="row">
          <a class="btn-icon mini" href="map.html?place=${p.id}" aria-label="На карте" title="На карте">${ICON.pin}</a>
          <button class="btn-icon mini fav-btn" type="button" data-fav="${p.id}"></button>
        </div>
      </div>`;
    }).join("") : `<div class="empty" style="padding:32px 16px"><b>Пока пусто</b>Загляните на страницы городов: ${CITIES.map((c) => `<a href="${c.id}.html" style="color:var(--turq)">${c.name}</a>`).join(", ")}.</div>`;
    paintFavButtons();
  }

  const renderAll = () => { renderStops(); renderSummary(); renderFavs(); };

  $("#stops").addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b || b.dataset.act === "toggle") return;
    const i = Number(b.closest(".stop").dataset.i), s = plan.stops[i];
    if (b.dataset.act === "plus") s.days = Math.min(14, s.days + 1);
    if (b.dataset.act === "minus") s.days = Math.max(1, s.days - 1);
    if (b.dataset.act === "plus" || b.dataset.act === "minus") s.on = true;
    if (b.dataset.act === "up" && i > 0) [plan.stops[i - 1], plan.stops[i]] = [plan.stops[i], plan.stops[i - 1]];
    if (b.dataset.act === "down" && i < plan.stops.length - 1) [plan.stops[i + 1], plan.stops[i]] = [plan.stops[i], plan.stops[i + 1]];
    save(); renderStops(); renderSummary();
    const moved = b.dataset.act === "up" ? i - 1 : b.dataset.act === "down" ? i + 1 : i;
    const li = $(`.stop[data-i="${moved}"]`); li?.classList.add("fade");
    if (b.dataset.act === "up" || b.dataset.act === "down") $(`[data-act="${b.dataset.act}"]:not([disabled])`, li)?.focus();
  });
  $("#stops").addEventListener("change", (e) => {
    if (e.target.dataset.act !== "toggle") return;
    const i = Number(e.target.closest(".stop").dataset.i);
    plan.stops[i].on = e.target.checked;
    save(); renderStops(); renderSummary();
    $(`.stop[data-i="${i}"] input`).focus();
  });

  $("#summary").addEventListener("click", async (e) => {
    const lvl = e.target.closest("[data-level]");
    if (lvl) { plan.level = lvl.dataset.level; save(); renderSummary(); return; }
    const on = active();
    switch (e.target.closest("button")?.id) {
      case "p-request": {
        const text = `План поездки: ${on.map((s) => `${CITY[s.city].name} — ${daysWord(s.days)}`).join("; ")}. Уровень: ${LEVELS[plan.level]}.` +
          (getFavs().length ? ` Хочу посмотреть: ${getFavs().map((id) => PLACE[id].name).join(", ")}.` : "");
        location.href = `contacts.html?plan=${encodeURIComponent(text)}&start=1`;
        break;
      }
      case "p-share": {
        const url = `${location.origin}${location.pathname}#plan=${on.map((s) => `${s.city}:${s.days}`).join(",")}&level=${plan.level}`;
        try { await navigator.clipboard.writeText(url); toast("Ссылка на план скопирована", "🔗"); }
        catch { prompt("Скопируйте ссылку:", url); }
        break;
      }
      case "p-print": window.print(); break;
      case "p-reset":
        if (confirm("Сбросить план к исходному?")) { plan = defaultPlan(); save(); renderAll(); toast("План сброшен", "↺"); }
        break;
    }
  });

  document.addEventListener("favs-changed", () => { renderFavs(); renderSummary(); });
  // Ссылка на план, открытая поверх уже загруженного планировщика, меняет только хеш — перечитываем страницу
  addEventListener("hashchange", () => { if (location.hash.startsWith("#plan=")) location.reload(); });
  renderAll();
  if (location.hash === "#favorites") setTimeout(() => $("#favorites").scrollIntoView({ behavior: "smooth" }), 400);
}

// ================= Страница: Контакты =================
function pageContacts() {
  $("#app").innerHTML = `
    ${pageHero({ photo: "labihauz", eyebrow: "Контакты", title: "Оставить заявку", short: true, crumbs: ["Контакты"],
      lead: "Расскажите о поездке — форма проверит данные и сохранит заявку в разделе «Мои заявки»." })}
    <section class="section">
      <div class="container two-col">
        <div class="panel reveal">
          <div class="notice"><span>ℹ</span><span>Это учебный сайт без сервера: заявка <b>никуда не отправляется</b>, а сохраняется только в вашем браузере.</span></div>
          <form class="form" id="req-form" novalidate>
            <div class="field"><label for="f-name">Имя *</label><input class="input" id="f-name" name="name" autocomplete="name" placeholder="Как к вам обращаться"><span class="err"></span></div>
            <div class="field"><label for="f-contact">E-mail или телефон *</label><input class="input" id="f-contact" name="contact" autocomplete="email" placeholder="name@mail.com или +998…"><span class="err"></span></div>
            <div class="field full"><label for="f-tour">Маршрут</label>
              <select class="select" id="f-tour" name="tour" style="width:100%"><option value="">Индивидуальная поездка</option>${TOURS.map((t) => `<option value="${t.id}">${esc(t.name)} · ${daysWord(t.days)}</option>`).join("")}</select><span class="err"></span></div>
            <div class="field"><label for="f-start">Дата начала *</label><input class="input" type="date" id="f-start" name="start"><span class="err"></span></div>
            <div class="field"><label for="f-end">Дата окончания *</label><input class="input" type="date" id="f-end" name="end"><span class="err"></span></div>
            <div class="field"><label>Путешественников</label>
              <div class="stepper" style="justify-self:start"><button type="button" id="ppl-minus" aria-label="Меньше">−</button><output id="ppl">2</output><button type="button" id="ppl-plus" aria-label="Больше">+</button></div><span class="err"></span></div>
            <div class="field"><label>&nbsp;</label><span class="muted" id="trip-len" style="font-size:14px"></span></div>
            <div class="field full"><label for="f-msg">Пожелания</label><textarea class="textarea" id="f-msg" name="message" maxlength="600" placeholder="Что хотите увидеть, темп поездки, особые пожелания"></textarea><div class="counter"><span id="msg-count">0</span> / 600</div></div>
            <div class="field full"><label class="check"><input type="checkbox" id="f-agree" name="agree"> Понимаю, что это демо и заявка сохранится только в браузере *</label><span class="err"></span></div>
            <div class="field full"><button class="btn" type="submit" id="req-submit">Отправить заявку</button></div>
          </form>
        </div>
        <div style="display:grid;gap:28px;align-content:start">
          <div class="panel reveal"><h2>Мои заявки</h2><p class="muted">Хранятся в этом браузере.</p><div class="req-list" id="req-list"></div></div>
          <div class="reveal" id="faq"><p class="eyebrow">FAQ</p><h2 style="font-size:40px;margin-bottom:18px">Частые вопросы</h2>${accordion(FAQ)}</div>
        </div>
      </div>
    </section>
    <div class="modal" id="ok-modal" role="dialog" aria-modal="true" aria-labelledby="ok-title">
      <div class="modal-box">
        <svg class="check-anim" viewBox="0 0 80 80"><circle cx="40" cy="40" r="36"/><path d="M24 41l11 11 21-23"/></svg>
        <h3 id="ok-title">Заявка сохранена</h3>
        <p id="ok-text"></p>
        <div class="modal-actions"><button class="btn" type="button" id="ok-close">Отлично</button><a class="btn btn-ghost" href="planner.html">В планировщик</a></div>
      </div>
    </div>`;

  const form = $("#req-form"), f = (n) => form.elements[n];
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  f("start").min = today; f("end").min = today;
  let people = 2;

  // Черновик и параметры из ссылки
  const draft = store.get("sr.draft", {});
  ["name", "contact", "tour", "start", "end", "message"].forEach((n) => { if (draft[n]) f(n).value = draft[n]; });
  if (draft.people) people = draft.people;
  if (TOUR[params.get("tour")]) f("tour").value = params.get("tour");
  if (params.get("plan")) f("message").value = params.get("plan");

  const saveDraft = () => store.set("sr.draft", { name: f("name").value, contact: f("contact").value, tour: f("tour").value, start: f("start").value, end: f("end").value, message: f("message").value, people });
  const paintMeta = () => {
    $("#ppl").textContent = people;
    $("#msg-count").textContent = f("message").value.length;
    const s = f("start").value, e = f("end").value;
    const n = s && e ? Math.round((new Date(e) - new Date(s)) / 86400000) + 1 : 0;
    $("#trip-len").textContent = n > 0 ? `Поездка: ${daysWord(n)}` : "";
  };
  paintMeta();

  $("#ppl-minus").onclick = () => { people = Math.max(1, people - 1); paintMeta(); saveDraft(); };
  $("#ppl-plus").onclick = () => { people = Math.min(20, people + 1); paintMeta(); saveDraft(); };
  form.addEventListener("input", (e) => {
    if (e.target.name === "start") f("end").min = f("start").value || today;
    e.target.closest(".field")?.classList.remove("invalid");
    const err = e.target.closest(".field")?.querySelector(".err"); if (err) err.textContent = "";
    paintMeta(); saveDraft();
  });

  function validate() {
    const errors = {};
    if (f("name").value.trim().length < 2) errors.name = "Введите имя — хотя бы 2 буквы";
    const contact = f("contact").value.trim();
    const isMail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(contact);
    const isPhone = /^\+?[\d\s()-]{9,}$/.test(contact) && contact.replace(/\D/g, "").length >= 9;
    if (!isMail && !isPhone) errors.contact = "Нужен корректный e-mail или телефон";
    if (!f("start").value) errors.start = "Выберите дату";
    else if (f("start").value < today) errors.start = "Дата уже прошла";
    if (!f("end").value) errors.end = "Выберите дату";
    else if (f("start").value && f("end").value < f("start").value) errors.end = "Раньше даты начала";
    if (!f("agree").checked) errors.agree = "Подтвердите, пожалуйста";
    $$(".field", form).forEach((fl) => { fl.classList.remove("invalid"); const e = $(".err", fl); if (e) e.textContent = ""; });
    Object.entries(errors).forEach(([n, msg]) => {
      const fl = f(n).closest(".field");
      void fl.offsetWidth;
      fl.classList.add("invalid"); $(".err", fl).textContent = msg;
    });
    const first = Object.keys(errors)[0];
    if (first) f(first).focus();
    return !first;
  }

  const fmt = (d) => new Date(d).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
  function renderRequests() {
    const reqs = store.get("sr.requests", []);
    $("#req-list").innerHTML = reqs.length ? reqs.map((r) => `
      <div class="req">
        <div class="req-top"><b>${esc(TOUR[r.tour]?.name || "Индивидуальная поездка")}</b><span class="status">сохранена</span></div>
        <p>${esc(r.name)} · ${esc(r.contact)}\n${fmt(r.start)} — ${fmt(r.end)} · ${r.people} ${plural(r.people, "человек", "человека", "человек")}${r.message ? `\n«${esc(r.message.slice(0, 140))}${r.message.length > 140 ? "…" : ""}»` : ""}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:10px">
          <small class="muted">${new Date(r.created).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}</small>
          <button class="btn btn-small btn-ghost" type="button" data-del="${r.id}">Удалить</button>
        </div>
      </div>`).join("") : `<div class="empty" style="padding:28px 16px"><b>Заявок нет</b>Заполните форму слева.</div>`;
  }

  $("#req-list").addEventListener("click", (e) => {
    const b = e.target.closest("[data-del]"); if (!b) return;
    store.set("sr.requests", store.get("sr.requests", []).filter((r) => r.id !== b.dataset.del));
    renderRequests(); toast("Заявка удалена", "🗑");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate()) { toast("Проверьте выделенные поля", "!"); return; }
    const btn = $("#req-submit");
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:2px;margin:0"></span> Сохраняем…';
    setTimeout(() => {
      const r = { id: String(Date.now()), created: Date.now(), name: f("name").value.trim(), contact: f("contact").value.trim(), tour: f("tour").value,
        start: f("start").value, end: f("end").value, people, message: f("message").value.trim() };
      store.set("sr.requests", [r, ...store.get("sr.requests", [])]);
      store.set("sr.draft", {});
      form.reset(); people = 2; paintMeta();
      btn.disabled = false; btn.textContent = "Отправить заявку";
      renderRequests();
      $("#ok-text").textContent = `${r.name}, заявка на ${fmt(r.start)} — ${fmt(r.end)} сохранена в разделе «Мои заявки».`;
      $("#ok-modal").classList.add("open");
      $("#ok-close").focus();
    }, 900);
  });

  const closeModal = () => $("#ok-modal").classList.remove("open");
  $("#ok-close").onclick = closeModal;
  $("#ok-modal").addEventListener("click", (e) => { if (e.target.id === "ok-modal") closeModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

  renderRequests();
  if (params.get("start") || params.get("tour")) setTimeout(() => $("#req-form").scrollIntoView({ behavior: "smooth", block: "center" }), 450);
  if (location.hash === "#faq") setTimeout(() => $("#faq").scrollIntoView({ behavior: "smooth" }), 450);
}

// ================= Запуск =================
renderLayout();
({ home: pageHome, city: pageCity, tours: pageTours, map: pageMap, gallery: pageGallery, planner: pagePlanner, contacts: pageContacts }[PAGE] || (() => {}))();
paintFavButtons();
observeReveal();

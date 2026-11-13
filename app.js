var PAL = { "Hijau (bawaan)": ["#0f3d2a", "#2e8b57", "#f4b942"], "Biru": ["#0d2f5a", "#2a73c5", "#f4b942"], "Ungu": ["#3a1d5c", "#8a4fc7", "#f4b942"], "Merah marun": ["#5a1420", "#c2415a", "#f2c14e"], "Teal": ["#0b3c49", "#1d8fa3", "#f4b942"] };
var LOGOS = { "Normal": 40, "Besar": 56, "Sangat besar": 72 };
var WRAPS = { "Standar": 1080, "Lebar": 1280, "Sangat lebar": 1440 };
var SIZES = { "Kecil": 15, "Normal": 16, "Besar": 18, "Sangat besar": 20 };
function applyTheme(t) {
  t = t || {};
  var p = PAL[t.palette] || PAL["Hijau (bawaan)"], st = document.documentElement.style, hex = /^#[0-9a-f]{6}$/i;
  ["forest", "leaf", "sun"].forEach(function (k, i) { st.setProperty("--" + k, hex.test(t[k] || "") ? t[k] : p[i]); });
  var hf = t.headingFont || "Bricolage Grotesque", bf = t.bodyFont || "Source Sans 3";
  st.setProperty("--fh", '"' + hf + '"'); st.setProperty("--fb", '"' + bf + '"');
  st.setProperty("--root", (SIZES[t.textSize] || 16) + "px");
  st.setProperty("--logo-h", (LOGOS[t.logoSize] || 56) + "px");
  st.setProperty("--wrap", (WRAPS[t.pageWidth] || 1080) + "px");
  [hf, bf].forEach(function (f) {
    if (f === "Bricolage Grotesque" || f === "Source Sans 3" || document.getElementById("f-" + f)) return;
    var l = document.createElement("link"); l.id = "f-" + f; l.rel = "stylesheet";
    l.href = "https://fonts.googleapis.com/css2?family=" + f.replace(/ /g, "+") + ":wght@400;700&display=swap"; document.head.appendChild(l);
  });
  var m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = st.getPropertyValue("--forest");
}
try { var cached = localStorage.getItem("lazTheme"); if (cached) applyTheme(JSON.parse(cached)); } catch (e) {}
function run(S) {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  S.news = (S.news || []).sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
  S.stats = S.stats || [];
  applyTheme(S.theme);
  try { localStorage.setItem("lazTheme", JSON.stringify(S.theme || {})); } catch (e) {}
  function slug(t) { return String(t || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function idOf(n) { return n.id || slug(n.title); }
  function paras(n) { var r = toParas(n.body); return r.length ? r : [n.summary]; }
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var page = document.body.dataset.page;

  function fmt(n, money) { return (money ? "Rp " : "") + Math.round(n).toLocaleString("id-ID"); }
  function dateId(d) { return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }); }
  function esc(t) { var e = document.createElement("div"); e.textContent = t || ""; return e.innerHTML; }

  function card(n) {
    return '<a class="card" href="article.html?id=' + encodeURIComponent(idOf(n)) + '">' + (n.image ? '<img src="' + esc(n.image) + '" alt="" loading="lazy">' : '<div class="ph"></div>') +
      '<div class="cb"><time>' + dateId(n.date) + '</time><h3>' + esc(n.title) + '</h3><p>' + esc(n.summary) + '</p></div></a>';
  }
  function renderNews(el, list) {
    el.innerHTML = list.length ? list.map(card).join("") :
      '<p class="empty">Belum ada kabar. Tambahkan kegiatan pertama Anda di <code>data/site.json</code>.</p>';
  }
  function toParas(t) {
    if (Array.isArray(t)) return t;
    return String(t || "").split(/\n\s*\n/).map(function (x) { return x.trim(); }).filter(Boolean);
  }
  var ICONS = {
    WhatsApp: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>',
    Instagram: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    Lainnya: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/></svg>'
  };
  function linkUrl(l) {
    var u = String(l.url || "").trim(); if (!u) return "";
    if (l.type === "WhatsApp" && !/^https?:/i.test(u)) { u = u.replace(/\D/g, ""); if (!u) return ""; if (u.charAt(0) === "0") u = "62" + u.slice(1); return "https://wa.me/" + u; }
    if (l.type === "Instagram" && !/^https?:/i.test(u)) return "https://instagram.com/" + u.replace(/^@/, "");
    return /^https?:\/\//i.test(u) ? u : "https://" + u;
  }
  function socials(P) {
    var items = (P.links || []).map(function (l) { return { l: l, u: linkUrl(l) }; }).filter(function (x) { return x.u; });
    if (!items.length) return "";
    return '<div class="blk"><h2>' + esc(P.linksTitle || "Hubungi kami") + '</h2><div class="soc">' + items.map(function (x) {
      return '<a href="' + esc(x.u) + '" target="_blank" rel="noopener">' + (ICONS[x.l.type] || ICONS.Lainnya) + '<span>' + esc(x.l.label || x.l.type || "Tautan") + '</span></a>';
    }).join("") + '</div></div>';
  }
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>';
  function href(u) { u = String(u || "#").trim(); return esc(/^javascript:/i.test(u) ? "#" : u.replace(/"/g, "%22")); }
  function ext(u) { return /^https?:/i.test(u || "") ? ' target="_blank" rel="noopener"' : ""; }
  function renderChrome() {
    var P = S.profile || {};
    var menu = S.menu && S.menu.length ? S.menu : [{ label: "Beranda", url: "index.html" }, { label: "Kabar", url: "news.html" }, { label: "Profil", url: "about.html" }];
    var cur = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index";
    if (cur === "article") cur = "news";
    function isCur(u) { return u && !/^https?:/i.test(u) && String(u).split(/[?#]/)[0].replace(/\.html$/, "") === cur; }
    var items = menu.filter(function (m) { return m && m.label; }).map(function (m) {
      var kids = (m.children || []).filter(function (c) { return c && c.label; });
      if (kids.length) return '<li class="dd"><button type="button" aria-expanded="false">' + esc(m.label) + CHEV + '</button><ul class="sub">' +
        kids.map(function (c) { return '<li><a href="' + href(c.url) + '"' + ext(c.url) + '>' + esc(c.label) + '</a></li>'; }).join("") + '</ul></li>';
      return '<li><a href="' + href(m.url) + '"' + ext(m.url) + (isCur(m.url) ? ' aria-current="page"' : '') + '>' + esc(m.label) + '</a></li>';
    }).join("");
    $("#hdr").innerHTML = '<div class="wrap bar"><a class="brand" href="index.html">' + (S.logo ? '<img class="logo" src="' + S.logo + '" alt="' + (S.showName === false ? S.name : '') + '">' : '<span class="mark" aria-hidden="true"></span>') + (S.showName === false && S.logo ? '' : S.name) + '</a>' +
      '<nav id="nav" aria-label="Menu utama"><ul>' + items + '</ul></nav><a class="btn small" href="' + S.lynk + '" target="_blank" rel="noopener">Donasi</a>' +
      '<button class="burger" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button></div>';
    var ic = (P.links || []).map(function (l) {
      var u = linkUrl(l); return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener" aria-label="' + esc(l.label || l.type || "Tautan") + '">' + (ICONS[l.type] || ICONS.Lainnya) + '</a>' : "";
    }).join("");
    $("#ftr").innerHTML = '<div class="wrap foot"><p><strong>' + esc(S.name) + '</strong><br>Lembaga amil zakat. Donasi diproses melalui Lynk.</p><div><p><a href="' + S.lynk + '" target="_blank" rel="noopener">Donasi sekarang</a></p>' + (ic ? '<div class="fsoc">' + ic + '</div>' : '') + '</div><p class="mut">&copy; ' + new Date().getFullYear() + ' ' + esc(S.name) + '</p></div>';
    var hdr = $("#hdr"), burger = $(".burger", hdr);
    function closeDd() { Array.prototype.forEach.call(hdr.querySelectorAll(".dd.open"), function (li) { li.classList.remove("open"); li.firstChild.setAttribute("aria-expanded", "false"); }); }
    burger.onclick = function (e) { e.stopPropagation(); var o = hdr.classList.toggle("menu-open"); burger.setAttribute("aria-expanded", String(o)); };
    Array.prototype.forEach.call(hdr.querySelectorAll(".dd > button"), function (b) {
      b.onclick = function (e) { e.stopPropagation(); var li = b.parentNode, o = !li.classList.contains("open"); closeDd(); li.classList.toggle("open", o); b.setAttribute("aria-expanded", String(o)); };
    });
    document.addEventListener("click", closeDd);
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeDd(); hdr.classList.remove("menu-open"); } });
  }
  renderChrome();
  if ($("#profile")) {
    var P = S.profile || {};
    $("#profile").innerHTML = '<h1>' + esc(P.title || "Profil " + S.name) + '</h1>' + (P.intro ? '<p class="lead">' + esc(P.intro) + '</p>' : '') +
      (P.sections || []).map(function (b) {
        return '<div class="blk"><h2>' + esc(b.heading) + '</h2>' + toParas(b.text).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("") + '</div>';
      }).join("") + socials(P);
    if (P.title) document.title = P.title;
  }
  if ($("#newsList")) renderNews($("#newsList"), S.news);
  if ($("#latest")) renderNews($("#latest"), S.news.slice(0, 3));

  if ($("#art")) {
    var id = new URLSearchParams(location.search).get("id");
    var n = S.news.filter(function (x) { return idOf(x) === id; })[0];
    $("#art").innerHTML = '<a class="back" href="news.html">&larr; Semua kabar</a>' + (n ?
      '<time>' + dateId(n.date) + '</time><h1>' + esc(n.title) + '</h1>' + (n.image ? '<img src="' + esc(n.image) + '" alt="">' : '') +
      paras(n).map(function (t) { return '<p>' + esc(t) + '</p>'; }).join("") +
      (n.source ? '<p class="src">Sumber: ' + (n.sourceUrl ? '<a href="' + esc(n.sourceUrl) + '" target="_blank" rel="noopener">' + esc(n.source) + '</a>' : esc(n.source)) + '</p>' : '') : '<h1>Berita tidak ditemukan</h1><p>Periksa tautan, atau buka halaman Kabar.</p>');
    if (n) document.title = n.title + " | " + S.name;
  }

  var box = $("#slides");
  if (box) {
    box.innerHTML = S.stats.map(function (s, i) {
      return '<div class="slide" role="group" aria-label="' + (i + 1) + ' dari ' + S.stats.length + '"><div class="num" data-v="' + s.value + '" data-m="' + (s.money ? 1 : 0) + '">' + fmt(s.value, s.money) + '</div><div class="lbl">' + s.label + '</div></div>';
    }).join("");
    $("#dots").innerHTML = S.stats.map(function (_, i) { return '<button aria-label="Tampilkan slide ' + (i + 1) + '"></button>'; }).join("");
    var slides = box.children, dots = $("#dots").children, cur = -1, timer;
    function count(el) {
      var v = +el.dataset.v, m = +el.dataset.m;
      if (reduce || !v) { el.textContent = fmt(v, m); return; }
      var t0 = performance.now();
      (function step(t) {
        var p = Math.min((t - t0) / 1400, 1);
        el.textContent = fmt(v * (1 - Math.pow(1 - p, 3)), m);
        if (p < 1) requestAnimationFrame(step);
      })(t0);
    }
    function show(i) {
      cur = (i + slides.length) % slides.length;
      for (var k = 0; k < slides.length; k++) {
        slides[k].classList.toggle("on", k === cur);
        dots[k].setAttribute("aria-current", k === cur ? "true" : "false");
      }
      count(slides[cur].firstChild);
    }
    function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { show(cur + 1); }, 4500); }
    Array.prototype.forEach.call(dots, function (d, i) { d.onclick = function () { show(i); auto(); }; });
    box.parentNode.onmouseenter = function () { clearInterval(timer); };
    box.parentNode.onmouseleave = auto;
    show(0); auto();
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-lynk]"), function (a) { a.href = S.lynk; });
}
fetch("data/site.json", { cache: "no-cache" }).then(function (r) { return r.json(); }).then(run);

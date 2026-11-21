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
  function on(x) { return x && x.tampil !== false; }
  S.news = (S.news || []).filter(on).sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
  S.stats = (S.stats || []).filter(on);
  S.arts = ((S.artikel && S.artikel.articles) || []).filter(function (a) { return on(a) && a.title; }).sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
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

  function card(n, base) {
    return '<a class="card" href="' + (base || "article.html") + '?id=' + encodeURIComponent(idOf(n)) + '">' + (n.image ? '<img src="' + esc(n.image) + '" alt="" loading="lazy">' : '<div class="ph"></div>') +
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
    var items = (P.links || []).filter(on).map(function (l) { return { l: l, u: linkUrl(l) }; }).filter(function (x) { return x.u; });
    if (!items.length) return "";
    return '<div class="blk"><h2>' + esc(P.linksTitle || "Hubungi kami") + '</h2><div class="soc">' + items.map(function (x) {
      return '<a href="' + esc(x.u) + '" target="_blank" rel="noopener">' + (ICONS[x.l.type] || ICONS.Lainnya) + '<span>' + esc(x.l.label || x.l.type || "Tautan") + '</span></a>';
    }).join("") + '</div></div>';
  }
  var CHEV = '<svg class="chev" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M6 9l6 6 6-6"/></svg>';
  function href(u) { u = String(u || "#").trim(); return esc(/^javascript:/i.test(u) ? "#" : u.replace(/"/g, "%22")); }
  function sameSite(u) { try { return new URL(u, location.href).hostname === location.hostname; } catch (e) { return false; } }
  function ext(u) { return /^https?:/i.test(u || "") && !sameSite(u) ? ' target="_blank" rel="noopener"' : ""; }
  function renderChrome() {
    var P = S.profile || {};
    var menu = S.menu && S.menu.length ? S.menu : [{ label: "Beranda", url: "index.html" }, { label: "Program", url: "program.html" }, { label: "Kabar", url: "news.html" }, { label: "Profil", url: "about.html" }];
    var cur = (location.pathname.split("/").pop() || "index").replace(/\.html$/, "") || "index";
    if (cur === "article") cur = "news";
    function isCur(u) {
      if (!u || (/^https?:/i.test(u) && !sameSite(u))) return false;
      var p = /^https?:/i.test(u) ? new URL(u).pathname : String(u).split(/[?#]/)[0];
      return (p.split("/").pop() || "index").replace(/\.html$/, "") === cur;
    }
    var items = menu.filter(function (m) { return m && m.label && m.tampil !== false; }).map(function (m) {
      var kids = (m.children || []).filter(function (c) { return c && c.label && c.tampil !== false; });
      if (kids.length) return '<li class="dd"><button type="button" aria-expanded="false">' + esc(m.label) + CHEV + '</button><ul class="sub">' +
        kids.map(function (c) { return '<li><a href="' + href(c.url) + '"' + ext(c.url) + '>' + esc(c.label) + '</a></li>'; }).join("") + '</ul></li>';
      return '<li><a href="' + href(m.url) + '"' + ext(m.url) + (isCur(m.url) ? ' aria-current="page"' : '') + '>' + esc(m.label) + '</a></li>';
    }).join("");
    $("#hdr").innerHTML = '<div class="wrap bar"><a class="brand" href="index.html">' + (S.logo ? '<img class="logo" src="' + S.logo + '" alt="' + (S.showName === false ? S.name : '') + '">' : '<span class="mark" aria-hidden="true"></span>') + (S.showName === false && S.logo ? '' : S.name) + '</a>' +
      '<nav id="nav" aria-label="Menu utama"><ul>' + items + '</ul></nav><a class="btn small" href="' + S.lynk + '" target="_blank" rel="noopener">Donasi</a>' +
      '<button class="burger" type="button" aria-label="Buka menu" aria-expanded="false" aria-controls="nav"><span></span><span></span><span></span></button></div>';
    var ic = (P.links || []).filter(on).map(function (l) {
      var u = linkUrl(l); return u ? '<a href="' + esc(u) + '" target="_blank" rel="noopener" aria-label="' + esc(l.label || l.type || "Tautan") + '">' + (ICONS[l.type] || ICONS.Lainnya) + '</a>' : "";
    }).join("");
    var F = S.footer || {};
    var fcopy = String(F.copyright || ("\u00a9 {tahun} " + S.name)).replace(/\{tahun\}/g, new Date().getFullYear());
    var desc = F.description || "Lembaga amil zakat. Donasi diproses melalui Lynk.";
    var quick = (F.quick || []).filter(function (l) { return l && l.label && l.url && l.tampil !== false; }).map(function (l) { return '<li><a href="' + href(l.url) + '"' + ext(l.url) + '>' + esc(l.label) + '</a></li>'; }).join("");
    var contact = [];
    if (F.address) contact.push('<li>' + esc(F.address) + '</li>');
    if (F.phone) contact.push('<li><a href="tel:' + esc(String(F.phone).replace(/[^\d+]/g, "")) + '">' + esc(F.phone) + '</a></li>');
    if (F.email) contact.push('<li><a href="mailto:' + esc(F.email) + '">' + esc(F.email) + '</a></li>');
    if (F.hours) contact.push('<li>' + esc(F.hours) + '</li>');
    $("#ftr").innerHTML = '<div class="wrap foot"><div class="fcol"><strong>' + esc(S.name) + '</strong>' +
      toParas(desc).map(function (x) { return '<p>' + esc(x) + '</p>'; }).join("") + (ic ? '<div class="fsoc">' + ic + '</div>' : '') + '</div>' +
      '<div class="fcol"><h4>' + esc(F.quickTitle || "Tautan") + '</h4><ul><li><a href="' + href(S.lynk) + '" target="_blank" rel="noopener">' + esc(F.donateText || "Donasi sekarang") + '</a></li>' + quick + '</ul></div>' +
      (contact.length ? '<div class="fcol"><h4>' + esc(F.contactTitle || "Kontak") + '</h4><ul>' + contact.join("") + '</ul></div>' : '') +
      '</div><div class="wrap fbot">' + esc(fcopy) + '</div>';
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
  var CATS = [["Donasi", "donasi"], ["Zakat", "zakat"], ["Sedekah", "sedekah"], ["Wakaf", "wakaf"]];
  var DEFDESC = { Donasi: "Ulurkan bantuan Anda untuk meringankan beban mereka yang membutuhkan.", Zakat: "Tunaikan zakat maal, zakat fitrah, dan zakat lainnya melalui lembaga kami.", Sedekah: "Sedekahkan sebagian harta Anda bagi mereka yang membutuhkan.", Wakaf: "Salurkan wakaf Anda untuk kemaslahatan umat yang terus mengalir." };
  var G = S.program || {};
  var cats = CATS.filter(function (c) { return G[c[1] + "Tampil"] !== false; }).map(function (c, i) {
    return { title: c[0], id: c[1], n: ("0" + (i + 1)).slice(-2), desc: G[c[1] + "Desc"] || DEFDESC[c[0]], icon: G[c[1] + "Icon"] || "",
      cards: (G.cards || []).filter(function (x) { return x && x.category === c[0] && x.title && x.tampil !== false; }) };
  });
  if ($("#progHome")) {
    $("#progTitle").textContent = G.title || "Program Kami";
    $("#progHome").innerHTML = cats.map(function (c) {
      return '<a class="pitem" href="program.html#' + c.id + '"><span class="phead">' + (c.icon ? '<img src="' + esc(c.icon) + '" alt="">' : '') + c.title + '</span><span class="pdesc">' + esc(c.desc) + '</span><span class="pmore">Mulai ' + c.title + ' &raquo;</span></a>';
    }).join("");
  }
  if ($("#progPage")) {
    function trk(x) {
      var tg = +x.target || 0; if (!x.tracker || tg <= 0) return "";
      var kum = +x.terkumpul || 0, pct = Math.min(100, kum / tg * 100);
      return '<div class="tr"><div class="bar"><i style="width:' + pct + '%"></i></div><div class="t"><span><b>' + fmt(kum, true) + '</b> terkumpul</span><span>' + Math.round(pct) + '% dari ' + fmt(tg, true) + '</span></div></div>';
    }
    function pcard(x) {
      var inner = (x.image ? '<img src="' + esc(x.image) + '" alt="" loading="lazy">' : '<div class="ph"></div>') + '<div class="cb"><h3>' + esc(x.title) + '</h3>' + trk(x) + '</div>';
      return x.url ? '<a class="card" href="' + href(x.url) + '"' + ext(x.url) + '>' + inner + '</a>' : '<div class="card">' + inner + '</div>';
    }
    $("#progPage").innerHTML = '<h1>' + esc(G.title || "Program Kami") + '</h1>' + (G.intro ? '<p class="lead">' + esc(G.intro) + '</p>' : '') +
      '<nav class="chips" aria-label="Kategori program">' + cats.map(function (c) { return '<a href="#' + c.id + '">' + c.title + '</a>'; }).join("") + '</nav>' +
      cats.map(function (c) {
        return '<section class="psec" id="' + c.id + '"><h2>' + c.title + '</h2><p class="pdesc2">' + esc(c.desc) + '</p><div class="grid pgrid">' +
          (c.cards.length ? c.cards.map(pcard).join("") : '<p class="empty">Belum ada program di kategori ini.</p>') + '</div>' +
          (c.id === "zakat" ? '<a class="zlink" href="kalkulator.html">Hitung zakat Anda &raquo;</a>' : '') + '</section>';
      }).join("");
    document.title = (G.title || "Program Kami") + " | " + S.name;
    if (location.hash) { var tg = document.getElementById(location.hash.slice(1)); if (tg) tg.scrollIntoView(); }
  }

  if ($("#profile")) {
    var P = S.profile || {};
    $("#profile").innerHTML = '<h1>' + esc(P.title || "Profil " + S.name) + '</h1>' + (P.intro ? '<p class="lead">' + esc(P.intro) + '</p>' : '') +
      (P.sections || []).filter(on).map(function (b) {
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


  /* ===== Slideshow beranda, strip angka, tombol Donasi melayang ===== */
  var SH = S.show || {};
  function slideList() {
    var out = [];
    (SH.slides || []).filter(on).forEach(function (m) {
      if (!m.judul) return;
      out.push({ eb: m.eyebrow, h: m.judul, p: m.kalimat, btn: m.tombol || "Donasi sekarang", href: m.link || S.lynk, img: m.gambar, imgHp: m.gambarHp,
        goal: m.jenis === "Campaign" ? { kum: +m.terkumpul || 0, tar: +m.target || 0 } : null });
    });
    (G.cards || []).filter(function (x) { return x && x.title && x.tampil !== false && x.slide; }).forEach(function (x) {
      var tg = +x.target || 0;
      out.push({ eb: x.category, h: x.title, p: x.kalimatSlide, btn: "Ikut berdonasi", href: x.url || S.lynk, img: x.gambarSlide, pic: x.image, goal: x.tracker && tg > 0 ? { kum: +x.terkumpul || 0, tar: tg } : null });
    });
    S.arts.filter(function (a) { return a.tampilSlide; }).forEach(function (a) {
      out.push({ eb: "Artikel", h: a.title, p: a.summary, btn: "Baca artikel", href: "artikel.html?id=" + encodeURIComponent(idOf(a)), img: a.gambarSlide, pic: a.image });
    });
    if (!out.length) out.push({ eb: "Lembaga Amil Zakat resmi", h: "Kebaikan Anda sampai ke yang membutuhkan.", p: "LAZ SM Peduli menyalurkan donasi dengan amanah. Setiap kegiatan kami laporkan di halaman ini.", btn: "Donasi lewat Lynk", href: S.lynk });
    return out;
  }
  if ($("#hs")) {
    var L = slideList(), hsBox = $("#hsSlides"), hsDots = $("#hsDots"), hs = $("#hs"), pp = $("#hsPause");
    var DUR = Math.max(3, +SH.kecepatan || 6.5) * 1000, paused = reduce || SH.gerakOtomatis === false, ix = 0, tm = null, hold = false;
    hs.style.setProperty("--dur", DUR + "ms");
    hsBox.innerHTML = L.map(function (x, n) {
      var im = x.img ? '<picture>' + (x.imgHp ? '<source media="(max-width:640px)" srcset="' + esc(x.imgHp) + '">' : '') + '<img src="' + esc(x.img) + '" alt=""' + (n ? ' loading="lazy"' : '') + '></picture>' : '';
      var pic = !x.img && x.pic ? '<div class="hs-pic"><img src="' + esc(x.pic) + '" alt=""' + (n ? ' loading="lazy"' : '') + '></div>' : '';
      var pct = x.goal && x.goal.tar > 0 ? Math.min(100, x.goal.kum / x.goal.tar * 100) : 0;
      return '<article class="hs-slide g' + (n % 4) + (x.img ? ' has-img' : '') + (pic ? ' has-pic' : '') + '" role="group" aria-roledescription="slide" aria-label="' + (n + 1) + ' dari ' + L.length + '"><div class="hs-bg">' + im + '</div><div class="hs-shade"></div>' +
        '<div class="hs-copy">' + (x.eb ? '<span class="hs-eb">' + esc(x.eb) + '</span>' : '') + '<h2>' + esc(x.h) + '</h2>' + (x.p ? '<p>' + esc(x.p) + '</p>' : '') +
        (x.goal ? '<div class="hs-goal"><div class="t"><span><b>' + fmt(x.goal.kum, true) + '</b> terkumpul</span><span>target ' + fmt(x.goal.tar, true) + '</span></div><div class="bar"><i style="width:' + pct + '%"></i></div></div>' : '') +
        '<a class="hs-btn" href="' + href(x.href) + '"' + ext(x.href) + '>' + esc(x.btn) + '</a></div>' + pic + '</article>';
    }).join("");
    hsDots.innerHTML = L.map(function (_, n) { return '<button type="button" aria-label="Slide ' + (n + 1) + '"><i></i></button>'; }).join("");
    var sl = [].slice.call(hsBox.children), dt = [].slice.call(hsDots.children);
    if (L.length < 2) hs.classList.add("single");
    function paint() {
      sl.forEach(function (e, k) { e.classList.toggle("on", k === ix); e.setAttribute("aria-hidden", k === ix ? "false" : "true"); [].forEach.call(e.querySelectorAll("a"), function (a) { a.tabIndex = k === ix ? 0 : -1; }); });
      dt.forEach(function (d, k) { d.classList.remove("on", "run"); void d.offsetWidth; if (k === ix) { d.classList.add("on"); if (!paused) d.classList.add("run"); } });
    }
    function arm() { clearTimeout(tm); if (!paused && L.length > 1) tm = setTimeout(function () { go(ix + 1); }, DUR); }
    function go(n) { ix = (n + sl.length) % sl.length; paint(); arm(); }
    dt.forEach(function (d, k) { d.onclick = function () { go(k); }; });
    $("#hsPrev").onclick = function () { go(ix - 1); }; $("#hsNext").onclick = function () { go(ix + 1); };
    function setPaused(p) { paused = p; pp.innerHTML = p ? "&#9654;" : "&#10074;&#10074;"; pp.setAttribute("aria-label", p ? "Putar slideshow" : "Jeda slideshow"); paint(); arm(); }
    pp.onclick = function () { setPaused(!paused); }; setPaused(paused);
    hs.addEventListener("mouseenter", function () { if (!paused) { hold = true; clearTimeout(tm); dt.forEach(function (d) { d.style.animationPlayState = "paused"; }); } });
    hs.addEventListener("mouseleave", function () { if (hold) { hold = false; dt.forEach(function (d) { d.style.animationPlayState = ""; }); paint(); arm(); } });
    var x0 = null;
    hs.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    hs.addEventListener("pointerup", function (e) { if (x0 === null) return; var d = e.clientX - x0; x0 = null; if (Math.abs(d) > 50) go(ix + (d < 0 ? 1 : -1)); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) clearTimeout(tm); else arm(); });
    paint();
  }

  var SZ = { "Kecil": "1.4rem", "Sedang": "2rem", "Besar": "2.8rem", "Sangat besar": "3.8rem" };
  var sn = $("#sn");
  if (sn) {
    if (!S.stats.length) sn.hidden = true;
    sn.style.setProperty("--stat", SZ[SH.ukuranAngka] || SZ.Kecil);
    sn.style.setProperty("--n", Math.max(1, S.stats.length));
    sn.innerHTML = S.stats.map(function (x) {
      return '<div class="sn-i"><div class="sn-num' + (x.money ? ' money' : '') + '" data-v="' + (+x.value || 0) + '" data-m="' + (x.money ? 1 : 0) + '">' + fmt(+x.value || 0, x.money) + '</div><div class="sn-lab">' + esc(x.label) + '</div></div>';
    }).join("");
    var nums = [].slice.call(sn.querySelectorAll(".sn-num"));
    function fit() {
      sn.classList.remove("stack"); nums.forEach(function (n) { n.style.fontSize = ""; });
      if (!nums.length || sn.hidden) return;
      var cols = getComputedStyle(sn).gridTemplateColumns.split(" ").length;
      if (cols < nums.length) return;
      var size = parseFloat(getComputedStyle(nums[0]).fontSize), min = 17.6;
      var over = function () { return nums.some(function (n) { return n.scrollWidth > n.clientWidth + 1; }); };
      while (over() && size > min) { size -= 1; nums.forEach(function (n) { n.style.fontSize = size + "px"; }); }
      if (over()) { nums.forEach(function (n) { n.style.fontSize = ""; }); sn.classList.add("stack"); }
    }
    fit(); window.addEventListener("resize", fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    if (!reduce && "IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return; io.disconnect();
        nums.forEach(function (el) {
          var v = +el.dataset.v, m = +el.dataset.m; if (!v) return; var t0 = null;
          (function step(t) { if (!t0) t0 = t; var p = Math.min(1, (t - t0) / 1200), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(v * e, m); if (p < 1) requestAnimationFrame(step); else fit(); })(performance.now());
        });
      }, { threshold: 0.3 }); io.observe(sn);
    }
  }

  var FB = SH.fab || {};
  if (FB.tampil !== false) {
    var FI = { "Hati": "heart", "Tangan memberi": "hand", "Koin Rp": "coin", "Tanpa gambar": "none" };
    var SV = {
      heart: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21.2l-1.4-1.3C5.5 15.3 2.2 12.3 2.2 8.6 2.2 5.6 4.5 3.3 7.5 3.3c1.7 0 3.3.8 4.5 2.1 1.2-1.3 2.8-2.1 4.5-2.1 3 0 5.3 2.3 5.3 5.3 0 3.7-3.3 6.7-8.4 11.3L12 21.2z"/></svg>',
      hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9.6s-3.2-1.9-3.2-4.1A1.9 1.9 0 0 1 12 4.4a1.9 1.9 0 0 1 3.2 1.1c0 2.2-3.2 4.1-3.2 4.1z" fill="currentColor"/><path d="M2.5 14.2h3l3.1 1.6h4.1c1.1 0 1.5 1.3.5 1.8l-4 .3"/><path d="M12.9 16.6l5.4-2.9c1-.5 2 .6 1.3 1.5L16.2 20H8.6l-3.1-1.5H2.5"/></svg>',
      coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="9.2"/><text x="12" y="15.6" text-anchor="middle" font-size="9.5" font-weight="800" fill="currentColor" stroke="none">Rp</text></svg>'
    };
    var ik = FI[FB.ikon] || "heart", word = String(FB.tulisan || "Donasi").trim() || "Donasi";
    var showT = FB.tulisanTampil !== false || ik === "none", fu = FB.link || S.lynk;
    var fa = document.createElement("a");
    fa.className = "fab " + (FB.posisi === "Kiri bawah" ? "l" : "r") + (showT ? "" : " round");
    fa.href = fu; if (/^https?:/i.test(fu) && !sameSite(fu)) { fa.target = "_blank"; fa.rel = "noopener"; }
    fa.setAttribute("aria-label", word);
    fa.innerHTML = (ik !== "none" ? SV[ik] : "") + (showT ? "<span>" + esc(word) + "</span>" : "");
    document.body.appendChild(fa);
  }

  /* ===== Pita hijau di atas halaman dalam ===== */
  var BL = { news: "Kabar", artikel: "Artikel", about: "Profil", program: "Program", kalkulator: "Kalkulator" };
  function band() {
    if ((S.theme || {}).aksen === "Mati") return true;
    var m = $("main.page"); if (!m) return true;
    if (m.querySelector(".pband")) return true;
    var h = m.querySelector("h1"); if (!h) return false;
    var d = document.createElement("div"), w = document.createElement("div"), lead = h.nextElementSibling;
    d.className = "pband"; w.className = "wrap";
    if (BL[page]) { var e = document.createElement("span"); e.className = "pb-eb"; e.textContent = BL[page]; w.appendChild(e); }
    w.appendChild(h);
    if (lead && lead.classList.contains("lead")) w.appendChild(lead);
    d.appendChild(w); m.insertBefore(d, m.firstChild); m.classList.add("has-band");
    return true;
  }
  if ($("main.page") && !band()) {
    var mo = new MutationObserver(function () { if (band()) mo.disconnect(); });
    mo.observe($("main.page"), { childList: true, subtree: true });
  }

  /* ===== Halaman Artikel ===== */
  if ($("#artPage")) {
    var A = S.artikel || {}, aid = new URLSearchParams(location.search).get("id");
    var an = S.arts.filter(function (x) { return idOf(x) === aid; })[0];
    function abody(n) {
      return toParas(n.body).map(function (t) { return /^##\s+/.test(t) ? '<h2 class="ah">' + esc(t.replace(/^##\s+/, "")) + '</h2>' : '<p>' + esc(t) + '</p>'; }).join("") || '<p>' + esc(n.summary) + '</p>';
    }
    if (aid) {
      $("#artPage").innerHTML = '<div class="art"><a class="back" href="artikel.html">&larr; Semua artikel</a>' + (an ?
        '<time>' + dateId(an.date) + '</time><h1>' + esc(an.title) + '</h1>' + (an.image ? '<img src="' + esc(an.image) + '" alt="">' : '') + abody(an) +
        '<p><a class="zlink" href="' + href(S.lynk) + '"' + ext(S.lynk) + '>Tunaikan kebaikan Anda &raquo;</a></p>' : '<h1>Artikel tidak ditemukan</h1><p>Periksa tautan, atau buka halaman Artikel.</p>') + '</div>';
      if (an) document.title = an.title + " | " + S.name;
    } else {
      $("#artPage").innerHTML = '<h1>' + esc(A.title || "Artikel") + '</h1>' + (A.intro ? '<p class="lead">' + esc(A.intro) + '</p>' : '') +
        '<div class="grid">' + (S.arts.length ? S.arts.map(function (n) { return card(n, "artikel.html"); }).join("") : '<p class="empty">Belum ada artikel.</p>') + '</div>';
      document.title = (A.title || "Artikel") + " | " + S.name;
    }
  }
  Array.prototype.forEach.call(document.querySelectorAll("[data-lynk]"), function (a) { a.href = S.lynk; });
}
function J(u) { return fetch(u, { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
Promise.all([J("data/site.json"), J("data/menu.json"), J("data/beranda.json"), J("data/berita.json"), J("data/program.json"), J("data/profil.json"), J("data/slideshow.json"), J("data/artikel.json")]).then(function (a) {
  var S = a[0] || {};
  if (a[1]) { if (a[1].menu) S.menu = a[1].menu; if (a[1].footer) S.footer = a[1].footer; }
  if (a[2] && a[2].stats) S.stats = a[2].stats;
  if (a[3] && a[3].news) S.news = a[3].news;
  if (a[4]) S.program = a[4];
  if (a[5]) S.profile = a[5];
  if (a[6]) S.show = a[6];
  if (a[7]) S.artikel = a[7];
  run(S);
});

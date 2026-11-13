var PAL = { "Hijau (bawaan)": ["#0f3d2a", "#2e8b57", "#f4b942"], "Biru": ["#0d2f5a", "#2a73c5", "#f4b942"], "Ungu": ["#3a1d5c", "#8a4fc7", "#f4b942"], "Merah marun": ["#5a1420", "#c2415a", "#f2c14e"], "Teal": ["#0b3c49", "#1d8fa3", "#f4b942"] };
var SIZES = { "Kecil": 15, "Normal": 16, "Besar": 18, "Sangat besar": 20 };
function applyTheme(t) {
  t = t || {};
  var p = PAL[t.palette] || PAL["Hijau (bawaan)"], st = document.documentElement.style, hex = /^#[0-9a-f]{6}$/i;
  ["forest", "leaf", "sun"].forEach(function (k, i) { st.setProperty("--" + k, hex.test(t[k] || "") ? t[k] : p[i]); });
  var hf = t.headingFont || "Bricolage Grotesque", bf = t.bodyFont || "Source Sans 3";
  st.setProperty("--fh", '"' + hf + '"'); st.setProperty("--fb", '"' + bf + '"');
  st.setProperty("--root", (SIZES[t.textSize] || 16) + "px");
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
  var nav = [["index.html", "Beranda", "home"], ["news.html", "Kabar", "news"], ["about.html", "Profil", "about"]];

  $("#hdr").innerHTML = '<div class="wrap bar"><a class="brand" href="index.html">' + (S.logo ? '<img class="logo" src="' + S.logo + '" alt="' + (S.showName === false ? S.name : '') + '">' : '<span class="mark" aria-hidden="true"></span>') + (S.showName === false && S.logo ? '' : S.name) + '</a><nav>' +
    nav.map(function (n) { return '<a href="' + n[0] + '"' + (n[2] === page ? ' aria-current="page"' : '') + '>' + n[1] + '</a>'; }).join("") +
    '</nav><a class="btn small" href="' + S.lynk + '" target="_blank" rel="noopener">Donasi</a></div>';
  $("#ftr").innerHTML = '<div class="wrap foot"><p><strong>' + S.name + '</strong><br>Lembaga amil zakat. Donasi diproses melalui Lynk.</p><p><a href="' + S.lynk + '" target="_blank" rel="noopener">Donasi sekarang</a></p><p class="mut">&copy; ' + new Date().getFullYear() + ' ' + S.name + '</p></div>';

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
  if ($("#profile")) {
    var P = S.profile || {};
    $("#profile").innerHTML = '<h1>' + esc(P.title || "Profil " + S.name) + '</h1>' + (P.intro ? '<p class="lead">' + esc(P.intro) + '</p>' : '') +
      (P.sections || []).map(function (b) {
        return '<div class="blk"><h2>' + esc(b.heading) + '</h2>' + toParas(b.text).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("") + '</div>';
      }).join("");
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

/* Kalkulator zakat. Isi (harga, tautan, doa) dibaca dari data/kalkulator.json.
   Rumus mengikuti buku Fikih Zakat Kontekstual Indonesia (BAZNAS) dan PMA 52/2014. */
(function () {
  var DEF = { judul: "Kalkulator Zakat", intro: "Hitung zakat Anda, lalu tunaikan melalui kami. Hasil hitungan berupa perkiraan.",
    hargaEmas: 2000000, hargaPerak: 25000, hargaBeras: 15000, hargaGabah: 4500, tanggalHarga: "",
    tombol: "Tunaikan Zakat", linkUmum: "", links: {},
    catatan: "Hasil ini hanya perkiraan. Untuk kepastian hukum zakat Anda, tanyakan kepada amil atau ulama." };
  function get(u) { return fetch(u, { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : {}; }).catch(function () { return {}; }); }
  Promise.all([get("data/kalkulator.json"), get("data/site.json")]).then(function (r) {
    var D = {}, k; for (k in DEF) D[k] = DEF[k];
    for (k in r[0]) { var v = r[0][k]; if (v !== "" && v !== null && v !== undefined && !(Array.isArray(v) && !v.length)) D[k] = v; }
    ["hargaEmas", "hargaPerak", "hargaBeras", "hargaGabah"].forEach(function (x) { D[x] = Number(D[x]) || DEF[x]; });
    start(D, (r[1] && r[1].lynk) || "https://lynk.id/lazsmpeduli");
  });
  function start(D, LYNK) {
    var root = document.getElementById("calc"); if (!root) return;
    var esc = function (t) { var e = document.createElement("div"); e.textContent = t || ""; return e.innerHTML; };
    root.innerHTML = '<div id="kz"><h1>' + esc(D.judul) + '</h1><p class="lead">' + esc(D.intro) + '</p>' +
      '<section class="kcard"><div class="tabs" role="tablist" id="groups"></div><div class="tabs ksub" role="tablist" id="tabs"></div>' +
      '<p class="desc" id="desc"></p><div class="kgrid" id="form"></div>' +
      '<div class="actions"><button class="kbtn ghost" id="reset" type="button">Hapus isian</button></div>' +
      '<div class="res" id="res" aria-live="polite"></div><div id="doa"></div>' +
      '<div class="actions"><a class="kbtn" id="payBtn" href="' + esc(LYNK) + '" target="_blank" rel="noopener">' + esc(D.tombol) + '</a></div></section>' +
      '<p class="knisab">Nisab emas, uang &amp; usaha: <b id="nEmas"></b> &middot; penghasilan per bulan: <b id="nBulan"></b> &middot; perak: <b id="nPerak"></b><br>' +
      'Dihitung dari harga emas ' + rpf(D.hargaEmas) + '/gram, perak ' + rpf(D.hargaPerak) + '/gram, gabah ' + rpf(D.hargaGabah) + '/kg, beras ' + rpf(D.hargaBeras) + '/kg' + (D.tanggalHarga ? ' (' + esc(D.tanggalHarga) + ')' : '') + '.</p>' +
      '<p class="kfoot">' + esc(D.catatan) + '</p></div>';
    function rpf(n) { return "Rp " + Math.round(n).toLocaleString("id-ID"); }

var rp=function(n){return "Rp "+Math.round(n).toLocaleString("id-ID")};
var num=function(s){var v=parseFloat(String(s||"").replace(/\./g,"").replace(",","."));return isNaN(v)?0:v};
var fmtLive=function(el){var raw=el.value.replace(/[^\d]/g,"");el.value=raw?Number(raw).toLocaleString("id-ID"):""};
var U=function(id,label,hint){return {id:id,label:label,hint:hint||"",unit:"Rp"}};
var UTANG=U("utang","Utang jatuh tempo","Utang yang harus dibayar dalam waktu dekat");

function simple(fields,sum,nisabKey,nisabLabel,rows){return {fields:fields,calc:function(v,P){var h=sum(v,P);var n=nisabKey==="perak"?595*P.perak:85*P.emas;return{harta:h,utang:v.utang||0,nisab:n,nisabLabel:nisabLabel,detail:rows(v,P,h)}}}}
function usaha(extra){return {
  fields:[U("modal","Modal usaha yang diputar","Tidak termasuk sarana pendukung "+extra),U("untung","Keuntungan"),U("simpanan","Simpanan / kas usaha"),U("piutang","Piutang yang bisa ditagih"),UTANG],
  calc:function(v){var h=v.modal+v.untung+v.simpanan+v.piutang;return{harta:h,utang:v.utang,nisab:null,nisabLabel:"setara 85 gram emas",detail:[["Modal",rp(v.modal)],["Keuntungan",rp(v.untung)],["Simpanan / kas",rp(v.simpanan)],["Piutang",rp(v.piutang)]]}}}}
var LABA={label:"Dari laba bersih",noHaul:true,fields:[U("laba","Laba bersih selama 1 tahun","Setelah dikurangi biaya operasional")],
  calc:function(v){return{harta:v.laba,utang:0,nisab:null,nisabLabel:"setara 85 gram emas",detail:[["Laba bersih 1 tahun",rp(v.laba)]]}}};

var GROUPS={maal:"Zakat Maal",usaha:"Zakat Usaha",hasil:"Zakat Penghasilan",tani:"Zakat Pertanian",ternak:"Zakat Peternakan",fitrah:"Zakat Fitrah"};
var TYPES={
  emas:{g:"maal",label:"Emas",desc:"Emas perhiasan atau batangan yang disimpan dan dimiliki penuh selama 1 tahun.",
    methods:{m:simple([{id:"gram",label:"Berat emas",hint:"Total seluruh emas yang Anda simpan",unit:"gram",dec:true},UTANG],function(v,P){return v.gram*P.emas},"emas","85 gram emas",function(v,P,h){return[["Berat emas",v.gram+" gram"],["Nilai emas",rp(h)]]})}},
  perak:{g:"maal",label:"Perak",desc:"Perak yang disimpan dan dimiliki penuh selama 1 tahun.",
    methods:{m:simple([{id:"gram",label:"Berat perak",hint:"Total seluruh perak yang Anda simpan",unit:"gram",dec:true},UTANG],function(v,P){return v.gram*P.perak},"perak","595 gram perak",function(v,P,h){return[["Berat perak",v.gram+" gram"],["Nilai perak",rp(h)]]})}},
  uang:{g:"maal",label:"Uang",desc:"Tabungan, deposito, dan uang tunai yang sudah mengendap 1 tahun.",
    methods:{m:simple([U("tab","Tabungan","Saldo semua rekening"),U("dep","Deposito"),U("kas","Uang tunai / e-wallet"),UTANG],function(v){return v.tab+v.dep+v.kas},"emas","setara 85 gram emas",function(v){return[["Tabungan",rp(v.tab)],["Deposito",rp(v.dep)],["Uang tunai / e-wallet",rp(v.kas)]]})}},
  surat:{g:"maal",label:"Surat Berharga",desc:"Saham, obligasi, reksadana, dan sejenisnya. Hitung modal ditambah keuntungan.",
    methods:{m:simple([U("modal","Modal","Nilai awal yang Anda investasikan"),U("untung","Keuntungan","Keuntungan yang sudah diterima atau bertambah"),U("piutang","Piutang yang bisa dicairkan","Tagihan yang pasti dibayar"),UTANG],function(v){return v.modal+v.untung+v.piutang},"emas","setara 85 gram emas",function(v){return[["Modal",rp(v.modal)],["Keuntungan",rp(v.untung)],["Piutang",rp(v.piutang)]]})}},
  niaga:{g:"usaha",label:"Perniagaan",desc:"Usaha dagang atau jual beli. Pilih cara menghitung yang sesuai pembukuan Anda.",
    methods:{aset:Object.assign({label:"Dari aset usaha"},usaha("seperti toko, rak, dan kendaraan")),laba:LABA}},
  ikan:{g:"usaha",label:"Perikanan",desc:"Hasil usaha perikanan dan tambak.",
    methods:{aset:Object.assign({label:"Dari aset usaha"},usaha("seperti kolam, jaring, dan perahu")),laba:LABA}},
  tambang:{g:"usaha",label:"Pertambangan",desc:"Hasil usaha pertambangan.",
    methods:{aset:Object.assign({label:"Dari aset usaha"},usaha("seperti alat berat dan peralatan tambang")),laba:LABA}},
  perusahaan:{g:"usaha",label:"Perusahaan",desc:"Perusahaan atau badan usaha. Pilih metode aktiva lancar atau metode laba.",
    methods:{aset:{label:"Aktiva lancar − utang lancar",fields:[U("kas","Kas dan bank"),U("piut","Piutang usaha"),U("sedia","Persediaan"),U("utang","Utang lancar","Utang jangka pendek")],
      calc:function(v){var h=v.kas+v.piut+v.sedia;return{harta:h,utang:v.utang,nisab:null,nisabLabel:"setara 85 gram emas",detail:[["Kas dan bank",rp(v.kas)],["Piutang usaha",rp(v.piut)],["Persediaan",rp(v.sedia)]]}}},
      laba:{label:"Dari laba sebelum pajak",noHaul:true,fields:[U("laba","Laba sebelum pajak selama 1 tahun")],calc:function(v){return{harta:v.laba,utang:0,nisab:null,nisabLabel:"setara 85 gram emas",detail:[["Laba sebelum pajak",rp(v.laba)]]}}}}}
};
var DOA=[
 {t:"Niat zakat maal",ar:"نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ مَالِي فَرْضًا لِلَّهِ تَعَالَى",lat:"Nawaitu an ukhrija zakāta mālī fardhan lillāhi ta‘ālā.",art:"Aku berniat mengeluarkan zakat hartaku, fardu karena Allah Ta‘ala."},
 {t:"Doa menunaikan zakat",ar:"رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ",lat:"Rabbanā taqabbal minnā innaka antas-samī‘ul-‘alīm.",art:"Ya Tuhan kami, terimalah dari kami (amal kami). Sesungguhnya Engkaulah Yang Maha Mendengar lagi Maha Mengetahui."}
];
TYPES.hasil={g:"hasil",label:"Penghasilan",desc:"Gaji, tunjangan, honor, dan penghasilan lain dari pekerjaan atau profesi. Pilih dihitung per bulan atau per tahun.",
  methods:{bulan:{label:"Per bulan",noHaul:true,bl:"Penghasilan bersih",okMsg:"Penghasilan Anda mencapai nisab.",utangLabel:"Cicilan",nisabLabel:"85 gram emas ÷ 12",per:12,fields:[U("gaji","Gaji pokok"),U("tunj","Tunjangan"),U("bonus","Honor / bonus / insentif"),U("lain","Penghasilan lain"),U("utang","Cicilan","Cicilan utang yang wajib dibayar (bukan pengeluaran lain)")],
      calc:function(v){var h=v.gaji+v.tunj+v.bonus+v.lain;return{harta:h,utang:v.utang,nisab:null,utangLabel:"Cicilan",detail:[["Gaji pokok",rp(v.gaji)],["Tunjangan",rp(v.tunj)],["Honor / bonus",rp(v.bonus)],["Penghasilan lain",rp(v.lain)]]}}},tahun:{label:"Per tahun",noHaul:true,bl:"Penghasilan bersih",okMsg:"Penghasilan Anda mencapai nisab.",utangLabel:"Cicilan",nisabLabel:"85 gram emas",per:1,fields:[U("gaji","Gaji pokok"),U("tunj","Tunjangan"),U("bonus","Honor / bonus / insentif"),U("lain","Penghasilan lain"),U("utang","Cicilan","Cicilan utang yang wajib dibayar (bukan pengeluaran lain)")],
      calc:function(v){var h=v.gaji+v.tunj+v.bonus+v.lain;return{harta:h,utang:v.utang,nisab:null,utangLabel:"Cicilan",detail:[["Gaji pokok",rp(v.gaji)],["Tunjangan",rp(v.tunj)],["Honor / bonus",rp(v.bonus)],["Penghasilan lain",rp(v.lain)]]}}}}};
TYPES.hasil.methods.bulan.label="Per bulan";TYPES.hasil.methods.tahun.label="Per tahun";
TYPES.fitrah={g:"fitrah",label:"Fitrah",desc:"Zakat fitrah wajib atas setiap jiwa, ditunaikan sebelum salat Idulfitri. Tidak ada nisab dan haul.",
  methods:{uang:{label:"Bayar dengan uang",fitrah:"uang",fields:[{id:"jiwa",label:"Jumlah jiwa",hint:"Diri sendiri dan tanggungan Anda",unit:"orang"}]},
           beras:{label:"Bayar dengan beras",fitrah:"beras",fields:[{id:"jiwa",label:"Jumlah jiwa",hint:"Diri sendiri dan tanggungan Anda",unit:"orang"}]}}};

var TANI=function(label,rate,irig){return {label:label,rate:rate,noHaul:true,bl:"Hasil panen bersih",okMsg:"Hasil panen bersih mencapai nisab.",utangLabel:"Biaya dan utang",nisabLabel:"653 kg gabah",nisabKg:653,
  fields:[{id:"kg",label:"Hasil panen",hint:"Jumlah hasil panen",unit:"kg",dec:true},U("harga","Harga hasil panen per kg","Harga jual saat panen"),U("biaya","Biaya produksi","Pupuk, bibit, racun hama, upah, angkut")].concat(irig?[U("irig","Biaya irigasi / pengairan")]:[]).concat([U("utang","Utang yang harus dibayar")]),
  calc:function(v){var h=v.kg*v.harga;return{harta:h,utang:v.biaya+(v.irig||0)+v.utang,nisab:null,utangLabel:"Biaya dan utang",detail:[["Hasil panen",v.kg+" kg"],["Nilai hasil panen",rp(h)]]}}}};
TYPES.tani={g:"tani",label:"Pertanian",desc:"Hasil pertanian, perkebunan, dan kehutanan. Dibayar saat panen, tanpa haul. Pilih jenis pengairan.",
  methods:{irigasi:TANI("Pakai irigasi / biaya pengairan (5%)",0.05,true),hujan:TANI("Tadah hujan (10%)",0.1,false)}};
var NIAT=function(){return 0};
function cnt(n,w){return n+" ekor "+w}
function unta(n){
  if(n<5)return null;
  var T=[[9,"1 ekor kambing"],[14,"2 ekor kambing"],[19,"3 ekor kambing"],[24,"4 ekor kambing"],[35,"1 ekor unta betina umur 1 tahun"],[45,"1 ekor unta betina umur 2 tahun"],[60,"1 ekor unta betina umur 3 tahun"],[75,"1 ekor unta betina umur 4 tahun"],[90,"2 ekor unta betina umur 2 tahun"],[120,"2 ekor unta betina umur 3 tahun"]];
  for(var i=0;i<T.length;i++)if(n<=T[i][0])return T[i][1];
  var best=null;
  for(var a=0;a*50<=n;a++)for(var b=0;a*50+b*40<=n;b++){var r=n-a*50-b*40;if(best===null||r<best.r||(r===best.r&&a>best.a))best={a:a,b:b,r:r}}
  var p=[];if(best.a)p.push(best.a+" ekor unta betina umur 3 tahun");if(best.b)p.push(best.b+" ekor unta betina umur 2 tahun");
  return p.join(" dan ")+" (setiap tambahan 50 ekor: 1 ekor umur 3 tahun, setiap tambahan 40 ekor: 1 ekor umur 2 tahun)";
}
function sapi(n){
  if(n<30)return null;
  var T=[[39,"1 ekor anak sapi jantan atau betina (umur 1 tahun)"],[59,"1 ekor anak sapi betina (umur 2 tahun)"],[69,"2 ekor anak sapi jantan atau betina (umur 1 tahun)"],[79,"1 ekor anak sapi betina (umur 2 tahun) dan 1 ekor anak sapi jantan (umur 1 tahun)"],[89,"2 ekor anak sapi betina (umur 2 tahun)"],[99,"3 ekor anak sapi jantan (umur 1 tahun)"],[109,"2 ekor anak sapi betina (umur 1 tahun) dan 2 ekor anak sapi jantan (umur 1 tahun)"],[119,"2 ekor anak sapi betina (umur 2 tahun) dan 1 ekor anak sapi jantan (umur 1 tahun)"],[120,"3 ekor anak sapi betina (umur 2 tahun) atau 3 ekor anak sapi jantan (umur 1 tahun)"]];
  for(var i=0;i<T.length;i++)if(n<=T[i][0])return T[i][1];
  var best=null;
  for(var b=0;b*40<=n;b++){var a=Math.floor((n-b*40)/30),r=n-b*40-a*30;if(best===null||r<best.r||(r===best.r&&b>best.b))best={a:a,b:b,r:r}}
  var p=[];if(best.a)p.push(best.a+" ekor anak sapi jantan atau betina (umur 1 tahun)");if(best.b)p.push(best.b+" ekor anak sapi betina (umur 2 tahun)");
  return p.join(" dan ");
}
function kambing(n){
  if(n<40)return null;
  if(n<=120)return "1 ekor kambing";if(n<=200)return "2 ekor kambing";if(n<=399)return "3 ekor kambing";
  return Math.floor(n/100)+" ekor kambing";
}
var TER=function(label,fn){return {label:label,ternak:fn,fields:[{id:"n",label:"Jumlah ekor",hint:"Seluruh hewan jenis ini yang Anda miliki",unit:"ekor"}]}};
TYPES.ternak={g:"ternak",label:"Peternakan",desc:"Hewan ternak yang digembalakan dan dimiliki 1 tahun. Zakatnya berupa hewan, bukan uang. Pilih jenis hewan.",
  methods:{unta:TER("Unta",unta),sapi:TER("Sapi / kerbau",sapi),kambing:TER("Kambing / domba",kambing)}};
function ternak(m,v){
  var n=Math.round(v.n),res=document.getElementById("res"),doa=document.getElementById("doa");
  var haul=document.getElementById("haul").checked,gb=document.getElementById("gembala").checked;
  var P=prices();document.getElementById("nEmas").textContent=rp(85*P.emas);document.getElementById("nPerak").textContent=rp(595*P.perak);document.getElementById("nBulan").textContent=rp(85*P.emas/12);
  var out=n>0?m.ternak(n):null,st,msg,big="";
  if(n<1){st="Isi data di atas";msg="Masukkan jumlah ekor."}
  else if(!out){st="Belum wajib zakat";msg="Jumlah ternak belum mencapai nisab."}
  else if(!haul){st="Belum wajib zakat";msg="Sudah mencapai nisab, tetapi belum genap 1 tahun (haul)."}
  else if(!gb){st="Bukan zakat peternakan";msg="Ternak yang dikandangkan dan diniatkan untuk dijual dihitung sebagai zakat perniagaan (lihat tab Zakat Usaha)."}
  else{st="Wajib zakat";msg="Zakat dibayarkan berupa hewan, bukan uang.";big=out}
  var w=st==="Wajib zakat";
  res.innerHTML='<span class="st'+(w?'':' no')+'">'+st+'</span><p class="msg">'+msg+'</p><div class="rows"><div class="row"><span>Jenis hewan</span><b>'+m.label+'</b></div><div class="row"><span>Jumlah</span><b>'+(n>0?n+" ekor":"-")+'</b></div></div>'+(w?'<div class="msg" style="margin-top:14px">Zakat yang harus dikeluarkan</div><div class="big" style="font-size:1.5rem;line-height:1.3">'+big+'</div><div class="msg" style="font-size:.85rem;margin-top:8px">Hubungi LAZ SM Peduli untuk menunaikan, atau menukar dengan nilai hewan sesuai ketentuan amil.</div>':'');
  doa.innerHTML=w?'<div class="doa">'+DOA.map(function(d){return '<h3>'+d.t+'</h3><div class="ar" lang="ar">'+d.ar+'</div><p class="lat">'+d.lat+'</p><p class="kart">'+d.art+'</p>'}).join("")+'</div>':"";
}
var DOAF=[{t:"Niat zakat fitrah untuk diri sendiri",ar:"نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنْ نَفْسِي فَرْضًا لِلَّهِ تَعَالَى",lat:"Nawaitu an ukhrija zakātal-fitri ‘an nafsī fardhan lillāhi ta‘ālā.",art:"Aku berniat mengeluarkan zakat fitrah untuk diriku, fardu karena Allah Ta‘ala."},{t:"Niat zakat fitrah untuk keluarga",ar:"نَوَيْتُ أَنْ أُخْرِجَ زَكَاةَ الْفِطْرِ عَنِّي وَعَنْ جَمِيعِ مَا يَلْزَمُنِي نَفَقَاتُهُمْ شَرْعًا فَرْضًا لِلَّهِ تَعَالَى",lat:"Nawaitu an ukhrija zakātal-fitri ‘annī wa ‘an jamī‘i mā yalzamunī nafaqātuhum syar‘an fardhan lillāhi ta‘ālā.",art:"Aku berniat mengeluarkan zakat fitrah untuk diriku dan semua orang yang nafkahnya menjadi tanggunganku, fardu karena Allah Ta‘ala."},DOA[1]];
var curT="emas",curM="m";
function normDoa(a){return (a||[]).filter(function(x){return x&&x.arab}).map(function(x){return{t:x.judul||"",ar:x.arab,lat:x.latin||"",art:x.arti||""}})}
if(normDoa(D.doaMaal).length)DOA=normDoa(D.doaMaal);
if(normDoa(D.doaFitrah).length)DOAF=normDoa(D.doaFitrah);

function prices(){return{emas:D.hargaEmas,perak:D.hargaPerak,beras:D.hargaBeras,gabah:D.hargaGabah}}
function curType(){return TYPES[curT]}
function curMethod(){var t=curType();return t.methods[curM]||t.methods[Object.keys(t.methods)[0]]}
function field(f){
  var d=document.createElement("div");
  d.innerHTML='<label for="f_'+f.id+'">'+f.label+(f.hint?'<span class="hint">'+f.hint+'</span>':'')+'</label><div class="inp"><span>'+f.unit+'</span><input id="f_'+f.id+'" inputmode="'+(f.dec?'decimal':'numeric')+'" placeholder="0" autocomplete="off"></div>';
  var inp=d.querySelector("input");
  inp.addEventListener("input",function(){if(!f.dec)fmtLive(inp);calc()});
  return d;
}
function build(){
  var t=curType(),keys=Object.keys(t.methods);
  if(!t.methods[curM])curM=keys[0];
  var m=curMethod();
  document.getElementById("desc").textContent=t.desc;
  var form=document.getElementById("form");form.innerHTML="";
  if(keys.length>1){
    var mm=document.createElement("div");mm.className="full methods";
    keys.forEach(function(k){var l=document.createElement("label");l.innerHTML='<input type="radio" name="meth" value="'+k+'"'+(k===curM?' checked':'')+'>'+t.methods[k].label;l.querySelector("input").onchange=function(){curM=k;build()};mm.appendChild(l)});
    form.appendChild(mm);
  }
  m.fields.forEach(function(f){form.appendChild(field(f))});
  if(!m.noHaul){
    var h=document.createElement("div");h.className="full";
    h.innerHTML='<label class="check"><input type="checkbox" id="haul"><span><b>Harta ini sudah saya miliki selama 1 tahun (haul)</b><span class="hint">Centang jika ya. Jika belum, zakat belum wajib.</span></span></label>';
    h.querySelector("input").addEventListener("change",calc);
    form.appendChild(h);
  }
  if(m.ternak){var g=document.createElement("div");g.className="full";g.innerHTML='<label class="check"><input type="checkbox" id="gembala"><span><b>Hewan ini digembalakan di padang</b><span class="hint">Bukan hewan kerja, bukan hewan pribadi, dan tidak dikandangkan untuk dijual.</span></span></label>';g.querySelector("input").addEventListener("change",calc);form.appendChild(g)}
  [].forEach.call(document.querySelectorAll("#groups .tab"),function(b){b.setAttribute("aria-selected",b.dataset.k===t.g)});
  var tb=document.getElementById("tabs");tb.innerHTML="";
  Object.keys(TYPES).filter(function(k){return TYPES[k].g===t.g}).forEach(function(k){var b=document.createElement("button");b.className="tab";b.type="button";b.setAttribute("role","tab");b.textContent=TYPES[k].label;b.setAttribute("aria-selected",k===curT);b.onclick=function(){curT=k;build()};tb.appendChild(b)});
  calc();
}
function copyText(txt,btn){
  var done=function(){btn.textContent="Tersalin ✓ Tempel di Lynk";setTimeout(function(){btn.textContent="Salin jumlah zakat"},2500)};
  var fb=function(){var a=document.createElement("textarea");a.value=txt;document.body.appendChild(a);a.select();try{document.execCommand("copy")}catch(e){}document.body.removeChild(a);done()};
  try{navigator.clipboard.writeText(txt).then(done,fb)}catch(e){fb()}
}
function fitrah(m,v,P){
  var j=Math.round(v.jiwa),res=document.getElementById("res"),doa=document.getElementById("doa");
  document.getElementById("nEmas").textContent=rp(85*P.emas);document.getElementById("nPerak").textContent=rp(595*P.perak);document.getElementById("nBulan").textContent=rp(85*P.emas/12);
  if(j<1){res.innerHTML='<span class="st no">Isi data di atas</span><p class="msg">Masukkan jumlah jiwa.</p>';doa.innerHTML="";return}
  var kg=j*2.5,l=j*3.5,uang=Math.round(kg*P.beras);
  if(m.fitrah==="uang"){
    res.innerHTML='<span class="st">Wajib zakat fitrah</span><p class="msg">Setiap jiwa wajib 2,5 kg beras, dinilai dengan harga beras setempat.</p><div class="rows"><div class="row"><span>Jumlah jiwa</span><b>'+j+' orang</b></div><div class="row"><span>Beras per jiwa</span><b>2,5 kg</b></div><div class="row"><span>Harga beras per kg</span><b>'+rp(P.beras)+'</b></div></div><div class="msg" style="margin-top:14px">Zakat fitrah yang harus dibayar</div><div class="big">'+rp(uang)+'</div><button class="copy" id="cp" type="button">Salin jumlah zakat</button><div class="msg" style="font-size:.85rem">Yang disalin berupa angka saja ('+uang+'), siap ditempel di kolom nominal Lynk.</div>';
    var cp=document.getElementById("cp");cp.onclick=function(){copyText(String(uang),cp)};
  }else{
    res.innerHTML='<span class="st">Wajib zakat fitrah</span><p class="msg">Beras diserahkan kepada amil atau mustahik sebelum salat Idulfitri.</p><div class="rows"><div class="row"><span>Jumlah jiwa</span><b>'+j+' orang</b></div></div><div class="msg" style="margin-top:14px">Zakat fitrah berupa beras</div><div class="big">'+kg.toLocaleString("id-ID")+' kg</div><div class="msg">atau '+l.toLocaleString("id-ID")+' liter beras</div>';
  }
  doa.innerHTML='<div class="doa">'+DOAF.map(function(d){return '<h3>'+d.t+'</h3><div class="ar" lang="ar">'+d.ar+'</div><p class="lat">'+d.lat+'</p><p class="kart">'+d.art+'</p>'}).join("")+'</div>';
}
function updatePay(){var l=String((D.links||{})[curT]||"").trim();var b=document.getElementById("payBtn");b.href=l||D.linkUmum||LYNK;b.title=b.href}
function calc(){updatePay();
  var P=prices(),m=curMethod(),v={};
  m.fields.forEach(function(f){v[f.id]=num(document.getElementById("f_"+f.id).value)});
  if(m.fitrah){return fitrah(m,v,P)}
  if(m.ternak){return ternak(m,v)}
  var r=m.calc(v,P);
  if(r.nisab===null)r.nisab=m.nisabKg?m.nisabKg*P.gabah:85*P.emas/(m.per||1);
  var hEl=document.getElementById("haul"),haul=m.noHaul?true:hEl.checked;
  var bersih=Math.max(0,r.harta-r.utang),ok=bersih>=r.nisab&&r.nisab>0;
  var wajib=ok&&haul,zakat=wajib?Math.round(bersih*(m.rate||0.025)):0;
  document.getElementById("nEmas").textContent=rp(85*P.emas);
  document.getElementById("nPerak").textContent=rp(595*P.perak);document.getElementById("nBulan").textContent=rp(85*P.emas/12);
  var status,msg;
  if(r.harta===0){status="Isi data di atas";msg="Hasil akan muncul setelah Anda mengisi."}
  else if(!ok){status="Belum wajib zakat";msg=(m.bl||"Harta bersih")+" Anda belum mencapai nisab ("+(m.nisabLabel||r.nisabLabel)+").";}
  else if(!haul){status="Belum wajib zakat";msg="Sudah mencapai nisab, tetapi belum genap 1 tahun (haul).";}
  else{status="Wajib zakat";msg=m.noHaul?(m.okMsg||"Laba setahun Anda mencapai nisab."):"Harta bersih Anda mencapai nisab dan sudah genap 1 tahun."}
  var rows=r.detail.concat(r.utang||!m.noHaul?[[r.utangLabel||"Utang jatuh tempo","− "+rp(r.utang)]]:[]).concat([[m.bl||"Harta bersih",rp(bersih)],["Nisab ("+(m.nisabLabel||r.nisabLabel)+")",rp(r.nisab)]]);
  var res=document.getElementById("res");
  res.innerHTML='<span class="st'+(wajib?'':' no')+'">'+status+'</span><p class="msg">'+msg+'</p><div class="rows">'+rows.map(function(x){return '<div class="row"><span>'+x[0]+'</span><b>'+x[1]+'</b></div>'}).join("")+'</div><div class="msg" style="margin-top:14px">Zakat yang harus dibayar ('+((m.rate||0.025)*100).toString().replace(".",",")+'%)</div><div class="big">'+rp(zakat)+'</div>'+(wajib?'<button class="copy" id="cp" type="button">Salin jumlah zakat</button><div class="msg" style="font-size:.85rem">Yang disalin berupa angka saja ('+zakat+'), siap ditempel di kolom nominal Lynk.</div>':'');
  var cp=document.getElementById("cp");if(cp)cp.onclick=function(){copyText(String(zakat),cp)};
  document.getElementById("doa").innerHTML=wajib?'<div class="doa">'+DOA.map(function(d){return '<h3>'+d.t+'</h3><div class="ar" lang="ar">'+d.ar+'</div><p class="lat">'+d.lat+'</p><p class="kart">'+d.art+'</p>'}).join("")+'</div>':"";
}
var gr=document.getElementById("groups");
Object.keys(GROUPS).forEach(function(k){var b=document.createElement("button");b.className="tab g";b.type="button";b.dataset.k=k;b.setAttribute("role","tab");b.textContent=GROUPS[k];b.onclick=function(){curT=Object.keys(TYPES).filter(function(x){return TYPES[x].g===k})[0];curM="m";build()};gr.appendChild(b)});
document.getElementById("reset").onclick=build;
var hs=location.hash.replace("#","");
if(GROUPS[hs]){curT=Object.keys(TYPES).filter(function(x){return TYPES[x].g===hs})[0];curM="m"}
build();
  }
})();

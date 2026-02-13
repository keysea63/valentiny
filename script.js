// Valetiny — tiny JS for cute interactions
(() => {
  const $ = (q, el=document) => el.querySelector(q);
  const $$ = (q, el=document) => [...el.querySelectorAll(q)];

  const fromName = $("#fromName");
  const toName = $("#toName");

  const toLine = $("#toLine");
  const fromLine = $("#fromLine");
  const dearLine = $("#dearLine");
  const sigLine = $("#sigLine");
  const noteTo = $("#noteTo");

  const flipCard = $("#flipCard");
  const customMessage = $("#customMessage");
  const mainMessage = $("#mainMessage");

  const toast = $("#toast");
  const copyStatus = $("#copyStatus");
  const noteStatus = $("#noteStatus");

  const makeHeartsBtn = $("#makeHearts");
  const burstBtn = $("#burst");
  const toggleMode = $("#toggleMode");

  const playlistLinks = [
    // Edit these:
    { title: "PAPARAZZI", sub: "lady gaga", url: "https://www.youtube.com/watch?v=28jp-30w8Lg" },
    { title: "needy", sub: "Ariana Grande", url: "https://youtu.be/Km__cJEJ3JI?si=yKhBF040THapkiNj" },
    { title: "Kiss Me", sub: "Sixpence None The Richer", url: "https://youtu.be/CAC-onWPMB0?si=S7Y5uYthzuNtxCWn" },
  ];

  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("show"), 1400);
  }

  function updateNames(){
    const from = (fromName.value || "Me").trim();
    const to = (toName.value || "My Valentine").trim();
    toLine.textContent = to;
    dearLine.textContent = to;
    noteTo.textContent = to;

    fromLine.textContent = from;
    sigLine.textContent = "— " + from;

    // Keep message cute if empty
    if (!customMessage.value.trim()) {
      mainMessage.textContent = `You make ordinary days feel like strawberries and sunshine.`;
    }
  }

  function flip(){
    flipCard.classList.toggle("isFlipped");
  }

  function applyMessage(){
    const msg = customMessage.value.trim();
    if (!msg){
      mainMessage.textContent = `You make ordinary days feel like strawberries and sunshine.`;
      showToast("Using the default sweet message 🍓");
      return;
    }
    mainMessage.textContent = msg;
    showToast("Message updated 💌");
  }

  async function copyText(text, okEl){
    try{
      await navigator.clipboard.writeText(text);
      if (okEl) okEl.textContent = "Copied ✨";
      showToast("Copied!");
      setTimeout(() => { if (okEl) okEl.textContent = ""; }, 1200);
    }catch(e){
      if (okEl) okEl.textContent = "Couldn't copy (browser blocked)";
      showToast("Copy blocked by browser");
      setTimeout(() => { if (okEl) okEl.textContent = ""; }, 1800);
    }
  }

  // Love notes
  const notes = [
    "You’re my favorite notification.",
    "I like you more than cake. And that’s saying a lot.",
    "You make my heart do little cartwheels.",
    "If kisses were pixels, I’d render you 4K.",
    "I’d choose you in every timeline.",
    "You + me = cozy mode forever.",
    "You’re the strawberry to my shortcake.",
    "You make my brain go ✨soft✨.",
    "I’d hold your hand even in a scary movie.",
    "You’re my happy place with extra sprinkles."
  ];

  function newNote(){
    const to = (toName.value || "My Valentine").trim();
    const from = (fromName.value || "Me").trim();
    const pick = notes[Math.floor(Math.random()*notes.length)];
    $("#noteText").textContent = pick;
    $("#noteTo").textContent = to;
    return `To ${to} — ${pick}\n\n— ${from}`;
  }

  // Confetti hearts burst
  function heartBurst(count = 18){
    const cx = window.innerWidth * (0.15 + Math.random()*0.7);
    const cy = window.innerHeight * (0.2 + Math.random()*0.55);

    for (let i=0; i<count; i++){
      const el = document.createElement("div");
      el.className = "confetti";
      const a = Math.random() * Math.PI * 2;
      const r0 = 10 + Math.random()*30;
      const r1 = 120 + Math.random()*200;
      el.style.setProperty("--x0", `${cx + Math.cos(a)*r0}px`);
      el.style.setProperty("--y0", `${cy + Math.sin(a)*r0}px`);
      el.style.setProperty("--x1", `${cx + Math.cos(a)*r1}px`);
      el.style.setProperty("--y1", `${cy + Math.sin(a)*r1}px`);
      el.style.animationDelay = `${Math.random()*120}ms`;
      el.style.filter = `hue-rotate(${Math.floor(Math.random()*30 - 15)}deg)`;
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }
  }

  function scrollToSel(sel){
    const el = document.querySelector(sel);
    if (!el) return;
    el.scrollIntoView({behavior:"smooth", block:"start"});
  }

  function initNav(){
    $$("[data-scroll]").forEach(btn => {
      btn.addEventListener("click", () => scrollToSel(btn.dataset.scroll));
    });
    $("#scrollTop").addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));
  }

  function initMode(){
    const key = "valetiny_theme";
    const saved = localStorage.getItem(key);
    if (saved) document.documentElement.setAttribute("data-theme", saved);

    const isNight = () => document.documentElement.getAttribute("data-theme") === "night";
    const paintIcon = () => toggleMode.textContent = isNight() ? "☀️" : "🌙";
    paintIcon();

    toggleMode.addEventListener("click", () => {
      const next = isNight() ? "day" : "night";
      document.documentElement.setAttribute("data-theme", next === "night" ? "night" : "");
      localStorage.setItem(key, next);
      paintIcon();
      showToast(next === "night" ? "Night mode 🌙" : "Day mode ☀️");
    });
  }

  function initCard(){
    flipCard.addEventListener("click", flip);
    flipCard.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); }
    });
    $("#applyMessage").addEventListener("click", applyMessage);
    $("#copyLink").addEventListener("click", () => {
      const from = (fromName.value || "Me").trim();
      const to = (toName.value || "My Valentine").trim();
      const msg = (customMessage.value.trim() || mainMessage.textContent).trim();
      const share = `💌 Valentine Card\nTo: ${to}\nFrom: ${from}\n\n${msg}`;
      copyText(share, copyStatus);
    });
  }

  function initNotes(){
    $("#newNote").addEventListener("click", () => {
      newNote();
      showToast("New note 💞");
    });
    $("#noteBox").addEventListener("click", () => {
      const share = newNote();
      copyText(share, noteStatus);
    });
    $("#copyNote").addEventListener("click", () => {
      const to = (toName.value || "My Valentine").trim();
      const from = (fromName.value || "Me").trim();
      const text = $("#noteText").textContent;
      copyText(`To ${to} — ${text}\n\n— ${from}`, noteStatus);
    });
  }

  function initPlaylist(){
    if (!playlistLinks.length) return;
    const songs = $$(".song");
    playlistLinks.slice(0, songs.length).forEach((s, i) => {
      const a = songs[i];
      a.href = s.url;
      a.onclick = null;
      a.target = "_blank";
      a.rel = "noreferrer";
      $(".songTitle", a).textContent = s.title;
      $(".songSub", a).textContent = s.sub || "Open link";
    });
  }

  // Bind inputs
  fromName.addEventListener("input", updateNames);
  toName.addEventListener("input", updateNames);

  makeHeartsBtn.addEventListener("click", () => heartBurst(22));
  burstBtn.addEventListener("click", () => heartBurst(26));
  $("#makeHearts").addEventListener("dblclick", () => heartBurst(50));

  // Initial
  updateNames();
  initNav();
  initMode();
  initCard();
  initNotes();
  initPlaylist();

  // A small welcome pop
  setTimeout(() => heartBurst(16), 600);
})();

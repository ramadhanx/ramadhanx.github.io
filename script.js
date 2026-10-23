/* =========================================================
   Portfolio script
   1. Language (ID / EN)      4. Nav highlight
   2. Theme (light / dark)    5. VLAN cable animation
   3. Mobile menu + CV modal  6. Durations + footer year
   Indonesian text lives in index.html (so you edit it there);
   only the English translations are kept below.
   ========================================================= */

/* ---------- Storage helpers (never crash if storage is blocked) ---------- */
function readStore(key) {
  try { return localStorage.getItem(key); } catch (e) { return null; }
}
function writeStore(key, value) {
  try { localStorage.setItem(key, value); } catch (e) { /* ignore */ }
}

/* ---------- 1. Language ---------- */
const EN = {
  "hero.lead": "Keeping company devices and IT systems running smoothly, from hardware and software support to Active Directory, VMware, and Networking.",
  "hero.exp": "Experience in IT Support & Infrastructure:",
  "hero.contact": "Contact me",
  "hero.cv": "View CV",

  "about.text": "I'm an IT Technician who keeps company devices, networks, and IT systems running smoothly. My journey began as an IT Support Admin working with the SAP ERP system, then grew toward the technical side. Day to day, I handle hardware and software support, from installation and troubleshooting to Active Directory administration, VMware ESXi virtualization, and VLAN configuration. I also make a habit of writing IT documentation so every issue that gets resolved is recorded and can be followed by the team.",

  "exp.current": "Current",
  "exp.present": "Present",
  "exp.t.title": "IT Support Technician",
  "exp.t.1": "Managing and maintaining IT hardware, including installation, configuration, and troubleshooting.",
  "exp.t.2": "Handling network infrastructure projects, including the <a href=\"#project\">VLAN implementation on Access Points</a> to separate traffic by user role.",
  "exp.t.3": "Documenting problems and their solutions in Notion as a knowledge base, so similar cases can be resolved faster.",
  "exp.t.4": "Ensuring IT devices and the network run optimally to support company operations.",
  "exp.a.title": "IT Support Admin",
  "exp.a.start": "February 2025",
  "exp.a.end": "October 2025",
  "exp.a.1": "Managing IT operational administration through the SAP ERP system, including creating PRs, WOs, and SPBBs.",
  "exp.a.2": "Monitoring IT assets and device stock.",
  "exp.a.3": "Drafting memos and handling email to keep the IT team's workflow running smoothly.",
  "exp.a.4": "Managing IT team attendance administration through the HRIS, including daily schedules, overtime, and scan error corrections.",

  "skills.sys": "Systems & servers",
  "skills.net": "Networking",
  "skills.ports": "Ports & protocols",
  "skills.support": "Support & operations",

  "proj.desc": "Network segmentation on Access Points into five VLANs based on user role. Traffic is better organized, guest access is separated from the internal network, and company network security is improved.",
  "proj.tags": "VLAN · Access Point · Network Segmentation · Network Security",
  "proj.aria": "Topology: one Access Point split into five VLANs",
  "vlan.mobile": "Mobile devices",
  "vlan.guest": "Guests",
  "vlan.wifi": "Employees / general users",
  "vlan.static": "Static IP allocation",

  "cv.sub": "CV preview. Download it to keep a copy.",
  "cv.close": "Close",
  "cv.fallback": "PDF preview isn't available on this device. Please download the CV or open it in a new tab.",
  "cv.open": "Open in new tab",
  "cv.download": "Download CV"
};

const UI = {
  id: { toLight: "Beralih ke mode terang", toDark: "Beralih ke mode gelap" },
  en: { toLight: "Switch to light mode", toDark: "Switch to dark mode" }
};

// Remember the Indonesian originals straight from the page, so edits in index.html are always respected
const originals = new Map();
document.querySelectorAll("[data-i18n], [data-i18n-html], [data-i18n-label]").forEach((el) => {
  originals.set(el, {
    text: el.textContent,
    html: el.innerHTML,
    label: el.getAttribute("aria-label")
  });
});

let lang = "id";

function formatMonths(total, l) {
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (l === "en") {
    if (years) parts.push(years + (years > 1 ? " years" : " year"));
    if (months) parts.push(months + (months > 1 ? " months" : " month"));
    return parts.join(" ") || "1 month";
  }
  if (years) parts.push(years + " tahun");
  if (months) parts.push(months + " bulan");
  return parts.join(" ") || "1 bulan";
}

function monthsBetween(start, end) {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end
    ? end.split("-").map(Number)
    : [new Date().getFullYear(), new Date().getMonth() + 1];
  return (ey - sy) * 12 + (em - sm) + 1; // both months counted
}

function updateDurations() {
  document.querySelectorAll("[data-start]").forEach((el) => {
    el.textContent = formatMonths(monthsBetween(el.dataset.start, el.dataset.end), lang);
  });
}

function applyLang(next, persist) {
  lang = next;
  document.documentElement.lang = next;

  originals.forEach((orig, el) => {
    const useEn = next === "en";
    if (el.hasAttribute("data-i18n")) {
      const v = useEn ? EN[el.getAttribute("data-i18n")] : null;
      el.textContent = v !== undefined && v !== null ? v : orig.text;
    }
    if (el.hasAttribute("data-i18n-html")) {
      const v = useEn ? EN[el.getAttribute("data-i18n-html")] : null;
      el.innerHTML = v !== undefined && v !== null ? v : orig.html;
    }
    if (el.hasAttribute("data-i18n-label")) {
      const v = useEn ? EN[el.getAttribute("data-i18n-label")] : null;
      if (orig.label !== null) el.setAttribute("aria-label", v !== undefined && v !== null ? v : orig.label);
    }
  });

  document.querySelectorAll("[data-lang]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.lang === next))
  );

  updateDurations();
  updateThemeButton();
  if (persist) writeStore("lang", next);
}

document.querySelectorAll("[data-lang]").forEach((b) =>
  b.addEventListener("click", () => applyLang(b.dataset.lang, true))
);

/* ---------- 2. Theme ---------- */
const root = document.documentElement;
const themeBtn = document.getElementById("theme-toggle");

function currentTheme() {
  return root.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function updateThemeButton() {
  if (!themeBtn) return;
  const label = currentTheme() === "dark" ? UI[lang].toLight : UI[lang].toDark;
  themeBtn.setAttribute("aria-label", label);
  themeBtn.setAttribute("title", label);
}

function setTheme(theme, persist) {
  root.setAttribute("data-theme", theme);
  if (persist) writeStore("theme", theme);
  updateThemeButton();
}

if (themeBtn) {
  themeBtn.addEventListener("click", () =>
    setTheme(currentTheme() === "dark" ? "light" : "dark", true)
  );
}

// Follow the system theme live, until the visitor picks one themselves
if (window.matchMedia) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemChange = (e) => {
    const saved = readStore("theme");
    if (saved !== "light" && saved !== "dark") setTheme(e.matches ? "dark" : "light", false);
  };
  if (mq.addEventListener) mq.addEventListener("change", onSystemChange);
}

/* ---------- 3a. Mobile menu ---------- */
const header = document.querySelector(".topbar");
const nav = document.getElementById("site-nav");
const menuBtn = document.getElementById("menu-toggle");

function setMenu(open) {
  if (!nav || !menuBtn) return;
  nav.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
}

if (menuBtn && nav) {
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("click", (e) => {
    if (header && !header.contains(e.target)) setMenu(false);
  });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  window.addEventListener("resize", () => { if (window.innerWidth > 760) setMenu(false); });
}

/* ---------- 3b. CV preview modal ---------- */
const cvModal = document.getElementById("cv-modal");
if (cvModal && typeof cvModal.showModal === "function") {
  const cvObject = cvModal.querySelector("object");

  document.querySelectorAll("[data-cv-open]").forEach((opener) =>
    opener.addEventListener("click", (e) => {
      e.preventDefault(); // without JS (or on old browsers) the link simply opens the PDF
      // Load the PDF only when asked, so it never slows down the page
      if (cvObject && !cvObject.getAttribute("data")) {
        cvObject.setAttribute("data", cvObject.dataset.src);
      }
      cvModal.showModal();
      document.documentElement.style.overflow = "hidden";
    })
  );

  cvModal.querySelectorAll("[data-cv-close]").forEach((b) =>
    b.addEventListener("click", () => cvModal.close())
  );

  // Click on the dimmed area outside the card closes it
  cvModal.addEventListener("click", (e) => { if (e.target === cvModal) cvModal.close(); });

  cvModal.addEventListener("close", () => { document.documentElement.style.overflow = ""; });
}

/* ---------- 4. Highlight the nav link of the section in view ----------
   Scroll-based (not IntersectionObserver) so the last, short section
   (Contact) still gets highlighted when the page can't scroll further. */
const links = [...document.querySelectorAll(".topbar nav a")];
const sections = links
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

function updateActiveLink() {
  const atBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
  const line = window.innerHeight * 0.4; // a section becomes "current" once its top passes this line

  let current = null;
  if (atBottom) {
    current = sections[sections.length - 1];
  } else {
    sections.forEach((s) => {
      if (s.getBoundingClientRect().top <= line) current = s;
    });
  }

  links.forEach((a) =>
    a.classList.toggle("active", !!current && a.getAttribute("href") === "#" + current.id)
  );
}

let ticking = false;
function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateActiveLink();
    ticking = false;
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
updateActiveLink();

/* ---------- 5. Draw the VLAN cables once when the topology scrolls into view ---------- */
const topology = document.querySelector(".topology");
if (topology) {
  topology.classList.add("armed");
  const topologyObserver = new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        topology.classList.add("in-view");
        obs.disconnect();
      }
    },
    { threshold: 0.35 }
  );
  topologyObserver.observe(topology);
}

/* ---------- 6. Footer year + start ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

// Language: saved choice first, otherwise the browser language (Indonesian -> ID, anything else -> EN)
const savedLang = readStore("lang");
const browserLang = (navigator.language || "id").toLowerCase();
applyLang(
  savedLang === "id" || savedLang === "en" ? savedLang : browserLang.startsWith("id") ? "id" : "en",
  false
);

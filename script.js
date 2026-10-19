// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Highlight the nav link of the section currently in view.
// Scroll-based (not IntersectionObserver) so the last, short section (Contact)
// still gets highlighted when the page can't scroll any further.
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

// Draw the VLAN cables once when the topology scrolls into view
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

// Work out experience durations from dates, so "Sekarang" never goes stale
function monthsBetween(start, end) {
  const [sy, sm] = start.split("-").map(Number);
  const [ey, em] = end ? end.split("-").map(Number) : [new Date().getFullYear(), new Date().getMonth() + 1];
  return (ey - sy) * 12 + (em - sm) + 1; // both months counted
}

function formatMonths(total) {
  const years = Math.floor(total / 12);
  const months = total % 12;
  const parts = [];
  if (years) parts.push(years + " tahun");
  if (months) parts.push(months + " bulan");
  return parts.join(" ") || "1 bulan";
}

document.querySelectorAll("[data-start]").forEach((el) => {
  el.textContent = formatMonths(monthsBetween(el.dataset.start, el.dataset.end));
});

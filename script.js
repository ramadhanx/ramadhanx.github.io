// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Highlight the nav link of the section currently in view
const links = document.querySelectorAll(".topbar nav a");
const sections = [...links]
  .map((a) => document.querySelector(a.getAttribute("href")))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        links.forEach((a) =>
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id)
        );
      }
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);
sections.forEach((s) => navObserver.observe(s));

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

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

// Play the VLAN cable animation once when it scrolls into view
const diagram = document.querySelector(".diagram");
if (diagram) {
  const diagramObserver = new IntersectionObserver(
    (entries, obs) => {
      if (entries[0].isIntersecting) {
        diagram.classList.add("in-view");
        obs.disconnect();
      }
    },
    { threshold: 0.4 }
  );
  diagramObserver.observe(diagram);
}

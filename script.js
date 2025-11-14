// ================================================
// PORTFOLIO JAVASCRIPT
// ================================================

// === NAVIGATION TOGGLE ===
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");

navToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Schliesse Menu bei Link-Klick
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// === SMOOTH SCROLLING ===
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// === PROJECTS DATA ===
const projects = [
  {
    title: "Wildradar",
    description:
      "Projektarbeit im Rahmen des Bachelorstudiums. Präsentation mit Bestnote (6). Entwicklung einer Lösung zur Erfassung und Analyse von Wildtierdaten.",
    icon: "🦌",
    tags: ["Bachelor Projekt", "Datenanalyse", "Konzept", "Teamarbeit"],
    demo: "https://showroom-bcs.digisus-lab.ch/ghost/#/site",
  },
  {
    title: "Typescript App mit SAP S/4HANA Anbindung",
    description:
      "Offline-fähige Zeit- und Leistungserfassung für das FUB/VBS. Entwicklung einer modernen TS-App mit Synchronisation zum SAP S/4HANA Backend.",
    icon: "⌚",
    tags: ["TypeScript", "SAP S/4HANA", "Offline Sync", "REST API"],
  },
  {
    title: "SAP ERP Einführungen & Kundenentwicklungen",
    description:
      "Diverse Kundenprojekte als SAP Development Consultant bei NTT DATA Business Solutions AG. Schwerpunkt in ABAP, Fiori & Schnittstellenentwicklung.",
    icon: "🔧",
    tags: ["SAP ABAP", "SAP Fiori", "ERP Implementierung"],
  },
];

// === RENDER PROJECTS ===
function renderProjects() {
  const container = document.getElementById("projectsGrid");

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
            <div class="project-image">${project.icon}</div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags
                      .map((tag) => `<span class="tag">${tag}</span>`)
                      .join("")}
                </div>
                <div class="project-links">
                    <a href="${project.github}"
                </div>
            </div>
        `;
    container.appendChild(card);
  });
}

// === CHART.JS VISUALIZATION ===
function createSkillsChart() {
  const ctx = document.getElementById("skillsChart");
  if (!ctx) return;

  new Chart(ctx, {
    type: "radar",
    data: {
      labels: ["HTML", "CSS", "JavaScript", "Responsive Design", "Git", "APIs"],
      datasets: [
        {
          label: "Meine Skills",
          data: [85, 80, 75, 90, 70, 65],
          fill: true,
          backgroundColor: "rgba(0, 255, 135, 0.2)",
          borderColor: "rgb(0, 255, 135)",
          pointBackgroundColor: "rgb(0, 255, 135)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(0, 255, 135)",
          pointRadius: 5,
          pointHoverRadius: 7,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            color: "#7a8a99",
          },
          grid: {
            color: "#3a4149",
          },
          pointLabels: {
            color: "#b8c4ce",
            font: {
              size: 12,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

// === INTERSECTION OBSERVER für Animationen ===
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.1,
  }
);

document
  .querySelectorAll(".project-card, .stat-card, .skill-item")
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });

// === STATS ANIMATION beim Scrollen ===
const statsSection = document.getElementById("stats");
const statsObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      animateStats();
      statsObserver.unobserve(statsSection);
    }
  },
  {
    threshold: 0.3,
  }
);

// === INIT ===
window.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  createSkillsChart();
  statsObserver.observe(statsSection);
});

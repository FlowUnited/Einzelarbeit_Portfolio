/* ================================================
   PORTFOLIO FLORIAN - SCRIPTS
   JAVASCRIPT
   ================================================ */

// ================================================
// KONFIGURATION
// ================================================
const GITHUB_USERNAME = "FlowUnited"; // Dein GitHub Username
const MAX_REPOS = 6; // Anzahl der angezeigten Repositories
const MAX_EVENTS = 10; // Anzahl der angezeigten Events

// ================================================
// NAVIGATION TOGGLE
// ================================================
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

// ================================================
// SMOOTH SCROLLING
// ================================================
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

// ================================================
// PROJECTS DATA ARRAY MIT MEINEN PROJEKTEN
// ================================================
const projects = [
  {
    title: "Wildradar",
    description:
      "Projektarbeit im Rahmen des Bachelorstudiums. Präsentation mit Bestnote (6). Entwicklung einer Lösung zur Prävention von Wildunfällen im öffentlichen Strassenverkehr.",
    icon: "Images/Wildradar.png",
    tags: ["WPR2", "Datenanalyse", "Business Case Study", "Teamarbeit"],
    demo: "https://showroom-bcs.digisus-lab.ch/ghost/#/site",
  },
  {
    title: "TypeScript App mit SAP S/4HANA Anbindung",
    description:
      "Offline-fähige Zeit- und Leistungserfassung für das FUB/VBS. Entwicklung einer modernen TypeScript-App mit Synchronisation zum SAP S/4HANA Backend.",
    icon: "Images/Typescript.png",
    tags: [
      "TypeScript",
      "SAP S/4HANA",
      "Offline Sync",
      "REST API",
      "ABAP",
      "Schnittstellen",
    ],
  },
  {
    title: "SAP ERP Einführungen & Kundenentwicklungen",
    description:
      "Diverse Kundenprojekte als SAP Development Consultant bei NTT DATA Business Solutions AG. Schwerpunkt in ABAP, Fiori, Formular- & Schnittstellenentwicklung.",
    icon: "Images/Sap4Hana.png",
    tags: [
      "SAP ABAP",
      "SAP Fiori",
      "ERP Implementierung",
      "Formularentwicklung",
      "SAP Script",
      "SAP Adobe Forms",
      "Schnittstellenentwicklung",
    ],
  },
];

// ================================================
// PROJEKTE RENDERN
// ================================================
function renderProjects() {
  const container = document.getElementById("projectsGrid");

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <div class="project-image">
        <img src="${project.icon}" alt="${project.title}" class="project-img">
      </div>
      <div class="project-content">
        <h3 class="project-title">${project.title}</h3>
        <p class="project-description">${project.description}</p>
        <div class="project-tags">
          ${project.tags
            .map((tag) => `<span class="tag">${tag}</span>`)
            .join("")}
        </div>
        <div class="project-links">
          ${
            project.demo
              ? `<a href="${project.demo}" class="btn btn-secondary" target="_blank">Demo ansehen</a>`
              : ""
          }
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

// ================================================
// GITHUB API INTEGRATION
// ================================================

/**
 * Holt die Featured Repositories von GitHub
 * Verwendet die GitHub REST API v3
 */
async function fetchGitHubRepos() {
  const reposContainer = document.getElementById("githubRepos");

  try {
    // API Call zu GitHub
    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      {
        params: {
          sort: "updated",
          per_page: MAX_REPOS,
          type: "owner",
        },
      }
    );

    const repos = response.data;

    // Leere Container und füge Repos hinzu
    reposContainer.innerHTML = "";

    if (repos.length === 0) {
      reposContainer.innerHTML = `
        <div class="github-empty">
          <p>Keine öffentlichen Repositories gefunden.</p>
        </div>
      `;
      return;
    }

    // Rendere jedes Repository
    repos.forEach((repo) => {
      const repoCard = createRepoCard(repo);
      reposContainer.appendChild(repoCard);
    });
  } catch (error) {
    console.error("Fehler beim Laden der GitHub Repositories:", error);
    reposContainer.innerHTML = `
      <div class="github-error">
        <p>⚠️ Fehler beim Laden der Repositories</p>
        <small>Bitte versuche es später erneut.</small>
      </div>
    `;
  }
}

/**
 * Erstellt eine Repository Card
 * @param {Object} repo - Repository Objekt von GitHub API
 * @returns {HTMLElement} - Repository Card Element
 */
function createRepoCard(repo) {
  const card = document.createElement("div");
  card.className = "github-repo-card";

  // Formatiere Datum
  const updatedDate = new Date(repo.updated_at).toLocaleDateString("de-CH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Language Color Mapping (häufigste Sprachen)
  const languageColors = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#b07219",
    HTML: "#e34c26",
    CSS: "#563d7c",
    PHP: "#4F5D95",
    C: "#555555",
    "C++": "#f34b7d",
    "C#": "#178600",
    Ruby: "#701516",
    Go: "#00ADD8",
    Rust: "#dea584",
    Swift: "#ffac45",
    Kotlin: "#A97BFF",
  };

  const languageColor = languageColors[repo.language] || "#858585";

  card.innerHTML = `
    <div class="repo-header">
      <div class="repo-icon">📦</div>
      <div class="repo-info">
        <h4 class="repo-name">
          <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        </h4>
        ${repo.private ? '<span class="repo-badge">Private</span>' : ""}
      </div>
    </div>
    <p class="repo-description">
      ${repo.description || "Keine Beschreibung verfügbar"}
    </p>
    <div class="repo-stats">
      ${
        repo.language
          ? `
        <span class="repo-language">
          <span class="language-dot" style="background-color: ${languageColor}"></span>
          ${repo.language}
        </span>
      `
          : ""
      }
      <span class="repo-stat">⭐ ${repo.stargazers_count}</span>
      <span class="repo-stat">🍴 ${repo.forks_count}</span>
    </div>
    <div class="repo-footer">
      <span class="repo-updated">Aktualisiert: ${updatedDate}</span>
    </div>
  `;

  return card;
}

/**
 * Holt die letzten GitHub Events/Aktivitäten
 * Zeigt Commits, PRs, Issues, etc.
 */
async function fetchGitHubActivity() {
  const activityContainer = document.getElementById("githubActivity");

  try {
    // API Call zu GitHub Events
    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public`,
      {
        params: {
          per_page: MAX_EVENTS,
        },
      }
    );

    const events = response.data;

    // Leere Container
    activityContainer.innerHTML = "";

    if (events.length === 0) {
      activityContainer.innerHTML = `
        <div class="github-empty">
          <p>Keine aktuellen Aktivitäten gefunden.</p>
        </div>
      `;
      return;
    }

    // Filtere und rendere relevante Events
    const relevantEvents = events.filter((event) =>
      ["PushEvent", "CreateEvent", "PullRequestEvent", "IssuesEvent"].includes(
        event.type
      )
    );

    relevantEvents.forEach((event) => {
      const activityItem = createActivityItem(event);
      if (activityItem) {
        activityContainer.appendChild(activityItem);
      }
    });

    // Falls keine relevanten Events
    if (relevantEvents.length === 0) {
      activityContainer.innerHTML = `
        <div class="github-empty">
          <p>Keine relevanten Aktivitäten in letzter Zeit.</p>
        </div>
      `;
    }
  } catch (error) {
    console.error("Fehler beim Laden der GitHub Aktivitäten:", error);
    activityContainer.innerHTML = `
      <div class="github-error">
        <p>⚠️ Fehler beim Laden der Aktivitäten</p>
        <small>Bitte versuche es später erneut.</small>
      </div>
    `;
  }
}

/**
 * Erstellt ein Activity Item basierend auf Event Type
 * @param {Object} event - GitHub Event Objekt
 * @returns {HTMLElement|null} - Activity Item Element
 */
function createActivityItem(event) {
  const item = document.createElement("div");
  item.className = "github-activity-item";

  // Formatiere Datum
  const eventDate = getTimeAgo(new Date(event.created_at));
  const repoName = event.repo.name;

  let icon = "📝";
  let action = "";
  let details = "";

  // Event Type Handling
  switch (event.type) {
    case "PushEvent":
      icon = "🔨";
      const commitCount = event.payload.commits.length;
      action = `pushed ${commitCount} commit${commitCount > 1 ? "s" : ""} to`;
      const commitMsg =
        event.payload.commits[0]?.message.substring(0, 60) || "";
      details = commitMsg ? `<small>"${commitMsg}..."</small>` : "";
      break;

    case "CreateEvent":
      if (event.payload.ref_type === "repository") {
        icon = "📦";
        action = "created repository";
      } else if (event.payload.ref_type === "branch") {
        icon = "🌿";
        action = `created branch ${event.payload.ref} in`;
      } else {
        icon = "✨";
        action = "created";
      }
      break;

    case "PullRequestEvent":
      icon = "🔀";
      action = `${event.payload.action} pull request in`;
      details = event.payload.pull_request
        ? `<small>"${event.payload.pull_request.title.substring(
            0,
            60
          )}..."</small>`
        : "";
      break;

    case "IssuesEvent":
      icon = "🐛";
      action = `${event.payload.action} issue in`;
      details = event.payload.issue
        ? `<small>"${event.payload.issue.title.substring(0, 60)}..."</small>`
        : "";
      break;

    default:
      return null;
  }

  item.innerHTML = `
    <div class="activity-icon">${icon}</div>
    <div class="activity-content">
      <p class="activity-text">
        <strong>${GITHUB_USERNAME}</strong> ${action}
        <a href="https://github.com/${repoName}" target="_blank">${repoName}</a>
      </p>
      ${details ? `<p class="activity-details">${details}</p>` : ""}
      <span class="activity-time">${eventDate}</span>
    </div>
  `;

  return item;
}

/**
 * Berechnet "Zeit vor" Text (z.B. "vor 2 Tagen")
 * @param {Date} date - Datum des Events
 * @returns {string} - Formatierter Zeit-Text
 */
function getTimeAgo(date) {
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return diffMins <= 1 ? "vor 1 Minute" : `vor ${diffMins} Minuten`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? "vor 1 Stunde" : `vor ${diffHours} Stunden`;
  } else if (diffDays < 7) {
    return diffDays === 1 ? "vor 1 Tag" : `vor ${diffDays} Tagen`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "vor 1 Woche" : `vor ${weeks} Wochen`;
  } else {
    return date.toLocaleDateString("de-CH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
}

// ================================================
// CHART.JS VISUALISIERUNG
// ================================================
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

// ================================================
// INTERSECTION OBSERVER FÜR ANIMATIONEN
// ================================================
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

// Beobachte Elemente für Animation
document
  .querySelectorAll(
    ".project-card, .stat-card, .skill-item, .github-repo-card, .github-activity-item"
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "all 0.6s ease";
    observer.observe(el);
  });

// ================================================
// INITIALISIERUNG
// ================================================
window.addEventListener("DOMContentLoaded", () => {
  // Rendere Projekte
  renderProjects();

  // Lade GitHub Daten
  fetchGitHubRepos();
  fetchGitHubActivity();

  // Erstelle Chart (falls Canvas vorhanden)
  createSkillsChart();
});

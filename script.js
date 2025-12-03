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
    // API Call zu GitHub mit Headers
    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos`,
      {
        params: {
          sort: "updated",
          per_page: MAX_REPOS,
          type: "owner",
        },
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const repos = response.data;

    // Zeige Rate Limit Info in Konsole
    console.log(
      "GitHub API - Remaining Requests:",
      response.headers["x-ratelimit-remaining"]
    );
    console.log(
      "GitHub API - Rate Limit Reset:",
      new Date(response.headers["x-ratelimit-reset"] * 1000)
    );

    // Leere Container und füge Repos hinzu
    reposContainer.innerHTML = "";

    if (!Array.isArray(repos) || repos.length === 0) {
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

    // Detaillierte Fehlerbehandlung
    let errorMessage = "Bitte versuche es später erneut.";

    if (error.response) {
      const status = error.response.status;
      const remaining = error.response.headers["x-ratelimit-remaining"];

      if (status === 404) {
        errorMessage = `GitHub User "${GITHUB_USERNAME}" nicht gefunden. Prüfe den Username in script.js.`;
      } else if (status === 403 && remaining === "0") {
        const resetTime = new Date(
          error.response.headers["x-ratelimit-reset"] * 1000
        );
        errorMessage = `GitHub API Rate Limit erreicht. Versuche es nach ${resetTime.toLocaleTimeString(
          "de-CH"
        )} Uhr erneut.`;
      } else if (status === 403) {
        errorMessage =
          "GitHub API Zugriff eingeschränkt. Möglicherweise Rate Limit erreicht.";
      }
    } else if (error.request) {
      errorMessage =
        "Keine Verbindung zur GitHub API möglich. Prüfe deine Internetverbindung.";
    }

    reposContainer.innerHTML = `
      <div class="github-error">
        <p>⚠️ Fehler beim Laden der Repositories</p>
        <small>${errorMessage}</small>
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
    ABAP: "#E8274B",
  };

  const languageColor = languageColors[repo.language] || "#858585";

  card.innerHTML = `
    <div class="repo-header">
      <div class="repo-icon">📦</div>
      <div class="repo-info">
        <h4 class="repo-name">
          <a href="${
            repo.html_url
          }" target="_blank" rel="noopener noreferrer">${repo.name}</a>
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
    // API Call zu GitHub Events mit Headers
    const response = await axios.get(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public`,
      {
        params: {
          per_page: MAX_EVENTS,
        },
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    const events = response.data;

    // Zeige Rate Limit Info in Konsole
    console.log(
      "GitHub Events API - Remaining Requests:",
      response.headers["x-ratelimit-remaining"]
    );

    // Leere Container
    activityContainer.innerHTML = "";

    // Prüfe ob Events ein Array ist
    if (!Array.isArray(events) || events.length === 0) {
      activityContainer.innerHTML = `
        <div class="github-empty">
          <p>Keine aktuellen Aktivitäten gefunden.</p>
          <small>Sobald du auf GitHub aktiv wirst (Push, PR, etc.), erscheinen hier deine Aktivitäten.</small>
        </div>
      `;
      return;
    }

    // Filtere und rendere relevante Events
    const relevantEvents = events.filter((event) =>
      [
        "PushEvent",
        "CreateEvent",
        "PullRequestEvent",
        "IssuesEvent",
        "WatchEvent",
        "ForkEvent",
      ].includes(event.type)
    );

    // Erstelle Activity Items
    let addedCount = 0;
    relevantEvents.forEach((event) => {
      try {
        const activityItem = createActivityItem(event);
        if (activityItem) {
          activityContainer.appendChild(activityItem);
          addedCount++;
        }
      } catch (err) {
        console.warn("Fehler beim Erstellen eines Activity Items:", err);
      }
    });

    // Falls keine relevanten Events hinzugefügt wurden
    if (addedCount === 0) {
      activityContainer.innerHTML = `
        <div class="github-empty">
          <p>Keine relevanten Aktivitäten in letzter Zeit.</p>
          <small>Push Events, Repository Creation, Pull Requests, etc. werden hier angezeigt.</small>
        </div>
      `;
    }
  } catch (error) {
    console.error("Fehler beim Laden der GitHub Aktivitäten:", error);

    // Detaillierte Fehlerbehandlung
    let errorMessage = "Bitte versuche es später erneut.";

    if (error.response) {
      const status = error.response.status;
      const remaining = error.response.headers?.["x-ratelimit-remaining"];

      if (status === 404) {
        errorMessage = `GitHub User "${GITHUB_USERNAME}" nicht gefunden oder keine öffentlichen Events verfügbar.`;
      } else if (status === 403 && remaining === "0") {
        const resetTime = error.response.headers["x-ratelimit-reset"]
          ? new Date(
              error.response.headers["x-ratelimit-reset"] * 1000
            ).toLocaleTimeString("de-CH")
          : "in einer Stunde";
        errorMessage = `GitHub API Rate Limit erreicht (max. 60 Requests/Stunde ohne Auth). Versuche es nach ${resetTime} Uhr erneut.`;
      } else if (status === 403) {
        errorMessage =
          "GitHub API Zugriff eingeschränkt. Rate Limit erreicht oder Secondary Rate Limit aktiv.";
      }

      console.log("Error Response:", error.response.data);
      console.log("Rate Limit Status:", {
        remaining: remaining,
        limit: error.response.headers?.["x-ratelimit-limit"],
        reset: error.response.headers?.["x-ratelimit-reset"],
      });
    } else if (error.request) {
      errorMessage =
        "Keine Verbindung zur GitHub API möglich. Prüfe deine Internetverbindung.";
    }

    activityContainer.innerHTML = `
      <div class="github-error">
        <p>⚠️ Fehler beim Laden der Aktivitäten</p>
        <small>${errorMessage}</small>
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
  const repoName = event.repo?.name || "Unknown Repository";

  let icon = "📝";
  let action = "";
  let details = "";

  // Event Type Handling mit sicherer Abfrage
  try {
    switch (event.type) {
      case "PushEvent":
        icon = "🔨";
        const commits = event.payload?.commits || [];
        const commitCount = commits.length;
        action = `pushed ${commitCount} commit${commitCount > 1 ? "s" : ""} to`;
        const commitMsg = commits[0]?.message?.substring(0, 60) || "";
        details = commitMsg ? `<small>"${commitMsg}..."</small>` : "";
        break;

      case "CreateEvent":
        if (event.payload?.ref_type === "repository") {
          icon = "📦";
          action = "created repository";
        } else if (event.payload?.ref_type === "branch") {
          icon = "🌿";
          action = `created branch ${event.payload.ref} in`;
        } else if (event.payload?.ref_type === "tag") {
          icon = "🏷️";
          action = `created tag ${event.payload.ref} in`;
        } else {
          icon = "✨";
          action = "created";
        }
        break;

      case "PullRequestEvent":
        icon = "🔀";
        action = `${event.payload?.action || "updated"} pull request in`;
        details = event.payload?.pull_request?.title
          ? `<small>"${event.payload.pull_request.title.substring(
              0,
              60
            )}..."</small>`
          : "";
        break;

      case "IssuesEvent":
        icon = "🐛";
        action = `${event.payload?.action || "updated"} issue in`;
        details = event.payload?.issue?.title
          ? `<small>"${event.payload.issue.title.substring(0, 60)}..."</small>`
          : "";
        break;

      case "WatchEvent":
        icon = "⭐";
        action = "starred";
        break;

      case "ForkEvent":
        icon = "🍴";
        action = "forked";
        break;

      default:
        return null;
    }
  } catch (err) {
    console.warn("Fehler beim Verarbeiten eines Events:", err, event);
    return null;
  }

  item.innerHTML = `
    <div class="activity-icon">${icon}</div>
    <div class="activity-content">
      <p class="activity-text">
        <strong>${GITHUB_USERNAME}</strong> ${action}
        <a href="https://github.com/${repoName}" target="_blank" rel="noopener noreferrer">${repoName}</a>
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

document.addEventListener("DOMContentLoaded", () => {
  const defaultEvents = {
    upcoming: [
      {
        id: "frontend-craft-lab",
        title: "Frontend Craft Lab",
        date: "June 2026",
        status: "Registration Open",
        description: "A hands-on build session focused on responsive layouts, interaction polish, and deployable portfolio projects."
      },
      {
        id: "ai-mini-project-night",
        title: "AI Mini Project Night",
        date: "July 2026",
        status: "Opening Soon",
        description: "Small teams turn datasets and APIs into working demos with guidance from AI/ML domain mentors."
      }
    ],
    past: [
      {
        id: "git-github-workshop",
        title: "Git and GitHub Workshop",
        date: "Completed",
        description: "Completed with hands-on branching, pull requests, and team collaboration practice."
      },
      {
        id: "code-sprint-warmup",
        title: "Code Sprint Warmup",
        date: "Completed",
        description: "A friendly competitive programming session for first-time and returning coders."
      },
      {
        id: "design-systems-primer",
        title: "Design Systems Primer",
        date: "Completed",
        description: "A compact introduction to visual consistency, interface rhythm, and product polish."
      }
    ]
  };

  const eventStoreKey = "acm-jit-events";

  const readEvents = () => {
    const savedEvents = localStorage.getItem(eventStoreKey);
    if (!savedEvents) return structuredClone(defaultEvents);
    try {
      const parsedEvents = JSON.parse(savedEvents);
      return {
        upcoming: Array.isArray(parsedEvents.upcoming) ? parsedEvents.upcoming : [],
        past: Array.isArray(parsedEvents.past) ? parsedEvents.past : []
      };
    } catch {
      return structuredClone(defaultEvents);
    }
  };

  const saveEvents = (events) => {
    localStorage.setItem(eventStoreKey, JSON.stringify(events));
  };

  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  /* Status badge: returns inline style string */
  const statusStyle = (status) => {
    const s = status.toLowerCase();
    if (s.includes("open"))  return "background:rgba(52,211,153,0.1);color:#6ee7b7;";
    if (s.includes("soon"))  return "background:rgba(251,191,36,0.1);color:#fcd34d;";
    if (s.includes("fast"))  return "background:rgba(34,211,238,0.1);color:#67e8f9;";
    return "background:rgba(244,63,94,0.1);color:#fda4af;";
  };

  /* Accent colours for cycling */
  const accentColors = [
    { border: "rgba(103,232,249,0.2)", hoverBorder: "rgba(103,232,249,0.6)", date: "#67e8f9", dot: "#67e8f9" },
    { border: "rgba(196,181,253,0.2)", hoverBorder: "rgba(196,181,253,0.6)", date: "#c4b5fd", dot: "#c4b5fd" },
    { border: "rgba(110,231,183,0.2)", hoverBorder: "rgba(110,231,183,0.6)", date: "#6ee7b7", dot: "#6ee7b7" }
  ];

  const renderPublicEvents = () => {
    const upcomingList = document.getElementById("upcoming-events-list");
    const pastList     = document.getElementById("past-events-list");
    if (!upcomingList || !pastList) return;

    const events = readEvents();

    /* ── Upcoming ── */
    if (events.upcoming.length) {
      upcomingList.innerHTML = events.upcoming.map((event, i) => {
        const ac = accentColors[i % accentColors.length];
        return `
          <article style="
            border-radius:1.5rem;border:1px solid ${ac.border};
            background:rgba(255,255,255,0.06);padding:1.5rem;
            backdrop-filter:blur(12px);
            transition:transform 0.3s ease,border-color 0.3s ease;
          "
          onmouseenter="this.style.transform='translateY(-4px)';this.style.borderColor='${ac.hoverBorder}'"
          onmouseleave="this.style.transform='';this.style.borderColor='${ac.border}'">
            <div style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:1rem;">
              <div>
                <p style="font-size:0.875rem;font-weight:900;color:${ac.date};">${escapeHtml(event.date)}</p>
                <h3 style="margin-top:0.5rem;font-size:1.5rem;font-weight:900;color:#fff;">${escapeHtml(event.title)}</h3>
              </div>
              <span style="border-radius:9999px;padding:0.25rem 0.75rem;font-size:0.75rem;font-weight:900;white-space:nowrap;${statusStyle(event.status)}">${escapeHtml(event.status)}</span>
            </div>
            <p style="margin-top:1rem;line-height:1.75;color:#cbd5e1;">${escapeHtml(event.description)}</p>
          </article>`;
      }).join("");
    } else {
      upcomingList.innerHTML =
        '<p style="border-radius:1.5rem;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.06);padding:1.5rem;color:#cbd5e1;">No upcoming events added yet.</p>';
    }

    /* ── Past ── */
    if (events.past.length) {
      pastList.innerHTML = events.past.map((event, i) => {
        const ac = accentColors[i % accentColors.length];
        return `
          <div style="display:flex;gap:1rem;">
            <span style="display:block;margin-top:0.25rem;height:0.75rem;width:0.75rem;flex-shrink:0;border-radius:9999px;background:${ac.dot};"></span>
            <div>
              <h3 style="font-weight:900;color:#fff;">${escapeHtml(event.title)}</h3>
              <p style="margin-top:0.25rem;font-size:0.875rem;line-height:1.75;color:#94a3b8;">${escapeHtml(event.description)}</p>
            </div>
          </div>`;
      }).join("");
    } else {
      pastList.innerHTML = '<p style="font-size:0.875rem;color:#94a3b8;">No past events added yet.</p>';
    }
  };

  const renderAdminEvents = () => {
    const adminList = document.getElementById("admin-events-list");
    if (!adminList) return;

    const events = readEvents();
    const combined = [
      ...events.upcoming.map((e) => ({ ...e, type: "upcoming" })),
      ...events.past.map((e)     => ({ ...e, type: "past" }))
    ];

    if (combined.length) {
      adminList.innerHTML = combined.map((event) => `
        <article style="border-radius:1rem;border:1px solid rgba(255,255,255,0.1);background:rgba(2,6,23,0.6);padding:1.25rem;">
          <div style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:1rem;">
            <div>
              <p style="font-size:0.75rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:#67e8f9;">${escapeHtml(event.type)}</p>
              <h3 style="margin-top:0.5rem;font-size:1.25rem;font-weight:900;color:#fff;">${escapeHtml(event.title)}</h3>
              <p style="margin-top:0.25rem;font-size:0.875rem;color:#94a3b8;">${escapeHtml(event.date || "")}${event.status ? ` · ${escapeHtml(event.status)}` : ""}</p>
              <p style="margin-top:0.75rem;font-size:0.875rem;line-height:1.75;color:#cbd5e1;">${escapeHtml(event.description)}</p>
            </div>
            <button type="button"
              data-delete-event="${escapeHtml(event.id)}"
              data-delete-type="${escapeHtml(event.type)}"
              style="flex-shrink:0;border-radius:0.5rem;border:1px solid rgba(253,164,175,0.3);background:rgba(244,63,94,0.1);color:#fecdd3;font-weight:900;padding:0.5rem 0.75rem;font-size:0.875rem;cursor:pointer;font-family:inherit;"
              onmouseenter="this.style.background='rgba(244,63,94,0.2)'"
              onmouseleave="this.style.background='rgba(244,63,94,0.1)'">Delete</button>
          </div>
        </article>`).join("");
    } else {
      adminList.innerHTML =
        '<p style="border-radius:1rem;border:1px solid rgba(255,255,255,0.1);background:rgba(2,6,23,0.6);padding:1.25rem;color:#cbd5e1;">No events saved yet.</p>';
    }
  };

  const setupAdminPanel = () => {
    const form       = document.getElementById("event-admin-form");
    if (!form) return;

    const typeInput  = document.getElementById("event-type");
    const statusWrap = document.getElementById("event-status-wrap");
    const resetBtn   = document.getElementById("reset-events");

    const toggleStatus = () => {
      statusWrap.style.display = typeInput.value === "past" ? "none" : "";
    };
    typeInput.addEventListener("change", toggleStatus);
    toggleStatus();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const type = typeInput.value;
      const newEvent = {
        id: `${Date.now()}`,
        title: document.getElementById("event-title").value.trim(),
        date:  document.getElementById("event-date").value.trim(),
        description: document.getElementById("event-description").value.trim()
      };
      if (type === "upcoming") {
        newEvent.status = document.getElementById("event-status").value;
      }
      const events = readEvents();
      events[type].unshift(newEvent);
      saveEvents(events);
      form.reset();
      toggleStatus();
      renderAdminEvents();
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-delete-event]");
      if (!btn) return;
      const events = readEvents();
      const type = btn.dataset.deleteType;
      events[type] = events[type].filter((item) => item.id !== btn.dataset.deleteEvent);
      saveEvents(events);
      renderAdminEvents();
    });

    resetBtn.addEventListener("click", () => {
      localStorage.removeItem(eventStoreKey);
      renderAdminEvents();
    });

    renderAdminEvents();
  };

  renderPublicEvents();
  setupAdminPanel();

  /* ── Navbar injection ── */
  const mount = document.getElementById("global-navbar");
  if (!mount) return;

  fetch("navbar.html")
    .then((res) => {
      if (!res.ok) throw new Error("Unable to load navbar");
      return res.text();
    })
    .then((html) => {
      mount.innerHTML = html;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const links = mount.querySelectorAll(".nav-link");

      links.forEach((link) => {
        const isActive = link.dataset.page === currentPage;
        if (!isActive) return;
        if (link.classList.contains("nav-cta")) {
          link.style.boxShadow = "0 0 0 2px rgba(165,243,252,0.5)";
        } else {
          link.classList.add("active");
        }
      });

      const button = document.getElementById("nav-menu-button");
      const menu   = document.getElementById("nav-links");
      if (button && menu) {
        button.addEventListener("click", () => {
          const isOpen = menu.classList.contains("open");
          menu.classList.toggle("open", !isOpen);
          button.setAttribute("aria-expanded", String(!isOpen));
        });
      }
    })
    .catch(() => {
      mount.innerHTML =
        '<div style="position:fixed;inset:0 0 auto;z-index:50;background:#020617;padding:1rem;text-align:center;font-size:0.875rem;color:#a5f3fc;">ACM JIT</div>';
    });

  /* ── Auth toggle (join-us.html) ── */
  const authTabs   = document.querySelectorAll("[data-auth-mode]");
  const authTitle  = document.getElementById("auth-title");
  const authCopy   = document.getElementById("auth-copy");
  const authSubmit = document.getElementById("auth-submit");

  authTabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.authMode;
      authTabs.forEach((t) => {
        if (t === btn) {
          t.classList.add("active");
        } else {
          t.classList.remove("active");
        }
      });
      if (authTitle && authCopy && authSubmit) {
        const isRegister = mode === "register";
        authTitle.textContent = isRegister ? "Register for Membership" : "Welcome Back";
        authCopy.textContent  = isRegister
          ? "Create your chapter access and step into the ACM JIT community."
          : "Sign in to access chapter updates, resources, and member-only opportunities.";
        authSubmit.textContent = isRegister ? "Create Membership" : "Sign In";
      }
    });
  });
});

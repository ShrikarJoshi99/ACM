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

  const statusClasses = (status) => {
    const normalizedStatus = status.toLowerCase();
    if (normalizedStatus.includes("open")) return "bg-emerald-400/10 text-emerald-300";
    if (normalizedStatus.includes("soon")) return "bg-amber-400/10 text-amber-300";
    if (normalizedStatus.includes("fast")) return "bg-cyan-400/10 text-cyan-300";
    return "bg-rose-400/10 text-rose-300";
  };

  const renderPublicEvents = () => {
    const upcomingList = document.getElementById("upcoming-events-list");
    const pastList = document.getElementById("past-events-list");
    if (!upcomingList || !pastList) return;

    const events = readEvents();
    const accents = ["cyan", "violet", "emerald"];

    upcomingList.innerHTML = events.upcoming.length
      ? events.upcoming
          .map((event, index) => {
            const accent = accents[index % accents.length];
            return `
              <article class="rounded-3xl border border-${accent}-300/20 bg-white/[0.06] p-6 backdrop-blur transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-${accent}-300/60">
                <div class="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p class="text-sm font-black text-${accent}-300">${escapeHtml(event.date)}</p>
                    <h3 class="mt-2 text-2xl font-black text-white">${escapeHtml(event.title)}</h3>
                  </div>
                  <span class="rounded-full px-3 py-1 text-xs font-black ${statusClasses(event.status)}">${escapeHtml(event.status)}</span>
                </div>
                <p class="mt-4 leading-7 text-slate-300">${escapeHtml(event.description)}</p>
              </article>
            `;
          })
          .join("")
      : '<p class="rounded-3xl border border-white/10 bg-white/[0.06] p-6 text-slate-300">No upcoming events added yet.</p>';

    pastList.innerHTML = events.past.length
      ? events.past
          .map((event, index) => {
            const accent = accents[index % accents.length];
            return `
              <div class="flex gap-4">
                <span class="mt-1 h-3 w-3 rounded-full bg-${accent}-300"></span>
                <div>
                  <h3 class="font-black text-white">${escapeHtml(event.title)}</h3>
                  <p class="mt-1 text-sm leading-6 text-slate-400">${escapeHtml(event.description)}</p>
                </div>
              </div>
            `;
          })
          .join("")
      : '<p class="text-sm text-slate-400">No past events added yet.</p>';
  };

  const renderAdminEvents = () => {
    const adminList = document.getElementById("admin-events-list");
    if (!adminList) return;

    const events = readEvents();
    const combinedEvents = [
      ...events.upcoming.map((event) => ({ ...event, type: "upcoming" })),
      ...events.past.map((event) => ({ ...event, type: "past" }))
    ];

    adminList.innerHTML = combinedEvents.length
      ? combinedEvents
          .map((event) => `
            <article class="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
              <div class="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">${escapeHtml(event.type)}</p>
                  <h3 class="mt-2 text-xl font-black text-white">${escapeHtml(event.title)}</h3>
                  <p class="mt-1 text-sm text-slate-400">${escapeHtml(event.date || "")}${event.status ? ` · ${escapeHtml(event.status)}` : ""}</p>
                  <p class="mt-3 text-sm leading-6 text-slate-300">${escapeHtml(event.description)}</p>
                </div>
                <button type="button" data-delete-event="${escapeHtml(event.id)}" data-delete-type="${escapeHtml(event.type)}" class="rounded-lg border border-rose-300/30 bg-rose-400/10 px-3 py-2 text-sm font-black text-rose-200 transition-all duration-300 ease-in-out hover:bg-rose-400/20">Delete</button>
              </div>
            </article>
          `)
          .join("")
      : '<p class="rounded-2xl border border-white/10 bg-slate-950/60 p-5 text-slate-300">No events saved yet.</p>';
  };

  const setupAdminPanel = () => {
    const form = document.getElementById("event-admin-form");
    if (!form) return;

    const typeInput = document.getElementById("event-type");
    const statusWrap = document.getElementById("event-status-wrap");
    const resetButton = document.getElementById("reset-events");

    const toggleStatus = () => {
      statusWrap.classList.toggle("hidden", typeInput.value === "past");
    };

    typeInput.addEventListener("change", toggleStatus);
    toggleStatus();

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const type = typeInput.value;
      const newEvent = {
        id: `${Date.now()}`,
        title: document.getElementById("event-title").value.trim(),
        date: document.getElementById("event-date").value.trim(),
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

    document.addEventListener("click", (event) => {
      const deleteButton = event.target.closest("[data-delete-event]");
      if (!deleteButton) return;

      const events = readEvents();
      const type = deleteButton.dataset.deleteType;
      events[type] = events[type].filter((item) => item.id !== deleteButton.dataset.deleteEvent);
      saveEvents(events);
      renderAdminEvents();
    });

    resetButton.addEventListener("click", () => {
      localStorage.removeItem(eventStoreKey);
      renderAdminEvents();
    });

    renderAdminEvents();
  };

  renderPublicEvents();
  setupAdminPanel();

  const mount = document.getElementById("global-navbar");
  if (!mount) return;

  fetch("navbar.html")
    .then((response) => {
      if (!response.ok) throw new Error("Unable to load navbar");
      return response.text();
    })
    .then((html) => {
      mount.innerHTML = html;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const links = mount.querySelectorAll(".nav-link");

      links.forEach((link) => {
        const isActive = link.dataset.page === currentPage;
        link.classList.toggle("text-cyan-300", isActive);
        link.classList.toggle("bg-white/10", isActive && !link.classList.contains("nav-cta"));
        link.classList.toggle("shadow-cyan-500/30", isActive && link.classList.contains("nav-cta"));
        link.classList.toggle("ring-2", isActive && link.classList.contains("nav-cta"));
        link.classList.toggle("ring-cyan-200/50", isActive && link.classList.contains("nav-cta"));

        if (isActive && !link.classList.contains("nav-cta")) {
          link.classList.add("after:mt-1", "after:block", "after:h-0.5", "after:w-full", "after:rounded-full", "after:bg-cyan-300/80");
        }
      });

      const button = document.getElementById("nav-menu-button");
      const menu = document.getElementById("nav-links");
      if (button && menu) {
        button.addEventListener("click", () => {
          const isOpen = !menu.classList.contains("hidden");
          menu.classList.toggle("hidden", isOpen);
          button.setAttribute("aria-expanded", String(!isOpen));
        });
      }
    })
    .catch(() => {
      mount.innerHTML = '<div class="fixed inset-x-0 top-0 z-50 bg-slate-950 p-4 text-center text-sm text-cyan-200">ACM JIT</div>';
    });

  const authToggle = document.querySelectorAll("[data-auth-mode]");
  const authTitle = document.getElementById("auth-title");
  const authCopy = document.getElementById("auth-copy");
  const authButton = document.getElementById("auth-submit");

  authToggle.forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.authMode;
      authToggle.forEach((item) => {
        item.classList.toggle("bg-cyan-400", item === button);
        item.classList.toggle("text-slate-950", item === button);
        item.classList.toggle("text-slate-300", item !== button);
      });

      if (authTitle && authCopy && authButton) {
        const isRegister = mode === "register";
        authTitle.textContent = isRegister ? "Register for Membership" : "Welcome Back";
        authCopy.textContent = isRegister
          ? "Create your chapter access and step into the ACM JIT community."
          : "Sign in to access chapter updates, resources, and member-only opportunities.";
        authButton.textContent = isRegister ? "Create Membership" : "Sign In";
      }
    });
  });
});

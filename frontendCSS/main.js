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

  const setButtonBusy = (button, label) => {
    if (!button) return;
    button.dataset.originalText = button.textContent;
    button.textContent = label;
    button.disabled = true;
    button.style.opacity = "0.82";
  };

  const restoreButton = (button) => {
    if (!button) return;
    button.textContent = button.dataset.originalText || button.textContent;
    button.disabled = false;
    button.style.opacity = "";
  };
const showPopup = (title, message, options = {}) => {
  const popup = document.getElementById("popup");
  const popupTitle = document.getElementById("popup-title");
  const popupMessage = document.getElementById("popup-message");
  const popupBtn = document.getElementById("popup-btn");

  if (!popup || !popupTitle || !popupMessage || !popupBtn) {
    alert(`${title}: ${message}`);
    return;
  }

  popupTitle.textContent = title;
  popupMessage.textContent = message;

  popup.style.display = "flex";

  const closePopup = () => {
    popup.style.display = "none";
    if (options.onClose) options.onClose();
  };

  popupBtn.onclick = closePopup;
  
  // Auto-close after 3 seconds for success messages
  if (title.toLowerCase().includes("success")) {
    setTimeout(closePopup, 3000);
  }
};

  const setupAuthForms = () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");
    const verifyForm = document.getElementById("verify-form");
    const forgotPasswordForm = document.getElementById("forgot-password-form");

 if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = loginForm.querySelector("button[type='submit']");
    const formData = new FormData(loginForm);

    setButtonBusy(submitButton, "Signing In...");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
       body: JSON.stringify({
  email: formData.get("identifier"),
  password: formData.get("password"),
}),
      });

      const data = await response.json();

      restoreButton(submitButton);

      if (!response.ok) {
       showPopup(
  "Login Failed",
  data.message || "Invalid credentials"
);
        return;
      }

      // Save token
    localStorage.setItem("token", data.accessToken);

      // Save user
      localStorage.setItem("user", JSON.stringify(data.user));

      showPopup(
  "Success",
  "Login successful",
  { onClose: () => window.location.href = "index.html" }
);

      loginForm.reset();

    } catch (error) {
      console.error(error);
      restoreButton(submitButton);
    showPopup(
  "Server Error",
  "Unable to connect to server"
);
    }
  });
}

    if (registerForm) {
  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = registerForm.querySelector("button[type='submit']");
    const formData = new FormData(registerForm);

    setButtonBusy(submitButton, "Creating Account...");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
  name: formData.get("fullName"),
  email: formData.get("email"),
  password: formData.get("password"),
}),
      });

      const data = await response.json();

      restoreButton(submitButton);

      if (!response.ok) {
       showPopup(
  "Registration Failed",
  data.message || "Unable to register"
);
        return;
      }

   showPopup(
  "Success",
  "Registration successful",
  { onClose: () => window.location.href = "verify.html" }
);

      registerForm.reset();

    } catch (error) {
      console.error(error);
      restoreButton(submitButton);
   showPopup(
  "Server Error",
  "Unable to connect to server"
);
    }
  });
}
    if (verifyForm) {
  verifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = verifyForm.querySelector("button[type='submit']");
    const formData = new FormData(verifyForm);

    setButtonBusy(submitButton, "Confirming...");

    try {
      const response = await fetch("http://localhost:5000/api/auth/verify-email", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          code: formData.get("verificationCode"),
        }),
      });

      const data = await response.json();

      restoreButton(submitButton);

      if (!response.ok) {
      showPopup(
  "Verification Failed",
  data.message || "Invalid code or email"
);
        return;
      }
showPopup(
  "Success",
  "Email verified successfully",
  { onClose: () => window.location.href = "join-us.html" }
);

      verifyForm.reset();

    } catch (error) {
      console.error(error);
      restoreButton(submitButton);
  showPopup(
  "Server Error",
  "Unable to connect to server"
);
    }
  });
}

    if (forgotPasswordForm) {
  const identifierInput = forgotPasswordForm.querySelector("[name='identifier']");
  const resetTokenInput = forgotPasswordForm.querySelector("[name='resetToken']");
  const newPasswordInput = forgotPasswordForm.querySelector("[name='newPassword']");
  const requestField = forgotPasswordForm.querySelector("[data-reset-request-field]");
  const tokenNote = forgotPasswordForm.querySelector("[data-reset-token-note]");

  let resetTokenSent = false;

  forgotPasswordForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = forgotPasswordForm.querySelector("button[type='submit']");
    const formData = new FormData(forgotPasswordForm);

    // STEP 1 — SEND RESET TOKEN
    if (!resetTokenSent) {
      setButtonBusy(submitButton, "Sending Token...");

      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/forgot-password",
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
  body: JSON.stringify({
  email: formData.get("identifier"),
}),
          }
        );

        const data = await response.json();

        restoreButton(submitButton);

        if (!response.ok) {
         showPopup(
  "Error",
  data.message || "Failed to send reset token"
);
          return;
        }

        resetTokenSent = true;

        if (requestField) requestField.style.display = "none";

        if (identifierInput) identifierInput.disabled = true;

        if (resetTokenInput) resetTokenInput.disabled = false;

        if (newPasswordInput) newPasswordInput.disabled = false;

        if (tokenNote) {
          tokenNote.style.display = "";
          tokenNote.textContent =
            "Reset token sent successfully.";
        }

        submitButton.textContent = "Reset Password";

        resetTokenInput?.focus();

      } catch (error) {
        console.error(error);
        restoreButton(submitButton);
     showPopup(
  "Server Error",
  "Unable to connect to server"
);
      }

      return;
    }

    // STEP 2 — RESET PASSWORD
    setButtonBusy(submitButton, "Resetting...");

try {

  const token = formData.get("resetToken");



  const response = await fetch(
    `http://localhost:5000/api/auth/reset-password/${token}`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: formData.get("newPassword"),
      }),
    }
  );

 const text = await response.text();



let data;

try {
  data = JSON.parse(text);
} catch {
 
  return;
}


  restoreButton(submitButton);

  if (!response.ok) {
   showPopup(
  "Error",
  data.message || "Failed to reset password"
);
    return;
  }

 showPopup(
  "Success",
  "Password reset successful",
  { onClose: () => window.location.href = "join-us.html" }
);

  forgotPasswordForm.reset();

  resetTokenSent = false;

  if (requestField) requestField.style.display = "";

  if (identifierInput) identifierInput.disabled = false;

  if (resetTokenInput) resetTokenInput.disabled = true;

  if (newPasswordInput) newPasswordInput.disabled = true;

  if (tokenNote) tokenNote.style.display = "none";

  submitButton.textContent = "Send Reset Token";

} catch (error) {
  console.error(error);
  restoreButton(submitButton);
showPopup(
  "Server Error",
  "Unable to connect to server"
);
}
  });
}
  };

  renderPublicEvents();
  setupAdminPanel();
  setupAuthForms();

  /* ── Navbar injection ── */
  const mount = document.getElementById("global-navbar");
  if (!mount) return;
  const mainScript = document.querySelector('script[src$="main.js"]');
  const navbarUrl = mainScript ? new URL("navbar.html", mainScript.src).href : "navbar.html";

  fetch(navbarUrl)
    .then((res) => {
      if (!res.ok) throw new Error("Unable to load navbar");
      return res.text();
    })
    .then((html) => {
      mount.innerHTML = html;

      const currentPage = window.location.pathname.split("/").pop() || "index.html";
      const activePageAliases = {
        "forgot-password.html": "join-us.html",
        "verify.html": "register.html"
      };
      const activePage = activePageAliases[currentPage] || currentPage;
      mount.querySelectorAll("a[href]").forEach((anchor) => {
        const rawHref = anchor.getAttribute("href");
        if (rawHref && !rawHref.startsWith("#")) {
          anchor.href = new URL(rawHref, navbarUrl).href;
        }
      });
      const links = mount.querySelectorAll(".nav-link");

      links.forEach((link) => {
        const isActive = link.dataset.page === activePage;
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
      // CHECK LOGIN STATUS & VALIDATE WITH BACKEND
      const token = localStorage.getItem("token");
      const localUserStr = localStorage.getItem("user");

      console.log("[nav] token present:", !!token);
      console.log("[nav] local user:", localUserStr);

      const hideAuthLinks = () => {
        menu.querySelectorAll("a").forEach(link => {
          const href = link.getAttribute("href");
          if (href?.includes("register") || href?.includes("join-us")) link.style.display = "none";
        });
      };

      if (!token) {
        // not logged in
        console.log("[nav] no token, skipping profile validation");
        return;
      }

      hideAuthLinks();

      const addLogoutButton = () => {
        if (document.getElementById("logout-btn")) return;
        menu.insertAdjacentHTML(
          "beforeend",
          `
          <a href="#" id="logout-btn" class="nav-cta">
            Logout
          </a>
          `
        );
        document.getElementById("logout-btn")?.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.reload();
        });
      };

      addLogoutButton();

      // Validate token by fetching profile from backend
      console.log("[nav] validating token with backend...");
      fetch("http://localhost:5000/api/auth/profile", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then(async (res) => {
        console.log("[nav] profile response status:", res.status);
        if (!res.ok) {
          // token invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return null;
        }
        const data = await res.json();
        console.log("[nav] profile data:", data);
        return data;
      })
      .then((profile) => {
        if (!profile) return;

        // backend returns { success: true, user }
        const profileData = profile.user || profile;

        // Update local user storage with fresh profile (store only the user object)
        try { localStorage.setItem('user', JSON.stringify(profileData)); } catch {}

        const isAdmin = !!(profileData && (profileData.isAdmin || (typeof profileData.role === 'string' && profileData.role.toLowerCase() === 'admin') || (Array.isArray(profileData.roles) && profileData.roles.map(r=>String(r).toLowerCase()).includes('admin'))));

        if (isAdmin) {
          // Insert admin dropdown
          menu.insertAdjacentHTML('beforeend', `
            <div class="admin-dropdown" style="position:relative;">
              <button type="button" id="admin-menu-toggle" class="nav-link" style="cursor:pointer;background:transparent;border:none;color:inherit;">Admin ▾</button>
              <div id="admin-menu" style="position:absolute;right:0;top:calc(100% + 8px);display:none;min-width:180px;border-radius:0.75rem;padding:0.5rem;background:rgba(2,6,23,0.95);border:1px solid rgba(255,255,255,0.06);box-shadow:0 10px 30px rgba(2,6,23,0.5);">
                <a class="nav-link" href="admin/admin.html" style="display:block;padding:0.5rem 0.75rem;">Manage Events</a>
                <a class="nav-link" href="admin/users.html" style="display:block;padding:0.5rem 0.75rem;">User Management</a>
                <a class="nav-link" href="admin/analytics.html" style="display:block;padding:0.5rem 0.75rem;">Analytics</a>
              </div>
            </div>
          `);

          const toggleBtn = document.getElementById('admin-menu-toggle');
          const adminMenu = document.getElementById('admin-menu');
          toggleBtn?.addEventListener('click', (e) => {
            const open = adminMenu.style.display === 'block';
            adminMenu.style.display = open ? 'none' : 'block';
          });
          // close when clicking outside
          document.addEventListener('click', (e) => {
            if (!e.target.closest('.admin-dropdown')) {
              const m = document.getElementById('admin-menu');
              if (m) m.style.display = 'none';
            }
          });
        }

        // Admin controls may be added after profile validation.
        // The logout button is already rendered when a token exists.
      })
      .catch(() => {
        // network error — keep showing basic UI but do not expose admin
      });
    })
    .catch(() => {
      mount.innerHTML =
        '<div style="position:fixed;inset:0 0 auto;z-index:50;background:#020617;padding:1rem;text-align:center;font-size:0.875rem;color:#a5f3fc;">ACM JIT</div>';
    });
});

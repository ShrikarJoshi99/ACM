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
        const showRegister = event.status && event.status.toLowerCase().includes("open");
        const registerBtn = showRegister
          ? `<button type="button" class="btn-register-event" data-reg-event-id="${escapeHtml(event.id)}" data-reg-event-title="${escapeHtml(event.title)}">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
               Register Now
             </button>`
          : "";
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
            ${registerBtn}
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

  /* ══════════════════════════════════════════════════
     EVENT REGISTRATION MODAL LOGIC
  ══════════════════════════════════════════════════ */
  const setupEventRegistration = () => {
    const modal     = document.getElementById("event-register-modal");
    const form      = document.getElementById("event-register-form");
    const closeBtn  = document.getElementById("modal-close-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const submitBtn = document.getElementById("reg-submit-btn");
    const teamSizeSelect  = document.getElementById("reg-team-size");
    const teamSection     = document.getElementById("team-members-section");
    const teamFieldsWrap  = document.getElementById("team-members-fields");

    if (!modal || !form) return;

    /* ── Open modal ── */
    const openModal = (eventId, eventTitle) => {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        showPopup("Login Required", "Please log in to register for events.", {
          onClose: () => { window.location.href = "join-us.html"; }
        });
        return;
      }

      // Pre-fill hidden fields
      document.getElementById("reg-event-id").value = eventId;
      document.getElementById("reg-event-title").value = eventTitle;
      document.getElementById("modal-event-title").textContent = eventTitle;

      // Auto-fill from stored user profile
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.name)  document.getElementById("reg-fullname").value = user.name;
          if (user.email) document.getElementById("reg-email").value = user.email;
        }
      } catch {}

      // Reset team fields
      teamSizeSelect.value = "1";
      teamSection.style.display = "none";
      teamFieldsWrap.innerHTML = "";

      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    /* ── Close modal ── */
    const closeModal = () => {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      form.reset();
      teamSection.style.display = "none";
      teamFieldsWrap.innerHTML = "";
    };

    closeBtn?.addEventListener("click", closeModal);
    cancelBtn?.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });

    /* ── Dynamic team members ── */
    const renderTeamFields = (size) => {
      const count = size - 1; // leader is the registrant
      if (count <= 0) {
        teamSection.style.display = "none";
        teamFieldsWrap.innerHTML = "";
        return;
      }
      teamSection.style.display = "";
      teamFieldsWrap.innerHTML = Array.from({ length: count }, (_, i) => `
        <div class="team-member-row">
          <p class="team-member-label">Member ${i + 2}</p>
          <input type="text" name="tm-name-${i}" placeholder="Full Name" required />
          <input type="text" name="tm-usn-${i}"  placeholder="USN" required />
        </div>
      `).join("");
    };

    teamSizeSelect.addEventListener("change", () => {
      renderTeamFields(Number(teamSizeSelect.value));
    });

    /* ── Register button click delegation ── */
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-reg-event-id]");
      if (!btn) return;
      openModal(btn.dataset.regEventId, btn.dataset.regEventTitle);
    });

    /* ── Form submission ── */
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("token");
      if (!token) {
        showPopup("Login Required", "Please log in to register for events.");
        return;
      }

      setButtonBusy(submitBtn, "Submitting...");

      const teamSize = Number(teamSizeSelect.value);
      const teamMembers = [];
      if (teamSize > 1) {
        for (let i = 0; i < teamSize - 1; i++) {
          const name = form.querySelector(`[name="tm-name-${i}"]`)?.value.trim();
          const usn  = form.querySelector(`[name="tm-usn-${i}"]`)?.value.trim();
          if (!name || !usn) {
            restoreButton(submitBtn);
            showPopup("Validation Error", `Please fill name and USN for team member ${i + 2}`);
            return;
          }
          teamMembers.push({ name, usn });
        }
      }

      const body = {
        eventId:    document.getElementById("reg-event-id").value,
        eventTitle: document.getElementById("reg-event-title").value,
        fullName:   document.getElementById("reg-fullname").value.trim(),
        email:      document.getElementById("reg-email").value.trim(),
        phone:      document.getElementById("reg-phone").value.trim(),
        collegeName: document.getElementById("reg-college").value.trim(),
        usn:        document.getElementById("reg-usn").value.trim(),
        teamSize,
        teamMembers,
        notes:      document.getElementById("reg-notes").value.trim()
      };

      try {
        const response = await fetch("http://localhost:5000/api/events/register", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        restoreButton(submitBtn);

        if (!response.ok) {
          showPopup("Registration Failed", data.message || "Something went wrong");
          return;
        }

        closeModal();
        showPopup("Success", "You have been successfully registered for this event!");
      } catch (error) {
        console.error(error);
        restoreButton(submitBtn);
        showPopup("Server Error", "Unable to connect to server. Please try again later.");
      }
    });
  };

  renderPublicEvents();
  setupAdminPanel();
  setupAuthForms();
  setupEventRegistration();

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


      const hideAuthLinks = () => {
        menu.querySelectorAll("a").forEach(link => {
          const href = link.getAttribute("href");
          if (href?.includes("register") || href?.includes("join-us")) link.style.display = "none";
        });
      };

      if (!token) {
        // not logged in
        return;
      }

      hideAuthLinks();

      // Validate token by fetching profile from backend
      fetch("http://localhost:5000/api/auth/profile", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
      .then(async (res) => {
        if (!res.ok) {
          // token invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          return null;
        }
        const data = await res.json();
        return data;
      })
      .then((profile) => {
        if (!profile) return;

        // backend returns { success: true, user }
        const profileData = profile.user || profile;

        // Update local user storage with fresh profile (store only the user object)
        try { localStorage.setItem('user', JSON.stringify(profileData)); } catch {}

        // Add profile avatar exactly after 'Know Us' button
        const nameParts = (profileData.fullName || profileData.name || "User").split(" ");
        const initials = nameParts.length > 1 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : nameParts[0].substr(0, 2).toUpperCase();

        const knowUsLink = menu.querySelector('a[href*="know-us.html"]');
        if (knowUsLink && !document.getElementById("profile-avatar-container")) {
          knowUsLink.insertAdjacentHTML('afterend', `
            <div id="profile-avatar-container" class="profile-avatar-container" style="display:flex;align-items:center;position:relative;margin-left:0.5rem;margin-right:0.5rem;">
              <button type="button" id="profile-avatar-btn" style="width:2.3rem;height:2.3rem;border-radius:50%;background:linear-gradient(135deg, var(--cyan-400), var(--violet-400));border:1px solid rgba(255,255,255,0.15);color:#0d0d0d;font-weight:900;font-size:0.85rem;cursor:pointer;display:grid;place-items:center;box-shadow:0 8px 20px rgba(34,211,238,0.25);transition:all 0.3s ease;font-family:'Inter',sans-serif;" title="View Profile">
                ${initials}
              </button>
            </div>
          `);

          // Hook up avatar button click event to display profile modal
          document.getElementById("profile-avatar-btn")?.addEventListener("click", () => {
            // Check if modal already exists in DOM, if so remove it
            const existingModal = document.getElementById("profile-info-modal");
            if (existingModal) existingModal.remove();

            // Inject modal markup
            const modalHTML = `
              <div id="profile-info-modal" style="position:fixed;inset:0;background:rgba(0,0,0,0.8);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;transition:opacity 0.3s ease;font-family:'Inter',sans-serif;padding:1rem;">
                <div id="profile-modal-body" style="background:rgba(20,20,20,0.95);border:1px solid rgba(255,255,255,0.1);border-radius:2rem;max-width:540px;width:100%;box-shadow:0 25px 50px -12px rgba(0,0,0,0.8);transform:scale(0.95);transition:transform 0.3s ease;overflow:hidden;color:#f1f5f9;">
                  <!-- Header -->
                  <div style="background:linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01));padding:2rem;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:1.5rem;position:relative;">
                    <button id="close-profile-modal-btn" style="position:absolute;top:1rem;right:1.25rem;background:transparent;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;transition:color 0.2s;" title="Close">×</button>
                    
                    <div style="width:4.5rem;height:4.5rem;border-radius:50%;background:linear-gradient(135deg, var(--cyan-400), var(--violet-400));display:grid;place-items:center;font-size:1.75rem;font-weight:900;color:#0d0d0d;box-shadow:0 8px 24px rgba(34,211,238,0.3);">
                      ${initials}
                    </div>
                    <div>
                      <h3 style="font-size:1.5rem;font-weight:900;color:#fff;margin:0;">${profileData.fullName || profileData.name || "User"}</h3>
                      <p style="font-size:0.9rem;color:#94a3b8;margin:0.25rem 0 0 0;">${profileData.email}</p>
                      <span style="display:inline-block;margin-top:0.5rem;padding:0.25rem 0.75rem;border-radius:9999px;font-size:0.75rem;font-weight:800;background:rgba(34,211,238,0.1);color:var(--cyan-300);text-transform:uppercase;">
                        ${profileData.role || 'Student'}
                      </span>
                    </div>
                  </div>

                  <!-- Body / Registered Events -->
                  <div style="padding:2rem;max-height:360px;overflow-y:auto;" id="profile-registered-events-section">
                    <h4 style="font-size:1.1rem;font-weight:800;color:#fff;margin-bottom:1rem;display:flex;align-items:center;gap:0.5rem;font-family:'Inter',sans-serif;">
                      <span>🎟️</span> Registered Events
                    </h4>
                    
                    <div id="my-events-loader" style="text-align:center;padding:2rem 0;color:#94a3b8;">
                      <div style="width:1.5rem;height:1.5rem;border:2px solid var(--cyan-400);border-top-color:transparent;border-radius:50%;margin:0 auto 0.75rem;animation:spin 0.8s linear infinite;"></div>
                      Loading your events...
                    </div>
                    <div id="my-events-list" style="display:none;flex-direction:column;gap:1rem;"></div>
                  </div>

                  <!-- Footer -->
                  <div style="padding:1.5rem 2rem;background:rgba(10,10,10,0.5);border-top:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;">
                    <span style="font-size:0.8rem;color:#64748b;">ACM Student Chapter</span>
                    <button id="profile-logout-btn" style="background:rgba(244,63,94,0.1);border:1px solid rgba(244,63,94,0.2);color:var(--rose-300);font-weight:700;padding:0.5rem 1rem;border-radius:0.75rem;font-size:0.875rem;cursor:pointer;transition:all 0.2s;" onmouseover="this.style.background='rgba(244,63,94,0.2)'" onmouseout="this.style.background='rgba(244,63,94,0.1)'">
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <style>
                @keyframes spin { to { transform: rotate(360deg); } }
                #profile-registered-events-section::-webkit-scrollbar { width: 6px; }
                #profile-registered-events-section::-webkit-scrollbar-track { background: transparent; }
                #profile-registered-events-section::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 99px; }
              </style>
            `;

            document.body.insertAdjacentHTML("beforeend", modalHTML);

            const modal = document.getElementById("profile-info-modal");
            const modalBody = document.getElementById("profile-modal-body");

            // Animate in
            setTimeout(() => {
              if (modal) modal.style.opacity = "1";
              if (modalBody) modalBody.style.transform = "scale(1)";
            }, 10);

            // Close handlers
            const closeModal = () => {
              if (modal) modal.style.opacity = "0";
              if (modalBody) modalBody.style.transform = "scale(0.95)";
              setTimeout(() => {
                modal?.remove();
              }, 300);
            };

            document.getElementById("close-profile-modal-btn")?.addEventListener("click", closeModal);
            modal?.addEventListener("click", (e) => {
              if (e.target === modal) closeModal();
            });

            // Logout handler
            document.getElementById("profile-logout-btn")?.addEventListener("click", () => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.reload();
            });

            // Fetch registrations from new endpoint!
            fetch("http://localhost:5000/api/events/my-registrations", {
              headers: {
                "Authorization": `Bearer ${token}`
              }
            })
            .then(res => res.json())
            .then(data => {
              const loader = document.getElementById("my-events-loader");
              const container = document.getElementById("my-events-list");
              if (loader) loader.style.display = "none";
              if (container) container.style.display = "flex";

              if (!data.success || !data.registrations || data.registrations.length === 0) {
                if (container) {
                  container.innerHTML = `
                    <div style="text-align:center;padding:2rem 0;color:#94a3b8;background:rgba(255,255,255,0.02);border:1px dashed rgba(255,255,255,0.08);border-radius:1rem;">
                      <p style="margin:0 0 1rem 0;font-size:0.95rem;">You haven't registered for any events yet.</p>
                      <a href="events.html" style="display:inline-block;padding:0.5rem 1rem;background:var(--cyan-400);color:#0d0d0d;border-radius:0.5rem;font-size:0.85rem;font-weight:800;text-decoration:none;transition:transform 0.2s;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='none'">Browse Events</a>
                    </div>
                  `;
                }
                return;
              }

              if (container) {
                container.innerHTML = data.registrations.map(reg => `
                  <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:1rem;padding:1.25rem;transition:border-color 0.2s;" onmouseover="this.style.borderColor='rgba(34,211,238,0.2)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.06)'">
                    <div style="display:flex;justify-content:space-between;align-items:start;gap:1rem;">
                      <div style="flex:1;text-align:left;">
                        <h5 style="font-size:1.05rem;font-weight:800;color:#fff;margin:0 0 0.25rem 0;font-family:'Inter',sans-serif;">${reg.eventTitle}</h5>
                        <div style="font-size:0.8rem;color:#cbd5e1;display:flex;flex-direction:column;gap:0.25rem;margin-top:0.5rem;font-family:'Inter',sans-serif;">
                          <div><strong>USN:</strong> ${reg.usn}</div>
                          <div><strong>College:</strong> ${reg.collegeName}</div>
                          ${reg.teamSize > 1 ? `
                            <div style="margin-top:0.25rem;padding-top:0.25rem;border-top:1px dashed rgba(255,255,255,0.06);">
                              <strong>Team Size:</strong> ${reg.teamSize}
                              <div style="font-size:0.75rem;color:#94a3b8;margin-top:0.25rem;max-height:60px;overflow-y:auto;">
                                ${reg.teamMembers.map((m, idx) => `<div>${idx + 1}. ${m.name} (${m.usn})</div>`).join('')}
                              </div>
                            </div>
                          ` : ''}
                        </div>
                      </div>
                      <span style="font-size:0.7rem;color:#64748b;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;background:rgba(255,255,255,0.05);padding:0.25rem 0.5rem;border-radius:0.5rem;font-family:'Inter',sans-serif;">
                        Registered
                      </span>
                    </div>
                  </div>
                `).join("");
              }
            })
            .catch(err => {
              console.error(err);
              const loader = document.getElementById("my-events-loader");
              if (loader) {
                loader.innerHTML = `<span style="color:var(--rose-300);font-family:'Inter',sans-serif;">⚠️ Error loading your events. Please try again.</span>`;
              }
            });
          });
        }

        const isAdmin = !!(profileData && (profileData.isAdmin || (typeof profileData.role === 'string' && profileData.role.toLowerCase() === 'admin') || (Array.isArray(profileData.roles) && profileData.roles.map(r=>String(r).toLowerCase()).includes('admin'))));

        if (isAdmin) {
          // Resolve relative paths using navbarUrl so they don't break inside the nested admin/ folder!
          const adminHtmlUrl = new URL("admin/admin.html", navbarUrl).href;
          const adminUsersUrl = new URL("admin/users.html", navbarUrl).href;
          const adminAnalyticsUrl = new URL("admin/analytics.html", navbarUrl).href;

          // Insert admin dropdown
          menu.insertAdjacentHTML('beforeend', `
            <div class="admin-dropdown" style="position:relative;">
              <button type="button" id="admin-menu-toggle" class="nav-link" style="cursor:pointer;background:transparent;border:none;color:inherit;">Admin ▾</button>
              <div id="admin-menu" style="position:absolute;right:0;top:calc(100% + 8px);display:none;min-width:180px;border-radius:0.75rem;padding:0.5rem;background:rgba(2,6,23,0.95);border:1px solid rgba(255,255,255,0.06);box-shadow:0 10px 30px rgba(2,6,23,0.5);">
                <a class="nav-link" href="${adminHtmlUrl}" style="display:block;padding:0.5rem 0.75rem;">Manage Events</a>
                <a class="nav-link" href="${adminUsersUrl}" style="display:block;padding:0.5rem 0.75rem;">User Management</a>
                <a class="nav-link" href="${adminAnalyticsUrl}" style="display:block;padding:0.5rem 0.75rem;">Analytics</a>
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

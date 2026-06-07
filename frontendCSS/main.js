document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURATION ---
  // When deployed, change the fallback URL to your production backend URL
  const PROD_BACKEND_URL = "https://acmjyothy-backend.onrender.com/api";
  const isLocal = window.location.hostname === "localhost" || 
                  window.location.hostname === "127.0.0.1" || 
                  window.location.protocol === "file:";
  const API_BASE_URL = isLocal ? "http://localhost:5000/api" : PROD_BACKEND_URL;
  // ---------------------

  // --- Dark/Light Theme Custom Design System Overrides ---


  // Force migration to light mode for existing users (run once)
  if (!localStorage.getItem("migrated_to_light_default")) {
    localStorage.setItem("theme", "light");
    localStorage.setItem("migrated_to_light_default", "true");
  }

  // Apply saved theme immediately
  const savedTheme = localStorage.getItem("theme") || "light";
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
    document.documentElement.classList.add("light-theme");
  } else {
    document.body.classList.remove("light-theme");
    document.documentElement.classList.remove("light-theme");
  }

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/events`);
      const data = await res.json();
      if (data.success) {
        return { upcoming: data.upcoming || [], past: data.past || [] };
      }
    } catch (err) {
      console.error("Error fetching events from backend:", err);
    }
    return { upcoming: [], past: [] };
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
    const s = (status || "").toLowerCase();
    if (s.includes("closed")) return "background:rgba(244,63,94,0.1);color:#fda4af;";
    if (s.includes("open")) return "background:rgba(52,211,153,0.1);color:#6ee7b7;";
    if (s.includes("soon")) return "background:rgba(251,191,36,0.1);color:#fcd34d;";
    if (s.includes("fast")) return "background:rgba(34,211,238,0.1);color:#67e8f9;";
    return "background:rgba(244,63,94,0.1);color:#fda4af;";
  };

  /* Accent colours for cycling */
  const accentColors = [
    { border: "rgba(103,232,249,0.2)", hoverBorder: "rgba(103,232,249,0.6)", date: "#67e8f9", dot: "#67e8f9" },
    { border: "rgba(196,181,253,0.2)", hoverBorder: "rgba(196,181,253,0.6)", date: "#c4b5fd", dot: "#c4b5fd" },
    { border: "rgba(110,231,183,0.2)", hoverBorder: "rgba(110,231,183,0.6)", date: "#6ee7b7", dot: "#6ee7b7" }
  ];

  const renderPublicEvents = async () => {
    const upcomingList = document.getElementById("upcoming-events-list");
    const pastList = document.getElementById("past-events-list");
    if (!upcomingList || !pastList) return;

    const events = await fetchEvents();

    /* ── Upcoming ── */
    if (events.upcoming.length) {
      upcomingList.innerHTML = events.upcoming.map((event, i) => {
        const ac = accentColors[i % accentColors.length];
        const st = (event.status || "").toLowerCase();
        const isOpen = st.includes("open") && !st.includes("closed");
        const isClosed = st.includes("closed");

        let actionHtml = "";
        if (isOpen) {
          actionHtml = `<button type="button" class="btn-register-event" data-reg-event-id="${escapeHtml(event._id)}" data-reg-event-title="${escapeHtml(event.title)}" data-reg-event-team-size="${escapeHtml(event.teamSize || 1)}">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>
               Register Now
             </button>`;
        } else if (isClosed) {
          actionHtml = `<div style="margin-top:1rem;padding:0.6rem 1.2rem;border-radius:0.75rem;background:rgba(244,63,94,0.08);border:1px solid rgba(253,164,175,0.2);text-align:center;">
            <span style="font-size:0.85rem;font-weight:800;color:#fda4af;">🔒 Registration Closed</span>
          </div>`;
        }

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
            ${actionHtml}
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

  const renderAdminEvents = async () => {
    const adminList = document.getElementById("admin-events-list");
    if (!adminList) return;

    const events = await fetchEvents();
    const combined = [
      ...events.upcoming.map((e) => ({ ...e, type: "upcoming" })),
      ...events.past.map((e) => ({ ...e, type: "past" }))
    ];

    const formatDate = (d) => {
      if (!d) return "";
      try {
        return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      } catch { return ""; }
    };

    if (combined.length) {
      adminList.innerHTML = combined.map((event) => {
        let regInfo = "";
        if (event.registrationOpenDate || event.registrationCloseDate) {
          const openStr = formatDate(event.registrationOpenDate);
          const closeStr = formatDate(event.registrationCloseDate);
          regInfo = `<p style="margin-top:0.5rem;font-size:0.8rem;color:#6ee7b7;">
            📅 Registration: ${openStr || "—"} → ${closeStr || "—"}
            <span style="margin-left:0.5rem;padding:0.15rem 0.5rem;border-radius:9999px;font-size:0.7rem;font-weight:900;${statusStyle(event.status)}">${escapeHtml(event.status)}</span>
          </p>`;
        } else if (event.status) {
          regInfo = `<p style="margin-top:0.5rem;font-size:0.8rem;color:#94a3b8;">${escapeHtml(event.status)}</p>`;
        }
        return `
        <article style="border-radius:1rem;border:1px solid rgba(255,255,255,0.1);background:rgba(2,6,23,0.6);padding:1.25rem;">
          <div style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:1rem;">
            <div>
              <p style="font-size:0.75rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:#67e8f9;">${escapeHtml(event.type)}</p>
              <h3 style="margin-top:0.5rem;font-size:1.25rem;font-weight:900;color:#fff;">${escapeHtml(event.title)}</h3>
              <p style="margin-top:0.25rem;font-size:0.875rem;color:#94a3b8;">${escapeHtml(event.date || "")}</p>
              ${regInfo}
              <p style="margin-top:0.75rem;font-size:0.875rem;line-height:1.75;color:#cbd5e1;">${escapeHtml(event.description)}</p>
            </div>
            <button type="button"
              data-delete-event="${escapeHtml(event._id)}"
              data-delete-type="${escapeHtml(event.type)}"
              style="flex-shrink:0;border-radius:0.5rem;border:1px solid rgba(253,164,175,0.3);background:rgba(244,63,94,0.1);color:#fecdd3;font-weight:900;padding:0.5rem 0.75rem;font-size:0.875rem;cursor:pointer;font-family:inherit;"
              onmouseenter="this.style.background='rgba(244,63,94,0.2)'"
              onmouseleave="this.style.background='rgba(244,63,94,0.1)'"
            >Delete</button>
          </div>
        </article>`;
      }).join("");
    } else {
      adminList.innerHTML =
        '<p style="border-radius:1rem;border:1px solid rgba(255,255,255,0.1);background:rgba(2,6,23,0.6);padding:1.25rem;color:#cbd5e1;">No events saved yet.</p>';
    }
  };

  const setupAdminPanel = () => {
    const form = document.getElementById("event-admin-form");
    if (!form) return;

    const typeInput = document.getElementById("event-type");
    const regOpenWrap = document.getElementById("event-reg-open-wrap");
    const regCloseWrap = document.getElementById("event-reg-close-wrap");
    const teamSizeWrap = document.getElementById("event-team-size-wrap");
    const resetBtn = document.getElementById("reset-events");

    const toggleUpcomingFields = () => {
      const isPast = typeInput.value === "past";
      if (regOpenWrap) regOpenWrap.style.display = isPast ? "none" : "";
      if (regCloseWrap) regCloseWrap.style.display = isPast ? "none" : "";
      if (teamSizeWrap) teamSizeWrap.style.display = isPast ? "none" : "";
    };
    typeInput.addEventListener("change", toggleUpcomingFields);
    toggleUpcomingFields();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) submitBtn.textContent = "Saving...";

      const type = typeInput.value;
      const rawDate = document.getElementById("event-date").value;
      // Format the date for display (e.g., "June 15, 2026")
      let displayDate = rawDate;
      if (rawDate) {
        try {
          const d = new Date(rawDate + "T00:00:00");
          displayDate = d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
        } catch { /* keep raw value */ }
      }

      const newEvent = {
        title: document.getElementById("event-title").value.trim(),
        date: displayDate,
        description: document.getElementById("event-description").value.trim(),
        type: type
      };

      if (type === "upcoming") {
        const tsInput = document.getElementById("event-team-size");
        if (tsInput) {
          newEvent.teamSize = parseInt(tsInput.value) || 1;
        }
        const regOpen = document.getElementById("event-reg-open").value;
        const regClose = document.getElementById("event-reg-close").value;
        if (regOpen) newEvent.registrationOpenDate = new Date(regOpen + "T00:00:00").toISOString();
        if (regClose) {
          // Set close date to end of that day (23:59:59)
          newEvent.registrationCloseDate = new Date(regClose + "T23:59:59").toISOString();
        }
      }

      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE_URL}/events`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(newEvent)
        });
        if (res.ok) {
          form.reset();
          toggleUpcomingFields();
          await renderAdminEvents();
        } else {
          alert("Failed to save event");
        }
      } catch (err) {
        console.error(err);
        alert("Server error while saving event");
      }
      if (submitBtn) submitBtn.textContent = origText;
    });

    document.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-delete-event]");
      if (!btn) return;

      if (!confirm("Are you sure you want to delete this event?")) return;

      const eventId = btn.dataset.deleteEvent;
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          await renderAdminEvents();
        } else {
          alert("Failed to delete event");
        }
      } catch (err) {
        console.error(err);
      }
    });

    resetBtn.addEventListener("click", () => {
      alert("Reset is disabled. Events are managed in the database now.");
    });

    renderAdminEvents();
  };

  const defaultAnnouncements = [
    {
      id: "ann-1",
      category: "cyan",
      badge: "Hackathon Alerts",
      time: "Today, 10:30 AM",
      title: "Internal hack sprint registration opens soon",
      body: "Teams can start preparing project ideas for a focused build weekend around web, AI, and campus-life problem statements."
    },
    {
      id: "ann-2",
      category: "violet",
      badge: "Core Update",
      time: "May 18, 2026",
      title: "Domain orientation schedule released",
      body: "New members can meet domain leads, understand chapter tracks, and choose where they want to contribute first."
    },
    {
      id: "ann-3",
      category: "emerald",
      badge: "Workshop",
      time: "May 15, 2026",
      title: "Git and GitHub hands-on lab completed",
      body: "Thanks to everyone who joined the collaborative workflow session. Resource links will be added to the hub shortly."
    }
  ];

  const announcementStoreKey = "acm-jit-announcements";

  const readAnnouncements = () => {
    const saved = localStorage.getItem(announcementStoreKey);
    if (!saved) return structuredClone(defaultAnnouncements);
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return structuredClone(defaultAnnouncements);
    }
  };

  const saveAnnouncements = (announcements) => {
    localStorage.setItem(announcementStoreKey, JSON.stringify(announcements));
  };

  const renderPublicAnnouncements = () => {
    const list = document.getElementById("announcements-list");
    if (!list) return;

    const announcements = readAnnouncements();

    if (announcements.length) {
      list.innerHTML = announcements.map((ann) => {
        return `
      <article class="timeline-item ${escapeHtml(ann.category)}">
        <span class="timeline-dot ${escapeHtml(ann.category)}"></span>
        <div class="item-meta">
          <span class="item-badge ${escapeHtml(ann.category)}">${escapeHtml(ann.badge)}</span>
          <time class="item-time">${escapeHtml(ann.time)}</time>
        </div>
        <h2 class="item-title">${escapeHtml(ann.title)}</h2>
        <p class="item-body">${escapeHtml(ann.body)}</p>
      </article>`;
      }).join("");
    } else {
      list.innerHTML = '<p style="color:#cbd5e1;">No announcements yet.</p>';
    }
  };

  const renderAdminAnnouncements = () => {
    const adminList = document.getElementById("admin-announcements-list");
    if (!adminList) return;

    const announcements = readAnnouncements();

    if (announcements.length) {
      adminList.innerHTML = announcements.map((ann) => {
        let badgeColor = "#67e8f9"; // cyan default
        if (ann.category === "violet") badgeColor = "#c4b5fd";
        if (ann.category === "emerald") badgeColor = "#6ee7b7";
        return `
        <article style="border-radius:1rem;border:1px solid rgba(255,255,255,0.1);background:rgba(2,6,23,0.6);padding:1.25rem;">
          <div style="display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:1rem;">
            <div>
              <p style="font-size:0.75rem;font-weight:900;text-transform:uppercase;letter-spacing:0.2em;color:${badgeColor};">${escapeHtml(ann.badge)}</p>
              <h3 style="margin-top:0.5rem;font-size:1.25rem;font-weight:900;color:#fff;">${escapeHtml(ann.title)}</h3>
              <p style="margin-top:0.25rem;font-size:0.875rem;color:#94a3b8;">${escapeHtml(ann.time)}</p>
              <p style="margin-top:0.75rem;font-size:0.875rem;line-height:1.75;color:#cbd5e1;">${escapeHtml(ann.body)}</p>
            </div>
            <button type="button"
              data-delete-ann="${escapeHtml(ann.id)}"
              style="flex-shrink:0;border-radius:0.5rem;border:1px solid rgba(253,164,175,0.3);background:rgba(244,63,94,0.1);color:#fecdd3;font-weight:900;padding:0.5rem 0.75rem;font-size:0.875rem;cursor:pointer;font-family:inherit;"
              onmouseenter="this.style.background='rgba(244,63,94,0.2)'"
              onmouseleave="this.style.background='rgba(244,63,94,0.1)'">Delete</button>
          </div>
        </article>`;
      }).join("");
    } else {
      adminList.innerHTML =
        '<p style="border-radius:1rem;border:1px solid rgba(255,255,255,0.1);background:rgba(2,6,23,0.6);padding:1.25rem;color:#cbd5e1;">No announcements saved yet.</p>';
    }
  };

  const setupAdminAnnouncements = () => {
    const form = document.getElementById("announcement-admin-form");
    if (!form) return;

    const resetBtn = document.getElementById("reset-announcements");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const categorySelect = document.getElementById("announcement-category");
      const category = categorySelect.value;
      const badge = categorySelect.options[categorySelect.selectedIndex].text.split(" (")[0];

      const newAnn = {
        id: `ann-${Date.now()}`,
        category: category,
        badge: badge,
        time: document.getElementById("announcement-time").value.trim(),
        title: document.getElementById("announcement-title").value.trim(),
        body: document.getElementById("announcement-body").value.trim()
      };

      const announcements = readAnnouncements();
      announcements.unshift(newAnn);
      saveAnnouncements(announcements);
      form.reset();
      renderAdminAnnouncements();
    });

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-delete-ann]");
      if (!btn) return;
      let announcements = readAnnouncements();
      announcements = announcements.filter((item) => item.id !== btn.dataset.deleteAnn);
      saveAnnouncements(announcements);
      renderAdminAnnouncements();
    });

    resetBtn.addEventListener("click", () => {
      localStorage.removeItem(announcementStoreKey);
      renderAdminAnnouncements();
    });

    renderAdminAnnouncements();
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
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
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

        // Timeout after 30s so the button never stays stuck
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
          const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            credentials: "include",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: formData.get("fullName"),
              email: formData.get("email"),
              password: formData.get("password"),
            }),
          });

          clearTimeout(timeoutId);

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
          clearTimeout(timeoutId);
          console.error(error);
          restoreButton(submitButton);
          const msg = error.name === "AbortError"
            ? "Request timed out. Please try again."
            : "Unable to connect to server";
          showPopup(
            "Server Error",
            msg
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
          const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
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


        if (!resetTokenSent) {
          setButtonBusy(submitButton, "Sending Token...");

          try {
            const response = await fetch(
              `${API_BASE_URL}/auth/forgot-password`,
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


        setButtonBusy(submitButton, "Resetting...");

        try {

          const token = formData.get("resetToken");



          const response = await fetch(
            `${API_BASE_URL}/auth/reset-password/${token}`,
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
    const modal = document.getElementById("event-register-modal");
    const form = document.getElementById("event-register-form");
    const closeBtn = document.getElementById("modal-close-btn");
    const cancelBtn = document.getElementById("modal-cancel-btn");
    const submitBtn = document.getElementById("reg-submit-btn");
    const teamSizeSelect = document.getElementById("reg-team-size");
    const teamSection = document.getElementById("team-members-section");
    const teamFieldsWrap = document.getElementById("team-members-fields");

    if (!modal || !form) return;

    /* ── Open modal ── */
    const openModal = (eventId, eventTitle, maxTeamSize = 1) => {
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
          if (user.name) document.getElementById("reg-fullname").value = user.name;
          if (user.email) document.getElementById("reg-email").value = user.email;
        }
      } catch { }

      // Populate team size options based on maxTeamSize
      if (teamSizeSelect) {
        teamSizeSelect.innerHTML = "";
        for (let i = 1; i <= maxTeamSize; i++) {
          const opt = document.createElement("option");
          opt.value = i;
          opt.textContent = i === 1 ? "1 (Solo)" : i;
          teamSizeSelect.appendChild(opt);
        }
      }

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


    const renderTeamFields = (size) => {
      const count = size - 1;
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
          <input type="text" name="tm-usn-${i}"  placeholder="1JT24IS060" pattern="\\d[a-zA-Z]{2}\\d{2}[a-zA-Z]{2}\\d{3}" title="Please enter a valid USN in the format 1JT24IS052" required />
        </div>
      `).join("");
    };

    teamSizeSelect.addEventListener("change", () => {
      renderTeamFields(Number(teamSizeSelect.value));
    });


    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-reg-event-id]");
      if (!btn) return;
      openModal(btn.dataset.regEventId, btn.dataset.regEventTitle, parseInt(btn.dataset.regEventTeamSize) || 1);
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
          const usn = form.querySelector(`[name="tm-usn-${i}"]`)?.value.trim();
          if (!name || !usn) {
            restoreButton(submitBtn);
            showPopup("Validation Error", `Please fill name and USN for team member ${i + 2}`);
            return;
          }
          teamMembers.push({ name, usn });
        }
      }

      const body = {
        eventId: document.getElementById("reg-event-id").value,
        eventTitle: document.getElementById("reg-event-title").value,
        fullName: document.getElementById("reg-fullname").value.trim(),
        email: document.getElementById("reg-email").value.trim(),
        phone: document.getElementById("reg-phone").value.trim(),
        collegeName: document.getElementById("reg-college").value.trim(),
        usn: document.getElementById("reg-usn").value.trim(),
        teamSize,
        teamMembers,
        notes: document.getElementById("reg-notes").value.trim()
      };

      try {
        const response = await fetch(`${API_BASE_URL}/events/register`, {
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
  renderPublicAnnouncements();
  setupAdminPanel();
  setupAdminAnnouncements();
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
      const menu = document.getElementById("nav-links");
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
      fetch(`${API_BASE_URL}/auth/profile`, {
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
          try { localStorage.setItem('user', JSON.stringify(profileData)); } catch { }

          // Add profile avatar exactly after 'Know Us' button
          const nameParts = (profileData.fullName || profileData.name || "User").split(" ");
          const initials = nameParts.length > 1 ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase() : nameParts[0].substr(0, 2).toUpperCase();

          const knowUsLink = menu.querySelector('a[href*="know-us.html"]');
          if (knowUsLink && !document.getElementById("profile-avatar-container")) {
            knowUsLink.insertAdjacentHTML('afterend', `
            <div id="profile-avatar-container" class="profile-avatar-container" style="display:flex;align-items:center;position:relative;margin-left:0.5rem;margin-right:0.5rem;">
              <button type="button" id="profile-avatar-btn" style="width:2.3rem;height:2.3rem;border-radius:50%;background:linear-gradient(135deg, var(--cyan-400), var(--violet-400));border:1px solid rgba(255,255,255,0.15);color:#0d0d0d;font-weight:900;font-size:0.85rem;cursor:pointer;display:grid;place-items:center;box-shadow:0 8px 20px rgba(34,211,238,0.25);transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);font-family:'Inter',sans-serif;" onmouseover="this.style.transform='scale(1.08)';this.style.boxShadow='0 0 15px rgba(34,211,238,0.6)';" onmouseout="this.style.transform='none';this.style.boxShadow='0 8px 20px rgba(34,211,238,0.25)';" title="View Profile">
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
                    <button id="close-profile-modal-btn" style="position:absolute;top:1rem;right:1.25rem;background:transparent;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;transition:all 0.2s ease;" onmouseover="this.style.color='#fff';this.style.transform='scale(1.15)';" onmouseout="this.style.color='#94a3b8';this.style.transform='none';" title="Close">×</button>
                    
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
                      <span>🪽</span> Registered Events
                    </h4>
                    
                    <div id="my-events-loader" style="text-align:center;padding:2rem 0;color:#94a3b8;">
                      <div style="width:1.5rem;height:1.5rem;border:2px solid var(--cyan-400);border-top-color:transparent;border-radius:50%;margin:0 auto 0.75rem;animation:spin 0.8s linear infinite;"></div>
                      Loading your events...
                    </div>
                    <div id="my-events-list" style="display:none;flex-direction:column;gap:1rem;"></div>
                  </div>

                  <!-- Footer -->
                  <div style="padding:1.5rem 2rem;background:rgba(10,10,10,0.5);border-top:1px solid rgba(255,255,255,0.06);display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
                    <!-- Theme Mode Toggle -->
                    <div class="theme-switch-container" style="display:flex;align-items:center;gap:0.75rem;">
                      <button id="theme-toggle-btn" type="button" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:#fff;width:2.5rem;height:2.5rem;border-radius:0.75rem;cursor:pointer;display:grid;place-items:center;transition:all 0.3s cubic-bezier(0.4, 0, 0.2, 1);outline:none;position:relative;" title="Toggle Light/Dark Theme">
                        <svg id="theme-toggle-sun" style="width:1.25rem;height:1.25rem;color:var(--amber-300);transition:transform 0.5s ease;display:none;" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="5"></circle>
                          <line x1="12" y1="1" x2="12" y2="3"></line>
                          <line x1="12" y1="21" x2="12" y2="23"></line>
                          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                          <line x1="1" y1="12" x2="3" y2="12"></line>
                          <line x1="21" y1="12" x2="23" y2="12"></line>
                          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        <svg id="theme-toggle-moon" style="width:1.25rem;height:1.25rem;color:var(--violet-300);transition:transform 0.5s ease;display:none;" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                      </button>
                      <span id="theme-toggle-label" style="font-size:0.8rem;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;font-family:'Inter',sans-serif;">Dark Mode</span>
                    </div>

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

              // Setup Theme Switcher Controls
              const toggleBtn = document.getElementById("theme-toggle-btn");
              const sunIcon = document.getElementById("theme-toggle-sun");
              const moonIcon = document.getElementById("theme-toggle-moon");
              const toggleLabel = document.getElementById("theme-toggle-label");

              const updateToggleUI = (theme) => {
                if (theme === "light") {
                  if (sunIcon) sunIcon.style.display = "block";
                  if (moonIcon) moonIcon.style.display = "none";
                  if (toggleLabel) {
                    toggleLabel.textContent = "Light Mode";
                    toggleLabel.style.color = "#0f172a";
                  }
                  if (toggleBtn) {
                    toggleBtn.style.background = "rgba(15, 83, 240, 0.05)";
                    toggleBtn.style.borderColor = "rgba(15,23,42,0.1)";
                    toggleBtn.style.color = "#0f172a";
                  }
                } else {
                  if (sunIcon) sunIcon.style.display = "none";
                  if (moonIcon) moonIcon.style.display = "block";
                  if (toggleLabel) {
                    toggleLabel.textContent = "Dark Mode";
                    toggleLabel.style.color = "#f1f5f9";
                  }
                  if (toggleBtn) {
                    toggleBtn.style.background = "rgba(255,255,255,0.06)";
                    toggleBtn.style.borderColor = "rgba(255,255,255,0.1)";
                    toggleBtn.style.color = "#f1f5f9";
                  }
                }
              };

              const activeTheme = localStorage.getItem("theme") || "light";
              updateToggleUI(activeTheme);

              toggleBtn?.addEventListener("click", () => {
                const isLight = document.body.classList.contains("light-theme");
                const nextTheme = isLight ? "dark" : "light";

                if (nextTheme === "light") {
                  document.body.classList.add("light-theme");
                  document.documentElement.classList.add("light-theme");
                } else {
                  document.body.classList.remove("light-theme");
                  document.documentElement.classList.remove("light-theme");
                }

                localStorage.setItem("theme", nextTheme);
                updateToggleUI(nextTheme);
              });

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
              fetch(`${API_BASE_URL}/events/my-registrations`, {
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

          const isAdmin = !!(profileData && (profileData.isAdmin || (typeof profileData.role === 'string' && profileData.role.toLowerCase() === 'admin') || (Array.isArray(profileData.roles) && profileData.roles.map(r => String(r).toLowerCase()).includes('admin'))));

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


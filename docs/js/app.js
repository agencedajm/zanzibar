// Logique de l'application — Voyage Zanzibar 2026
(function () {
  "use strict";

  const LS_PREFIX = "znz2026_";
  const store = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(LS_PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
      } catch (e) { /* stockage indisponible, on ignore */ }
    }
  };

  const fmtDate = (iso) => {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" });
  };
  const fmtDateShort = (iso) => {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
  };
  const euro = (n) => n.toLocaleString("fr-FR") + " €";
  const icon = (id, extraClass) => `<svg class="icon${extraClass ? " " + extraClass : ""}"><use href="#i-${id}"/></svg>`;

  let leafletMapInstance = null;

  // ---------- Toast (micro-interaction de confirmation) ----------
  let toastEl = null;
  let toastTimer = null;
  function showToast(message) {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.id = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1800);
  }

  // ---------- Navigation par onglets ----------
  function activateTab(tabId) {
    const buttons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");
    buttons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
    panels.forEach((p) => p.classList.toggle("active", p.id === tabId));
    store.set("activeTab", tabId);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (tabId === "carte" && leafletMapInstance) {
      setTimeout(() => leafletMapInstance.invalidateSize(), 80);
    }
  }

  function initTabs() {
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.addEventListener("click", () => activateTab(b.dataset.tab));
    });
    activateTab(store.get("activeTab", "accueil"));
  }

  function initGotoButtons() {
    document.querySelectorAll("[data-goto]").forEach((el) => {
      el.addEventListener("click", () => activateTab(el.dataset.goto));
    });
  }

  // ---------- Accueil : compte à rebours + résumé ----------
  function initHome() {
    document.getElementById("home-destination").textContent = TRIP_INFO.destination;
    document.getElementById("home-dates").textContent =
      fmtDate(TRIP_INFO.startDate) + " → " + fmtDate(TRIP_INFO.endDate);
    document.getElementById("home-duration").textContent =
      TRIP_INFO.days + " jours / " + TRIP_INFO.nights + " nuits";
    document.getElementById("home-travelers").textContent = TRIP_INFO.travelers + " personnes";
    document.getElementById("home-budget").textContent =
      euro(TRIP_INFO.budgetPerPerson) + " / pers. (" + euro(TRIP_INFO.budgetCouple) + " au total)";
    document.getElementById("home-why").textContent = TRIP_INFO.whySeptember;
    const nightsNoteEl = document.getElementById("home-nights-note");
    if (nightsNoteEl) nightsNoteEl.textContent = TRIP_INFO.nightsNote || "";

    const stagesEl = document.getElementById("home-stages");
    stagesEl.innerHTML = TRIP_INFO.stages
      .map(
        (s) =>
          `<div class="stage-chip"><strong>${s.name}</strong><span>${s.nights} nuits — ${s.dates}</span></div>`
      )
      .join("");

    updateCountdown();
    setInterval(updateCountdown, 60 * 1000);
  }

  function updateCountdown() {
    const el = document.getElementById("countdown");
    if (!el) return;
    const now = new Date();
    const start = new Date(TRIP_INFO.startDate + "T00:00:00");
    const end = new Date(TRIP_INFO.endDate + "T23:59:59");
    if (now < start) {
      const days = Math.ceil((start - now) / 86400000);
      el.innerHTML = `<span class="countdown-number">${days}</span><span class="countdown-label">jour${days > 1 ? "s" : ""} avant le départ ${icon("plane")}<br><strong>${fmtDate(TRIP_INFO.startDate)}</strong></span>`;
    } else if (now >= start && now <= end) {
      const currentDay = Math.floor((now - start) / 86400000) + 1;
      el.innerHTML = `<span class="countdown-number">Jour ${currentDay}</span><span class="countdown-label">vous êtes à Zanzibar — bon voyage !</span>`;
      highlightItineraryDay(currentDay);
    } else {
      el.innerHTML = `<span class="countdown-number">${icon("check-circle")}</span><span class="countdown-label">Voyage terminé — asante sana Zanzibar !</span>`;
    }
  }

  function highlightItineraryDay(dayNum) {
    document.querySelectorAll(".day-card").forEach((card) => {
      card.classList.toggle("today", Number(card.dataset.day) === dayNum);
    });
  }

  // ---------- Itinéraire ----------
  function initItinerary() {
    const container = document.getElementById("itinerary-list");
    container.innerHTML = ITINERARY.map(renderDayCard).join("");

    container.querySelectorAll(".day-header").forEach((header) => {
      header.addEventListener("click", () => {
        header.parentElement.classList.toggle("open");
      });
    });

    container.querySelectorAll(".day-notes").forEach((textarea) => {
      const day = textarea.dataset.day;
      textarea.value = store.get("note_day_" + day, "");
      textarea.addEventListener("blur", () => {
        store.set("note_day_" + day, textarea.value);
        if (textarea.value) showToast("Note enregistrée");
      });
    });

    initJourneyStepper(container);
  }

  function initJourneyStepper(container) {
    const stepperEl = document.getElementById("journey-stepper");
    if (!stepperEl) return;
    const steps = [{ key: "tous", label: "Tout le voyage", icon: "map" }, ...JOURNEY];

    stepperEl.innerHTML = steps
      .map(
        (s) => `
        <button class="stepper-step" data-phase="${s.key}" type="button">
          <span class="stepper-dot">${icon(s.icon)}</span>
          <span class="stepper-label">${s.label}</span>
        </button>`
      )
      .join("");

    function applyFilter(phase) {
      stepperEl.querySelectorAll(".stepper-step").forEach((b) => b.classList.toggle("active", b.dataset.phase === phase));
      container.querySelectorAll(".day-card").forEach((card) => {
        const match = phase === "tous" || card.dataset.phase === phase;
        card.classList.toggle("filtered-out", !match);
      });
    }

    stepperEl.querySelectorAll(".stepper-step").forEach((btn) => {
      btn.addEventListener("click", () => applyFilter(btn.dataset.phase));
    });

    applyFilter("tous");
  }

  function scheduleRow(iconId, label, value) {
    return `
      <div class="day-schedule-row">
        ${icon(iconId)}
        <div><span class="label">${label}</span><p class="value">${value}</p></div>
      </div>`;
  }

  function renderDayCard(d) {
    return `
    <article class="day-card" data-day="${d.day}" data-stage="${d.stage}" data-phase="${d.phase}">
      <button class="day-header" type="button">
        <span class="day-badge">J${d.day}</span>
        <span class="day-heading">
          <span class="day-date">${fmtDateShort(d.date)}</span>
          <span class="day-location">${d.location}</span>
        </span>
        <span class="day-budget">${d.budget > 0 ? "≈ " + euro(d.budget) + "/pers" : ""}</span>
        <span class="day-chevron">${icon("chevron")}</span>
      </button>
      <div class="day-body">
        ${d.budgetNote ? `<p class="day-budget-note">${icon("info")} ${d.budgetNote}</p>` : ""}
        <div class="day-schedule">
          ${scheduleRow("sun", "Matin", d.morning)}
          ${scheduleRow("cloud-sun", "Après-midi", d.afternoon)}
          ${scheduleRow("moon", "Soir", d.evening)}
          ${scheduleRow("utensils", "Repas", d.meal)}
        </div>
        ${d.mealAlt ? `<p class="meal-alt">${icon("cross")} <strong>Sans poisson/fruits de mer :</strong> ${d.mealAlt}</p>` : ""}
        <label class="day-notes-label">
          Vos notes personnelles (souvenirs, adresses, changements de dernière minute…)
          <textarea class="day-notes" data-day="${d.day}" rows="2" placeholder="Écrivez ici pendant ou après le voyage…"></textarea>
        </label>
      </div>
    </article>`;
  }

  // ---------- Budget ----------
  function initBudget() {
    const tbody = document.getElementById("budget-tbody");
    const spent = store.get("budgetSpent", {});

    tbody.innerHTML = BUDGET_CATEGORIES.map((c) => {
      const val = spent[c.key] ?? "";
      return `
      <tr data-key="${c.key}">
        <td>
          <div class="budget-label">${c.label}</div>
          <div class="budget-detail">${c.detail}</div>
        </td>
        <td class="num">${euro(c.planned)}</td>
        <td class="num">
          <input type="number" min="0" step="1" class="spent-input" data-key="${c.key}" value="${val}" placeholder="0" /> €
        </td>
        <td class="num diff-cell">—</td>
      </tr>`;
    }).join("");

    tbody.querySelectorAll(".spent-input").forEach((input) => {
      input.addEventListener("change", () => {
        const s = store.get("budgetSpent", {});
        s[input.dataset.key] = input.value === "" ? null : Number(input.value);
        store.set("budgetSpent", s);
        recomputeBudget();
        showToast("Dépense enregistrée");
      });
    });

    recomputeBudget();
  }

  function recomputeBudget() {
    const spent = store.get("budgetSpent", {});
    let totalPlanned = 0;
    let totalSpent = 0;
    let anySpent = false;

    BUDGET_CATEGORIES.forEach((c) => {
      totalPlanned += c.planned;
      const s = spent[c.key];
      const row = document.querySelector(`#budget-tbody tr[data-key="${c.key}"]`);
      const diffCell = row ? row.querySelector(".diff-cell") : null;
      if (s !== null && s !== undefined && !Number.isNaN(s)) {
        anySpent = true;
        totalSpent += s;
        const diff = c.planned - s;
        if (diffCell) {
          diffCell.textContent = (diff >= 0 ? "+" : "") + diff + " €";
          diffCell.classList.toggle("over", diff < 0);
          diffCell.classList.toggle("under", diff >= 0);
        }
      } else if (diffCell) {
        diffCell.textContent = "—";
        diffCell.classList.remove("over", "under");
      }
    });

    document.getElementById("budget-total-planned").textContent = euro(totalPlanned);
    document.getElementById("budget-total-spent").textContent = anySpent ? euro(totalSpent) : "—";
    document.getElementById("budget-ceiling").textContent = euro(TRIP_INFO.budgetPerPerson);

    const margin = TRIP_INFO.budgetPerPerson - totalPlanned;
    document.getElementById("budget-margin").textContent =
      (margin >= 0 ? "+" : "") + euro(margin) + " de marge sous le plafond de " + euro(TRIP_INFO.budgetPerPerson) + "/pers.";

    const pct = Math.min(100, Math.round((totalPlanned / TRIP_INFO.budgetPerPerson) * 100));
    const bar = document.getElementById("budget-bar-fill");
    if (bar) bar.style.width = pct + "%";

    const label = document.getElementById("budget-bar-label");
    if (label) {
      label.textContent = euro(totalPlanned) + " prévus / " + euro(TRIP_INFO.budgetPerPerson) + " plafond (" + pct + "%)";
    }

    if (anySpent) {
      const pctSpent = Math.min(100, Math.round((totalSpent / TRIP_INFO.budgetPerPerson) * 100));
      const barSpent = document.getElementById("budget-bar-spent");
      if (barSpent) barSpent.style.width = pctSpent + "%";
    }

    document.getElementById("budget-couple-total").textContent =
      euro(totalPlanned * 2) + " pour le couple (sur un plafond de " + euro(TRIP_INFO.budgetCouple) + ")";
  }

  function initBudgetReset() {
    const btn = document.getElementById("budget-reset");
    if (!btn) return;
    btn.addEventListener("click", () => {
      if (confirm("Réinitialiser toutes les dépenses réelles saisies ?")) {
        store.set("budgetSpent", {});
        initBudget();
      }
    });
  }

  // ---------- Hébergements & vols ----------
  function initStay() {
    const flightsEl = document.getElementById("flights-list");
    flightsEl.innerHTML = FLIGHTS.map((f) => {
      const link = `https://www.google.com/travel/flights?q=${encodeURIComponent("vols " + f.airline + " Paris Zanzibar")}`;
      return `
      <div class="flight-card ${f.recommended ? "recommended" : ""}">
        ${f.recommended ? `<span class="badge">${icon("star")}Recommandé</span>` : ""}
        <h4 class="card-title"><span class="icon-tile c1">${icon("plane")}</span>${f.airline}</h4>
        <p class="pick-label">${f.pick}</p>
        <p><strong>${f.airport}</strong> → escale <strong>${f.stopover}</strong> → ZNZ</p>
        <p>Durée totale : ${f.duration}</p>
        <p class="price">${f.price} <span>/pers A/R</span></p>
        <a class="cta-btn primary block" href="${link}" target="_blank" rel="noopener">
          ${icon("plane")} Comparer les prix
        </a>
      </div>`;
    }).join("");

    const accEl = document.getElementById("accommodations-list");
    accEl.innerHTML = ACCOMMODATIONS.map((stageAcc) => {
      const options = stageAcc.options
        .map((opt, oi) => {
          const tileClass = "c" + ((oi % 3) + 1);
          return `
          <div class="acc-option">
            <div class="acc-banner ${tileClass}">${icon("building")}</div>
            <div class="acc-option-body">
              <span class="acc-profile">${opt.profile}</span>
              <h5>${opt.name}</h5>
              <p>${opt.description}</p>
              <a class="cta-btn small" href="${opt.bookingUrl}" target="_blank" rel="noopener">
                ${icon("chevron")} Voir sur Booking.com
              </a>
            </div>
          </div>`;
        })
        .join("");
      return `
      <div class="acc-stage-group">
        <div class="acc-stage-header">
          <h4>${stageAcc.stage}</h4>
          <span class="acc-nights">${stageAcc.nights} nuits — ${stageAcc.priceRange}</span>
        </div>
        <div class="acc-options-grid">${options}</div>
        <label class="booking-ref-label">
          N° de réservation / notes pour cette étape
          <input type="text" class="booking-ref" data-stage="${stageAcc.stage}" placeholder="Ex : confirmation Booking.com #..." />
        </label>
      </div>`;
    }).join("");

    accEl.querySelectorAll(".booking-ref").forEach((input) => {
      const key = "booking_" + input.dataset.stage;
      input.value = store.get(key, "");
      input.addEventListener("blur", () => {
        store.set(key, input.value);
        if (input.value) showToast("Référence enregistrée");
      });
    });
  }

  // ---------- Checklist ----------
  function initChecklist() {
    const container = document.getElementById("checklist-container");
    container.innerHTML = CHECKLIST.map((group, gi) => {
      const tileClass = "c" + ((gi % 3) + 1);
      return `
      <details class="checklist-group" ${gi === 0 ? "open" : ""}>
        <summary>
          <span class="icon-tile ${tileClass}">${icon(group.icon || "check-circle")}</span>
          <span class="checklist-group-title">${group.group}</span>
          <span class="group-progress" data-group="${gi}"></span>
          ${icon("chevron", "chevron-icon")}
        </summary>
        <ul class="checklist-items" data-group="${gi}"></ul>
        <div class="add-item-row">
          <input type="text" class="add-item-input" data-group="${gi}" placeholder="Ajouter un élément à cette liste…" />
          <button class="add-item-btn" data-group="${gi}" type="button">${icon("check-circle")}</button>
        </div>
      </details>`;
    }).join("");

    CHECKLIST.forEach((group, gi) => renderChecklistItems(gi));

    container.querySelectorAll(".add-item-btn").forEach((btn) => {
      const gi = Number(btn.dataset.group);
      const input = container.querySelector(`.add-item-input[data-group="${gi}"]`);
      const submit = () => {
        const text = input.value.trim();
        if (!text) return;
        const custom = store.get("checklistCustom", {});
        custom[gi] = custom[gi] || [];
        custom[gi].push(text);
        store.set("checklistCustom", custom);
        input.value = "";
        renderChecklistItems(gi);
        showToast("Élément ajouté");
      };
      btn.addEventListener("click", submit);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") { e.preventDefault(); submit(); } });
    });

    updateChecklistProgress();
  }

  function renderChecklistItems(gi) {
    const group = CHECKLIST[gi];
    const checked = store.get("checklist", {});
    const custom = store.get("checklistCustom", {})[gi] || [];

    const staticItems = group.items.map((text, ii) => ({ id: `chk-${gi}-${ii}`, text, custom: false }));
    const customItems = custom.map((text, ci) => ({ id: `chk-${gi}-custom-${ci}`, text, custom: true, ci }));
    const all = staticItems.concat(customItems);
    const unchecked = all.filter((it) => !checked[it.id]);
    const done = all.filter((it) => checked[it.id]);
    const ordered = unchecked.concat(done);

    const ul = document.querySelector(`.checklist-items[data-group="${gi}"]`);
    if (!ul) return;
    ul.innerHTML = ordered
      .map(
        (it) => `
      <li class="${checked[it.id] ? "is-checked" : ""}">
        <label class="checklist-item">
          <input type="checkbox" id="${it.id}" ${checked[it.id] ? "checked" : ""} />
          <span>${it.text}</span>
        </label>
        ${it.custom ? `<button class="item-delete" data-gi="${gi}" data-ci="${it.ci}" type="button" aria-label="Supprimer">✕</button>` : ""}
      </li>`
      )
      .join("");

    ul.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.addEventListener("change", () => {
        const c = store.get("checklist", {});
        c[box.id] = box.checked;
        store.set("checklist", c);
        renderChecklistItems(gi);
        updateChecklistProgress();
      });
    });

    ul.querySelectorAll(".item-delete").forEach((delBtn) => {
      delBtn.addEventListener("click", () => {
        const customStore = store.get("checklistCustom", {});
        const list = customStore[gi] || [];
        list.splice(Number(delBtn.dataset.ci), 1);
        customStore[gi] = list;
        store.set("checklistCustom", customStore);
        renderChecklistItems(gi);
        updateChecklistProgress();
      });
    });
  }

  function updateChecklistProgress() {
    let totalAll = 0;
    let doneAll = 0;
    const checked = store.get("checklist", {});
    const customStore = store.get("checklistCustom", {});
    CHECKLIST.forEach((group, gi) => {
      const customCount = (customStore[gi] || []).length;
      const total = group.items.length + customCount;
      let done = 0;
      for (let ii = 0; ii < group.items.length; ii++) if (checked[`chk-${gi}-${ii}`]) done++;
      for (let ci = 0; ci < customCount; ci++) if (checked[`chk-${gi}-custom-${ci}`]) done++;
      totalAll += total;
      doneAll += done;
      const label = document.querySelector(`.group-progress[data-group="${gi}"]`);
      if (label) label.textContent = `(${done}/${total})`;
    });
    const overall = document.getElementById("checklist-overall");
    if (overall) {
      const pct = totalAll ? Math.round((doneAll / totalAll) * 100) : 0;
      overall.textContent = `${doneAll} / ${totalAll} préparés (${pct}%)`;
    }
  }

  // ---------- Infos pratiques ----------
  function initPractical() {
    const container = document.getElementById("practical-list");
    container.innerHTML = PRACTICAL_INFO.map(
      (info, i) => `
      <details class="practical-card">
        <summary><span class="icon-tile c${(i % 3) + 1}">${icon(info.icon)}</span>${info.title}${icon("chevron", "chevron-icon")}</summary>
        <p>${info.content}</p>
      </details>`
    ).join("");
  }

  // ---------- Carte (Leaflet + OpenStreetMap) ----------
  function initMap() {
    const el = document.getElementById("leaflet-map");
    if (!el || typeof L === "undefined") return;

    const colors = { airport: "#1a1d1f", stage: "#ff5533", activity: "#0d9c86" };
    const map = L.map(el, { scrollWheelZoom: false });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 17
    }).addTo(map);

    const bounds = [];
    MAP_POINTS.forEach((p) => {
      const color = colors[p.type] || colors.activity;
      const radius = p.type === "stage" ? 10 : 7;
      L.circleMarker(p.coords, {
        radius,
        color: "#fff",
        weight: 2,
        fillColor: color,
        fillOpacity: 1
      })
        .addTo(map)
        .bindPopup(`<strong>${p.name}</strong>`);
      bounds.push(p.coords);
    });
    map.fitBounds(bounds, { padding: [28, 28] });
    leafletMapInstance = map;

    const legend = document.getElementById("map-legend");
    if (legend) {
      legend.innerHTML = MAP_POINTS.map((p) => `<li><span class="dot ${p.type}"></span>${p.name}</li>`).join("");
    }
  }

  // ---------- Initialisation ----------
  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
    initGotoButtons();
    initHome();
    initItinerary();
    initBudget();
    initBudgetReset();
    initStay();
    initChecklist();
    initPractical();
    initMap();
  });
})();

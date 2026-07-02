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

  // ---------- Navigation par onglets ----------
  function initTabs() {
    const buttons = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".tab-panel");
    function activate(tabId) {
      buttons.forEach((b) => b.classList.toggle("active", b.dataset.tab === tabId));
      panels.forEach((p) => p.classList.toggle("active", p.id === tabId));
      store.set("activeTab", tabId);
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    }
    buttons.forEach((b) => b.addEventListener("click", () => activate(b.dataset.tab)));
    activate(store.get("activeTab", "accueil"));
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
      el.innerHTML = `<span class="countdown-number">${days}</span><span class="countdown-label">jour${days > 1 ? "s" : ""} avant le départ ${icon("plane")}</span>`;
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
      textarea.addEventListener("input", () => {
        store.set("note_day_" + day, textarea.value);
      });
    });

    initItineraryFilters(container);
  }

  function initItineraryFilters(container) {
    const filtersEl = document.getElementById("itinerary-filters");
    if (!filtersEl) return;
    const stages = ["Tous", ...TRIP_INFO.stages.map((s) => s.name)];
    filtersEl.innerHTML = stages
      .map((s, i) => `<button class="filter-chip${i === 0 ? " active" : ""}" data-stage="${s}">${s}</button>`)
      .join("");

    filtersEl.querySelectorAll(".filter-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        filtersEl.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const stage = chip.dataset.stage;
        container.querySelectorAll(".day-card").forEach((card) => {
          const match = stage === "Tous" || card.dataset.stage === stage;
          card.classList.toggle("filtered-out", !match);
        });
      });
    });
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
    <article class="day-card" data-day="${d.day}" data-stage="${d.stage}">
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
        <div class="day-schedule">
          ${scheduleRow("sun", "Matin", d.morning)}
          ${scheduleRow("cloud-sun", "Après-midi", d.afternoon)}
          ${scheduleRow("moon", "Soir", d.evening)}
          ${scheduleRow("utensils", "Repas", d.meal)}
        </div>
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
      input.addEventListener("input", () => {
        const s = store.get("budgetSpent", {});
        s[input.dataset.key] = input.value === "" ? null : Number(input.value);
        store.set("budgetSpent", s);
        recomputeBudget();
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
    flightsEl.innerHTML = FLIGHTS.map(
      (f) => `
      <div class="flight-card ${f.recommended ? "recommended" : ""}">
        ${f.recommended ? `<span class="badge">${icon("star")}Recommandé</span>` : ""}
        <h4 class="card-title"><span class="icon-tile c1">${icon("plane")}</span>${f.airline}</h4>
        <p><strong>${f.airport}</strong> → escale <strong>${f.stopover}</strong> → ZNZ</p>
        <p>Durée totale : ${f.duration}</p>
        <p class="price">${f.price} <span>/pers A/R</span></p>
      </div>`
    ).join("");

    const accEl = document.getElementById("accommodations-list");
    accEl.innerHTML = ACCOMMODATIONS.map(
      (a) => `
      <div class="acc-card">
        <h4 class="card-title"><span class="icon-tile c2">${icon("building")}</span>${a.stage} <span class="acc-nights">— ${a.nights} nuits</span></h4>
        <p class="acc-type">${a.type}</p>
        <p class="acc-examples">Exemples : ${a.examples}</p>
        <p class="acc-price">${a.priceRange}</p>
        <label class="booking-ref-label">
          N° de réservation / notes
          <input type="text" class="booking-ref" data-stage="${a.stage}" placeholder="Ex : confirmation Booking.com #..." />
        </label>
      </div>`
    ).join("");

    accEl.querySelectorAll(".booking-ref").forEach((input) => {
      const key = "booking_" + input.dataset.stage;
      input.value = store.get(key, "");
      input.addEventListener("input", () => store.set(key, input.value));
    });
  }

  // ---------- Checklist ----------
  function initChecklist() {
    const container = document.getElementById("checklist-container");
    const checked = store.get("checklist", {});

    container.innerHTML = CHECKLIST.map((group, gi) => {
      const items = group.items
        .map((item, ii) => {
          const id = `chk-${gi}-${ii}`;
          const isChecked = !!checked[id];
          return `
          <li>
            <label class="checklist-item">
              <input type="checkbox" id="${id}" ${isChecked ? "checked" : ""} />
              <span>${item}</span>
            </label>
          </li>`;
        })
        .join("");
      const tileClass = "c" + ((gi % 3) + 1);
      return `
      <div class="checklist-group">
        <h3><span class="icon-tile ${tileClass}">${icon(group.icon || "check-circle")}</span>${group.group}<span class="group-progress" data-group="${gi}"></span></h3>
        <ul>${items}</ul>
      </div>`;
    }).join("");

    container.querySelectorAll('input[type="checkbox"]').forEach((box) => {
      box.addEventListener("change", () => {
        const c = store.get("checklist", {});
        c[box.id] = box.checked;
        store.set("checklist", c);
        updateChecklistProgress();
      });
    });

    updateChecklistProgress();
  }

  function updateChecklistProgress() {
    let totalAll = 0;
    let doneAll = 0;
    CHECKLIST.forEach((group, gi) => {
      const boxes = document.querySelectorAll(`#checklist-container .checklist-group:nth-child(${gi + 1}) input[type="checkbox"]`);
      let done = 0;
      boxes.forEach((b) => { if (b.checked) done++; });
      totalAll += boxes.length;
      doneAll += done;
      const label = document.querySelector(`.group-progress[data-group="${gi}"]`);
      if (label) label.textContent = `(${done}/${boxes.length})`;
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

  // ---------- Carte ----------
  function initMap() {
    const svg = document.getElementById("map-svg");
    if (!svg) return;
    const colors = { airport: "#1a1d1f", stage: "#ff5533", activity: "#0d9c86" };
    const markers = MAP_POINTS.map((p) => {
      const color = colors[p.type] || colors.activity;
      const r = p.type === "stage" ? 2.2 : 1.5;
      return `
        <g class="map-marker" tabindex="0">
          <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${color}" stroke="#fff" stroke-width="0.4"></circle>
          <title>${p.name}</title>
        </g>`;
    }).join("");
    svg.innerHTML += markers;

    const legend = document.getElementById("map-legend");
    if (legend) {
      legend.innerHTML = MAP_POINTS.map((p) => `<li><span class="dot ${p.type}"></span>${p.name}</li>`).join("");
    }
  }

  // ---------- Initialisation ----------
  document.addEventListener("DOMContentLoaded", () => {
    initTabs();
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

document.addEventListener("DOMContentLoaded", loadReport);

async function loadReport() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Report data failed to load.");
    }

    const data = await response.json();
    initReport(data);
  } catch (err) {
    showError(err);
  }
}

function initReport(data) {
  REPORT_DATA = data;

  document.getElementById("generatedAt").textContent =
    "Generated: " + data.generatedAt;

  fillFilter("yearFilter", data.filters.years, "All Years");
  fillFilter("sessionFilter", data.filters.sessions, "All Sessions");
  fillFilter("areaFilter", data.filters.areas, "All Areas");
  fillFilter("timeFilter", data.filters.times, "All Class Times");

  // Default to the newest year
  const yearFilter = document.getElementById("yearFilter");
  const years = [...data.filters.years]
    .map(Number)
    .sort((a, b) => b - a);

  if (years.length) {
    yearFilter.value = String(years[0]);
  }

  renderCurrentView();
}

function renderCurrentView() {
  if (!REPORT_DATA) return;

  const view = document.getElementById("viewSelect").value;
  const year = document.getElementById("yearFilter").value;
  const time = document.getElementById("timeFilter").value;

  updateSessionFilterState(view);

  const session = document.getElementById("sessionFilter").value;
  const area = document.getElementById("areaFilter").value;
  const search = document.getElementById("searchBox").value.toLowerCase().trim();

  let rows = [...REPORT_DATA[view]];

  if (SELECTED_BADGE) {
    rows = rows.filter(r => String(r.badgeName || "") === SELECTED_BADGE);
  }

  rows = rows.filter(r => {
    if (year && r.year !== year) return false;
    if (session && r.session !== session) return false;
    if (area && r.area !== area) return false;
    if (time && r.time !== time) return false;
    if (search && !String(r.badgeName || "").toLowerCase().includes(search)) return false;
    return true;
  });

  const combineOfferings = document.getElementById("combineOfferingsCheck").checked;

  if (combineOfferings) {
    rows = combineBadgeRows(rows);
  }

  sortRows(rows);

  CURRENT_ROWS = rows;

  renderCards(rows, view);
  renderTable(rows, VIEW_COLUMNS[view]);
}

function openBadgeView(badgeName) {
  SELECTED_BADGE = badgeName;

  // Turn off Combine Offerings
  document.getElementById("combineOfferingsCheck").checked = false;

  document.getElementById("generatedAt").textContent =
    "Generated: " + REPORT_DATA.generatedAt;

  document.getElementById("backToSummaryBtn").style.display = "";

  document.getElementById("combineOfferingsCheck").disabled = true;

  renderCurrentView();
}

function backToSummary() {
  SELECTED_BADGE = null;

  document.getElementById("generatedAt").textContent =
    "Generated: " + REPORT_DATA.generatedAt;

  document.getElementById("backToSummaryBtn").style.display = "none";

  document.getElementById("combineOfferingsCheck").disabled = false;

  renderCurrentView();
}

function resetDefaultSort() {
  SORT = { key: null, dir: "asc", mode: "default" };
  renderCurrentView();
}

function showError(err) {
  document.body.innerHTML = `
    <div style="font-family: Arial; padding: 30px;">
      <h2>Report failed to load</h2>
      <pre>${escapeHtml(err.message || err)}</pre>
    </div>
  `;
}

function resetFilters() {
  SELECTED_BADGE = null;

  document.getElementById("viewSelect").value = "summer";

  const newestYear = [...REPORT_DATA.filters.years]
    .map(Number)
    .sort((a, b) => b - a)[0];

  document.getElementById("yearFilter").value = String(newestYear || "");
  document.getElementById("sessionFilter").value = "";
  document.getElementById("areaFilter").value = "";
  document.getElementById("timeFilter").value = "";
  document.getElementById("searchBox").value = "";

  document.getElementById("combineOfferingsCheck").checked = false;
  document.getElementById("combineOfferingsCheck").disabled = false;

  document.getElementById("backToSummaryBtn").style.display = "none";
  document.getElementById("generatedAt").textContent =
    "Generated: " + REPORT_DATA.generatedAt;

  renderCurrentView();
}

function toggleDisplayMode() {
  const badgeMode =
    document.getElementById("combineOfferingsCheck").checked;

  document.getElementById("offeringLabel")
    .classList.toggle("active", !badgeMode);

  document.getElementById("badgeLabel")
    .classList.toggle("active", badgeMode);

  renderCurrentView();
}

function resetMetrics() {
  CARD_CHOICES = [
    "badgesTaken",
    "badgesEarned",
    "completionRate",
    "highestDemand"
  ];

  renderCards(
    CURRENT_ROWS,
    document.getElementById("viewSelect").value
  );
}
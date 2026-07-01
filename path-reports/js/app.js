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

  rows = rows.filter(r => {
    if (year && r.year !== year) return false;
    if (session && r.session !== session) return false;
    if (area && r.area !== area) return false;
    if (time && r.time !== time) return false;
    if (search && !String(r.badgeName || "").toLowerCase().includes(search)) return false;
    return true;
  });

  sortRows(rows);

  CURRENT_ROWS = rows;

  renderCards(rows, view);
  renderTable(rows, VIEW_COLUMNS[view]);
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

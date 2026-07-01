function renderTable(rows, columns) {
  const head = document.getElementById("tableHead");
  const body = document.getElementById("tableBody");

  head.innerHTML = `
    <tr>
      ${columns.map(([key, label]) => `
        <th
          class="${isNumericKey(key) ? "num" : ""}"
          title="${escapeHtml(COLUMN_DESCRIPTIONS[key] || "")}"
          onclick="sortBy('${key}')"
        >
          
          ${escapeHtml(getColumnLabel(key, label))}${SORT.key === key ? (SORT.dir === "asc" ? " ▲" : " ▼") : ""}
        </th>
      `).join("")}
    </tr>
  `;

  if (!rows.length) {
    body.innerHTML = `<tr><td class="empty" colspan="${columns.length}">No rows match the current filters.</td></tr>`;
    return;
  }

  body.innerHTML = rows.map(row => `
    <tr>
      ${columns.map(([key]) => {
    const value = formatCell(key, row[key]);
    const cls = isNumericKey(key) ? "num" : "";

    if (key === "badgeName" && !SELECTED_BADGE) {
      return `<td class="${cls}">
            <button class="linkButton" onclick="openBadgeView('${escapeJs(row[key])}')">
              ${escapeHtml(value)}
            </button>
          </td>`;
    }

    return `<td class="${cls}">${escapeHtml(value)}</td>`;
    return `<td class="${cls}">${escapeHtml(value)}</td>`;
  }).join("")}
    </tr>
  `).join("");
}

function getColumnLabel(key, label) {
  const combineOfferings = document.getElementById("combineOfferingsCheck")?.checked;

  if (combineOfferings && key === "time") {
    return "Class Time(s)";
  }

  return label;
}
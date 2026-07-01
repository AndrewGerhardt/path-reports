function renderTable(rows, columns) {
  const head = document.getElementById("tableHead");
  const body = document.getElementById("tableBody");

  head.innerHTML = `
    <tr>
      ${columns.map(([key, label]) => `
        <th class="${isNumericKey(key) ? "num" : ""}" onclick="sortBy('${key}')">
          ${escapeHtml(label)}${SORT.key === key ? (SORT.dir === "asc" ? " ▲" : " ▼") : ""}
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
        return `<td class="${cls}">${escapeHtml(value)}</td>`;
      }).join("")}
    </tr>
  `).join("");
}

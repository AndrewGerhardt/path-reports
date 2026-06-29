function downloadCsv() {
  const view = document.getElementById("viewSelect").value;
  const columns = VIEW_COLUMNS[view];

  const header = columns.map(c => csvEscape(c[1])).join(",");

  const lines = CURRENT_ROWS.map(row => {
    return columns.map(([key]) => csvEscape(formatCell(key, row[key]))).join(",");
  });

  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `offering-planning-${view}.csv`;
  a.click();

  URL.revokeObjectURL(url);
}

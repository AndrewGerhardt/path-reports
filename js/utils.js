function formatCell(key, value) {
  if (key.toLowerCase().includes("pct")) return formatPct(value);
  if (key === "averageDailyAttendance" || key === "avgWeeklyEnrollment") return formatDecimal(value);
  if (typeof value === "number") return formatNumber(value);
  return value || "";
}

function isNumericKey(key) {
  return [
    "enrollment",
    "attendanceMarks",
    "averageDailyAttendance",
    "retentionPct",
    "earned",
    "notEarned",
    "completionPct",
    "weeksOffered",
    "avgWeeklySharePct",
    "avgWeeklyEnrollment"
  ].includes(key);
}

function compareValues(a, b) {
  const an = Number(a);
  const bn = Number(b);

  if (!isNaN(an) && !isNaN(bn)) return an - bn;

  return String(a || "").localeCompare(String(b || ""), undefined, { numeric: true });
}

function sum(rows, key) {
  return rows.reduce((total, row) => total + Number(row[key] || 0), 0);
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString();
}

function formatDecimal(value) {
  return Number(value || 0).toFixed(1);
}

function formatPct(value) {
  return Number(value || 0).toFixed(1) + "%";
}

function csvEscape(value) {
  const str = String(value ?? "");
  return `"${str.replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

function escapeJs(value) {
  return String(value ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/'/g, "\\'")
    .replace(/"/g, "&quot;");
}

function combineBadgeRows(rows) {
  const map = new Map();

  for (const r of rows) {
    const key = [
      r.year || "",
      r.session || "",
      r.area || "",
      r.badgeName || ""
    ].join("|");

    if (!map.has(key)) {
      map.set(key, {
        ...r,
        time: new Set(),
        enrollment: 0,
        earned: 0,
        notEarned: 0,
        weeksOffered: 0,
        _retentionWeightedTotal: 0,
        _completionWeightedTotal: 0,
        _avgWeeklyEnrollmentTotal: 0,
        _rowCount: 0
      });
    }

    const out = map.get(key);

    if (r.time) out.time.add(r.time);

    const enrollment = Number(r.enrollment || 0);
    const earned = Number(r.earned || 0);
    const notEarned = Number(r.notEarned || 0);

    out.enrollment += enrollment;
    out.earned += earned;
    out.notEarned += notEarned;

    out.weeksOffered += Number(r.weeksOffered || 0);
    out._avgWeeklyEnrollmentTotal += Number(r.avgWeeklyEnrollment || 0);

    out._retentionWeightedTotal += Number(r.retentionPct || 0) * enrollment;
    out._completionWeightedTotal += Number(r.completionPct || 0) * enrollment;

    out._rowCount++;
  }

  return [...map.values()].map(r => {
    const enrollment = Number(r.enrollment || 0);

    return {
      ...r,
      time: sortTimes([...r.time]).join(", "),
      retentionPct: enrollment ? r._retentionWeightedTotal / enrollment : 0,
      completionPct: enrollment ? r._completionWeightedTotal / enrollment : 0,
      avgWeeklyEnrollment: r._rowCount ? r._avgWeeklyEnrollmentTotal / r._rowCount : 0
    };
  });
}

function sortTimes(times) {
  return times.sort((a, b) => compareTime(a, b));
}
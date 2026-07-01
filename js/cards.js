function renderCards(rows, view) {
  const cards = CARD_CHOICES.map(choice => buildCard(choice, rows, view));

  document.getElementById("summaryCards").innerHTML = cards.map((card, index) => `
    <div class="card">
      <select class="cardSelect" onchange="changeCardChoice(${index}, this.value)">
        ${Object.entries(CARD_OPTIONS)
          .filter(([key]) =>
            key === CARD_CHOICES[index] ||
            !CARD_CHOICES.includes(key)
          )
          .map(([key, label]) => `
            <option value="${key}" ${CARD_CHOICES[index] === key ? "selected" : ""}>
              ${escapeHtml(label)}
            </option>
          `).join("")}
      </select>
      <div class="value">${escapeHtml(card.value)}</div>
    </div>
  `).join("");
}

function changeCardChoice(index, value) {
  CARD_CHOICES[index] = value;
  renderCards(CURRENT_ROWS, document.getElementById("viewSelect").value);
}

function buildCard(choice, rows, view) {
  const totalEnrollment = sum(rows, "enrollment");
  const totalEarned = sum(rows, "earned");
  const avgCompletion = totalEnrollment ? (totalEarned / totalEnrollment) * 100 : 0;

  const excludedBadges = METRIC_EXCLUDE_BADGES[choice] || [];
  const metricRows = rows.filter(r =>
    !excludedBadges.includes(String(r.badgeName || ""))
  );

  const byEnrollmentDesc = [...metricRows]
    .sort((a, b) => Number(b.enrollment || 0) - Number(a.enrollment || 0));

  const byEnrollmentAsc = [...metricRows]
    .filter(r => Number(r.enrollment || 0) > 0)
    .sort((a, b) => Number(a.enrollment || 0) - Number(b.enrollment || 0));

  const byCompletionDesc = [...metricRows]
    .filter(r => Number(r.enrollment || 0) > 0)
    .sort((a, b) => Number(b.completionPct || 0) - Number(a.completionPct || 0));

  const byCompletionAsc = [...metricRows]
    .filter(r => Number(r.enrollment || 0) > 0)
    .sort((a, b) => Number(a.completionPct || 0) - Number(b.completionPct || 0));

  const byAttendanceDesc = [...metricRows]
    .filter(r => Number(r.enrollment || 0) > 0)
    .sort((a, b) => Number(b.retentionPct || 0) - Number(a.retentionPct || 0));

  const byAttendanceAsc = [...metricRows]
    .filter(r => Number(r.enrollment || 0) > 0)
    .sort((a, b) => Number(a.retentionPct || 0) - Number(b.retentionPct || 0));

  const enrollmentByTime = groupSum(metricRows, "time", "enrollment");
  const classCountByTime = groupCount(metricRows, "time");

  switch (choice) {
    case "badgesTaken":
      return { value: formatNumber(totalEnrollment) };

    case "badgesEarned":
      return { value: formatNumber(totalEarned) };

    case "completionRate":
      return { value: formatPct(avgCompletion) };

    case "highestDemand":
      return { value: formatBadgeMetric(byEnrollmentDesc[0], "enrollment") };

    case "lowestDemand":
      return { value: formatBadgeMetric(byEnrollmentAsc[0], "enrollment") };

    case "bestCompletion":
      return { value: formatBadgeMetric(byCompletionDesc[0], "completionPct", true) };

    case "worstCompletion":
      return { value: formatBadgeMetric(byCompletionAsc[0], "completionPct", true) };

    case "bestAttendance":
      return { value: formatBadgeMetric(byAttendanceDesc[0], "retentionPct", true) };

    case "worstAttendance":
      return { value: formatBadgeMetric(byAttendanceAsc[0], "retentionPct", true) };

    case "busiestTime":
      return { value: topGroup(enrollmentByTime, true) };

    case "lightestTime":
      return { value: topGroup(enrollmentByTime, false) };

    case "mostClassesTime":
      return { value: topGroup(classCountByTime, true) };

    case "fewestClassesTime":
      return { value: topGroup(classCountByTime, false) };

    case "averageEnrollment":
      return {
        value: metricRows.length
          ? formatDecimal(sum(metricRows, "enrollment") / metricRows.length)
          : "0.0"
      };

    case "totalOfferings":
      return { value: formatNumber(metricRows.length) };

    default:
      return { value: "" };
  }
}

function formatBadgeMetric(row, key, isPercent = false) {
  if (!row) return "";

  const value = isPercent
    ? formatPct(row[key])
    : formatNumber(row[key]);

  const combine =
    document.getElementById("combineOfferingsCheck")?.checked;

  if (!combine && row.time) {
    return `${row.badgeName} | ${row.time} (${value})`;
  }

  return `${row.badgeName} (${value})`;
}

function groupSum(rows, groupKey, sumKey) {
  const map = new Map();

  rows.forEach(r => {
    const keys = splitGroupKeys(r[groupKey]);

    keys.forEach(key => {
      map.set(key, (map.get(key) || 0) + Number(r[sumKey] || 0));
    });
  });

  return map;
}

function groupCount(rows, groupKey) {
  const map = new Map();

  rows.forEach(r => {
    const keys = splitGroupKeys(r[groupKey]);

    keys.forEach(key => {
      map.set(key, (map.get(key) || 0) + 1);
    });
  });

  return map;
}

function splitGroupKeys(value) {
  return String(value || "None")
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);
}

function topGroup(map, highest = true) {
  const entries = [...map.entries()].filter(([key]) => key && key !== "None");

  if (!entries.length) return "";

  entries.sort((a, b) => highest ? b[1] - a[1] : a[1] - b[1]);

  return `${entries[0][0]} (${formatNumber(entries[0][1])})`;
}
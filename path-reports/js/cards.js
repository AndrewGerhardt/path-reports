function renderCards(rows, view) {
  const totalEnrollment = sum(rows, "enrollment");
  const totalEarned = sum(rows, "earned");
  const avgCompletion = totalEnrollment ? (totalEarned / totalEnrollment) * 100 : 0;

  let top = [...rows].sort((a, b) => Number(b.enrollment || 0) - Number(a.enrollment || 0))[0];

  const cards = [
    ["Badges Taken", formatNumber(totalEnrollment)],
    ["Badges Earned", formatNumber(totalEarned)],
    ["Completion Rate", formatPct(avgCompletion)],
    ["Highest Demand", top ? `${top.badgeName} (${top.enrollment})` : ""]
  ];

  if (view === "normalized") {
    const normTop = [...rows].sort((a, b) =>
      Number(b.avgWeeklyEnrollment || 0) - Number(a.avgWeeklyEnrollment || 0)
    )[0];

    cards[3] = [
      "Highest Avg Demand",
      normTop ? `${normTop.badgeName} (${formatDecimal(normTop.avgWeeklyEnrollment)})` : ""
    ];
  }

  document.getElementById("summaryCards").innerHTML = cards.map(c => `
    <div class="card">
      <div class="label">${escapeHtml(c[0])}</div>
      <div class="value">${escapeHtml(c[1])}</div>
    </div>
  `).join("");
}

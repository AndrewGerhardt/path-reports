function sortRows(rows) {
  rows.sort((a, b) => {
    if (SORT.mode === "default") return defaultCompare(a, b);

    if (SORT.key === "time") {
      return timeHeaderCompare(a, b) * (SORT.dir === "asc" ? 1 : -1);
    }

    return compareValues(a[SORT.key], b[SORT.key]) * (SORT.dir === "asc" ? 1 : -1);
  });
}

function defaultCompare(a, b) {
  return compareValues(a.area, b.area)
    || compareValues(a.badgeName, b.badgeName)
    || compareTime(a.time, b.time);
}

function timeHeaderCompare(a, b) {
  return compareTime(a.time, b.time)
    || compareValues(a.area, b.area)
    || compareValues(a.badgeName, b.badgeName);
}

function compareTime(a, b) {
  const av = TIME_ORDER[String(a || "").trim()] || 999;
  const bv = TIME_ORDER[String(b || "").trim()] || 999;

  if (av !== bv) return av - bv;

  return compareValues(a, b);
}

function sortBy(key) {
  if (SORT.mode !== "header" || SORT.key !== key) {
    SORT = { key, dir: "asc", mode: "header" };
  } else {
    SORT.dir = SORT.dir === "asc" ? "desc" : "asc";
  }

  renderCurrentView();
}

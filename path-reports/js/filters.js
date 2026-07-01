function fillFilter(id, values, allLabel) {
  const select = document.getElementById(id);
  select.innerHTML = "";

  const all = document.createElement("option");
  all.value = "";
  all.textContent = allLabel;
  select.appendChild(all);

  values.forEach(value => {
    const opt = document.createElement("option");
    opt.value = value;
    opt.textContent = value;
    select.appendChild(opt);
  });
}

function updateSessionFilterState(view) {
  const sessionFilter = document.getElementById("sessionFilter");
  const sessionLabel = document.getElementById("sessionFilterLabel");

  const sessionEnabled = view === "weekly";

  sessionFilter.disabled = !sessionEnabled;
  sessionFilter.tabIndex = sessionEnabled ? 0 : -1;

  sessionLabel.classList.toggle("disabledFilter", !sessionEnabled);
  sessionLabel.title = sessionEnabled
    ? ""
    : "Session filtering is only available in the By Week view. Whole Summer already combines all sessions.";

  if (!sessionEnabled) {
    sessionFilter.value = "";
  }
}

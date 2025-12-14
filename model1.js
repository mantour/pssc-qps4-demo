// model1.js (non-module) - full original UI + logic
(() => {
  const RF_KEYS = [
    "Malignancy",
    "Transplantation",
    "Immunocompromise",
    "Asplenia/splenectomy",
    "Bedridden",
    "Central/implanted catheters",
    "Long-term ventilator use"
  ];

  const AS_KEYS = [
    "Fever or hypothermia",
    "Hypotension",
    "Tachycardia",
    "Tachypnea",
    "Abnormal capillary refill",
    "Altered mental status",
    "Abnormal pulse quality",
    "Skin findings"
  ];

  let state = {}; // editable UI state for Model 1

  const rfItem = k => state?.risk_factors?.items?.[k] || {};
  const asItem = k => state?.alert_signs?.items?.[k] || {};

  const riskFactorPresent = () => RF_KEYS.some(k => rfItem(k).present === true);
  const alertCount = () => AS_KEYS.filter(k => asItem(k).present === true).length;

  function computeSepsisRisk() {
    const triggers = [];
    if (asItem("Hypotension").present === true) triggers.push("hypotension");
    if (riskFactorPresent() && alertCount() >= 2) triggers.push(">=2 alert with risk factor");
    if (alertCount() >= 3) triggers.push(">=3 alert");
    return { risk: triggers.length ? "High risk" : "Lower risk", triggers };
  }

  function renderRiskFactors($) {
    const box = $("riskFactors");
    box.innerHTML = "";

    const table = document.createElement("table");
    table.innerHTML =
      "<tr><th>present</th><th>item</th><th>value</th><th>time</th><th>description</th></tr>";

    RF_KEYS.forEach(k => {
      const it = rfItem(k);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${k}</td>
        <td><input></td>
        <td><input></td>
        <td><input></td>
      `;

      const [cb, v, t, d] = tr.querySelectorAll("input");

      cb.checked = it.present === true;
      v.value = it.value ?? "";
      t.value = it.recorded_at ?? "";
      d.value = it.description ?? "";

      cb.onchange = e => { it.present = e.target.checked; renderDerived($); };
      v.oninput = e => { it.value = e.target.value.trim() === "" ? null : e.target.value; };
      t.oninput = e => { it.recorded_at = e.target.value.trim() === "" ? null : e.target.value; };
      d.oninput = e => { it.description = e.target.value; };

      table.appendChild(tr);
    });

    box.appendChild(table);
  }

  function renderAlertSigns($) {
    const box = $("alertSigns");
    box.innerHTML = "";

    const table = document.createElement("table");
    table.innerHTML =
      "<tr><th>present</th><th>item</th><th>value</th><th>time</th><th>criteria</th></tr>";

    AS_KEYS.forEach(k => {
      const it = asItem(k);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${k}</td>
        <td><input></td>
        <td><input></td>
        <td><input></td>
      `;

      const [cb, v, t, c] = tr.querySelectorAll("input");

      cb.checked = it.present === true;
      v.value = it.value ?? "";
      t.value = it.recorded_at ?? "";
      c.value = it.threshold ?? it.description ?? "";

      cb.onchange = e => { it.present = e.target.checked; renderDerived($); };
      v.oninput = e => { it.value = e.target.value.trim() === "" ? null : e.target.value; };
      t.oninput = e => { it.recorded_at = e.target.value.trim() === "" ? null : e.target.value; };
      c.oninput = e => { it.threshold = e.target.value; };

      table.appendChild(tr);
    });

    box.appendChild(table);
  }

  function renderDerived($) {
    $("rfDerived").textContent = riskFactorPresent() ? "Yes" : "No";
    $("asDerivedCount").textContent = String(alertCount());

    const { risk, triggers } = computeSepsisRisk();
    $("sepsisRisk").textContent = risk;

    const ul = $("sepsisTriggers");
    ul.innerHTML = "";
    $("triggerBlock").style.display = (risk === "High risk") ? "" : "none";

    triggers.forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      ul.appendChild(li);
    });
  }

  function renderAll($) {
    renderRiskFactors($);
    renderAlertSigns($);
    renderDerived($);
  }

  function buildSummaryText() {
    const L = [];
    L.push("[Model 1: PSSC trigger tool]");

    L.push("RiskFactor:");
    RF_KEYS.forEach(k => {
      const it = rfItem(k);
      if (it.present !== true) {
        L.push(`${k}: No`);
        return;
      }
      const parts = [];
      if (it.value != null && String(it.value).trim() !== "") parts.push(String(it.value).trim());
      if (it.recorded_at != null && String(it.recorded_at).trim() !== "") parts.push(String(it.recorded_at).trim());
      if (it.description != null && String(it.description).trim() !== "") parts.push(String(it.description).trim());
      L.push(`${k}: Yes${parts.length ? ", " + parts.join(", ") : ""}`);
    });

    L.push("");
    L.push("AlertSign:");
    AS_KEYS.forEach(k => {
      const it = asItem(k);
      const yesNo = (it.present === true) ? "Yes" : "No";

      const actual = (it.value != null && String(it.value).trim() !== "") ? String(it.value).trim() : "";
      const time = (it.recorded_at != null && String(it.recorded_at).trim() !== "") ? String(it.recorded_at).trim() : "";
      const crit = (it.threshold ?? it.description ?? "").toString().trim();

      let line = `${k}: ${yesNo}`;
      if (actual) {
        line += `, ${actual}`;
        if (time) line += ` at ${time}`;
      }
      if (crit) line += ` [criteria: ${crit}]`;

      L.push(line);
    });

    L.push("");
    L.push("SepsisRisk:");
    const { risk, triggers } = computeSepsisRisk();
    if (risk === "High risk") L.push(`High risk, ${triggers.join(", ")}`);
    else L.push("Lower risk");

    return L.join("\n");
  }

  window.Model1 = {
    setState: (obj) => { state = (obj && typeof obj === "object") ? obj : {}; },
    renderAll,
    buildSummaryText
  };
})();

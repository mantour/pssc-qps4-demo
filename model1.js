(() => {
  const RF_KEYS = [
    "Malignancy","Transplantation","Immunocompromise",
    "Asplenia/splenectomy","Bedridden",
    "Central/implanted catheters","Long-term ventilator use"
  ];

  const AS_KEYS = [
    "Fever or hypothermia","Hypotension","Tachycardia","Tachypnea",
    "Abnormal capillary refill","Altered mental status",
    "Abnormal pulse quality","Skin findings"
  ];

  let state = {};

  const rfItem = k => state?.risk_factors?.items?.[k] || {};
  const asItem = k => state?.alert_signs?.items?.[k] || {};

  const riskFactorPresent = () => RF_KEYS.some(k => rfItem(k).present);
  const alertCount = () => AS_KEYS.filter(k => asItem(k).present).length;

  function computeRisk() {
    const t = [];
    if (asItem("Hypotension").present) t.push("hypotension");
    if (riskFactorPresent() && alertCount() >= 2) t.push(">=2 alert + RF");
    if (alertCount() >= 3) t.push(">=3 alert");
    return { risk: t.length ? "High risk" : "Lower risk", triggers: t };
  }

  function renderAll($) {
    // Risk factors
    const rf = $("riskFactors"); rf.innerHTML = "";
    const rft = document.createElement("table");
    rft.innerHTML = "<tr><th>present</th><th>item</th></tr>";
    RF_KEYS.forEach(k => {
      const it = rfItem(k);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><input type="checkbox"></td><td>${k}</td>`;
      const cb = tr.querySelector("input");
      cb.checked = it.present === true;
      cb.onchange = e => { it.present = e.target.checked; renderDerived($); };
      rft.appendChild(tr);
    });
    rf.appendChild(rft);

    // Alert signs
    const as = $("alertSigns"); as.innerHTML = "";
    const ast = document.createElement("table");
    ast.innerHTML = "<tr><th>present</th><th>item</th></tr>";
    AS_KEYS.forEach(k => {
      const it = asItem(k);
      const tr = document.createElement("tr");
      tr.innerHTML = `<td><input type="checkbox"></td><td>${k}</td>`;
      const cb = tr.querySelector("input");
      cb.checked = it.present === true;
      cb.onchange = e => { it.present = e.target.checked; renderDerived($); };
      ast.appendChild(tr);
    });
    as.appendChild(ast);

    renderDerived($);
  }

  function renderDerived($) {
    $("rfDerived").textContent = riskFactorPresent() ? "Yes" : "No";
    $("asDerivedCount").textContent = alertCount();
    const { risk, triggers } = computeRisk();
    $("sepsisRisk").textContent = risk;
    $("sepsisTriggers").innerHTML = triggers.map(t => `<li>${t}</li>`).join("");
  }

  function buildSummaryText() {
    const { risk, triggers } = computeRisk();
    return [
      "[Model 1: PSSC trigger tool]",
      `Risk: ${risk}`,
      triggers.length ? `Triggers: ${triggers.join(", ")}` : ""
    ].join("\n");
  }

  window.Model1 = {
    setState: obj => { state = obj || {}; },
    renderAll,
    buildSummaryText
  };
})();

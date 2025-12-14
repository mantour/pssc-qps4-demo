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
    if (riskFactorPresent() && alertCount() >= 2) t.push(">=2 alert with risk factor");
    if (alertCount() >= 3) t.push(">=3 alert");
    return { risk: t.length ? "High risk" : "Lower risk", triggers: t };
  }

  function renderAll($) {
    const rfBody = $("riskFactorsBody");
    rfBody.innerHTML = "";
    RF_KEYS.forEach(k => {
      const it = rfItem(k);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${k}</td>
        <td><input></td>
        <td><input></td>
        <td><input></td>`;
      const [cb,v,t,d] = tr.querySelectorAll("input");
      cb.checked = it.present === true;
      cb.onchange = e => { it.present = e.target.checked; renderDerived($); };
      v.value = it.value ?? ""; t.value = it.recorded_at ?? ""; d.value = it.description ?? "";
      v.oninput = e => it.value = e.target.value || null;
      t.oninput = e => it.recorded_at = e.target.value || null;
      d.oninput = e => it.description = e.target.value || null;
      rfBody.appendChild(tr);
    });

    const asBody = $("alertSignsBody");
    asBody.innerHTML = "";
    AS_KEYS.forEach(k => {
      const it = asItem(k);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><input type="checkbox"></td>
        <td>${k}</td>
        <td><input></td>
        <td><input></td>
        <td><input></td>`;
      const [cb,v,t,c] = tr.querySelectorAll("input");
      cb.checked = it.present === true;
      cb.onchange = e => { it.present = e.target.checked; renderDerived($); };
      v.value = it.value ?? ""; t.value = it.recorded_at ?? ""; c.value = it.threshold ?? "";
      v.oninput = e => it.value = e.target.value || null;
      t.oninput = e => it.recorded_at = e.target.value || null;
      c.oninput = e => it.threshold = e.target.value || null;
      asBody.appendChild(tr);
    });

    renderDerived($);
  }

  function renderDerived($) {
    $("rfDerived").textContent = riskFactorPresent() ? "Yes" : "No";
    $("asDerivedCount").textContent = alertCount();
    const { risk, triggers } = computeRisk();
    $("sepsisRisk").textContent = risk;
    $("sepsisTriggers").innerHTML = triggers.map(t=>`<li>${t}</li>`).join("");
    $("triggerBlock").style.display = risk==="High risk" ? "" : "none";
  }

  function buildSummaryText() {
    const { risk, triggers } = computeRisk();
    return `[Model 1: PSSC trigger tool]\nSepsisRisk:\n${risk}${triggers.length? ", "+triggers.join(", "):""}`;
  }

  window.Model1 = {
    setState: o => state = o || {},
    renderAll,
    buildSummaryText
  };
})();

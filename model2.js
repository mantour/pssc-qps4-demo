(() => {
  let state = null;

  function render($) {
    const body = $("qps4TableBody");
    body.innerHTML = "";
    if (!state) return;

    const c = state.qPS4_components || {};
    const tamsiFormula = "(HR - 10 × (Temp - 37)) / MAP";

    function row(name, point, value, criteria, tip) {
      const tr = document.createElement("tr");
      if (point === 1) tr.style.background = "#ffeaea";
      tr.innerHTML = `
        <td>${name}</td>
        <td>${point ?? ""}</td>
        <td ${tip?`title="${tip}"`:""}>${value ?? ""}</td>
        <td>${criteria ?? ""}</td>`;
      body.appendChild(tr);
    }

    if (c.altered_mentation)
      row("Altered mentation", c.altered_mentation.point,
          c.altered_mentation.GCS? "GCS "+c.altered_mentation.GCS:"","GCS < 15");

    if (c.respiratory_rate)
      row("Respiratory rate", c.respiratory_rate.point,
          c.respiratory_rate.RR? "RR "+c.respiratory_rate.RR:"", c.respiratory_rate.Criteria);

    if (c.TAMSI_threshold) {
      const t=c.TAMSI_threshold;
      row("TAMSI", t.point,
        `T=${t.temperature}, HR=${t.HR}, MAP=${t.MAP}, TAMSI=${Number(t.TAMSI).toFixed(2)}`,
        t.threshold, tamsiFormula);
    }

    if (c.capillary_refill)
      row("Capillary refill", c.capillary_refill.point,
          c.capillary_refill.capillary_refill,"≥ 3 sec");

    $("qps4Total").textContent = state.qPS4_total ?? "";
    $("qps4Risk").textContent = state.septic_shock_risk ?? "";
  }

  function buildSummaryText() {
    if (!state) return "";
    return `[Model 2: qPS4]\nTotal qPS4 score: ${state.qPS4_total ?? ""}`;
  }

  window.Model2 = {
    setState: o => state = o || null,
    render,
    buildSummaryText
  };
})();

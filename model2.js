// model2.js (non-module) - fixed rows, full original UI behavior
(() => {
  let qps4State = null;

  function render() {
    const rows = document.querySelectorAll("tr[data-q]");
    rows.forEach(tr => {
      tr.style.background = "";
      tr.querySelector(".q-point").textContent = "";
      tr.querySelector(".q-value").textContent = "";
      tr.querySelector(".q-value").removeAttribute("title");
      // criteria cell stays as HTML default unless overwritten below
    });

    if (!qps4State || typeof qps4State !== "object") {
      document.getElementById("qps4Total").textContent = "";
      document.getElementById("qps4Risk").textContent = "";
      return;
    }

    const c = qps4State.qPS4_components || {};
    const tamsiFormula = "(HR - 10 × (Temp - 37)) / MAP";

    function setRow(key, point, value, criteria, tooltip) {
      const tr = document.querySelector(`tr[data-q="${key}"]`);
      if (!tr) return;

      tr.querySelector(".q-point").textContent = (point ?? "");
      const vtd = tr.querySelector(".q-value");
      vtd.textContent = (value ?? "");
      if (tooltip) vtd.setAttribute("title", tooltip);
      if (criteria != null) tr.querySelector(".q-crit").textContent = criteria;

      if (point === 1) tr.style.background = "#ffeaea";
    }

    if (c.altered_mentation) {
      const gcs = c.altered_mentation.GCS ? ("GCS " + c.altered_mentation.GCS) : "";
      setRow("altered_mentation", c.altered_mentation.point, gcs, "GCS < 15", "");
    }

    if (c.respiratory_rate) {
      const rr = (c.respiratory_rate.RR != null) ? ("RR " + c.respiratory_rate.RR) : "";
      setRow("respiratory_rate", c.respiratory_rate.point, rr, c.respiratory_rate.Criteria || "", "");
    }

    if (c.TAMSI_threshold) {
      const t = c.TAMSI_threshold;
      const tamsi = (t.TAMSI != null) ? Number(t.TAMSI).toFixed(2) : "";
      const value = `T=${t.temperature}, HR=${t.HR}, MAP=${t.MAP}, TAMSI=${tamsi}`;
      setRow("TAMSI_threshold", t.point, value, t.threshold || "", tamsiFormula);
    }

    if (c.capillary_refill) {
      setRow("capillary_refill", c.capillary_refill.point, c.capillary_refill.capillary_refill || "", "≥ 3 sec", "");
    }

    document.getElementById("qps4Total").textContent = (qps4State.qPS4_total ?? "");
    document.getElementById("qps4Risk").textContent = (qps4State.septic_shock_risk ?? "");
  }

  function buildSummaryText() {
    if (!qps4State || typeof qps4State !== "object") return "";
    const L = [];
    L.push("[Model 2: qPS4]");

    const c = qps4State.qPS4_components || {};

    if (c.altered_mentation) {
      const g = c.altered_mentation.GCS ? (", GCS " + c.altered_mentation.GCS) : "";
      L.push(`Altered mentation: point ${c.altered_mentation.point ?? ""}${g}`);
    }

    if (c.respiratory_rate) {
      const crit = c.respiratory_rate.Criteria ? ` [criteria: ${c.respiratory_rate.Criteria}]` : "";
      L.push(`Respiratory rate: point ${c.respiratory_rate.point ?? ""}, RR ${c.respiratory_rate.RR ?? ""}${crit}`);
    }

    if (c.TAMSI_threshold) {
      const t = c.TAMSI_threshold;
      const tamsi = (t.TAMSI != null) ? Number(t.TAMSI).toFixed(2) : "";
      const crit = t.threshold ? ` [criteria: ${t.threshold}]` : "";
      L.push(`TAMSI: point ${t.point ?? ""}, TAMSI ${tamsi}${crit}`);
    }

    if (c.capillary_refill) {
      L.push(`Capillary refill: point ${c.capillary_refill.point ?? ""}, ${c.capillary_refill.capillary_refill ?? ""}`);
    }

    if (qps4State.qPS4_total != null) L.push(`Total qPS4 score: ${qps4State.qPS4_total}`);
    if (qps4State.septic_shock_risk != null) L.push(`Septic shock risk: ${qps4State.septic_shock_risk}`);

    return L.join("\n");
  }

  window.Model2 = {
    setState: (obj) => { qps4State = (obj && typeof obj === "object") ? obj : null; },
    render,
    buildSummaryText
  };
})();

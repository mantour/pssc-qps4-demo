// model2.js (non-module) - full original UI + logic
(() => {
  let qps4State = null;

  function render($) {
    const box = $("qps4Result");
    box.innerHTML = "";
    if (!qps4State || typeof qps4State !== "object") return;

    const c = qps4State.qPS4_components || {};
    const table = document.createElement("table");
    table.innerHTML = "<tr><th>Component</th><th>Point</th><th>Value</th><th>Criteria</th></tr>";

    const tamsiFormula = "(HR - 10 × (Temp - 37)) / MAP";

    function addRow(name, point, value, criteria, tooltip) {
      const tr = document.createElement("tr");
      if (point === 1) tr.style.background = "#ffeaea";
      tr.innerHTML = `
        <td>${name}</td>
        <td>${point ?? ""}</td>
        <td${tooltip ? ` title="${tooltip}"` : ""}>${value ?? ""}</td>
        <td>${criteria ?? ""}</td>
      `;
      table.appendChild(tr);
    }

    if (c.altered_mentation) {
      addRow(
        "Altered mentation",
        c.altered_mentation.point,
        c.altered_mentation.GCS ? ("GCS " + c.altered_mentation.GCS) : "",
        "GCS < 15",
        ""
      );
    }

    if (c.respiratory_rate) {
      addRow(
        "Respiratory rate",
        c.respiratory_rate.point,
        (c.respiratory_rate.RR != null) ? ("RR " + c.respiratory_rate.RR) : "",
        c.respiratory_rate.Criteria || "",
        ""
      );
    }

    if (c.TAMSI_threshold) {
      const t = c.TAMSI_threshold;
      const tamsi = (t.TAMSI != null) ? Number(t.TAMSI).toFixed(2) : "";
      const value = `T=${t.temperature}, HR=${t.HR}, MAP=${t.MAP}, TAMSI=${tamsi}`;
      addRow(
        "TAMSI",
        t.point,
        value,
        t.threshold || "",
        tamsiFormula
      );
    }

    if (c.capillary_refill) {
      addRow(
        "Capillary refill",
        c.capillary_refill.point,
        c.capillary_refill.capillary_refill || "",
        "≥ 3 sec",
        ""
      );
    }

    box.appendChild(table);

    const total = (qps4State.qPS4_total != null) ? qps4State.qPS4_total : "";
    const risk = (qps4State.septic_shock_risk != null) ? qps4State.septic_shock_risk : "";
    box.innerHTML += `
      <div style="margin-top:8px;">
        <div><b>Total qPS4</b>: ${total}</div>
        <div><b>Septic shock risk</b>: ${risk}</div>
      </div>
    `;
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

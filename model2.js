// model2.js
let state = null;

export function setModel2State(obj) {
  state = obj || null;
}

export function renderModel2($) {
  if (!state) return;

  $("qps4Result").innerHTML = `
    <div>Total qPS4: ${state.qPS4_total ?? ""}</div>
    <div>Septic shock risk: ${state.septic_shock_risk ?? ""}</div>
  `;
}

export function buildModel2SummaryText() {
  if (!state) return "";
  return `[Model 2: qPS4]\nTotal score: ${state.qPS4_total}`;
}

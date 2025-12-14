// model1.js
export const RF_KEYS = ["Malignancy", "Immunocompromise"];
export const AS_KEYS = ["Hypotension", "Altered mental status"];

let state = {};

export function setModel1State(obj) {
  state = obj || {};
}

export function renderModel1($) {
  $("riskFactors").innerHTML =
    "<b>Risk factors:</b> " +
    RF_KEYS.map(k => `${k}: ${state?.risk_factors?.items?.[k]?.present ? "Yes" : "No"}`).join(", ");

  $("alertSigns").innerHTML =
    "<b>Alert signs:</b> " +
    AS_KEYS.map(k => `${k}: ${state?.alert_signs?.items?.[k]?.present ? "Yes" : "No"}`).join(", ");

  const high = AS_KEYS.some(k => state?.alert_signs?.items?.[k]?.present);
  $("sepsisRisk").textContent = high ? "High risk" : "Lower risk";
  $("sepsisTriggers").innerHTML = high ? "<li>alert sign present</li>" : "";
}

export function buildModel1SummaryText() {
  return "[Model 1: PSSC trigger tool]\n(see UI)";
}

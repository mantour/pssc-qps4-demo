(() => {
  let state=null;

  function render() {
    if (!state) return;
    const c = state.qPS4_components || {};
    const formula="(HR - 10 × (Temp - 37)) / MAP";

    document.querySelectorAll("tr[data-q]").forEach(r=>{
      const k=r.dataset.q, d=c[k]||{};
      const tds=r.querySelectorAll("td");
      tds[1].textContent=d.point??"";
      if (k==="TAMSI_threshold") {
        tds[2].textContent =
          d.TAMSI!=null?`T=${d.temperature}, HR=${d.HR}, MAP=${d.MAP}, TAMSI=${Number(d.TAMSI).toFixed(2)}`:"";
        tds[2].title=formula;
        tds[3].textContent=d.threshold??"";
      } else {
        tds[2].textContent=d.RR||d.GCS||d.capillary_refill||"";
        tds[3].textContent=d.Criteria??tds[3].textContent;
      }
      r.style.background=d.point===1?"#ffeaea":"";
    });

    document.getElementById("qps4Total").textContent=state.qPS4_total??"";
    document.getElementById("qps4Risk").textContent=state.septic_shock_risk??"";
  }

  function buildSummaryText(){
    return state?`[Model 2: qPS4]\nTotal qPS4 score: ${state.qPS4_total??""}`:"";
  }

  window.Model2={ setState:o=>state=o||null, render, buildSummaryText };
})();

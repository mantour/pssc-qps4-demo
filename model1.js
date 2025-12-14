(() => {
  let state = {};
  const rfRows = () => document.querySelectorAll("tr[data-rf]");
  const asRows = () => document.querySelectorAll("tr[data-as]");

  const rfItem = k => state?.risk_factors?.items?.[k] || {};
  const asItem = k => state?.alert_signs?.items?.[k] || {};

  function renderDerived() {
    const rfPresent = [...rfRows()].some(r => rfItem(r.dataset.rf).present);
    const asCount = [...asRows()].filter(r => asItem(r.dataset.as).present).length;

    document.getElementById("rfDerived").textContent = rfPresent ? "Yes" : "No";
    document.getElementById("asDerivedCount").textContent = asCount;

    const triggers = [];
    if (asItem("Hypotension").present) triggers.push("hypotension");
    if (rfPresent && asCount >= 2) triggers.push(">=2 alert with risk factor");
    if (asCount >= 3) triggers.push(">=3 alert");

    document.getElementById("sepsisRisk").textContent =
      triggers.length ? "High risk" : "Lower risk";

    document.getElementById("sepsisTriggers").innerHTML =
      triggers.map(t => `<li>${t}</li>`).join("");
  }

  function renderAll() {
    rfRows().forEach(r => {
      const it = rfItem(r.dataset.rf);
      const [cb,v,t,d] = r.querySelectorAll("input");
      cb.checked = it.present === true;
      v.value = it.value ?? ""; t.value = it.recorded_at ?? ""; d.value = it.description ?? "";
      cb.onchange = e => { it.present = e.target.checked; renderDerived(); };
      v.oninput = e => it.value = e.target.value || null;
      t.oninput = e => it.recorded_at = e.target.value || null;
      d.oninput = e => it.description = e.target.value || null;
    });

    asRows().forEach(r => {
      const it = asItem(r.dataset.as);
      const [cb,v,t,c] = r.querySelectorAll("input");
      cb.checked = it.present === true;
      v.value = it.value ?? ""; t.value = it.recorded_at ?? ""; c.value = it.threshold ?? "";
      cb.onchange = e => { it.present = e.target.checked; renderDerived(); };
      v.oninput = e => it.value = e.target.value || null;
      t.oninput = e => it.recorded_at = e.target.value || null;
      c.oninput = e => it.threshold = e.target.value || null;
    });

    renderDerived();
  }

  function buildSummaryText() {
    return "[Model 1: PSSC trigger tool]";
  }

  window.Model1 = {
    setState:o=>state=o||{},
    renderAll,
    buildSummaryText
  };
})();

(() => {
  let state = null;

  function render($) {
    const box = $("qps4Result");
    box.innerHTML = "";
    if (!state) return;

    const c = state.qPS4_components || {};
    const t = document.createElement("table");
    t.innerHTML = "<tr><th>Item</th><th>Point</th></tr>";

    Object.keys(c).forEach(k => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${k}</td><td>${c[k].point ?? ""}</td>`;
      t.appendChild(tr);
    });

    box.appendChild(t);
    box.innerHTML += `<div>Total: ${state.qPS4_total ?? ""}</div>`;
  }

  function buildSummaryText() {
    if (!state) return "";
    return [
      "[Model 2: qPS4]",
      `Total score: ${state.qPS4_total ?? ""}`
    ].join("\n");
  }

  window.Model2 = {
    setState: obj => { state = obj || null; },
    render,
    buildSummaryText
  };
})();

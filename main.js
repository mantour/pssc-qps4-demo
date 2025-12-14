// main.js (non-module) - dropdown auto load+render, no auto-load on page open
(() => {
  const $ = id => document.getElementById(id);

  async function loadSample(path) {
    const r = await fetch(path);
    return await r.text();
  }

  // ===== Model 1: Render from textarea =====
  $("renderBtn").onclick = () => {
    $("summary").value = "";
    try {
      const txt = $("jsonInput").value || "{}";
      Model1.setState(JSON.parse(txt));
      Model1.renderAll($);
      $("jsonError").textContent = "";
    } catch (e) {
      $("jsonError").textContent = "JSON parse error: " + e.message;
    }
  };

  // ===== Model 1: Dropdown change -> load + render =====
  $("sampleSelect1").onchange = () => {
    const path = $("sampleSelect1").value;
    if (!path) return;

    $("summary").value = "";
    $("sampleError1").textContent = "";

    loadSample(path)
      .then(txt => {
        $("jsonInput").value = txt;
        Model1.setState(JSON.parse(txt || "{}"));
        Model1.renderAll($);
        $("jsonError").textContent = "";
      })
      .catch(e => {
        $("sampleError1").textContent = String(e);
      });
  };

  // ===== Model 2: Render from textarea =====
  $("renderQps4Btn").onclick = () => {
    $("summary").value = "";
    try {
      const txt = $("qps4Input").value || "{}";
      Model2.setState(JSON.parse(txt));
      Model2.render($);
      $("qps4Error").textContent = "";
    } catch (e) {
      $("qps4Error").textContent = "JSON parse error: " + e.message;
    }
  };

  // ===== Model 2: Dropdown change -> load + render =====
  $("sampleSelect2").onchange = () => {
    const path = $("sampleSelect2").value;
    if (!path) return;

    $("summary").value = "";
    $("sampleError2").textContent = "";

    loadSample(path)
      .then(txt => {
        $("qps4Input").value = txt;
        Model2.setState(JSON.parse(txt || "{}"));
        Model2.render($);
        $("qps4Error").textContent = "";
      })
      .catch(e => {
        $("sampleError2").textContent = String(e);
      });
  };

  // ===== Summary =====
  $("fillBtn").onclick = () => {
    let text = Model1.buildSummaryText();
    const m2 = Model2.buildSummaryText();
    if (m2) text += "\n\n" + m2;
    $("summary").value = text;
  };

  $("clearSummaryBtn").onclick = () => {
    $("summary").value = "";
  };

  // ===== init: render empty UIs (no auto sample load) =====
  Model1.setState({});
  Model1.renderAll($);
  Model2.setState(null);
  Model2.render($);
})();

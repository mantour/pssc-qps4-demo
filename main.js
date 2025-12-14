// main.js (non-module)
(() => {
  const $ = id => document.getElementById(id);

  async function loadSample(path) {
    const r = await fetch(path);
    return await r.text();
  }

  // ===== Render buttons =====
  $("renderBtn").onclick = () => {
    $("summary").value = "";
    $("jsonError").textContent = "";
    try {
      const txt = $("jsonInput").value || "{}";
      Model1.setState(JSON.parse(txt));
      Model1.renderAll();
    } catch (e) {
      $("jsonError").textContent = "JSON parse error: " + e.message;
    }
  };

  $("renderQps4Btn").onclick = () => {
    $("summary").value = "";
    $("qps4Error").textContent = "";
    try {
      const txt = $("qps4Input").value || "{}";
      Model2.setState(JSON.parse(txt));
      Model2.render();
    } catch (e) {
      $("qps4Error").textContent = "JSON parse error: " + e.message;
    }
  };

  // ===== Dropdown: auto load + render =====
  $("sampleSelect1").onchange = () => {
    const path = $("sampleSelect1").value;
    if (!path) return;

    $("summary").value = "";
    $("sampleError1").textContent = "";
    $("jsonError").textContent = "";

    loadSample(path)
      .then(txt => {
        $("jsonInput").value = txt;
        Model1.setState(JSON.parse(txt || "{}"));
        Model1.renderAll();
      })
      .catch(e => {
        $("sampleError1").textContent = String(e);
      });
  };

  $("sampleSelect2").onchange = () => {
    const path = $("sampleSelect2").value;
    if (!path) return;

    $("summary").value = "";
    $("sampleError2").textContent = "";
    $("qps4Error").textContent = "";

    loadSample(path)
      .then(txt => {
        $("qps4Input").value = txt;
        Model2.setState(JSON.parse(txt || "{}"));
        Model2.render();
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

  // ===== init: render empty UI (no auto sample load) =====
  Model1.setState({});
  Model1.renderAll();
  Model2.setState(null);
  Model2.render();
})();

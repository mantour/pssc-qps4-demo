// main.js
(() => {
  const $ = id => document.getElementById(id);

  async function fetchText(url) {
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`Fetch failed (${resp.status}): ${url}`);
    return await resp.text();
  }

  function clearSummary() {
    $("summary").value = "";
  }

  function readLocalJsonIntoTextarea(fileInputEl, textareaEl, afterLoad) {
    const f = fileInputEl.files && fileInputEl.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      textareaEl.value = ev.target.result;
      afterLoad();
    };
    r.readAsText(f);
  }

  // ============== Model 1: Render / Load sample / Upload JSON ==============
  $("renderBtn").onclick = () => {
    clearSummary(); // keep original behavior
    try {
      const obj = JSON.parse($("jsonInput").value || "{}");
      window.Model1.setState(obj);
      window.Model1.renderAll($);
      $("jsonError").textContent = "";
    } catch (e) {
      $("jsonError").textContent = "JSON parse error: " + e.message;
    }
  };

  $("loadSampleBtn1").onclick = async () => {
    clearSummary();
    $("sampleError1").textContent = "";
    try {
      $("jsonInput").value = await fetchText("./samples/model1_pssc_example.json");
      $("renderBtn").click();
    } catch (e) {
      $("sampleError1").textContent = String(e?.message || e);
    }
  };

  $("uploadJsonBtn1").onclick = () => $("fileInput1").click();
  $("fileInput1").onchange = () => {
    clearSummary();
    readLocalJsonIntoTextarea($("fileInput1"), $("jsonInput"), () => $("renderBtn").click());
  };

  // ============== Model 2: Render / Load sample / Upload JSON ==============
  $("renderQps4Btn").onclick = () => {
    clearSummary(); // keep original behavior
    try {
      const obj = JSON.parse($("qps4Input").value || "{}");
      window.Model2.setState(obj);
      window.Model2.render($);
      $("qps4Error").textContent = "";
    } catch (e) {
      $("qps4Error").textContent = "JSON parse error: " + e.message;
    }
  };

  $("loadSampleBtn2").onclick = async () => {
    clearSummary();
    $("sampleError2").textContent = "";
    try {
      $("qps4Input").value = await fetchText("./samples/model2_qps4_example.json");
      $("renderQps4Btn").click();
    } catch (e) {
      $("sampleError2").textContent = String(e?.message || e);
    }
  };

  $("uploadJsonBtn2").onclick = () => $("fileInput2").click();
  $("fileInput2").onchange = () => {
    clearSummary();
    readLocalJsonIntoTextarea($("fileInput2"), $("qps4Input"), () => $("renderQps4Btn").click());
  };

  // ============== Summary buttons (original) ==============
  $("fillBtn").onclick = () => {
    let text = window.Model1.buildSummaryText();
    const m2 = window.Model2.buildSummaryText();
    if (m2) text += "\n\n" + m2;
    $("summary").value = text;
  };

  $("clearSummaryBtn").onclick = () => {
    $("summary").value = "";
  };

  // init: render empty UIs (original)
  window.Model1.setState({});
  window.Model1.renderAll($);
  window.Model2.setState(null);
  window.Model2.render($);
})();

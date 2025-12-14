// main.js
(() => {
  const $ = (id) => document.getElementById(id);

  function must(id) {
    const el = $(id);
    if (!el) throw new Error(`Missing element #${id}`);
    return el;
  }

  async function fetchText(url) {
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`Fetch failed (${resp.status}): ${url}`);
    return await resp.text();
  }

  function clearSummary() {
    must("summary").value = "";
  }

  function readLocalJsonIntoTextarea(fileInputEl, textareaEl, afterLoad) {
    const f = fileInputEl.files && fileInputEl.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = (ev) => {
      textareaEl.value = ev.target.result;
      afterLoad();
    };
    r.readAsText(f);
  }

  function safeParseJSON(text) {
    return JSON.parse(text || "{}");
  }

  function init() {
    // If models didn't load, fail loudly (otherwise buttons look "dead")
    if (!window.Model1 || !window.Model2) {
      throw new Error("Model scripts not loaded. Ensure model1.js and model2.js are included before main.js.");
    }

    // ===== Model 1: Render =====
    must("renderBtn").onclick = () => {
      clearSummary();
      try {
        const obj = safeParseJSON(must("jsonInput").value);
        window.Model1.setState(obj);
        window.Model1.renderAll($);
        must("jsonError").textContent = "";
      } catch (e) {
        must("jsonError").textContent = "JSON parse error: " + e.message;
      }
    };

    // ===== Model 1: Load sample =====
    must("loadSampleBtn1").onclick = async () => {
      clearSummary();
      must("sampleError1").textContent = "";
      try {
        must("jsonInput").value = await fetchText("./samples/model1_pssc_example.json");
        must("renderBtn").click();
      } catch (e) {
        must("sampleError1").textContent = String(e?.message || e);
      }
    };

    // ===== Model 1: Upload JSON =====
    must("uploadJsonBtn1").onclick = () => must("fileInput1").click();
    must("fileInput1").onchange = () => {
      clearSummary();
      readLocalJsonIntoTextarea(must("fileInput1"), must("jsonInput"), () => must("renderBtn").click());
    };

    // ===== Model 2: Render =====
    must("renderQps4Btn").onclick = () => {
      clearSummary();
      try {
        const obj = safeParseJSON(must("qps4Input").value);
        window.Model2.setState(obj);
        window.Model2.render($);
        must("qps4Error").textContent = "";
      } catch (e) {
        must("qps4Error").textContent = "JSON parse error: " + e.message;
      }
    };

    // ===== Model 2: Load sample =====
    must("loadSampleBtn2").onclick = async () => {
      clearSummary();
      must("sampleError2").textContent = "";
      try {
        must("qps4Input").value = await fetchText("./samples/model2_qps4_example.json");
        must("renderQps4Btn").click();
      } catch (e) {
        must("sampleError2").textContent = String(e?.message || e);
      }
    };

    // ===== Model 2: Upload JSON =====
    must("uploadJsonBtn2").onclick = () => must("fileInput2").click();
    must("fileInput2").onchange = () => {
      clearSummary();
      readLocalJsonIntoTextarea(must("fileInput2"), must("qps4Input"), () => must("renderQps4Btn").click());
    };

    // ===== Summary =====
    must("fillBtn").onclick = () => {
      let text = window.Model1.buildSummaryText();
      const m2 = window.Model2.buildSummaryText();
      if (m2) text += "\n\n" + m2;
      must("summary").value = text;
    };

    must("clearSummaryBtn").onclick = () => {
      must("summary").value = "";
    };

    // ===== init render =====
    window.Model1.setState({});
    window.Model1.renderAll($);
    window.Model2.setState(null);
    window.Model2.render($);
  }

  // ✅ Critical fix: only run after DOM is ready
  window.addEventListener("DOMContentLoaded", () => {
    try {
      init();
    } catch (e) {
      // Fail loudly in console so you see what's wrong immediately
      console.error(e);
      // Also show on page (so you don't have to open console)
      const host = document.createElement("div");
      host.style.cssText = "color:red; white-space:pre-wrap; margin:8px 0;";
      host.textContent = "Init error: " + (e?.message || String(e));
      document.body.prepend(host);
    }
  });
})();

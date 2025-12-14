// main.js (ES module entry)
import { setModel1State, renderModel1, buildModel1SummaryText } from "./model1.js";
import { setModel2State, renderModel2, buildModel2SummaryText } from "./model2.js";

const $ = (id) => document.getElementById(id);

async function fetchText(url) {
  const resp = await fetch(url, { cache: "no-store" });
  if (!resp.ok) throw new Error(`Fetch failed (${resp.status}): ${url}`);
  return await resp.text();
}

function clearSummary() {
  $("summary").value = "";
}

function readLocalFileToTextarea(fileInputEl, textareaEl, onDone) {
  const f = fileInputEl.files?.[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = (ev) => {
    textareaEl.value = ev.target.result;
    onDone();
  };
  r.readAsText(f);
}

window.addEventListener("DOMContentLoaded", () => {
  // ===== Render Model 1 =====
  $("renderBtn").onclick = () => {
    clearSummary();
    try {
      const obj = JSON.parse($("jsonInput").value || "{}");
      setModel1State(obj);
      renderModel1($);
      $("jsonError").textContent = "";
    } catch (e) {
      $("jsonError").textContent = "JSON parse error: " + e.message;
    }
  };

  // ===== Render Model 2 =====
  $("renderQps4Btn").onclick = () => {
    clearSummary();
    try {
      const obj = JSON.parse($("qps4Input").value || "{}");
      setModel2State(obj);
      renderModel2($);
      $("qps4Error").textContent = "";
    } catch (e) {
      $("qps4Error").textContent = "JSON parse error: " + e.message;
    }
  };

  // ===== Load sample (repo) =====
  $("loadSampleBtn1").onclick = async () => {
    clearSummary();
    $("repoLoadError1").textContent = "";
    try {
      $("jsonInput").value = await fetchText("./samples/model1_pssc_example.json");
      $("renderBtn").click();
    } catch (e) {
      $("repoLoadError1").textContent = String(e?.message || e);
    }
  };

  $("loadSampleBtn2").onclick = async () => {
    clearSummary();
    $("repoLoadError2").textContent = "";
    try {
      $("qps4Input").value = await fetchText("./samples/model2_qps4_example.json");
      $("renderQps4Btn").click();
    } catch (e) {
      $("repoLoadError2").textContent = String(e?.message || e);
    }
  };

  // ===== Upload JSON (local) =====
  $("uploadJsonBtn1").onclick = () => $("fileInput1").click();
  $("fileInput1").onchange = () => {
    clearSummary();
    readLocalFileToTextarea($("fileInput1"), $("jsonInput"), () => $("renderBtn").click());
  };

  $("uploadJsonBtn2").onclick = () => $("fileInput2").click();
  $("fileInput2").onchange = () => {
    clearSummary();
    readLocalFileToTextarea($("fileInput2"), $("qps4Input"), () => $("renderQps4Btn").click());
  };

  // ===== Summary =====
  $("fillBtn").onclick = () => {
    let text = buildModel1SummaryText();
    const m2 = buildModel2SummaryText();
    if (m2) text += "\n\n" + m2;
    $("summary").value = text;
  };

  $("clearSummaryBtn").onclick = () => {
    $("summary").value = "";
  };

  // ===== init: render empty UIs =====
  setModel1State({});
  renderModel1($);
  setModel2State(null);
  renderModel2($);
});

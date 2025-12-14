// main.js
import { setModel1State, renderModel1, buildModel1SummaryText } from "./model1.js";
import { setModel2State, renderModel2, buildModel2SummaryText } from "./model2.js";

const $ = id => document.getElementById(id);

async function fetchSample(path) {
  const r = await fetch(path, { cache: "no-store" });
  if (!r.ok) throw new Error("fetch failed");
  return r.text();
}

function uploadJson(fileInput, textarea, renderFn) {
  fileInput.click();
  fileInput.onchange = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = ev => {
      textarea.value = ev.target.result;
      renderFn();
    };
    r.readAsText(f);
  };
}

window.addEventListener("DOMContentLoaded", () => {

  $("renderBtn").onclick = () => {
    const obj = JSON.parse($("jsonInput").value || "{}");
    setModel1State(obj);
    renderModel1($);
  };

  $("renderQps4Btn").onclick = () => {
    const obj = JSON.parse($("qps4Input").value || "{}");
    setModel2State(obj);
    renderModel2($);
  };

  $("loadSampleBtn1").onclick = async () => {
    $("jsonInput").value = await fetchSample("./samples/model1_pssc_example.json");
    $("renderBtn").click();
  };

  $("loadSampleBtn2").onclick = async () => {
    $("qps4Input").value = await fetchSample("./samples/model2_qps4_example.json");
    $("renderQps4Btn").click();
  };

  $("uploadJsonBtn1").onclick = () =>
    uploadJson($("fileInput1"), $("jsonInput"), () => $("renderBtn").click());

  $("uploadJsonBtn2").onclick = () =>
    uploadJson($("fileInput2"), $("qps4Input"), () => $("renderQps4Btn").click());

  $("fillBtn").onclick = () => {
    $("summary").value =
      buildModel1SummaryText() + "\n\n" + buildModel2SummaryText();
  };

  $("clearSummaryBtn").onclick = () => $("summary").value = "";
});

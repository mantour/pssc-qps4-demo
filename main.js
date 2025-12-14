(() => {
  const $ = id => document.getElementById(id);

  async function load(path) {
    const r = await fetch(path);
    return await r.text();
  }

  $("sampleSelect1").onchange = async () => {
    const p = $("sampleSelect1").value;
    if (!p) return;
    $("jsonInput").value = await load(p);
    Model1.setState(JSON.parse($("jsonInput").value));
    Model1.renderAll($);
  };

  $("sampleSelect2").onchange = async () => {
    const p = $("sampleSelect2").value;
    if (!p) return;
    $("qps4Input").value = await load(p);
    Model2.setState(JSON.parse($("qps4Input").value));
    Model2.render($);
  };

  $("renderBtn").onclick = () => {
    Model1.setState(JSON.parse($("jsonInput").value || "{}"));
    Model1.renderAll($);
  };

  $("renderQps4Btn").onclick = () => {
    Model2.setState(JSON.parse($("qps4Input").value || "{}"));
    Model2.render($);
  };

  $("fillBtn").onclick = () => {
    $("summary").value =
      Model1.buildSummaryText() + "\n\n" + Model2.buildSummaryText();
  };

  $("clearSummaryBtn").onclick = () => {
    $("summary").value = "";
  };

  // init: no auto load
  Model1.setState({});
  Model1.renderAll($);
  Model2.setState(null);
  Model2.render($);
})();

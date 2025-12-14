(() => {
  const $ = id => document.getElementById(id);

  async function load(path){ return (await fetch(path)).text(); }

  $("sampleSelect1").onchange = async () => {
    if (!$("sampleSelect1").value) return;
    const txt = await load($("sampleSelect1").value);
    $("jsonInput").value = txt;
    Model1.setState(JSON.parse(txt));
    Model1.renderAll($);
  };

  $("sampleSelect2").onchange = async () => {
    if (!$("sampleSelect2").value) return;
    const txt = await load($("sampleSelect2").value);
    $("qps4Input").value = txt;
    Model2.setState(JSON.parse(txt));
    Model2.render($);
  };

  $("renderBtn").onclick = () => {
    Model1.setState(JSON.parse($("jsonInput").value||"{}"));
    Model1.renderAll($);
  };

  $("renderQps4Btn").onclick = () => {
    Model2.setState(JSON.parse($("qps4Input").value||"{}"));
    Model2.render($);
  };

  $("fillBtn").onclick = () => {
    $("summary").value =
      Model1.buildSummaryText() + "\n\n" + Model2.buildSummaryText();
  };

  $("clearSummaryBtn").onclick = () => $("summary").value="";

  Model1.setState({});
  Model1.renderAll($);
  Model2.setState(null);
  Model2.render($);
})();

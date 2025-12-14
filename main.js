(() => {
  const $=id=>document.getElementById(id);
  async function load(p){ return (await fetch(p)).text(); }

  $("sampleSelect1").onchange=async()=>{
    if(!$("sampleSelect1").value)return;
    const t=await load($("sampleSelect1").value);
    $("jsonInput").value=t;
    Model1.setState(JSON.parse(t));
    Model1.renderAll();
  };

  $("sampleSelect2").onchange=async()=>{
    if(!$("sampleSelect2").value)return;
    const t=await load($("sampleSelect2").value);
    $("qps4Input").value=t;
    Model2.setState(JSON.parse(t));
    Model2.render();
  };
})();

(function(){
  const KEY = "geo_capture";

  function load(){
    try { return JSON.parse(localStorage.getItem(KEY)) || {}; }
    catch { return {}; }
  }

  function save(d){
    localStorage.setItem(KEY, JSON.stringify(d));
  }

  const data = load();
  const path = location.pathname;

  data[path] = data[path] || { views: 0, clicks: 0, time: 0 };
  data[path].views += 1;

  const start = Date.now();

  document.addEventListener("click", () => {
    data[path].clicks += 1;
    save(data);
  });

  window.addEventListener("beforeunload", () => {
    data[path].time += Math.round((Date.now() - start) / 1000);
    save(data);
  });

  save(data);
})();

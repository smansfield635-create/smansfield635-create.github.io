document.addEventListener('DOMContentLoaded',()=>{
  const target='https://raw.githack.com/smansfield635-create/smansfield635-create.github.io/0c6069f30e494be2f84d2653f40e374178251c77/showroom/globe/h-earth/index.html';
  document.querySelectorAll('[data-compass-room][data-label="H-Earth"], a[href="/showroom/globe/h-earth/"]').forEach(el=>{
    if(el.matches('[data-compass-room][data-label="H-Earth"]')) el.dataset.route=target;
    if(el.getAttribute('href')==='/showroom/globe/h-earth/') el.setAttribute('href',target);
  });
});

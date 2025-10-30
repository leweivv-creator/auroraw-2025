(function(){
  const root=document.documentElement,btn=document.getElementById('themeToggle');
  const q=new URLSearchParams(location.search);const themeFromQuery=q.get('theme');
  const saved=localStorage.getItem('theme');const initial=themeFromQuery||saved||'pink';
  root.setAttribute('data-theme', initial);btn.textContent = initial==='bw'?'BW':'PG';
  btn.addEventListener('click',()=>{const next=root.getAttribute('data-theme')==='bw'?'pink':'bw';root.setAttribute('data-theme',next);localStorage.setItem('theme',next);btn.textContent=next==='bw'?'BW':'PG';});
  document.getElementById('year').textContent=new Date().getFullYear();
})();
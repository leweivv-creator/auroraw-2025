(function(){
  // ===== Theme toggle（保留原功能） =====
  const root=document.documentElement,btn=document.getElementById('themeToggle');
  const q=new URLSearchParams(location.search);
  const saved=localStorage.getItem('theme');
  const initial=q.get('theme')||saved||'pink';
  root.setAttribute('data-theme', initial);
  if(btn){ btn.textContent = initial==='bw'?'BW':'PG';
    btn.addEventListener('click',()=>{
      const next=root.getAttribute('data-theme')==='bw'?'pink':'bw';
      root.setAttribute('data-theme',next);
      localStorage.setItem('theme',next);
      btn.textContent=next==='bw'?'BW':'PG';
    });
  }
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // ===== Band Setlist =====
  // 说明：下面是你给的歌单里挑出的 18 首（可增删）
  const SETLIST = [
    {title:"Until I Found You", artist:"Stephen Sanchez"},
    {title:"505", artist:"Arctic Monkeys"},
    {title:"Love Yourself", artist:"Justin Bieber"},
    {title:"Painkiller", artist:"Ruel"},
    {title:"Run", artist:"Joji"},
    {title:"Restless Heart Syndrome", artist:"Green Day"},
    {title:"Happier Than Ever", artist:"Billie Eilish"},
    {title:"Die With A Smile", artist:"Lady Gaga Bruno Mars"},
    {title:"What You Won’t Do for Love", artist:"Bobby Caldwell"},
    {title:"Blinding Lights", artist:"The Weeknd"},
    {title:"Zombie", artist:"The Cranberries"},
    {title:"Bohemian Rhapsody", artist:"Queen"},
    {title:"Undercover Martyn", artist:"Two Door Cinema Club"},
    {title:"Strawberries & Cigarettes", artist:"Troye Sivan"},
    {title:"Hotel California", artist:"Eagles"},
    {title:"勇敢的人", artist:"草东没有派对"},
    {title:"普通朋友", artist:"陶喆"},
    {title:"不能说的秘密", artist:"周杰伦"}
  ];

  // 用 iTunes Search API 获取封面与链接（支持 CORS；无需服务器）
  const API = "https://itunes.apple.com/search"; // 返回 JSON
  const grid = document.getElementById('setlist');

  function itunesUrl(q){
    const params = new URLSearchParams({
      term: q, media: "music", entity: "song", limit: 1
    });
    return `${API}?${params.toString()}`;
  }

  function toHiRes(art) {
    // artworkUrl100 -> 600x600（或 1200x1200）
    return art ? art.replace(/\/\d+x\d+bb\.jpg/, "/600x600bb.jpg") : null;
  }

  async function render(){
    if(!grid) return;
    grid.innerHTML = "";
    for (const track of SETLIST){
      const q = `${track.title} ${track.artist}`;
      let cover=null, link=null, title=track.title, artist=track.artist;
      try{
        const res = await fetch(itunesUrl(q));
        const data = await res.json();
        if(data.results && data.results.length){
          const r = data.results[0];
          cover = toHiRes(r.artworkUrl100);
          link = r.trackViewUrl || r.collectionViewUrl;
          // 用返回值矫正大小写
          title = r.trackName || title;
          artist = r.artistName || artist;
        }
      }catch(e){ /* 静默失败，用占位 */ }
      // 兜底：没有找到就用 Apple Music 搜索页
      if(!link) link = `https://music.apple.com/us/search?term=${encodeURIComponent(q)}`;

      const card = document.createElement('div');
      card.className = "track-card";
      card.innerHTML = `
        <a href="${link}" target="_blank" rel="noopener">
          <img class="cover" src="${cover || '/og-image.jpg'}" alt="${title} — ${artist}">
          <div class="track-meta">
            <div class="track-title">${title}</div>
            <div class="track-artist">${artist}</div>
          </div>
        </a>
      `;
      grid.appendChild(card);
    }
  }

  render();
})();

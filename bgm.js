// bgm.js — vinyl toggle with memory & autoplay unlock
(function(){
  const audio = document.getElementById('bgm');
  const btn   = document.getElementById('bgmToggle');
  if(!audio || !btn) return;

  // 记忆用户偏好
  let on = localStorage.getItem('bgm') === 'on';

  // UI 同步
  function syncUI(){
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', String(on));
    btn.title = on ? 'Pause music' : 'Play music';
  }

  // 真正开关
  async function set(onWanted){
    on = onWanted;
    localStorage.setItem('bgm', on ? 'on' : 'off');
    syncUI();
    if(on){
      if(audio.preload === 'none') audio.preload = 'auto';
      try{ await audio.play(); }catch(e){ /* 等用户手势再播 */ }
    }else{
      audio.pause();
    }
  }

  // 点击切换
  btn.addEventListener('click', ()=> set(!on));

  // 如果记忆为 ON，则在首次用户手势后尝试解锁播放
  syncUI();
  if(on){
    const unlock = async ()=>{
      if(audio.preload === 'none') audio.preload = 'auto';
      try{ await audio.play(); }catch(_){}
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
      document.removeEventListener('touchstart', unlock);
    };
    document.addEventListener('click', unlock, {once:true});
    document.addEventListener('keydown', unlock, {once:true});
    document.addEventListener('touchstart', unlock, {once:true});
  }

  // 页面隐藏时暂停、回来恢复（不改变用户选择）
  document.addEventListener('visibilitychange', ()=>{
    if(document.hidden) audio.pause();
    else if(on) audio.play().catch(()=>{});
  });

  audio.volume = 0.35; // 初始音量
})();

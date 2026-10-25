window.MODES = window.MODES || {};

MODES.url = {
  title: 'browser',
  bare: true,           // ไม่ใช้กรอบ window/titlebar
  init(){},
  inputs: ['urlInput','urlTab','urlTheme'],
  render(){
    const raw = $('urlInput').value || 'https://';
    const dark = $('urlTheme').value === 'dark';
    const c = dark
      ? {bar:'#2b2d31', tab:'#3c4043', field:'#202124', text:'#e8eaed', mute:'#9aa0a6'}
      : {bar:'#dee1e6', tab:'#ffffff', field:'#f1f3f4', text:'#202124', mute:'#5f6368'};
    let scheme='', host=raw, rest='';
    try{
      const u = new URL(raw);
      scheme = u.protocol + '//'; host = u.host; rest = u.pathname + u.search + u.hash;
      if(rest === '/') rest = '';
    }catch(e){}
    const lock = scheme === 'https://' ? '🔒' : 'ⓘ';
    $('bodyMount').innerHTML = `
    <div style="width:760px;background:${c.bar};font-family:'Segoe UI','Noto Sans Thai',sans-serif;color:${c.text};border-radius:10px;overflow:hidden">
      <div style="padding:8px 12px 0;display:flex">
        <div style="background:${c.tab};padding:8px 16px;border-radius:8px 8px 0 0;font-size:12.5px;min-width:180px">🌐 ${esc($('urlTab').value)}</div>
      </div>
      <div style="background:${c.tab};padding:8px 12px;display:flex;align-items:center;gap:12px">
        <span style="color:${c.mute};font-size:16px;letter-spacing:8px">←→⟳</span>
        <div style="flex:1;background:${c.field};border-radius:20px;padding:7px 14px;font-size:14px;white-space:nowrap;overflow:hidden">
          <span style="font-size:12px">${lock}</span>
          <span style="color:${c.mute}">${esc(scheme)}</span><span>${esc(host)}</span><span style="color:${c.mute}">${esc(rest)}</span>
        </div>
      </div>
    </div>`;
  }
};

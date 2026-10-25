window.MODES = window.MODES || {};

const RESP_STATUS = {200:'OK',201:'Created',204:'No Content',301:'Moved Permanently',400:'Bad Request',
  401:'Unauthorized',403:'Forbidden',404:'Not Found',405:'Method Not Allowed',422:'Unprocessable Entity',
  429:'Too Many Requests',500:'Internal Server Error',502:'Bad Gateway',503:'Service Unavailable'};

const RESP_METHOD_COLOR = {GET:'#22c55e',POST:'#f59e0b',PUT:'#3b82f6',PATCH:'#a855f7',DELETE:'#ef4444'};

const RESP_PRESETS = {
  ok:      {method:'GET',  url:'https://api.example.com/users/1', status:'200', time:'124',
            body:{id:1,name:'Guy',email:'guy@example.com',role:'instructor',active:true}},
  created: {method:'POST', url:'https://api.example.com/users', status:'201', time:'210',
            body:{message:'User created',data:{id:42,name:'Somchai'}}},
  invalid: {method:'POST', url:'https://api.example.com/users', status:'422', time:'88',
            body:{message:'The given data was invalid.',errors:{email:['The email field is required.']}}},
  notfound:{method:'GET',  url:'https://api.example.com/users/999', status:'404', time:'45',
            body:{message:'User not found'}},
  server:  {method:'GET',  url:'https://api.example.com/report', status:'500', time:'1530',
            body:{message:'Server Error'}}
};

MODES.resp = {
  title: 'response.json',
  init(){
    const load = p=>{
      $('respMethod').value = p.method; $('respUrl').value = p.url;
      $('respStatus').value = p.status; $('respTime').value = p.time;
      $('respJson').value = JSON.stringify(p.body, null, 2);
    };
    load(RESP_PRESETS.ok);
    $('respPreset')?.addEventListener('change', e=>{
      if(RESP_PRESETS[e.target.value]){ load(RESP_PRESETS[e.target.value]); render(); }
    });
  },
  inputs: ['respMethod','respUrl','respStatus','respTime','respJson','respIndent','respLines','respHeader'],
  render(){
    const raw = $('respJson').value.trim();
    const indent = parseInt($('respIndent').value);
    let text = raw, err = '';
    try{ text = JSON.stringify(JSON.parse(raw), null, indent || 0); }
    catch(e){ err = e.message; }

    let html;
    try{ html = err ? esc(text) : hljs.highlight(text, {language:'json'}).value; }
    catch(e){ html = esc(text); }
    if($('respLines').checked && indent){
      html = html.split('\n').map((l,i)=>`<span class="lnum">${i+1}</span>${l}`).join('\n');
    }

    const code = parseInt($('respStatus').value) || 200;
    const sc = code < 300 ? '#22c55e' : code < 400 ? '#3b82f6' : code < 500 ? '#f59e0b' : '#ef4444';
    const method = $('respMethod').value;
    const bytes = new Blob([text]).size;
    const size = bytes < 1024 ? bytes + ' B' : (bytes/1024).toFixed(1) + ' KB';
    const chip = (t,c)=>`<span style="color:${c};font-weight:700">${esc(t)}</span>`;

    const header = $('respHeader').checked ? `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 20px;background:rgba(255,255,255,.05);
        border-bottom:1px solid rgba(255,255,255,.08);font:13px 'Segoe UI','Noto Sans Thai',sans-serif;color:#cbd5e1;flex-wrap:wrap">
        <span style="background:${RESP_METHOD_COLOR[method]||'#64748b'};color:#fff;padding:3px 10px;border-radius:6px;font-weight:700;font-size:12px">${method}</span>
        <span style="flex:1;min-width:0;word-break:break-all;font-family:Consolas,Menlo,monospace">${esc($('respUrl').value)}</span>
        <span style="background:${sc}22;border:1px solid ${sc};color:${sc};padding:3px 10px;border-radius:999px;font-weight:700">${code} ${RESP_STATUS[code]||''}</span>
        ${chip($('respTime').value + ' ms','#94a3b8')}${chip(size,'#94a3b8')}
      </div>` : '';

    const errBar = err ? `<div style="background:#7f1d1d;color:#fecaca;padding:6px 20px;font:12px Consolas,monospace">Invalid JSON: ${esc(err)}</div>` : '';
    const wrap = indent ? 'white-space:pre' : 'white-space:pre-wrap;word-break:break-all';

    $('bodyMount').innerHTML = `${header}${errBar}
      <pre id="codeblock"><code class="hljs" id="codeOut" style="${wrap}">${html}</code></pre>`;
    $('codeOut').style.fontSize = $('fs').value + 'px';
    requestAnimationFrame(()=>{
      $('window').style.background = getComputedStyle($('codeOut')).backgroundColor;
    });
  }
};

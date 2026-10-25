// helpers (ใช้ร่วมกันทุกไฟล์)
const $ = id => document.getElementById(id);
const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

let mode = 'code';

function render(){
  const m = MODES[mode];
  m.render();

  const bare = !!m.bare;
  const w = $('window');
  w.style.boxShadow = bare ? 'none' : '';
  w.style.minWidth  = bare ? '0' : '';
  w.style.borderRadius = bare ? '0' : '';
  if(bare) w.style.background = 'transparent';

  $('fsVal').textContent = $('fs').value;
  $('padVal').textContent = $('pad').value;
  $('capture').style.background = $('bg').value;
  $('capture').style.padding = $('pad').value + 'px';
  $('titlebar').style.display = (!bare && $('titlebarOn').checked) ? 'flex' : 'none';
  $('titleText').textContent = $('title').value || ' ';
}

function setMode(next){
  mode = next;
  document.querySelectorAll('.mode-btn').forEach(b=>b.classList.toggle('active', b.dataset.mode===mode));
  Object.keys(MODES).forEach(k=>$('fields-'+k)?.classList.toggle('active', k===mode));
  $('title').value = MODES[mode].title;
  render();
}

// ---- boot ----
// ตรวจว่า HTML ครบหรือไม่ แล้วบอกใน Console (F12) ว่าขาด id ไหน
Object.entries(MODES).forEach(([k,m])=>{
  const bad = [`fields-${k}`, ...m.inputs].filter(id=>!$(id));
  bad.forEach(id=>console.warn(`[CodeSnap] โหมด "${k}": ไม่พบ element id="${id}" ใน index.html`));
  if(bad.length){ delete MODES[k]; console.warn(`[CodeSnap] ปิดโหมด "${k}" ชั่วคราว (โหมดอื่นยังใช้ได้)`); return; }
  if(!document.querySelector(`[data-mode="${k}"]`)) console.warn(`[CodeSnap] โหมด "${k}": ไม่มีแท็บ data-mode="${k}"`);
});

Object.values(MODES).forEach(m=>m.init());

document.querySelectorAll('.mode-btn').forEach(b=>b.addEventListener('click', ()=>setMode(b.dataset.mode)));

const commonInputs = ['bg','title','pad','fs','titlebarOn'];
const modeInputs = Object.values(MODES).flatMap(m=>m.inputs);
[...commonInputs, ...modeInputs].forEach(id=>$(id)?.addEventListener('input', render));

$('theme').addEventListener('change', e=>{
  $('hljs-theme').href = `vendor/styles/${e.target.value}.min.css`;
  setTimeout(render, 250);
});
$('scale').addEventListener('input', ()=> $('scaleVal').textContent = $('scale').value);

initExport();
render();

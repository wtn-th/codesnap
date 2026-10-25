window.MODES = window.MODES || {};

const BTN_PRESETS = {
  copy:  `📋|Copy|ghost|*\n📥|Paste|ghost`,
  save:  `💾|Save|primary|*\n📂|Open|ghost`,
  run:   `▶|Run|success|*\n⏹|Stop|danger`,
  steps: `📂|Open|ghost|1\n✏️|Edit|ghost|2\n💾|Save|primary|3`
};

MODES.btn = {
  title: 'buttons',
  bare: true,
  init(){
    $('btnInput').value = BTN_PRESETS.copy;
    $('btnPreset')?.addEventListener('change', e=>{
      if(BTN_PRESETS[e.target.value]){ $('btnInput').value = BTN_PRESETS[e.target.value]; render(); }
    });
  },
  inputs: ['btnInput','btnSize','btnLayout','btnRing'],
  render(){
    const S = {
      ghost:'background:#f3f4f6;color:#1f2937;border:1px solid #d1d5db',
      primary:'background:#2563eb;color:#fff', success:'background:#16a34a;color:#fff',
      danger:'background:#dc2626;color:#fff',  dark:'background:#1f2937;color:#fff',
      light:'background:#fff;color:#111827;border:1px solid #e5e7eb',
      outline:'background:#fff;color:#2563eb;border:2px solid #2563eb'
    };
    const k = parseFloat($('btnSize').value);
    const ring = $('btnRing').value;
    const fs = parseInt($('fs').value) * k;
    const items = ($('btnInput').value || '').split('\n').filter(l=>l.trim()).map(l=>{
      const [icon='', label='', style='ghost', hl=''] = l.split('|').map(s=>s.trim());
      const isNum = /^\d+$/.test(hl);
      const on = hl === '*' || isNum;
      const btn = `<span style="${S[style]||S.ghost};display:inline-flex;align-items:center;gap:${8*k}px;
        padding:${10*k}px ${20*k}px;border-radius:${8*k}px;font-size:${fs}px;font-weight:600;
        font-family:'Segoe UI','Noto Sans Thai',sans-serif;box-sizing:border-box;
        ${on ? `box-shadow:0 0 0 ${3*k}px #fff,0 0 0 ${7*k}px ${ring};` : ''}">
        <span>${esc(icon)}</span>${label ? `<span>${esc(label)}</span>` : ''}</span>`;
      const badge = isNum ? `<span style="position:absolute;left:${-16*k}px;top:${-16*k}px;width:${28*k}px;height:${28*k}px;
        border-radius:50%;background:${ring};color:#fff;font:700 ${15*k}px 'Segoe UI',sans-serif;
        display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 ${2*k}px #fff">${hl}</span>` : '';
      const hand = hl === '*' ? `<span style="position:absolute;right:${-14*k}px;bottom:${-30*k}px;font-size:${30*k}px;line-height:1">👆</span>` : '';
      return `<span style="position:relative;display:inline-block;margin:${10*k}px ${10*k}px ${(hl==='*'?28:10)*k}px">${btn}${badge}${hand}</span>`;
    }).join('');
    $('bodyMount').innerHTML =
      `<div style="display:flex;flex-direction:${$('btnLayout').value};flex-wrap:wrap;gap:${12*k}px;padding:${8*k}px;align-items:flex-start">${items}</div>`;
  }
};

window.MODES = window.MODES || {};

const KEY_PRESETS = {
  copy: `Ctrl+C|คัดลอก\nCtrl+V|วาง\nCtrl+X|ตัด`,
  undo: `Ctrl+Z|ย้อนกลับ\nCtrl+Y|ทำซ้ำ\nCtrl+S|บันทึก`,
  find: `Ctrl+F|ค้นหา\nCtrl+A|เลือกทั้งหมด`,
  sys:  `Ctrl+Shift+Esc|เปิด Task Manager\nWin+Shift+S|แคปหน้าจอ`,
  term: `Ctrl+C|หยุดโปรแกรม\nCtrl+L|ล้างหน้าจอ`
};

const KEY_LABEL = {
  win: {ctrl:'Ctrl', shift:'Shift', alt:'Alt', win:'⊞ Win', cmd:'⊞ Win', enter:'Enter', esc:'Esc',
        tab:'Tab', backspace:'Backspace', del:'Del', delete:'Del', space:'Space', caps:'Caps Lock',
        up:'↑', down:'↓', left:'←', right:'→', plus:'+'},
  mac: {ctrl:'⌃ control', shift:'⇧ shift', alt:'⌥ option', win:'⌘ command', cmd:'⌘ command',
        enter:'⏎ return', esc:'esc', tab:'⇥ tab', backspace:'⌫ delete', del:'⌦ del', delete:'⌦ del',
        space:'space', caps:'⇪ caps', up:'↑', down:'↓', left:'←', right:'→', plus:'+'}
};

MODES.key = {
  title: 'shortcut',
  bare: true,
  init(){
    $('keyInput').value = KEY_PRESETS.copy;
    $('keyPreset')?.addEventListener('change', e=>{
      if(KEY_PRESETS[e.target.value]){ $('keyInput').value = KEY_PRESETS[e.target.value]; render(); }
    });
  },
  inputs: ['keyInput','keyOS','keyTheme','keySize','keyLayout'],
  render(){
    const os = $('keyOS').value, dark = $('keyTheme').value === 'dark';
    const k = parseFloat($('keySize').value);
    const fs = parseInt($('fs').value) * k;
    const cap = dark
      ? 'background:linear-gradient(#4b5563,#374151);color:#f9fafb;border:1px solid #1f2937;box-shadow:0 4px 0 #111827,0 7px 10px rgba(0,0,0,.35)'
      : 'background:linear-gradient(#ffffff,#f3f4f6);color:#1f2937;border:1px solid #d1d5db;box-shadow:0 4px 0 #b6bfcc,0 7px 10px rgba(0,0,0,.25)';

    const keycap = raw=>{
      const id = raw.toLowerCase();
      const text = KEY_LABEL[os][id] || raw.toUpperCase();
      const w = id==='space' ? `min-width:${fs*6}px` : text.length > 1 ? `min-width:${fs*2.6}px` : `min-width:${fs*1.9}px`;
      return `<span style="${cap};${w};height:${fs*1.9}px;padding:0 ${fs*.6}px;border-radius:${fs*.35}px;
        display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;
        font:600 ${fs}px 'Segoe UI','Noto Sans Thai',sans-serif">${esc(text)}</span>`;
    };
    const plus = `<span style="font:700 ${fs}px 'Segoe UI',sans-serif;color:#6b7280;margin:0 ${fs*.15}px">+</span>`;

    const rows = ($('keyInput').value || '').split('\n').filter(l=>l.trim()).map(l=>{
      const [combo='', label=''] = l.split('|').map(s=>s.trim());
      const keys = combo.split('+').map(s=>s.trim()).filter(Boolean);
      const caps = keys.map(keycap).join(plus);
      const tag = label ? `<span style="margin-top:${fs*.6}px;background:rgba(17,24,39,.88);color:#fff;
        padding:${fs*.25}px ${fs*.8}px;border-radius:999px;font:600 ${fs*.8}px 'Segoe UI','Noto Sans Thai',sans-serif">${esc(label)}</span>` : '';
      return `<div style="display:flex;flex-direction:column;align-items:center;padding:${fs*.3}px ${fs*.3}px ${fs*.5}px">
        <div style="display:flex;align-items:center">${caps}</div>${tag}</div>`;
    }).join('');

    $('bodyMount').innerHTML =
      `<div style="display:flex;flex-direction:${$('keyLayout').value};flex-wrap:wrap;gap:${fs*.8}px;align-items:center">${rows}</div>`;
  }
};

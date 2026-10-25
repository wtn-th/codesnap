window.MODES = window.MODES || {};

MODES.folder = {
  title: 'project',
  init(){
    $('folderInput').value = `src/
  components/
    Header.jsx
    Footer.jsx
  pages/
    Home.jsx
    About.jsx
  App.jsx
  main.jsx
public/
  favicon.ico
package.json
README.md`;
  },
  inputs: ['folderInput','folderRoot'],
  render(){
    const root = $('folderRoot').value || 'project';
    const items = ($('folderInput').value || '').split('\n').filter(l=>l.trim()).map(l=>{
      const depth = Math.floor(l.match(/^(\s*)/)[1].length / 2);
      const name = l.trim();
      const isFolder = name.endsWith('/');
      return {depth, name: isFolder ? name.slice(0,-1) : name, isFolder};
    });

    // sibling สุดท้ายของระดับนั้นหรือไม่
    const isLastAt = (idx, depth)=>{
      for(let j=idx+1;j<items.length;j++){
        if(items[j].depth < depth) return true;
        if(items[j].depth === depth) return false;
      }
      return true;
    };

    let html = `<div class="tree-line"><span class="folder"><span class="tree-icon">📁</span>${esc(root)}</span></div>`;
    items.forEach((it, idx)=>{
      let prefix = '';
      // หา ancestor ของแต่ละระดับ เพื่อตัดสินว่าต้องวาด │ หรือเว้นว่าง
      for(let d=0; d<it.depth; d++){
        let a = idx - 1;
        while(a >= 0 && items[a].depth > d) a--;
        prefix += (a >= 0 && !isLastAt(a, d)) ? '│  ' : '   ';
      }
      const connector = isLastAt(idx, it.depth) ? '└─ ' : '├─ ';
      const icon = it.isFolder ? '📁' : '📄';
      html += `<div class="tree-line"><span class="branch">${prefix}${connector}</span><span class="${it.isFolder?'folder':'file'}"><span class="tree-icon">${icon}</span>${esc(it.name)}</span></div>`;
    });
    $('bodyMount').innerHTML = `<div class="tree-body" id="treeOut">${html}</div>`;
    $('treeOut').style.fontSize = $('fs').value + 'px';
    $('window').style.background = '#0c0f12';
  }
};

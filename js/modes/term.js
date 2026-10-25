window.MODES = window.MODES || {};

MODES.term = {
  title: 'Terminal',
  init(){
    $('termInput').value = `$ npm install
added 128 packages in 4.2s
$ npm run build
> project@1.0.0 build
> vite build
✓ 42 modules transformed.
✓ built in 812ms`;
  },
  inputs: ['termInput','termPrompt'],
  render(){
    const promptPath = $('termPrompt').value || 'user@host:~';
    const html = ($('termInput').value || '').split('\n').map(line=>{
      const m = line.match(/^([$>])\s?(.*)$/);
      if(m){
        return `<div class="term-line"><span class="prompt"><span class="prompt-path">${esc(promptPath)}</span> ${m[1]} </span><span class="term-cmd">${esc(m[2])}</span></div>`;
      }
      return `<div class="term-line"><span class="term-out">${esc(line) || '&nbsp;'}</span></div>`;
    }).join('');
    $('bodyMount').innerHTML = `<div class="term-body" id="termOut">${html}</div>`;
    $('termOut').style.fontSize = $('fs').value + 'px';
    $('window').style.background = '#0c0f12';
  }
};

window.MODES = window.MODES || {};

MODES.code = {
  title: 'main.py',
  demo: {code: `def greet(name: str) -> str:
    """ทักทายผู้ใช้"""
    message = f"Hello, {name}!"
    return message

if __name__ == "__main__":
    print(greet("Guy"))`},
  init(){ $('code').value = this.demo.code; },
  inputs: ['code','lang','lines'],
  render(){
    const code = $('code').value || ' ';
    const lang = $('lang').value;
    let html;
    try{
      html = lang === 'auto' ? hljs.highlightAuto(code).value
                             : hljs.highlight(code, {language: lang}).value;
    }catch(e){ html = esc(code); }

    if($('lines').checked){
      html = html.split('\n').map((l,i)=>`<span class="lnum">${i+1}</span>${l}`).join('\n');
    }
    $('bodyMount').innerHTML = `<pre id="codeblock"><code class="hljs" id="codeOut">${html}</code></pre>`;
    $('codeOut').style.fontSize = $('fs').value + 'px';
    requestAnimationFrame(()=>{
      $('window').style.background = getComputedStyle($('codeOut')).backgroundColor;
    });
  }
};

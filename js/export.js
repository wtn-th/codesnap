// ส่งออกภาพ: PNG / PDF / คัดลอก — ใช้ร่วมกันทุกโหมด
async function snap(){
  const transparent = $('bg').value === 'transparent';
  return await html2canvas($('capture'), {
    scale: parseInt($('scale').value),
    backgroundColor: transparent ? null : undefined,
    useCORS: true,
    logging: false
  });
}

function fname(ext){
  const base = ($('title').value || 'codesnap').replace(/\.[a-z0-9]+$/i,'') || 'codesnap';
  return base + '.' + ext;
}

function initExport(){
  $('btnPng').addEventListener('click', async function(){
    this.disabled = true;
    try{
      const canvas = await snap();
      const a = document.createElement('a');
      a.download = fname('png');
      a.href = canvas.toDataURL('image/png');
      a.click();
    }finally{ this.disabled = false; }
  });

  $('btnPdf').addEventListener('click', async function(){
    this.disabled = true;
    try{
      const canvas = await snap();
      let src = canvas;
      if($('bg').value === 'transparent'){   // JPEG ไม่มี alpha → เทพื้นขาว
        src = document.createElement('canvas');
        src.width = canvas.width; src.height = canvas.height;
        const ctx = src.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0,0,src.width,src.height);
        ctx.drawImage(canvas,0,0);
      }
      const img = src.toDataURL('image/jpeg', 0.82);
      const {jsPDF} = window.jspdf;
      const s = parseInt($('scale').value);
      const wPt = canvas.width * 0.75 / s * 2;
      const hPt = canvas.height * 0.75 / s * 2;
      const pdf = new jsPDF({orientation: wPt > hPt ? 'l' : 'p', unit:'pt', format:[wPt,hPt], compress:true});
      pdf.addImage(img, 'JPEG', 0, 0, wPt, hPt, undefined, 'FAST');
      pdf.save(fname('pdf'));
    }finally{ this.disabled = false; }
  });

  $('btnCopy').addEventListener('click', async function(){
    this.disabled = true;
    try{
      const canvas = await snap();
      const blob = await new Promise(r=>canvas.toBlob(r,'image/png'));
      await navigator.clipboard.write([new ClipboardItem({'image/png': blob})]);
      this.textContent = '✅ คัดลอกแล้ว';
      setTimeout(()=> this.textContent = '📋 คัดลอกภาพไปคลิปบอร์ด', 1500);
    }catch(e){
      alert('เบราว์เซอร์นี้ไม่รองรับการคัดลอกภาพ ให้ใช้ปุ่ม PNG แทน');
    }finally{ this.disabled = false; }
  });
}

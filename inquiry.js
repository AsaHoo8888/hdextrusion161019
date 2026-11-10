const inquiryMaterial = document.querySelector('#inquiry-material');
const inquiryDiameter = document.querySelector('#inquiry-diameter');

function setDiameterLimits(input, material) {
  input.min = material === 'HDPE' ? '16' : '1';
  if (material === 'HDPE') input.max = '1600';
  else input.removeAttribute('max');
}

function setInquiryMaterial(material) {
  inquiryMaterial.value = material;
  setDiameterLimits(inquiryDiameter, material);
  document.querySelector('#diameter-help').textContent = material === 'HDPE'
    ? 'HDPE line range: 16–1600 mm. For a range, enter one diameter and add the full range below.'
    : 'Enter your required diameter. Available configurations will need engineering confirmation.';
}

inquiryMaterial.addEventListener('change', () => setInquiryMaterial(inquiryMaterial.value));
setInquiryMaterial(inquiryMaterial.value);

const inquiryForm = document.querySelector('#inquiry-form');
const status = document.querySelector('#form-status');
inquiryForm.addEventListener('input', () => { status.textContent = ''; });
// shortcut: download only; connect submission when a verified delivery endpoint is supplied.
inquiryForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(inquiryForm);
  const labels = { material: 'Pipe material', diameter: 'Pipe diameter (mm)', wallThickness: 'Wall thickness (mm)', output: 'Target output (kg/h)', name: 'Name', email: 'Email', company: 'Company', country: 'Country / region', requirements: 'Additional requirements' };
  const lines = ['HD EXTRUSION — PROJECT INQUIRY', 'Prepared locally. This request has not been sent.', ''];
  for (const [key, label] of Object.entries(labels)) {
    lines.push(`${label}: ${String(data.get(key) || '').trim() || 'Not specified'}`);
  }
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
  const download = document.createElement('a');
  download.href = url;
  download.download = 'hd-extrusion-inquiry.txt';
  document.body.append(download);
  download.click();
  download.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  status.textContent = 'Your inquiry brief is ready to download. It has not been sent. Share the saved file with your sales contact.';
});

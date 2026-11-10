const materialInfo = {
  HDPE: { page: 'pe-pipe-extrusion-line.html', title: 'HDPE pipe extrusion', range: '16–1600 mm', description: 'Complete polyethylene pipe lines for water supply, gas transmission, irrigation and conduit applications. Specify your diameter range and required output to start the engineering conversation.', extrusion: 'High-efficiency single screw', configuration: 'Extrusion to cutting and coiling' },
  PPR: { page: 'ppr-4-layer-co-extrusion-line.html', title: 'Multi-layer PPR extrusion', range: 'Configured to your specification', description: 'Multi-layer pipe extrusion solutions configured around your material and pipe construction. Share your layer requirements, diameter range and production target for a tailored line discussion.', extrusion: 'Multi-layer extrusion', configuration: 'Layer configuration to final handling' },
  PVC: { page: 'pvc-pipe-extrusion-line.html', title: 'PVC twin-screw extrusion', range: 'Configured to your specification', description: 'Twin-screw extrusion solutions for PVC pipe production. Define your raw material, pipe dimensions and application to discuss the extruder and downstream equipment your project needs.', extrusion: 'Twin-screw extruder', configuration: 'Calibration to cutting and belling' }
};

const quickMaterial = document.querySelector('#quick-material');
const quickDiameter = document.querySelector('#quick-diameter');

function setMaterial(material) {
  const info = materialInfo[material];
  quickMaterial.value = material;
  inquiryMaterial.value = material;
  document.querySelectorAll('[data-material]').forEach(button => {
    const active = button.dataset.material === material;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  for (const key of ['title', 'range', 'description', 'extrusion', 'configuration']) {
    document.querySelector(`#line-${key}`).textContent = info[key];
  }
  const lineLink = document.querySelector('#line-inquiry');
  lineLink.firstChild.textContent = info.page ? `Explore the ${material === 'HDPE' ? 'PE' : material} pipe line ` : `Discuss your ${material} line `;
  lineLink.href = info.page || '#inquiry';
  setDiameterLimits(quickDiameter, material);
  setInquiryMaterial(material);
  const panel = document.querySelector('.selected-line');
  panel.classList.remove('is-changing');
  requestAnimationFrame(() => panel.classList.add('is-changing'));
}

document.querySelectorAll('[data-material]').forEach(button => {
  button.addEventListener('click', () => setMaterial(button.dataset.material));
});
quickMaterial.addEventListener('change', () => setMaterial(quickMaterial.value));
inquiryMaterial.addEventListener('change', () => setMaterial(inquiryMaterial.value));

document.querySelector('#line-config').addEventListener('submit', event => {
  event.preventDefault();
  inquiryDiameter.value = quickDiameter.value;
  document.querySelector('#inquiry').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  inquiryDiameter.focus({ preventScroll: true });
});


setMaterial('HDPE');

const gallery = document.querySelector('.equipment-gallery');
const fullPhoto = gallery.querySelector('.gallery-full');
const thumbnails = [...gallery.querySelectorAll('.gallery-thumbnails a')];
thumbnails.forEach((link, index) => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    fullPhoto.href = link.href;
    fullPhoto.querySelector('img').src = link.href;
    fullPhoto.querySelector('img').alt = link.getAttribute('aria-label');
    gallery.querySelector('figcaption span').textContent = `Photo ${index + 1} of ${thumbnails.length}`;
    thumbnails.forEach(item => item.removeAttribute('aria-current'));
    link.setAttribute('aria-current', 'true');
  });
});

const form = document.querySelector('.product-email-form');
form.hidden = false;
form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(form);
  const subject = encodeURIComponent('Inquiry: ' + form.dataset.product);
  const body = encodeURIComponent([
    form.dataset.product, '', fields.get('message'), '', fields.get('name'), fields.get('email')
  ].join('\r\n'));
  window.location.href = `mailto:sales@hdextrusion.com?subject=${subject}&body=${body}`;
});

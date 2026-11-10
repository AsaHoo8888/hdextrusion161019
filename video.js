const videoCards = [...document.querySelectorAll('.video-card')];
const videoPlayer = document.querySelector('#video-player');
const originalLink = document.querySelector('#active-video-link');

function playVideo(id) {
  const card = videoCards.find(item => item.dataset.videoId === id);
  if (!card) return;
  const title = card.querySelector('h3').textContent;
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
  iframe.title = title;
  iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
  iframe.allowFullscreen = true;
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';
  iframe.setAttribute('aria-describedby', 'player-help');
  videoPlayer.replaceChildren(iframe);
  document.querySelector('#active-video-title').textContent = title;
  document.querySelector('#active-category').textContent = card.dataset.categoryLabel;
  originalLink.href = `https://www.youtube.com/watch?v=${id}`;
  videoCards.forEach(item => {
    item.querySelector('button').setAttribute('aria-pressed', String(item === card));
  });
  document.querySelector('#watch').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  iframe.focus({ preventScroll: true });
}

document.querySelector('#featured-play').addEventListener('click', () => playVideo(videoCards[0].dataset.videoId));
videoCards.forEach(card => {
  card.querySelector('button').setAttribute('aria-pressed', 'false');
  card.querySelector('button').addEventListener('click', () => playVideo(card.dataset.videoId));
});

const videoFilters = [...document.querySelectorAll('[data-filter]')];
videoFilters.forEach(button => button.addEventListener('click', () => {
  const category = button.dataset.filter;
  videoFilters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
  let count = 0;
  videoCards.forEach(card => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
    if (!card.hidden) count += 1;
  });
  document.querySelector('#video-results').textContent = category === 'all'
    ? `Showing all ${count} videos`
    : `Showing ${count} videos · ${button.firstChild.textContent.trim()}`;
}));

const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const metadata = JSON.parse(fs.readFileSync(require.resolve('../assets/videos.json'), 'utf8'));
function element() {
  return { textContent: '', attributes: {}, dataset: {}, listeners: {},
    addEventListener(name, callback) { this.listeners[name] = callback; },
    setAttribute(name, value) { this.attributes[name] = value; },
    replaceChildren(child) { this.child = child; }, scrollIntoView() {}, focus() {} };
}
const cards = metadata.videos.map(video => {
  const button = element();
  return Object.assign(element(), { dataset: { videoId: video.id, category: video.category, categoryLabel: video.category },
    querySelector: selector => selector === 'h3' ? { textContent: video.title } : button });
});
const filters = ['all', 'HDPE', 'PVC', 'PPR', 'Profiles', 'Auxiliary'].map(category => Object.assign(element(), {
  dataset: { filter: category }, firstChild: { textContent: category }
}));
const nodes = new Map();
const get = selector => {
  if (!nodes.has(selector)) nodes.set(selector, element());
  return nodes.get(selector);
};
const context = { document: { querySelector: get, createElement: element,
  querySelectorAll: selector => selector === '.video-card' ? cards : filters },
  matchMedia: () => ({ matches: true }) };
vm.runInNewContext(fs.readFileSync(require.resolve('../video.js'), 'utf8'), context);
assert.equal(cards.length, 18);
assert.equal(new Set(metadata.videos.map(video => video.id)).size, 18);
assert(metadata.videos.every(video => video.verified && /^[\w-]{11}$/.test(video.id)));
for (const filter of filters.slice(1)) {
  filter.listeners.click();
  const visible = cards.filter(card => !card.hidden);
  assert.equal(visible.length, filter.dataset.filter === 'Auxiliary' ? 6 : 3);
  assert(visible.every(card => card.dataset.category === filter.dataset.filter));
  assert.equal(filter.attributes['aria-pressed'], 'true');
}
filters[0].listeners.click();
assert(cards.every(card => !card.hidden));
assert.equal(get('#video-player').child, undefined, 'No third-party player before a play action');
cards[4].querySelector('button').listeners.click();
const iframe = get('#video-player').child;
assert.equal(iframe.src, `https://www.youtube-nocookie.com/embed/${metadata.videos[4].id}?autoplay=1&rel=0`);
assert.equal(iframe.title, metadata.videos[4].title);
assert.equal(get('#active-video-link').href, `https://www.youtube.com/watch?v=${metadata.videos[4].id}`);
assert.equal(cards[4].querySelector('button').attributes['aria-pressed'], 'true');
console.log('PASS: 18 sourced video IDs, category counts, filtering and on-demand player/source selection.');

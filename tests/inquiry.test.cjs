const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function element() {
  return { value: '', textContent: '', firstChild: { textContent: '' }, dataset: {},
    listeners: {}, attributes: {}, classList: { toggle() {}, remove() {}, add() {} },
    addEventListener(name, fn) { this.listeners[name] = fn; },
    setAttribute(name, value) { this.attributes[name] = value; },
    getAttribute(name) { return this.attributes[name] ?? null; },
    removeAttribute(name) { delete this.attributes[name]; },
    querySelectorAll() { return []; }, scrollIntoView() {}, focus() {}, click() {}, remove() {} };
}
const nodes = new Map();
const materials = ['HDPE', 'PPR', 'PVC'].map(material => Object.assign(element(), { dataset: { material } }));
const get = selector => {
  if (!nodes.has(selector)) nodes.set(selector, element());
  return nodes.get(selector);
};
let downloadedBlob;
let downloadLink;
const data = new Map(Object.entries({ material: 'PVC', diameter: '110', name: 'Test Buyer', email: 'test@example.com', requirements: 'Two-layer pipe\nKeep this requirement.' }));
const context = {
  document: { querySelector: get, querySelectorAll: () => materials, listeners: {},
    addEventListener(name, fn) { this.listeners[name] = fn; }, body: { append(link) { downloadLink = link; } }, createElement: element },
  requestAnimationFrame: fn => fn(), matchMedia: () => ({ matches: true }),
  Blob, FormData: class { get(key) { return data.get(key); } },
  URL: { createObjectURL(blob) { downloadedBlob = blob; return 'blob:test'; }, revokeObjectURL() {} },
  setTimeout() {}
};
get('#inquiry-material').value = 'HDPE';
vm.runInNewContext(fs.readFileSync(require.resolve('../inquiry.js'), 'utf8'), context);
assert.equal(get('#inquiry-diameter').min, '16');
get('#inquiry-material').value = 'PPR';
get('#inquiry-material').listeners.change();
assert.equal(get('#inquiry-diameter').min, '1');
assert.equal(get('#inquiry-diameter').getAttribute('max'), null);
get('#inquiry-material').value = 'HDPE';
get('#inquiry-material').listeners.change();
vm.runInNewContext(fs.readFileSync(require.resolve('../app.js'), 'utf8'), context);
vm.runInNewContext(fs.readFileSync(require.resolve('../navigation.js'), 'utf8'), context);
get('.menu-toggle').listeners.click();
assert.equal(get('.menu-toggle').getAttribute('aria-expanded'), 'true');
context.document.listeners.keydown({ key: 'Escape' });
assert.equal(get('.menu-toggle').getAttribute('aria-expanded'), 'false');
assert.equal(get('#quick-material').value, 'HDPE');
assert.equal(get('#line-inquiry').href, 'pe-pipe-extrusion-line.html');
materials[1].listeners.click();
assert.equal(get('#line-inquiry').href, 'ppr-4-layer-co-extrusion-line.html');
assert.equal(get('#inquiry-material').value, 'PPR');
materials[0].listeners.click();
assert.equal(get('#inquiry-diameter').min, '16');
assert.equal(get('#inquiry-diameter').max, '1600');
materials[2].listeners.click();
assert.equal(get('#inquiry-material').value, 'PVC');
assert.equal(get('#line-title').textContent, 'PVC twin-screw extrusion');
assert.equal(get('#line-inquiry').href, 'pvc-pipe-extrusion-line.html');
assert.equal(get('#inquiry-diameter').getAttribute('max'), null);
get('#quick-diameter').value = '110';
get('#line-config').listeners.submit({ preventDefault() {} });
assert.equal(get('#inquiry-diameter').value, '110');
get('#inquiry-form').listeners.submit({ preventDefault() {} });
assert.equal(downloadLink.download, 'hd-extrusion-inquiry.txt');
downloadedBlob.text().then(text => {
  assert.match(text, /Pipe diameter \(mm\): 110/);
  assert.match(text, /Email: test@example.com/);
  assert.match(text, /Two-layer pipe\nKeep this requirement\./);
  assert.match(text, /This request has not been sent/);
  assert.match(get('#form-status').textContent, /has not been sent/);
  get('#inquiry-form').listeners.input();
  assert.equal(get('#form-status').textContent, '');
  console.log('PASS: shared navigation, material selection, diameter transfer, inquiry contents and honest download status.');
}).catch(error => { console.error(error); process.exitCode = 1; });

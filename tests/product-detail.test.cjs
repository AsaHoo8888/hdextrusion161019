const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function thumbnail(href) {
  const attributes = { 'aria-label': href };
  return {
    href, attributes,
    getAttribute: name => attributes[name],
    setAttribute: (name, value) => { attributes[name] = value; },
    removeAttribute: name => { delete attributes[name]; },
    addEventListener(type, fn) { this[type] = fn; }
  };
}

const links = [thumbnail('first.jpg'), thumbnail('second.jpg')];
const image = {}, caption = {};
const full = { querySelector: () => image };
const gallery = {
  querySelector: selector => selector === '.gallery-full' ? full : caption,
  querySelectorAll: () => links
};
const fields = new Map([['name', 'A & B'], ['email', 'buyer@example.com'], ['message', '20–110 mm\nA + B?']]);
const form = {
  dataset: { product: 'PPR & PPH' },
  addEventListener(type, fn) { this[type] = fn; }
};
const location = {};
vm.runInNewContext(fs.readFileSync(require.resolve('../product-detail.js'), 'utf8'), {
  document: { querySelector: s => s === '.equipment-gallery' ? gallery : form },
  window: { location }, FormData: class { get(key) { return fields.get(key); } }
});
const event = { preventDefault() {} };
links[1].click(event);
assert.equal(full.href, 'second.jpg');
assert.equal(image.src, full.href);
assert.equal(links[1].attributes['aria-current'], 'true');
assert.equal(caption.textContent, 'Photo 2 of 2');
form.submit(event);
const draft = new URL(location.href);
assert.equal(draft.pathname, 'sales@hdextrusion.com');
assert.equal(draft.searchParams.get('subject'), 'Inquiry: PPR & PPH');
for (const value of fields.values()) assert.ok(draft.searchParams.get('body').includes(value));
console.log('PASS: gallery selection and product inquiry draft encoding.');

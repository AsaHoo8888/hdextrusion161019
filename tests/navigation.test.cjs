const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const element = () => ({ listeners: {}, attributes: {}, classList: { remove() {}, toggle() {} },
  addEventListener(type, fn) { this.listeners[type] = fn; },
  setAttribute(key, value) { this.attributes[key] = value; },
  getAttribute(key) { return this.attributes[key]; }, focus() { this.focused = true; } });
const menu = element(), nav = element(), dropdown = element(), summary = element(), link = element();
nav.querySelectorAll = () => [link];
dropdown.querySelector = () => summary;
dropdown.contains = target => [dropdown, summary, link].includes(target);
const document = element();
document.querySelector = selector => ({ '.menu-toggle': menu, '#navigation': nav, '.nav-lines': dropdown })[selector];
vm.runInNewContext(fs.readFileSync(require.resolve('../navigation.js'), 'utf8'), { document });
menu.listeners.click();
dropdown.open = true;
document.listeners.keydown({ key: 'Escape' });
assert.equal(dropdown.open, false);
assert.equal(summary.focused, true);
assert.equal(menu.attributes['aria-expanded'], 'true');
document.listeners.keydown({ key: 'Escape' });
assert.equal(menu.attributes['aria-expanded'], 'false');
assert.equal(menu.focused, true);
dropdown.open = true;
document.listeners.click({ target: link });
assert.equal(dropdown.open, true);
document.listeners.click({ target: {} });
assert.equal(dropdown.open, false);
dropdown.open = true;
dropdown.listeners.focusout({ relatedTarget: {} });
assert.equal(dropdown.open, false);
menu.listeners.click(); dropdown.open = true; link.listeners.click();
assert.equal(dropdown.open, false);
assert.equal(menu.attributes['aria-expanded'], 'false');
const targets = ['pvc-pipe-extrusion-line.html', 'pe-pipe-extrusion-line.html', 'ppr-4-layer-co-extrusion-line.html'];
for (const file of fs.readdirSync('.').filter(file => file.endsWith('.html') && file !== 'contact.html')) {
  const html = fs.readFileSync(file, 'utf8');
  const panel = html.match(/<div class="nav-lines-panel">([\s\S]*?)<\/div>/)[1];
  for (const target of targets) assert.ok(panel.includes(`href="${target}"`), `${file}: ${target}`);
  if (targets.includes(file)) assert.ok(panel.includes(`href="${file}" aria-current="page"`));
}
console.log('PASS: all page links, current product, Escape focus, outside click, focus exit and mobile close.');

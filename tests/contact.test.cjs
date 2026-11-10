const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const page = fs.readFileSync('contact-us.html', 'utf8');
for (const href of ['mailto:sales@hdextrusion.com', 'tel:+8613601562675', 'https://api.whatsapp.com/send?phone=8613601562675']) {
  assert.ok(page.includes(`href="${href}"`), href);
}
assert.ok(!page.includes('not available on this site yet'));
assert.ok(page.includes('does not send your inquiry automatically'));
let destination;
const legacy = fs.readFileSync('contact.html', 'utf8');
vm.runInNewContext(legacy.match(/<script>(.*?)<\/script>/s)[1], {
  location: { search: '?source=test', hash: '#inquiry', replace(url) { destination = url; } }
});
assert.equal(destination, 'contact-us.html?source=test#inquiry');
for (const file of fs.readdirSync('.').filter(file => file.endsWith('.html') && file !== 'contact.html')) {
  assert.ok(!fs.readFileSync(file, 'utf8').includes('href="contact.html'), file);
}
console.log('PASS: contact links, form disclosure, legacy query/anchor redirect and updated callers.');

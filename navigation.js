const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const lineDropdown = document.querySelector('.nav-lines');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
  lineDropdown.open = false;
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (lineDropdown.open) {
    lineDropdown.open = false;
    lineDropdown.querySelector('summary').focus();
  } else if (menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
document.addEventListener('click', event => {
  if (!lineDropdown.contains(event.target)) lineDropdown.open = false;
});
lineDropdown.addEventListener('focusout', event => {
  if (event.relatedTarget && !lineDropdown.contains(event.relatedTarget)) lineDropdown.open = false;
});

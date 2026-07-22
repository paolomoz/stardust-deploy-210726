// add delayed functionality here

/* announcement banner dismiss — progressive enhancement on the default-content
   `banner` section style (the dismiss control is site behavior, not authored
   content; mirrors the prototype's dismissible strip) */
document.querySelectorAll('main .section.banner').forEach((section) => {
  const wrapper = section.querySelector('.default-content-wrapper') || section;
  if (wrapper.querySelector('.banner-dismiss')) return;
  const dismiss = document.createElement('button');
  dismiss.type = 'button';
  dismiss.className = 'banner-dismiss';
  dismiss.setAttribute('aria-label', 'Dismiss announcement');
  dismiss.textContent = '×';
  dismiss.addEventListener('click', () => section.remove());
  wrapper.append(dismiss);
});

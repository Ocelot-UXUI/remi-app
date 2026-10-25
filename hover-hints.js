(() => {
  const tip = document.createElement('div');
  tip.id = 'remi-hover-hint'; tip.className = 'remi-tooltip';
  tip.setAttribute('role', 'tooltip'); tip.hidden = true;
  document.body.appendChild(tip);
  let active = null, timer, previousDescription = null;
  const hide = () => {
    clearTimeout(timer);
    if (active) {
      if (previousDescription === null) active.removeAttribute('aria-describedby');
      else active.setAttribute('aria-describedby', previousDescription);
    }
    active = null; previousDescription = null;
    tip.classList.remove('is-visible'); tip.hidden = true;
  };
  const find = target => {
    if (!(target instanceof Element)) return null;
    const node = target.closest('[data-tooltip],button[aria-label],summary[aria-label],[role="button"][aria-label]');
    if (!node || node.closest('details[open] > summary')) return null;
    if (node.dataset.tooltip) return node;
    return !node.textContent.trim() ? node : null;
  };
  const show = node => {
    if (active === node) return;
    hide(); active = node;
    previousDescription = node.getAttribute('aria-describedby');
    timer = setTimeout(() => {
      if (!node.isConnected || !node.getClientRects().length) { hide(); return; }
      tip.textContent = node.dataset.tooltip || node.getAttribute('aria-label');
      tip.hidden = false;
      tip.classList.remove('is-below');
      const r = node.getBoundingClientRect(), t = tip.getBoundingClientRect();
      const left = Math.max(12, Math.min(r.left + r.width/2 - t.width/2, innerWidth - t.width - 12));
      const below = r.top < t.height + 18;
      const top = below ? r.bottom + 10 : r.top - t.height - 10;
      tip.style.left = left + 'px';
      tip.style.top = Math.max(8, Math.min(top, innerHeight - t.height - 8)) + 'px';
      tip.style.setProperty('--tip-x', Math.max(12, Math.min(r.left+r.width/2-left,t.width-12))+'px');
      tip.classList.toggle('is-below', below);
      node.setAttribute('aria-describedby', [previousDescription, tip.id].filter(Boolean).join(' '));
      tip.classList.add('is-visible');
    }, 280);
  };
  document.addEventListener('pointerover', e => { if(e.pointerType==='touch') return; const node=find(e.target); if(node) show(node); });
  document.addEventListener('pointerout', e => { if(active && !active.contains(e.relatedTarget)) hide(); });
  document.addEventListener('focusin', e => { const node=find(e.target); if(node && node.matches(':focus-visible')) show(node); });
  document.addEventListener('focusout', hide);
  document.addEventListener('pointerdown', e => {
    hide();
    document.querySelectorAll('.composer-output-picker[open],.composer-model-picker[open],.tw-model-picker[open]').forEach(picker => {
      if (!picker.contains(e.target)) picker.open = false;
    });
  }, true);
  document.addEventListener('keydown', e => { if(e.key==='Escape') hide(); });
  document.addEventListener('scroll', hide, true);
  window.addEventListener('resize', hide);
})();

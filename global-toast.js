(() => {
  let stack;
  const entries = [];
  const remove = (entry) => {
    clearTimeout(entry.timer);
    entry.element.remove();
    const index = entries.indexOf(entry);
    if (index !== -1) entries.splice(index, 1);
  };
  window.remiNotifyImportSuccess = (message = '文件导入成功') => {
    if (!stack) {
      stack = document.createElement('div');
      stack.className = 'remi-toast-stack';
      stack.setAttribute('role', 'status');
      stack.setAttribute('aria-live', 'polite');
      stack.setAttribute('aria-relevant', 'additions');
      document.body.append(stack);
    }
    if (entries.length >= 4) remove(entries[0]);
    const toast = document.createElement('div');
    toast.className = 'remi-global-toast';
    const icon = document.createElement('img');
    icon.src = 'assets/toast-success.svg'; icon.alt = ''; icon.width = 16; icon.height = 16;
    const label = document.createElement('span');
    label.textContent = message;
    toast.append(icon, label);
    stack.append(toast);
    const entry = {element: toast, timer: null};
    entries.push(entry);
    entry.timer = setTimeout(() => remove(entry), 3000);
    requestAnimationFrame(() => {
      const track = document.querySelector('.recent-resource-track');
      if (track) { track.scrollLeft = 0; track.closest('.activity-section')?.scrollIntoView({block:'nearest',behavior:'smooth'}); }
    });
  };
})();

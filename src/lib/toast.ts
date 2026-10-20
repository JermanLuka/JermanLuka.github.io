// Shows a short message in the toast that Layout.astro puts on every page. One
// message at a time: a new one replaces the old and restarts the timer.

let hideTimer: ReturnType<typeof setTimeout> | undefined;
let clearTimer: ReturnType<typeof setTimeout> | undefined;

export function showToast(message: string, duration = 2500) {
  const toast = document.querySelector<HTMLElement>('[data-toast]');
  const text = toast?.querySelector('[data-toast-text]');
  if (!toast || !text) return;

  clearTimeout(hideTimer);
  clearTimeout(clearTimer);
  text.textContent = message;
  toast.dataset.open = '';

  hideTimer = setTimeout(() => {
    delete toast.dataset.open;
    // Emptied once it has faded out, so a screen reader never finds a stale
    // message, and the same message shown again is announced again.
    clearTimer = setTimeout(() => (text.textContent = ''), 300);
  }, duration);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.alert').forEach(a => new bootstrap.Alert(a).close());
  }, 5000);
  const c = document.querySelector('input[name="card_number"]');
  if (c) c.addEventListener('input', e => {
    let v = e.target.value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    e.target.value = v.match(/.{1,4}/g)?.join(' ') || '';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.deps-tab');
  const deps = {
    ubuntu: document.getElementById('deps-ubuntu'),
    arch: document.getElementById('deps-arch'),
    fedora: document.getElementById('deps-fedora'),
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));

      Object.entries(deps).forEach(([key, el]) => {
        if (el) el.classList.add('hidden');
      });

      tab.classList.add('active');

      const distro = tab.dataset.distro;
      const target = deps[distro];
      if (target) target.classList.remove('hidden');
    });
  });
});

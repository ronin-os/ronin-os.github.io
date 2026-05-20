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

  const roadmap = document.querySelector('.roadmap');
  if (roadmap) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          roadmap.classList.add('roadmap-visible');
          observer.unobserve(roadmap);
        }
      });
    }, { threshold: 0.12 });

    observer.observe(roadmap);
  }
});

(() => {
  'use strict';
  const projects = [...document.querySelectorAll('[data-lightbox-src]')];
  const lightbox = document.querySelector('#galleryLightbox');
  const preview = lightbox?.querySelector('img');
  const counter = lightbox?.querySelector('.gallery-lightbox__counter');
  let index = 0;

  const show = nextIndex => {
    index = (nextIndex + projects.length) % projects.length;
    const project = projects[index];
    preview.src = project.dataset.lightboxSrc;
    preview.alt = project.dataset.lightboxAlt || '';
    counter.textContent = `${index + 1} / ${projects.length}`;
  };
  const close = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gallery-lightbox-open');
  };

  if (lightbox && preview && counter && projects.length) {
    projects.forEach((project, projectIndex) => project.addEventListener('click', () => {
      show(projectIndex);
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('gallery-lightbox-open');
      lightbox.querySelector('.gallery-lightbox__close').focus();
    }));
    lightbox.querySelector('.gallery-lightbox__close').addEventListener('click', close);
    lightbox.querySelector('.gallery-lightbox__previous').addEventListener('click', () => show(index - 1));
    lightbox.querySelector('.gallery-lightbox__next').addEventListener('click', () => show(index + 1));
    lightbox.addEventListener('click', event => { if (event.target === lightbox) close(); });
    document.addEventListener('keydown', event => {
      if (!lightbox.classList.contains('is-open')) return;
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowLeft') show(index - 1);
      if (event.key === 'ArrowRight') show(index + 1);
    });
  }

  const previewImage = document.querySelector('#galleryTintPreview');
  document.querySelectorAll('[data-shade-src]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-shade-src]').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    previewImage.src = button.dataset.shadeSrc;
    previewImage.alt = button.dataset.shadeAlt;
  }));
})();

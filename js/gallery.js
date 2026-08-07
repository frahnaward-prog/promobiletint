(() => {
  'use strict';

  const qs = selector => document.querySelector(selector);
  const qsa = selector => Array.from(document.querySelectorAll(selector));

  const createGalleryLightbox = () => {
    const galleryImages = qsa('.gallery-grid img');
    if (!galleryImages.length) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML = `
      <span class="close-lightbox" aria-label="Close gallery">&times;</span>
      <button class="lightbox-prev" type="button" aria-label="Previous image">&#10094;</button>
      <img src="" alt="Gallery Image">
      <button class="lightbox-next" type="button" aria-label="Next image">&#10095;</button>
      <div class="lightbox-counter"></div>
    `;

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('img');
    const closeButton = lightbox.querySelector('.close-lightbox');
    const prevButton = lightbox.querySelector('.lightbox-prev');
    const nextButton = lightbox.querySelector('.lightbox-next');
    const counter = lightbox.querySelector('.lightbox-counter');

    if (!(lightboxImage && closeButton && prevButton && nextButton && counter)) return;

    let currentIndex = 0;

    const updateLightbox = index => {
      currentIndex = (index + galleryImages.length) % galleryImages.length;
      const sourceImage = galleryImages[currentIndex];
      lightboxImage.src = sourceImage.src;
      lightboxImage.alt = sourceImage.alt || sourceImage.dataset.alt || 'Gallery image';
      counter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    };

    galleryImages.forEach((image, index) => {
      image.style.cursor = 'zoom-in';
      image.addEventListener('click', () => updateLightbox(index));
    });

    closeButton.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', event => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    prevButton.addEventListener('click', event => {
      event.stopPropagation();
      updateLightbox(currentIndex - 1);
    });

    nextButton.addEventListener('click', event => {
      event.stopPropagation();
      updateLightbox(currentIndex + 1);
    });

    document.addEventListener('keydown', event => {
      if (lightbox.style.display !== 'flex') return;
      if (event.key === 'Escape') {
        closeLightbox();
      } else if (event.key === 'ArrowLeft') {
        updateLightbox(currentIndex - 1);
      } else if (event.key === 'ArrowRight') {
        updateLightbox(currentIndex + 1);
      }
    });
  };

  const initialize = () => {
    createGalleryLightbox();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }
})();

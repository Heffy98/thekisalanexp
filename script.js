const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.site-nav');

requestAnimationFrame(() => document.body.classList.add('loaded'));

function closeMenu() {
  menuButton?.classList.remove('active');
  nav?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuButton?.addEventListener('click', () => {
  const opening = !nav.classList.contains('open');
  menuButton.classList.toggle('active', opening);
  nav.classList.toggle('open', opening);
  menuButton.setAttribute('aria-expanded', String(opening));
  document.body.style.overflow = opening ? 'hidden' : '';
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const modal = document.querySelector('#song-modal');
const serviceModal = document.querySelector('#service-modal');
const serviceTitle = document.querySelector('#service-title');
const serviceDescription = document.querySelector('#service-description');
const serviceArt = document.querySelector('[data-service-art]');
const serviceImage = document.querySelector('img[data-service-image]');
const serviceComing = document.querySelector('[data-service-coming]');
const galleryControls = document.querySelector('[data-service-gallery-controls]');
const galleryCount = document.querySelector('[data-gallery-count]');
const galleryDots = document.querySelector('[data-gallery-dots]');
const galleryPrev = document.querySelector('[data-gallery-prev]');
const galleryNext = document.querySelector('[data-gallery-next]');

let serviceGallery = [];
let serviceGalleryIndex = 0;

const splitServiceList = (value = '') => value.split('|').map((item) => item.trim()).filter(Boolean);

const renderServiceGallery = () => {
  const hasImages = serviceGallery.length > 0;
  const activeImage = serviceGallery[serviceGalleryIndex];

  serviceArt?.classList.toggle('has-image', hasImages);

  if (serviceImage) {
    serviceImage.hidden = !hasImages;
    serviceImage.src = activeImage?.src || '';
    serviceImage.alt = activeImage?.alt || '';
  }

  if (serviceComing) serviceComing.hidden = hasImages;
  if (galleryControls) galleryControls.hidden = serviceGallery.length <= 1;
  if (galleryCount) galleryCount.textContent = hasImages ? `${serviceGalleryIndex + 1} / ${serviceGallery.length}` : '1 / 1';

  if (galleryDots) {
    galleryDots.hidden = serviceGallery.length <= 1;
    galleryDots.replaceChildren();

    serviceGallery.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Show preview photo ${index + 1}`);
      dot.setAttribute('aria-current', index === serviceGalleryIndex ? 'true' : 'false');
      dot.addEventListener('click', () => {
        serviceGalleryIndex = index;
        renderServiceGallery();
      });
      galleryDots.append(dot);
    });
  }
};

const stepServiceGallery = (direction) => {
  if (serviceGallery.length <= 1) return;
  serviceGalleryIndex = (serviceGalleryIndex + direction + serviceGallery.length) % serviceGallery.length;
  renderServiceGallery();
};

document.querySelector('[data-modal-open]')?.addEventListener('click', () => modal?.showModal());
document.querySelectorAll('[data-modal-close]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});
document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelectorAll('[data-service-open]').forEach((card) => {
  card.addEventListener('click', () => {
    if (serviceTitle) serviceTitle.textContent = card.dataset.serviceTitle || 'Coming soon';
    if (serviceDescription) serviceDescription.textContent = card.dataset.serviceCopy || 'Workshop and example details are coming soon.';

    const images = splitServiceList(card.dataset.serviceImages || card.dataset.serviceImage);
    const alts = splitServiceList(card.dataset.serviceAlts || card.dataset.serviceImageAlt);
    serviceGallery = images.map((src, index) => ({ src, alt: alts[index] || card.dataset.serviceTitle || 'Preview photo' }));
    serviceGalleryIndex = 0;
    renderServiceGallery();

    serviceModal?.showModal();
  });
});

galleryPrev?.addEventListener('click', () => stepServiceGallery(-1));
galleryNext?.addEventListener('click', () => stepServiceGallery(1));

const channelPlayer = document.querySelector('[data-channel-player]');
const channelChoices = document.querySelectorAll('[data-channel-choice]');

channelChoices.forEach((choice) => {
  choice.addEventListener('click', () => {
    const selection = choice.dataset.channelChoice;
    channelPlayer.src = `https://www.youtube-nocookie.com/embed/${selection}?autoplay=1&rel=0&playsinline=1`;

    channelChoices.forEach((item) => {
      const active = item === choice;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });

    channelPlayer.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'center'
    });
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();

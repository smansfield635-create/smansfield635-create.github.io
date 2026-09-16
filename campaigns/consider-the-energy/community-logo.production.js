const mount = document.querySelector('[data-community-lifecycle-mount]');

if (mount) {
  fetch('./community-image-source.txt', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`IMAGE_SOURCE_HTTP_${response.status}`);
      return response.text();
    })
    .then((source) => {
      const image = document.createElement('img');
      image.src = source.trim();
      image.alt = 'Consider the Energy tree emblem';
      image.decoding = 'async';
      image.loading = 'eager';
      image.style.display = 'block';
      image.style.width = '100%';
      image.style.height = '100%';
      image.style.maxHeight = '36rem';
      image.style.objectFit = 'contain';
      image.style.objectPosition = 'center';
      image.style.background = '#000';
      mount.classList.add('campaign-hero__media--native');
      mount.replaceChildren(image);
    })
    .catch((error) => {
      console.error('COMMUNITY_IMAGE_LOAD_FAILED', error);
    });
}

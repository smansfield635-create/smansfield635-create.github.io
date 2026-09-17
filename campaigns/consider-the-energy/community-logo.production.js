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
      image.style.height = 'auto';
      image.style.maxHeight = 'none';
      image.style.objectFit = 'contain';
      image.style.objectPosition = 'center';
      image.style.background = 'transparent';

      mount.classList.add('campaign-hero__media--native');
      mount.style.minHeight = '0';
      mount.style.margin = '0';
      mount.style.padding = '0';
      mount.style.background = 'none';
      mount.style.borderLeft = '0';
      mount.style.alignSelf = 'center';
      mount.replaceChildren(image);
    })
    .catch((error) => {
      console.error('COMMUNITY_IMAGE_LOAD_FAILED', error);
    });
}
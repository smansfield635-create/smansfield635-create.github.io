const CONTRACT = Object.freeze({
  id: 'DGB_COMMUNITY_CENTERED_LOGO_STAGE_V1',
  object: 'CONSIDER_THE_ENERGY_CENTERED_LOGO_STAGE',
  medium: 'EXISTING_REPOSITORY_ASSET',
  source: '/campaigns/assets/consider-energy-symbolic.svg',
  motion: 'NONE',
  canvas: false,
  webgl: false,
  stage: 'REDUCED'
});

const root = document.querySelector('[data-community-lifecycle-mount]');
if (root) queueMicrotask(() => mount(root));

function mount(host) {
  const doc = host.ownerDocument || document;

  if (!doc.querySelector('style[data-community-logo-stage-style]')) {
    const style = doc.createElement('style');
    style.dataset.communityLogoStageStyle = 'true';
    style.textContent = `
      [data-community-lifecycle-mount] {
        min-height: 18rem !important;
        padding: .75rem !important;
        background:
          radial-gradient(circle at 50% 48%, rgba(77, 224, 225, .10), transparent 48%),
          rgba(1, 5, 13, .72) !important;
      }
      .community-logo-stage {
        display: grid;
        width: 100%;
        min-height: 16.5rem;
        place-items: center;
        overflow: hidden;
      }
      .community-logo-stage__mark {
        display: block !important;
        width: min(48%, 11rem) !important;
        height: auto !important;
        max-height: 16.5rem !important;
        object-fit: contain !important;
        filter: drop-shadow(0 .9rem 1.6rem rgba(0, 0, 0, .48));
      }
      @media (max-width: 900px) {
        [data-community-lifecycle-mount] {
          min-height: 17rem !important;
          padding: .65rem !important;
        }
        .community-logo-stage {
          min-height: 15.5rem;
        }
        .community-logo-stage__mark {
          width: min(44%, 10.5rem) !important;
          max-height: 15.75rem !important;
        }
      }
      @media (max-width: 560px) {
        [data-community-lifecycle-mount] {
          min-height: 15.5rem !important;
          padding: .5rem !important;
        }
        .community-logo-stage {
          min-height: 14rem;
        }
        .community-logo-stage__mark {
          width: min(52%, 9.25rem) !important;
          max-height: 13.9rem !important;
        }
      }
    `;
    doc.head.append(style);
  }

  const stage = doc.createElement('div');
  stage.className = 'community-logo-stage';

  const logo = doc.createElement('img');
  logo.className = 'community-logo-stage__mark';
  logo.src = CONTRACT.source;
  logo.alt = 'Consider the Energy tree and roots logo';
  logo.decoding = 'async';
  logo.loading = 'eager';

  stage.append(logo);
  host.replaceChildren(stage);
  host.dataset.communityLogoStage = 'ready';
  host.dataset.lifecycleStatus = 'ready';

  globalThis.DGB_COMMUNITY_LOGO_STAGE_RECEIPT = Object.freeze({
    contract: CONTRACT,
    centered: true,
    reducedStage: true,
    source: CONTRACT.source
  });
}

export { CONTRACT as DGB_COMMUNITY_LOGO_STAGE_CONTRACT };

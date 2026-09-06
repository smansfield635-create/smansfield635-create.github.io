export const COMPASS_MASTER_CONTEXT_ID = 'COMPASS_SINGLE_MASTER_SHOT_AWARE_CONTEXT_v1';

const freeze = (value) => Object.freeze(value);
const beat = (primary, secondary, desktopPlacement, phonePlacement = desktopPlacement) => freeze({
  primary, secondary, desktopPlacement, phonePlacement
});

const STATIC_CONTEXT = freeze({
  S01: beat('Diamond Gate Bridge', 'Interactive experience & research studio', 'left-low'),
  S02: beat('Find your way.', 'The Compass orients the experience.', 'left-low'),
  S03: beat('Start here.', 'Chapter One is the guided introduction.', 'right-high', 'right-mid'),
  S05: beat('Cross into Mirrorland.', 'Enter the narrative world.', 'right-high', 'right-mid'),
  S06: beat('Enter Audralia.', 'Explore a continuous planetary world.', 'left-high', 'left-mid'),
  S08: beat('Now choose your path.', 'Use the Compass to choose where to go.', 'center-low')
});

const S04_RESEARCH = beat("See what we're testing.", 'Research remains bounded to the evidence shown.', 'left-high', 'left-mid');
const S04_READINESS = beat("See what's ready.", 'Readiness keeps the claim boundary visible.', 'right-high', 'right-mid');
const S07_BRAIN = beat('Discover your Coherence Index.', 'Take a free coherence assessment.', 'right-high', 'right-mid');
const S07_TROPHY = beat('Enter the Awards Chamber.', 'See the work recognized — and why.', 'left-low');
const S07_HOUSE = beat('Meet the characters.', 'Choose who you want to speak with.', 'left-high', 'left-mid');

export const COMPASS_MASTER_CONTEXT_BINDING = freeze({
  clockAuthority: 'EXISTING_38000MS_MASTER_CLOCK_ONLY',
  secondClock: false,
  applicationState: false,
  destinationAuthority: false,
  fixedLowerThird: false,
  s07ActiveObjectThresholdsMs: freeze({ brainToTrophy: 31500, trophyToHouse: 32750 }),
  sourceSemantics: 'ISSUE_2756_STORYBOARD_V2'
});

function placementFor(context, viewportWidth) {
  return viewportWidth <= 700 ? context.phonePlacement : context.desktopPlacement;
}

export function resolveMasterContext({ shotId, elapsedMs = 0, shotProgress = 0, viewportWidth = 1280 } = {}) {
  let context = STATIC_CONTEXT[shotId] || null;
  if (shotId === 'S04') context = shotProgress < .52 ? S04_RESEARCH : S04_READINESS;
  if (shotId === 'S07') {
    context = elapsedMs < 31500 ? S07_BRAIN : elapsedMs < 32750 ? S07_TROPHY : S07_HOUSE;
  }
  if (!context) return null;
  return freeze({
    id: COMPASS_MASTER_CONTEXT_ID,
    shotId,
    primary: context.primary,
    secondary: context.secondary,
    placement: placementFor(context, viewportWidth),
    viewportClass: viewportWidth <= 700 ? 'PHONE' : 'TABLET_DESKTOP',
    elapsedMs,
    shotProgress,
    secondClockCreated: false
  });
}

export const COMPASS_MASTER_CONTEXT_SEQUENCE = freeze([
  freeze({ shotId: 'S01', ...STATIC_CONTEXT.S01 }),
  freeze({ shotId: 'S02', ...STATIC_CONTEXT.S02 }),
  freeze({ shotId: 'S03', ...STATIC_CONTEXT.S03 }),
  freeze({ shotId: 'S04', phases: freeze([S04_RESEARCH, S04_READINESS]) }),
  freeze({ shotId: 'S05', ...STATIC_CONTEXT.S05 }),
  freeze({ shotId: 'S06', ...STATIC_CONTEXT.S06 }),
  freeze({ shotId: 'S07', phases: freeze([S07_BRAIN, S07_TROPHY, S07_HOUSE]) }),
  freeze({ shotId: 'S08', ...STATIC_CONTEXT.S08 })
]);

import fs from 'node:fs';
import { chromium } from 'playwright';

const baseUrl =
  process.env.H_EARTH_TEST_BASE_URL ??
  'http://127.0.0.1:4173/showroom/globe/h-earth/';

async function getRuntimeState(page) {
  return page.evaluate(async () => {
    const compositor =
      await import('./compositor.js');

    const renderer =
      await import('./renderer.js');

    return {
      camera:
        compositor
          .getHEarth3DCompositorState()
          .camera,

      revisions:
        compositor
          .getHEarth3DCompositorState()
          .revisions,

      renderer:
        renderer
          .getHEarth3DRendererState(),

      routeStatus:
        document
          .getElementById(
            'h-earth-3d-status'
          )
          ?.textContent
          ?.trim() ??
        null,

      controls:
        document
          .getElementById(
            'h-earth-3d-renderer-mount'
          )
          ?.dataset
          ?.hEarthTouchCameraControls ??
        null,

      gestureRevision:
        document
          .getElementById(
            'h-earth-3d-route-root'
          )
          ?.dataset
          ?.hEarthTouchCameraGestureRevision ??
        null,

      controlReceipt:
        globalThis
          .H_EARTH_3D_TOUCH_CAMERA_CONTROL_RECEIPT ??
        null,

      lastGestureReceipt:
        globalThis
          .H_EARTH_3D_TOUCH_CAMERA_LAST_RECEIPT ??
        null
    };
  });
}

async function openRoute(browser, profile) {
  const context =
    await browser.newContext(
      profile.context
    );

  const page =
    await context.newPage();

  await page.goto(
    baseUrl,
    {
      waitUntil: 'networkidle',
      timeout: 120000
    }
  );

  await page.waitForSelector(
    '#h-earth-3d-renderer-mount .h-earth-3d-render-stage',
    {
      state: 'attached',
      timeout: 120000
    }
  );

  await page.waitForFunction(() =>
    document
      .getElementById(
        'h-earth-3d-status'
      )
      ?.textContent
      ?.includes(
        'PUBLIC_STAGE_RENDERER_MOUNTED'
      )
  );

  await page.waitForFunction(() =>
    document
      .getElementById(
        'h-earth-3d-renderer-mount'
      )
      ?.dataset
      ?.hEarthTouchCameraControls ===
      'active'
  );

  return {
    context,
    page
  };
}

async function dispatchTouchSequence(
  page,
  sequence
) {
  await page.evaluate(
    (events) => {
      const target =
        document.getElementById(
          'h-earth-3d-renderer-mount'
        );

      const rectangle =
        target.getBoundingClientRect();

      for (const event of events) {
        target.dispatchEvent(
          new PointerEvent(
            event.type,
            {
              bubbles: true,
              cancelable: true,
              pointerId:
                event.pointerId,
              pointerType:
                'touch',
              isPrimary:
                event.isPrimary ===
                true,
              button:
                event.type ===
                'pointerdown'
                  ? 0
                  : -1,
              buttons:
                event.type ===
                'pointerup'
                  ? 0
                  : 1,
              clientX:
                rectangle.left +
                event.x,
              clientY:
                rectangle.top +
                event.y
            }
          )
        );
      }
    },
    sequence
  );
}

const outputDirectory =
  process.env
    .H_EARTH_TOUCH_CAMERA_ARTIFACT_DIR ??
  'artifacts/h-earth-touch-camera';

fs.mkdirSync(
  outputDirectory,
  {
    recursive: true
  }
);

const browser =
  await chromium.launch({
    headless: true
  });

const evidence = {
  result: 'PASS',
  baseUrl,
  profiles: []
};

try {
  {
    const profile = {
      id:
        'mobile-touch',
      context: {
        viewport: {
          width: 390,
          height: 844
        },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true
      }
    };

    const {
      context,
      page
    } =
      await openRoute(
        browser,
        profile
      );

    const mount =
      page.locator(
        '#h-earth-3d-renderer-mount'
      );

    await mount
      .scrollIntoViewIfNeeded();

    const initial =
      await getRuntimeState(page);

    await dispatchTouchSequence(
      page,
      [
        {
          type: 'pointerdown',
          pointerId: 11,
          x: 150,
          y: 240,
          isPrimary: true
        },
        {
          type: 'pointermove',
          pointerId: 11,
          x: 95,
          y: 265,
          isPrimary: true
        },
        {
          type: 'pointerup',
          pointerId: 11,
          x: 95,
          y: 265,
          isPrimary: true
        }
      ]
    );

    await page.waitForTimeout(650);

    const afterOrbit =
      await getRuntimeState(page);

    if (
      afterOrbit.camera.yawDegrees ===
        initial.camera.yawDegrees &&
      afterOrbit.camera.pitchDegrees ===
        initial.camera.pitchDegrees
    ) {
      throw new Error(
        'ONE_POINTER_ORBIT_DID_NOT_CHANGE_CAMERA'
      );
    }

    await dispatchTouchSequence(
      page,
      [
        {
          type: 'pointerdown',
          pointerId: 21,
          x: 95,
          y: 260,
          isPrimary: true
        },
        {
          type: 'pointerdown',
          pointerId: 22,
          x: 295,
          y: 260,
          isPrimary: false
        },
        {
          type: 'pointermove',
          pointerId: 21,
          x: 145,
          y: 260,
          isPrimary: true
        },
        {
          type: 'pointermove',
          pointerId: 22,
          x: 245,
          y: 260,
          isPrimary: false
        },
        {
          type: 'pointerup',
          pointerId: 21,
          x: 145,
          y: 260,
          isPrimary: true
        },
        {
          type: 'pointerup',
          pointerId: 22,
          x: 245,
          y: 260,
          isPrimary: false
        }
      ]
    );

    await page.waitForTimeout(750);

    const afterPinch =
      await getRuntimeState(page);

    if (
      !(
        afterPinch.camera.zoomScale >
        afterOrbit.camera.zoomScale
      )
    ) {
      throw new Error(
        `PINCH_IN_DID_NOT_ZOOM_OUT:${
          afterOrbit.camera.zoomScale
        }:${
          afterPinch.camera.zoomScale
        }`
      );
    }

    if (
      afterPinch.renderer.mounted !==
        true ||
      afterPinch.renderer.applySequence <
        2 ||
      afterPinch.renderer
        .semanticLayerContainerCount !==
        15 ||
      afterPinch.renderer
        .interactionNodeCount !==
        1 ||
      afterPinch.routeStatus !==
        'PUBLIC_STAGE_RENDERER_MOUNTED' ||
      afterPinch.controls !==
        'active'
    ) {
      throw new Error(
        `MOBILE_RUNTIME_INVARIANT_FAILED:${
          JSON.stringify(
            afterPinch
          )
        }`
      );
    }

    const screenshotPath =
      `${outputDirectory}/mobile-after-pinch.png`;

    await page.screenshot({
      path:
        screenshotPath,
      fullPage: true
    });

    evidence.profiles.push({
      profile,
      initial,
      afterOrbit,
      afterPinch,
      screenshotPath
    });

    await context.close();
  }

  {
    const profile = {
      id:
        'desktop-pointer',
      context: {
        viewport: {
          width: 1440,
          height: 900
        },
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false
      }
    };

    const {
      context,
      page
    } =
      await openRoute(
        browser,
        profile
      );

    const mount =
      page.locator(
        '#h-earth-3d-renderer-mount'
      );

    await mount
      .scrollIntoViewIfNeeded();

    const box =
      await mount.boundingBox();

    if (!box) {
      throw new Error(
        'DESKTOP_RENDERER_MOUNT_BOX_MISSING'
      );
    }

    const initial =
      await getRuntimeState(page);

    await page.mouse.move(
      box.x +
        box.width *
        0.5,
      box.y +
        box.height *
        0.5
    );

    await page.mouse.down();

    await page.mouse.move(
      box.x +
        box.width *
        0.62,
      box.y +
        box.height *
        0.56,
      {
        steps: 5
      }
    );

    await page.mouse.up();

    await page.waitForTimeout(750);

    const afterOrbit =
      await getRuntimeState(page);

    if (
      afterOrbit.camera.yawDegrees ===
        initial.camera.yawDegrees &&
      afterOrbit.camera.pitchDegrees ===
        initial.camera.pitchDegrees
    ) {
      throw new Error(
        'DESKTOP_POINTER_ORBIT_DID_NOT_CHANGE_CAMERA'
      );
    }

    if (
      afterOrbit.renderer.mounted !==
        true ||
      afterOrbit.renderer.applySequence <
        1 ||
      afterOrbit.routeStatus !==
        'PUBLIC_STAGE_RENDERER_MOUNTED' ||
      afterOrbit.controls !==
        'active'
    ) {
      throw new Error(
        `DESKTOP_RUNTIME_INVARIANT_FAILED:${
          JSON.stringify(
            afterOrbit
          )
        }`
      );
    }

    const screenshotPath =
      `${outputDirectory}/desktop-after-drag.png`;

    await page.screenshot({
      path:
        screenshotPath,
      fullPage: true
    });

    evidence.profiles.push({
      profile,
      initial,
      afterOrbit,
      screenshotPath
    });

    await context.close();
  }
} finally {
  await browser.close();
}

fs.writeFileSync(
  `${outputDirectory}/interaction-evidence.json`,
  JSON.stringify(
    evidence,
    null,
    2
  ) + '\n'
);

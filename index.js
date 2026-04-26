/*
  Diamond Gate Bridge — Root Door Boot
  File: /index.js
  Generation: 1
  Baseline: Root Door Seasonal Solar Baseline 1
  Role: safe boot handoff and visible-page protection.
*/

(function () {
  "use strict";

  var RUNTIME_PATH = "/runtime/index_runtime.js";
  var RUNTIME_NAME = "DGBIndexRuntime";
  var bootState = {
    pageVisible: false,
    runtimeRequested: false,
    runtimeLoaded: false,
    runtimeFailed: false
  };

  function getDoorRoot() {
    return document.getElementById("door-root");
  }

  function setStatus(text) {
    var node = document.querySelector("[data-door-boot-status]");
    if (node) node.textContent = text;
  }

  function protectVisibleDoor() {
    var root = getDoorRoot();

    if (!root || root.textContent.trim().length < 80) {
      document.body.innerHTML =
        '<main id="door-root" style="min-height:100vh;padding:24px;background:#02040b;color:#fff8e7;font-family:system-ui,sans-serif;">' +
        '<p style="margin:0 0 10px;color:rgba(255,217,138,.78);letter-spacing:.16em;text-transform:uppercase;font-size:12px;">Visible-first fallback</p>' +
        '<h1 style="font-size:clamp(44px,12vw,88px);line-height:.88;letter-spacing:-.08em;margin:0;">Diamond Gate Bridge</h1>' +
        '<p style="font-size:clamp(24px,7vw,48px);line-height:.95;letter-spacing:-.06em;margin:18px 0 0;color:#fff8e7;">Learn to Live to Love</p>' +
        '<p style="max-width:620px;color:rgba(255,248,231,.72);line-height:1.55;margin:18px 0 0;">The root door fallback is active. The page remains visible even if runtime enhancement fails.</p>' +
        '<nav style="display:flex;flex-wrap:wrap;gap:10px;margin-top:24px;">' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/products/">Products</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/gauges/">Gauges</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/laws/">Laws</a>' +
        '<a style="color:#fff8e7;border:1px solid rgba(255,248,231,.24);border-radius:999px;padding:11px 14px;text-decoration:none;" href="/governance/">Governance</a>' +
        '</nav>' +
        '</main>';

      setStatus("Fallback door active");
      return false;
    }

    bootState.pageVisible = true;
    return true;
  }

  function loadRuntime() {
    if (bootState.runtimeRequested || window[RUNTIME_NAME]) return;

    bootState.runtimeRequested = true;
    setStatus("Seasonal door runtime loading");

    var script = document.createElement("script");
    script.src = RUNTIME_PATH;
    script.defer = true;

    script.onload = function () {
      bootState.runtimeLoaded = true;
      setStatus("Seasonal door runtime active");

      if (window[RUNTIME_NAME] && typeof window[RUNTIME_NAME].start === "function") {
        window[RUNTIME_NAME].start();
      }
    };

    script.onerror = function () {
      bootState.runtimeFailed = true;
      setStatus("Static seasonal door active");
    };

    document.body.appendChild(script);
  }

  function boot() {
    var visible = protectVisibleDoor();
    if (!visible) return;

    setStatus("Visible-first door active");
    loadRuntime();

    window.setTimeout(protectVisibleDoor, 500);
    window.setTimeout(protectVisibleDoor, 1600);
  }

  window.DGBIndexBoot = Object.freeze({
    getState: function () {
      return {
        pageVisible: bootState.pageVisible,
        runtimeRequested: bootState.runtimeRequested,
        runtimeLoaded: bootState.runtimeLoaded,
        runtimeFailed: bootState.runtimeFailed
      };
    },
    protectVisibleDoor: protectVisibleDoor
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();

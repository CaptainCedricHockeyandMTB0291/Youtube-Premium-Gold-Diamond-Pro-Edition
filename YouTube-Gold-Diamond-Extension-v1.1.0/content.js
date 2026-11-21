(() => {
  "use strict";

  const DEFAULTS = { enabled: true };
  const PANEL_CLASS = "gdp-ad-panel";
  const HOST_CLASS = "gdp-ad-panel-host";
  const LOGO_URL = chrome.runtime.getURL("assets/gold-diamond-logo-v223.svg");

  // Target only YouTube ad-specific containers; never ordinary recommendation renderers.
  const AD_SELECTORS = [
    "ytd-ad-slot-renderer",
    "ytd-in-feed-ad-layout-renderer",
    "ytd-display-ad-renderer",
    "ytd-promoted-sparkles-web-renderer",
    "ytd-banner-promo-renderer"
  ];

  let enabled = true;
  let observer = null;
  let queued = false;

  function visible(element) {
    if (!(element instanceof Element)) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number(style.opacity) !== 0 &&
      rect.width > 0 && rect.height > 0;
  }

  function hasAdCreative(container) {
    // Leave populated ad units untouched.
    const creativeSelectors = [
      "iframe", "video", "img", "yt-image", "ytd-thumbnail",
      "a#thumbnail", "#video-title",
      "ytd-promoted-sparkles-text-search-renderer",
      "button", "tp-yt-paper-button"
    ];

    for (const selector of creativeSelectors) {
      for (const node of container.querySelectorAll(selector)) {
        if (visible(node)) return true;
      }
    }

    const text = (container.innerText || container.textContent || "")
      .replace(/\s+/g, " ").trim();
    return text.length > 24;
  }

  function buildPanel() {
    const panel = document.createElement("div");
    panel.className = PANEL_CLASS;
    panel.setAttribute("role", "note");
    panel.setAttribute("aria-label", "Gold Diamond Edition decorative panel");

    const logo = document.createElement("img");
    logo.className = "gdp-ad-logo";
    logo.src = LOGO_URL;
    logo.alt = "Premium — Gold Diamond Edition";
    logo.draggable = false;

    const line = document.createElement("div");
    line.className = "gdp-ad-line";

    const label = document.createElement("div");
    label.className = "gdp-ad-label";
    label.textContent = "YOUTUBE PREMIUM";

    const subline = document.createElement("div");
    subline.className = "gdp-ad-subline";
    subline.textContent = "GOLD DIAMOND PRO EDITION";

    panel.append(logo, line, label, subline);
    return panel;
  }

  function decorate(container) {
    if (!(container instanceof HTMLElement)) return;
    if (container.dataset.gdpPanelAdded === "true") return;
    if (container.querySelector(`:scope > .${PANEL_CLASS}`)) return;
    if (hasAdCreative(container)) return;

    container.classList.add(HOST_CLASS);
    container.dataset.gdpPanelAdded = "true";
    container.appendChild(buildPanel());
  }

  function scan(root = document) {
    if (!enabled || !root) return;
    for (const selector of AD_SELECTORS) {
      if (root instanceof Element && root.matches(selector)) decorate(root);
      if (typeof root.querySelectorAll === "function") {
        root.querySelectorAll(selector).forEach(decorate);
      }
    }
  }

  function scheduleScan() {
    if (queued || !enabled) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      scan(document);
    });
  }

  function start() {
    if (observer) observer.disconnect();
    scan(document);
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) scan(node);
        }
      }
      scheduleScan();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  function stop() {
    if (observer) observer.disconnect();
    document.querySelectorAll(`.${PANEL_CLASS}`).forEach(node => node.remove());
    document.querySelectorAll(`.${HOST_CLASS}`).forEach(node => {
      node.classList.remove(HOST_CLASS);
      delete node.dataset.gdpPanelAdded;
    });
  }

  chrome.storage.sync.get(DEFAULTS, (settings) => {
    enabled = settings.enabled !== false;
    if (enabled) start();
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" || !changes.enabled) return;
    enabled = changes.enabled.newValue !== false;
    if (enabled) start();
    else stop();
  });

  document.addEventListener("yt-navigate-finish", () => {
    if (enabled) scheduleScan();
  });
})();
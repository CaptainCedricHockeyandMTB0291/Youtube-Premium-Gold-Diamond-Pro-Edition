(() => {
  "use strict";

  const DEFAULTS = { logo: true, goldTheme: true, cinema: false, speed: 1 };
  const LOGO_URL = chrome.runtime.getURL("assets/gold-diamond-logo.svg");
  const STYLE_ID = "gold-diamond-pro-styles";
  const originalLogoNodes = new WeakMap();
  let settings = { ...DEFAULTS };

  function addStyles() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      html.gdp-gold-theme ytd-masthead,
      html.gdp-gold-theme #masthead-container {
        border-bottom: 1px solid rgba(218,174,77,.55) !important;
        box-shadow: 0 2px 16px rgba(218,174,77,.10) !important;
      }
      html.gdp-cinema-mode ytd-watch-flexy #secondary,
      html.gdp-cinema-mode ytd-watch-flexy #related {
        display: none !important;
      }
      html.gdp-cinema-mode ytd-watch-flexy #primary {
        max-width: 100% !important;
      }
      .gdp-logo-image {
        display:block !important;
        width:40px !important;
        height:32px !important;
        object-fit:contain !important;
        flex:0 0 auto !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function updateLogo() {
    const targets = document.querySelectorAll(
      "ytd-topbar-logo-renderer #logo-icon, ytd-masthead #logo-icon"
    );

    targets.forEach((target) => {
      if (settings.logo) {
        if (target.dataset.gdpLogoApplied === "true") return;
        originalLogoNodes.set(target, Array.from(target.childNodes).map(node => node.cloneNode(true)));
        const image = document.createElement("img");
        image.className = "gdp-logo-image";
        image.src = LOGO_URL;
        image.alt = "Gold Diamond Pro";
        image.title = "YouTube Gold Diamond Pro";
        target.replaceChildren(image);
        target.dataset.gdpLogoApplied = "true";
      } else if (target.dataset.gdpLogoApplied === "true") {
        const originals = originalLogoNodes.get(target) || [];
        target.replaceChildren(...originals.map(node => node.cloneNode(true)));
        delete target.dataset.gdpLogoApplied;
      }
    });
  }

  function applyPlaybackSpeed() {
    const video = document.querySelector("video");
    const speed = Number(settings.speed);
    if (video && Number.isFinite(speed) && speed >= 0.25 && speed <= 3) {
      video.playbackRate = speed;
    }
  }

  function applySettings() {
    addStyles();
    document.documentElement.classList.toggle("gdp-gold-theme", Boolean(settings.goldTheme));
    document.documentElement.classList.toggle("gdp-cinema-mode", Boolean(settings.cinema));
    updateLogo();
    applyPlaybackSpeed();
  }

  chrome.storage.sync.get(DEFAULTS, (stored) => {
    if (chrome.runtime.lastError) {
      console.warn("Gold Diamond: settings could not be loaded.", chrome.runtime.lastError);
      return;
    }
    settings = { ...DEFAULTS, ...stored };
    applySettings();
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message?.type === "GDP_UPDATE_SETTINGS") {
      settings = { ...settings, ...message.settings };
      applySettings();
      sendResponse({ ok: true });
      return false;
    }

    if (message?.type === "GDP_PICTURE_IN_PICTURE") {
      const video = document.querySelector("video");
      if (!video || !document.pictureInPictureEnabled ||
          typeof video.requestPictureInPicture !== "function") {
        sendResponse({ ok: false, error: "Picture-in-Picture is unavailable for this video or browser." });
        return false;
      }
      video.requestPictureInPicture()
        .then(() => sendResponse({ ok: true }))
        .catch(error => sendResponse({
          ok: false,
          error: error.message || "Picture-in-Picture could not start."
        }));
      return true;
    }
    return false;
  });

  const observer = new MutationObserver(() => {
    updateLogo();
    applyPlaybackSpeed();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener("yt-navigate-finish", applySettings);
  window.addEventListener("pagehide", () => observer.disconnect(), { once: true });
})();
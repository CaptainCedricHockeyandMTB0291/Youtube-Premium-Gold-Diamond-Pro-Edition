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
      /* A brighter gold divider, kept in the same masthead position in dark and light themes. */
      ytd-masthead,
      #masthead-container {
        border-bottom: 2px solid #e9b94d !important;
        box-shadow:
          0 2px 0 rgba(255, 225, 150, .35),
          0 3px 18px rgba(231, 174, 55, .30),
          0 5px 28px rgba(197, 133, 25, .16) !important;
      }
      html.gdp-gold-theme ytd-masthead,
      html.gdp-gold-theme #masthead-container {
        border-bottom-color: #ffd36b !important;
        box-shadow:
          0 2px 0 rgba(255, 238, 190, .55),
          0 3px 20px rgba(255, 190, 55, .42),
          0 6px 32px rgba(214, 145, 28, .22) !important;
      }
      html.gdp-cinema-mode ytd-watch-flexy #secondary,
      html.gdp-cinema-mode ytd-watch-flexy #related {
        display: none !important;
      }
      html.gdp-cinema-mode ytd-watch-flexy #primary {
        max-width: 100% !important;
      }
      .gdp-logo-image {
        display: block !important;
        width: 100px !important;
        height: 79px !important;
        max-width: 100px !important;
        object-fit: contain !important;
        object-position: center !important;
        flex: 0 0 auto !important;
      }
      ytd-topbar-logo-renderer,
      ytd-masthead #logo {
        overflow: visible !important;
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
        image.alt = "YouTube Premium Gold Diamond Edition";
        image.title = "Gold Diamond Edition — Watch More. Worry Less.";
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
# YouTube Premium-Gold Diamond Pro Edition — Empty Ad Panels

A separate Manifest V3 extension for Microsoft Edge and Google Chrome. It fills detected **empty YouTube ad-specific containers** with the Gold Diamond Edition branded panel.

## Brand matching
The panel reuses the original project's `gold-diamond-logo-v223.svg` artwork and follows its existing popup palette:
- Near-black background: `#090909`
- Gold accent: `#e7bd61`
- Warm gold text: `#d8b45e`
- Muted gold text: `#a99b7b`
- Gold border line: `#62491e`
- Original metallic gold gradient and Premium lettering from the logo SVG

## Features
- Original Gold Diamond logo artwork, dark panels, gold outline and typography.
- Responsive panel sizing and MutationObserver support for dynamically added YouTube ad containers.
- Toolbar popup with an on/off switch.
- Does not target ordinary YouTube video recommendation cards.

## Important limitations
The extension only decorates ad-specific containers that remain in the page and appear empty. If an ad blocker removes the entire container, there is no remaining space for the extension to fill. YouTube may also change its markup, requiring selector maintenance.

This is a cosmetic customization. It does not provide paid YouTube Premium benefits, remove ads, or bypass subscriptions. It leaves ad containers with visible creative content untouched.

## Install
1. Download and extract the repository.
2. Open `edge://extensions` (Edge) or `chrome://extensions` (Chrome).
3. Enable **Developer mode**.
4. Select **Load unpacked** and choose this folder.
5. Refresh YouTube.

## Files
- `manifest.json` — extension configuration
- `content.js` — detects empty ad-specific containers
- `styles.css` — Gold Diamond panel styling
- `popup.html`, `popup.css`, `popup.js` — popup and toggle
- `assets/gold-diamond-logo-v223.svg` — original Gold Diamond logo artwork

**Version:** 1.1.0  
**License:** MIT. See `LICENSE`.
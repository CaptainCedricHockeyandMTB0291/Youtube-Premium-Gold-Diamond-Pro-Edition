# 💎 YouTube Premium-Gold Diamond Pro Edition
### Luxury Pro Edition — Independent YouTube Browser Enhancement

YouTube Premium-Gold Diamond Pro Edition is an independent Chromium browser extension that adds custom Gold Diamond branding and practical viewing controls to the YouTube website.

It is designed for **Microsoft Edge and Google Chrome** using Manifest V3.

> This is an independent customization project. It is not made by, affiliated with, sponsored by, or endorsed by YouTube or Google. It does not unlock paid YouTube Premium benefits.

---

## ✨ Features

### Gold Diamond branding
- Replaces the visible YouTube masthead logo with the project's custom gold-and-crystal play emblem.
- Keeps the surrounding YouTube logo link in place.
- Includes a matching emblem in the extension popup.
- Logo replacement can be switched off to restore the original logo when the same page elements remain mounted.

### Gold Theme
- Adds subtle gold accents to the YouTube masthead.
- Uses a restrained black-and-gold visual style.

### Cinema Mode
- Hides selected secondary watch-page content to provide a more focused layout.
- Can be toggled from the extension popup.

### Playback speed
- Offers 0.5×, 0.75×, 1×, 1.25×, 1.5×, 1.75× and 2×.
- Applies the selected speed to the current HTML video element.

### Picture-in-Picture
- Requests the browser's native Picture-in-Picture mode for the current video.
- Availability depends on browser support, video state and browser user-activation rules.

### Saved preferences
- Stores logo, theme, cinema and playback-speed settings using `chrome.storage.sync`.

---

## 🖥️ Compatibility

| Browser | Support |
|---|---|
| Microsoft Edge (Chromium) | Targeted |
| Google Chrome | Targeted |
| Safari | Not supported |
| Firefox | Not supported |

The extension targets desktop Chromium browsers. YouTube changes its page structure periodically, so selectors may need maintenance.

---

## 📁 Project Structure

```text
Youtube-Premium-Gold-Diamond-Pro-Edition/
├── manifest.json
├── content.js
├── popup.html
├── popup.css
├── popup.js
├── README.md
├── LICENSE
└── assets/
    └── gold-diamond-logo.svg
```

| File | Purpose |
|---|---|
| `manifest.json` | Manifest V3 configuration, permissions and content-script registration |
| `content.js` | Logo replacement, page styling, playback speed and Picture-in-Picture message handler |
| `popup.html` | Extension popup layout |
| `popup.css` | Gold-and-black popup styling |
| `popup.js` | Popup controls, storage and messaging |
| `assets/gold-diamond-logo.svg` | Custom vector emblem |
| `README.md` | Project documentation |
| `LICENSE` | MIT license |

---

## ⚙️ Installation

### Microsoft Edge
1. Open the repository and select **Code → Download ZIP**, or clone the repository.
2. Extract the ZIP.
3. Open `edge://extensions`.
4. Enable **Developer mode**.
5. Select **Load unpacked**.
6. Select the extracted repository folder containing `manifest.json`.
7. Open YouTube and refresh the page.

### Google Chrome
1. Download and extract the repository, or clone it.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Select **Load unpacked**.
5. Select the repository folder containing `manifest.json`.
6. Open YouTube and refresh the page.

After changing extension source files, return to the extensions page, select **Reload** for Gold Diamond Pro, and refresh YouTube.

---

## 🎛️ Using the Extension

1. Open `youtube.com`.
2. Select the Gold Diamond Pro extension icon in the browser toolbar.
3. Toggle the Gold Diamond Logo, Gold Theme or Cinema Mode.
4. Choose a playback speed.
5. Select **Picture-in-Picture** while a compatible video is available.

If the popup says to refresh YouTube, refresh the tab so the content script is loaded.

---

## 🔐 Permissions

| Permission | Reason |
|---|---|
| `storage` | Save user preferences with Chrome Storage Sync |
| `activeTab` | Identify and message the active YouTube tab after the user opens the popup |
| YouTube host access | Run the content script on YouTube and load the extension's logo asset |

The extension does not include analytics, advertising, account scraping or a remote tracking service.

---

## ⚠️ Important Limitations

- This project changes the visual interface; it does not provide, activate or simulate a paid Premium subscription.
- It does not remove YouTube advertisements or bypass subscription requirements.
- Picture-in-Picture is controlled by the browser and may be unavailable in some playback states.
- Cinema Mode uses page selectors that may need updating when YouTube changes its layout.
- The logo artwork in this repository is an original SVG emblem. It is not the full promotional screenshot.
- Browser support is a development target; test the extension in the browser versions you use before relying on it.

---

## 🔧 Troubleshooting

**The logo does not change**
- Confirm the extension is enabled.
- Refresh the YouTube tab after loading or reloading the extension.
- Check `chrome://extensions` or `edge://extensions` for extension errors.
- YouTube may have changed its masthead selectors.

**The popup says to refresh YouTube**
- Refresh the active YouTube tab to load the content script.

**Picture-in-Picture does not start**
- Confirm a video is loaded.
- Try starting playback and clicking the control again.
- The browser may reject the request if its user-activation requirement is not satisfied.

**Settings do not apply**
- Confirm browser storage is available.
- Reload the extension and refresh YouTube.

---

## 🧪 Development Checklist

- [ ] Load unpacked in Microsoft Edge.
- [ ] Load unpacked in Google Chrome.
- [ ] Confirm popup opens.
- [ ] Confirm logo replacement and logo toggle.
- [ ] Confirm Gold Theme toggle.
- [ ] Confirm Cinema Mode toggle.
- [ ] Confirm playback speed changes the video.
- [ ] Test Picture-in-Picture.
- [ ] Confirm settings persist after reopening the popup.
- [ ] Check extension errors and browser console output.

**Testing status:** Source files have been added to the repository, but this project has not yet been independently tested in live Edge and Chrome sessions. Do not treat the checklist as completed testing.

---

## 🚀 Future Development

Potential improvements:
- More Gold Diamond themes and accent controls.
- Adjustable logo sizing.
- Additional playback preferences.
- Keyboard shortcuts.
- Improved cinema layout options.
- Automated compatibility checks for YouTube interface changes.

---

## 📜 License

Distributed under the MIT License. See [LICENSE](LICENSE) for the full terms.

---

## 💎 Project Philosophy

**A familiar YouTube experience with a distinctive Gold Diamond identity.**

Built for customization. Designed around Gold Diamond.

**YouTube Premium-Gold Diamond Pro Edition — Luxury Pro Experience.**

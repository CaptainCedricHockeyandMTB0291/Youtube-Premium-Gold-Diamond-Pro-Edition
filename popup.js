const DEFAULTS = {
  logo: true,
  goldTheme: true,
  cinema: false,
  speed: 1
};

const CONTROL_IDS = ["logo", "goldTheme", "cinema", "speed"];

const $ = (id) => document.getElementById(id);

function showMessage(text) {
  $("message").textContent = text;
}

async function getActiveYouTubeTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id || !tab.url?.startsWith("https://www.youtube.com/")) return null;
  return tab;
}

async function sendCurrentSettings() {
  const tab = await getActiveYouTubeTab();
  if (!tab) {
    $("statusText").textContent = "OPEN YOUTUBE TO APPLY";
    return;
  }

  const settings = await chrome.storage.sync.get(DEFAULTS);
  chrome.tabs.sendMessage(tab.id, {
    type: "GDP_UPDATE_SETTINGS",
    settings
  }, () => {
    if (chrome.runtime.lastError) {
      $("statusText").textContent = "REFRESH YOUTUBE";
      showMessage("Refresh the YouTube tab, then try again.");
      return;
    }
    $("statusText").textContent = "CONNECTED TO YOUTUBE";
    showMessage("Settings applied.");
  });
}

async function initialize() {
  const settings = await chrome.storage.sync.get(DEFAULTS);

  for (const id of CONTROL_IDS) {
    const control = $(id);
    if (id === "speed") {
      control.value = String(settings.speed);
    } else {
      control.checked = Boolean(settings[id]);
    }

    control.addEventListener("change", async () => {
      const value = id === "speed" ? Number(control.value) : control.checked;
      await chrome.storage.sync.set({ [id]: value });
      await sendCurrentSettings();
    });
  }

  $("pip").addEventListener("click", async () => {
    const tab = await getActiveYouTubeTab();
    if (!tab) {
      showMessage("Open a YouTube video first.");
      return;
    }

    chrome.tabs.sendMessage(tab.id, { type: "GDP_PICTURE_IN_PICTURE" }, (response) => {
      if (chrome.runtime.lastError) {
        showMessage("Refresh YouTube and try again.");
        return;
      }
      showMessage(response?.ok ? "Picture-in-Picture started." :
        (response?.error || "Picture-in-Picture could not start."));
    });
  });

  const tab = await getActiveYouTubeTab();
  $("statusText").textContent = tab ? "YOUTUBE TAB FOUND" : "OPEN YOUTUBE TO APPLY";
}

initialize().catch((error) => {
  $("statusText").textContent = "INITIALIZATION ERROR";
  showMessage(error.message || "The extension popup could not initialize.");
});
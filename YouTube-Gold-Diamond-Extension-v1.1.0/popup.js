const enabled = document.getElementById("enabled");
const statusText = document.getElementById("statusText");
const message = document.getElementById("message");

chrome.storage.sync.get({ enabled: true }, (settings) => {
  enabled.checked = settings.enabled !== false;
  updateLabels();
});

enabled.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: enabled.checked }, () => {
    updateLabels();
    message.textContent = "Setting saved. Refresh YouTube if the page does not update.";
  });
});

function updateLabels() {
  statusText.textContent = enabled.checked ? "READY" : "PANELS OFF";
}
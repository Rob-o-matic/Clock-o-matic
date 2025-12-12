// Function to send the signal to the slide tab
function toggleClock(tab) {
  // Only work if the URL looks like Google Slides
  if (tab.url && tab.url.includes("docs.google.com/presentation")) {
    chrome.tabs.sendMessage(tab.id, { action: "toggle_clock" })
      .catch(err => {
        console.log("Clock Extension Error: Tab likely refreshed or not loaded.", err);
      });
  }
}

// 1. Listen for clicking the Extension Icon in the toolbar
chrome.action.onClicked.addListener((tab) => {
  toggleClock(tab);
});

// 2. Listen for the Keyboard Shortcut
chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-clock-command") {
    // Find the active tab first
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs.length > 0) {
        toggleClock(tabs[0]);
      }
    });
  }
});
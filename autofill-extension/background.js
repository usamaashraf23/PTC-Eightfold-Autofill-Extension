// background.js
chrome.action.onClicked.addListener((tab) => {
  // Check if we're on a PTC careers page
  if (tab.url.includes("ptc.eightfold.ai/careers")) {
    console.log("Extension icon clicked on PTC page, triggering autofill...");

    // Send message to content script to fill the form
    chrome.tabs
      .sendMessage(tab.id, { action: "fillForm" })
      .then((response) => {
        console.log("Autofill response:", response);
      })
      .catch((error) => {
        console.log("Error triggering autofill:", error);
        // If content script isn't ready, reload the tab and try again
        chrome.tabs.reload(tab.id);
      });
  } else {
    console.log("Not on PTC careers page");
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log("PTC Autofill extension installed");
});

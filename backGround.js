chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Check if the URL exists and the page has finished loading
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("youtube.com/watch")) {
        const queryParams = tab.url.split("?")[1];
        const urlParams = new URLSearchParams(queryParams); // Corrected variable name

        // Send a message to the content script with the new video ID
        chrome.tabs.sendMessage(tabId, {
            type: "NEW",
            videoId: urlParams.get("v") // Correctly using urlParams
        });
    }
});
chrome.tabs.onUpdate.addListener((tabId, tab) => {

    if(tab.url && tab.url.includes("youtube.com/watch")){
        const queryparams=tab.url.split("?")[1];
        const urlparams=new URLSearchParams(queryparams);
        console.log(urlparams);
        chrome.tabs.sendMessage(tabId,{
            type:"NEW",
            videoId:urlParameters.get("v"),

        });
    }
});
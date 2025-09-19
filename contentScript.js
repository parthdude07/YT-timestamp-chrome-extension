(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = "";
    let currentVideoBookmarks = [];

    // Listener for messages from other parts of the extension
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { type, value, videoId } = obj;

        if (type === "NEW") {
            currentVideo = videoId;
            newVideoLoaded();
        } else if (type === "PLAY") {
            youtubePlayer.currentTime = value;
        } else if (type === "DELETE") {
            currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
            chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
            
            response(currentVideoBookmarks);
        }
    });
    
    // Fetches bookmarks from chrome storage
    const fetchBookmarks = () => {
        return new Promise((resolve) => {
            chrome.storage.sync.get([currentVideo], (obj) => {
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
            });
        });
    };

    // Handles adding the bookmark button when a new video loads
    const newVideoLoaded = async () => {
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
        currentVideoBookmarks = await fetchBookmarks();

        if (!bookmarkBtnExists) {
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button " + "bookmark-btn";
            bookmarkBtn.title = "Click to bookmark current timestamp";

            // Wait for YouTube player controls to be available
            const controlsInterval = setInterval(() => {
                youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
                if (youtubeLeftControls) {
                    youtubePlayer = document.getElementsByClassName("video-stream")[0];
                    youtubeLeftControls.appendChild(bookmarkBtn);
                    bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
                    clearInterval(controlsInterval); // Stop checking once found
                }
            }, 1000); // Check every second
        }
    };
    
    // Event handler for clicking the new bookmark button
    const addNewBookmarkEventHandler = async () => {
        const currentTime = youtubePlayer.currentTime;
        const newBookmark = {
            time: currentTime,
            desc: "Bookmark at " + getTime(currentTime),
        };
        
        // Fetch the latest bookmarks before adding a new one
        currentVideoBookmarks = await fetchBookmarks();

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
        });
    };
    
    // Initial call in case the page is already loaded
    newVideoLoaded();
})();

// Utility function to format time
const getTime = t => {
    const date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substr(11, 8); // Returns time in HH:MM:SS format
};
// (() => {
//     let youtubeLeftControls, youtubePlayer;
//     let currentVideo = "";
//     let currentVideoBookmarks = [];

//     chrome.runtime.onMessage.addListener((obj, sender, response) => {
//         const { type, value, videoId } = obj;

//         if (type === "NEW") {
//             currentVideo = videoId;
//             newVideoLoaded();
//         }
//     });
//     const fetchBookmarks=()=>{
//         return new Promise((resolve)=>{
//             chrome.storage.sync.get([currentVideo],(obj)=>{
//                 resolve(obj[currentVideo]? JSON.parse(obj[currentVideo]):[])
//             });
//         });
//     }
//     const newVideoLoaded = async () => {
//         const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];
//         currentVideoBookmarks=await fetchBookmarks();

//         if (!bookmarkBtnExists) {
//             const bookmarkBtn = document.createElement("img");

//             bookmarkBtn.src = chrome.runtime.getURL("assets/bookmark.png");
//             bookmarkBtn.className = "ytp-button " + "bookmark-btn";
//             bookmarkBtn.title = "Click to bookmark current timestamp";

//             youtubeLeftControls = document.getElementsByClassName("ytp-left-controls")[0];
//             youtubePlayer = document.getElementsByClassName("video-stream")[0];
            
//             youtubeLeftControls.append(bookmarkBtn);
//             bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
//         }
//     }

//     const addNewBookmarkEventHandler = async () => {
//         const currentTime = youtubePlayer.currentTime;
//         const newBookmark = {
//             time: currentTime,
//             desc: "Bookmark at " + getTime(currentTime),
//         };
//         currentVideoBookmarks=await fetchBookmarks();

//         chrome.storage.sync.set({
//             [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
//         });
//     }

//     newVideoLoaded();
// })();

// const getTime = t => {
//     var date = new Date(0);
//     date.setSeconds(1);

//     return date.toISOString().substr(11, 0);
// }
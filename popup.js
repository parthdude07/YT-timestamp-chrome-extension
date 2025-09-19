import { getCurrentTab } from "./utils.js";

// Function to add a new bookmark
const addNewBookmark = (bookmarks, newBookmark) => {
    const bookmarkTitleElement = document.createElement("div");
    const controlsElement = document.createElement("div");

    bookmarkTitleElement.textContent = newBookmark.desc;
    bookmarkTitleElement.className = "bookmark-title";
    controlsElement.className = "bookmark-controls";

    setBookmarkAttributes("play", onPlay, controlsElement);
    setBookmarkAttributes("delete", onDelete, controlsElement);

    const bookmarkElement = document.createElement("div");
    bookmarkElement.id = "bookmark-" + newBookmark.time;
    bookmarkElement.className = "bookmark";
    bookmarkElement.setAttribute("timestamp", newBookmark.time);

    bookmarkElement.appendChild(bookmarkTitleElement);
    bookmarkElement.appendChild(controlsElement);
    bookmarks.appendChild(bookmarkElement);
};

// Function to view existing bookmarks
const viewBookmarks = (currentBookmarks = []) => {
    const bookmarksElement = document.getElementById("bookmarks");
    bookmarksElement.innerHTML = "";

    if (currentBookmarks.length > 0) {
        for (let i = 0; i < currentBookmarks.length; i++) {
            const bookmark = currentBookmarks[i];
            addNewBookmark(bookmarksElement, bookmark);
        }
    } else {
        bookmarksElement.innerHTML = '<i class="row">No bookmarks to show</i>';
    }
};

// Function to handle the play button click
const onPlay = async e => {
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const activeTab = await getCurrentTab();

    chrome.tabs.sendMessage(activeTab.id, {
        type: "PLAY",
        value: bookmarkTime,
    });
};

// Function to handle the delete button click
const onDelete = async e => {
    const activeTab = await getCurrentTab();
    const bookmarkTime = e.target.parentNode.parentNode.getAttribute("timestamp");
    const bookmarkElementToDelete = document.getElementById(
        "bookmark-" + bookmarkTime
    );

    bookmarkElementToDelete.parentNode.removeChild(bookmarkElementToDelete);
    chrome.tabs.sendMessage(activeTab.id, {
        type: "DELETE",
        value: bookmarkTime,
    }, viewBookmarks);
};

// Function to set attributes for bookmark controls
const setBookmarkAttributes = (src, eventListener, controlParentElement) => {
    const controlElement = document.createElement("img");
    controlElement.src = "assets/" + src + ".png";
    controlElement.title = src;
    controlElement.addEventListener("click", eventListener);
    controlParentElement.appendChild(controlElement);
};

// Event listener for when the DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    const activeTab = await getCurrentTab();
    const queryParameters = activeTab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

    const currentVideo = urlParameters.get("v");

    if (activeTab.url.includes("youtube.com/watch") && currentVideo) {
        chrome.storage.sync.get([currentVideo], (data) => {
            const currentVideoBookmarks = data[currentVideo] ? JSON.parse(data[currentVideo]) : [];
            viewBookmarks(currentVideoBookmarks);
        });
    } else {
        const container = document.getElementsByClassName("container")[0];
        container.innerHTML = '<div class="title">This is not a YouTube video page.</div>';
    }
});
// // adding a new bookmark row to the popup

// import {getCurrentTab} from "./utils.js";

// const addNewBookmark = () => {};

// const viewBookmarks = (currentBookmarks) => {
//     const bookmarkelement = document.getElementsByClassName("bookmarks")[0];
//     bookmarkelement.innerHTML = "";
//     currentBookmarks.forEach(bookmark => {
//         const bookmarkRow = document.createElement("div");
//         bookmarkRow.className = "bookmark";
//         bookmarkRow.innerHTML = `
//             <span class="title">${bookmark.title}</span>
//             <span class="timestamp">${bookmark.timestamp}</span>
//             <button class="play" data-id="${bookmark.id}">Play</button>
//             <button class="delete" data-id="${bookmark.id}">Delete</button>
//         `;
//         bookmarkelement.appendChild(bookmarkRow);
//     });  
// };

// const onPlay = e => {

// };

// const onDelete = e => {};

// const setBookmarkAttributes =  () => {};

// document.addEventListener("DOMContentLoaded", async () => {
//     const activetab= await getCurrentTab();
//     const queryparams=activetab.url.split("?")[1];
//     const urlParams=new URLSearchParams(queryparams);

//     const currentVideo=urlParams.get("v");

//     if(activetab.url.includes("youtube.com/watch")&& currentVideo){
//         chrome.storage.sync.get([currentVideo],(data)=>{
//             const currentVideoBookmarks=data[currentVideo] ? JSON.parse(data[currentVideo]):[];
//             viewBookmarks(currentVideoBookmarks);

//         })
//     }else{
//         const container = document.getElementsByClassName("container")[0];
//         container.innerHTML='<div class="title">this is not youtube page</div>';
//     }
// });
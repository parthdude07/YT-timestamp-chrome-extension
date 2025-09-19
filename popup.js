// adding a new bookmark row to the popup

import {getCurrentTab} from "./utils.js";

const addNewBookmark = () => {};

const viewBookmarks = () => {};

const onPlay = e => {};

const onDelete = e => {};

const setBookmarkAttributes =  () => {};

document.addEventListener("DOMContentLoaded", async () => {
    const activetab= await getCurrentTab();
    const queryparams=activetab.url.split("?")[1];
    const urlParams=new URLSearchParams(queryparams);

    const currentVideo=urlParams.get("v");

    if(activetab.url.includes("youtube.com/watch")&& currentVideo){
        chrome.storage.sync.get([currentVideo],(data)=>{
            const currentVideoBookmarks=data[currentVideo] ? JSON.parse(data[currentVideo]):[];

        })
    }else{
        
    }
});
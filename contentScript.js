(()=>{
    let ytLeftControls, ytPlayer;
    let currentVideo= "";

    let currentVideoBookmarks = [];


    chrome.runtime.onMessage.addListener((obj,sender,response)=> {
        const {type,value, videoID}= obj;
        if (type ==="NEW"){
            currentVideo = videoID;
            newVideoLoaded();
            console.log("Loaded the full function");
        } else if (type === "PLAY"){
            ytPlayer.currentTime = value;
        } else if (type === "DELETE"){
            currentVideoBookmarks = currentVideoBookmarks.filter((b)=>b.time!=value);
            chrome.storage.sync.set({[currentVideo]: JSON.stringify(currentVideoBookmarks)});
            if(Object.keys(currentVideoBookmarks).length==0){
                chrome.storage.sync.remove([currentVideo]);
            }
            response(currentVideoBookmarks);
        }
    });

    

    const fetchBookmarks =() =>{
        return new Promise ((resolve)=>{
            chrome.storage.sync.get([currentVideo], (obj)=>{
                resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : [])
            })
        })
    }

    const newVideoLoaded = async()=>{
        currentVideoBookmarks = await fetchBookmarks();
        const bookmarkBtnExists = document.getElementsByClassName("bookmark-btn")[0];

        if(!bookmarkBtnExists){
            const bookmarkBtn = document.createElement("img");

            bookmarkBtn.src=chrome.runtime.getURL("assets/bookmark.png");
            bookmarkBtn.className = "ytp-button "+"bookmark-btn";
            bookmarkBtn.title="Click to bookmark current timestamp";
            bookmarkBtn.style.cursor="pointer";


            ytLeftControls=document.getElementsByClassName("ytp-left-controls")[0];
            ytPlayer=document.getElementsByClassName("video-stream")[0];

            ytLeftControls.appendChild(bookmarkBtn);

            bookmarkBtn.addEventListener("click", addNewBookmarkEventHandler);
        }
    }
    
    const addNewBookmarkEventHandler = async () => {
        const currentTime = ytPlayer.currentTime;
        const newBookmark= {
            time:currentTime,
            desc:"Bookmark at "+ getTime(currentTime),
        };
        
        currentVideoBookmarks = await fetchBookmarks();

        chrome.storage.sync.set({
            [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a,b) => a.time -b.time))
        });
    }

    let trail="&ytExt=ON";
    if(!window.location.href.includes(trail)&&!window.location.href.includes("ab_channel")&&window.location.href.includes("www.youtube.com/watch")&&!window.location.href.includes(".youtube.com")){
        window.location.href+=trail;
    }

})();

const getTime = t =>{
    var date = new Date(0);
    date.setSeconds(t);

    return date.toISOString().substring(11, 19);
};
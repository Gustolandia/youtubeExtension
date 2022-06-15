
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

            bookmarkBtn.addEventListener("click", openModal);

            const myModal=document.createElement("div");
            myModal.className="modal1";
            myModal.id="myModal1";
            myModal.innerHTML=`<div class="modal1-content">
            <span class="close1" id="close1">&times;</span>
            <input name="bookmarkDesc" id="bookmarkDesc" autocomplete="on" placeholder="Please insert the bookmark description"><button id="myBtn1">Add Bookmark</button>
            </div>`;

            document.getElementsByTagName("body")[0].appendChild(myModal);
            document.getElementById("myBtn1").addEventListener("click", addNewBookmarkEventHandler );
            document.getElementById("close1").addEventListener("click", closeModal);


            window.onclick = function(event) {
                if (event.target == myModal) {
                    myModal.style.display = "none";
                }
              }

            
        }
    }
    
    const openModal = () => {
        document.getElementById("myModal1").style.display = "block";
    }
    const closeModal = () => {
        document.getElementById("myModal1").style.display = "none";
    }

    const addNewBookmarkEventHandler = async () => {
        let bookmarkDesc = document.getElementById("bookmarkDesc").value;
        console.log(bookmarkDesc);
        const currentTime = ytPlayer.currentTime;
        const newBookmark= {
            time:currentTime,
            desc:bookmarkDesc+" (Time: "+ getTime(currentTime)+")",
        };
        
        currentVideoBookmarks = await fetchBookmarks();
        document.getElementById("myModal1").style.display = "none";
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
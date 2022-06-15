
const onDelete = e => {
    let id=e.target.getAttribute("key");
    let video=e.target.getAttribute("class"); //giving class name for the delete images of a video the same as id for the column of the embedded video
    if (id==undefined){
        id="";
    }
    let timestamp=e.target.getAttribute("timestamp");
    let currentVideoBookmarks=[];
    chrome.storage.sync.get([id], (data) => {
        currentVideoBookmarks = data [id] ? JSON.parse(data[id]) : [];

        currentVideoBookmarks = currentVideoBookmarks.filter((b)=>b.time!=timestamp);

        chrome.storage.sync.set({[id]: JSON.stringify(currentVideoBookmarks)});

        console.log(currentVideoBookmarks);
    if(Object.keys(currentVideoBookmarks).length==0){
        chrome.storage.sync.remove([id]);
    }

    e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode);
    let rowspan=document.getElementById(""+video).getAttribute("rowspan");
    console.log(document.getElementById(""+video).getAttribute("rowspan"));
    document.getElementById(""+video).setAttribute("rowspan",rowspan-1);


    } )

}

document.addEventListener("DOMContentLoaded",  () => {
    const imageArea = document.getElementsByClassName("image-area")[0];
    const allImages = document.getElementsByTagName('img');
    chrome.storage.sync.get(null, (data) => {
        let thtml=`<table id="tableOfContents"><tbody>`;
        
        for (const [key, value] of Object.entries(data)) {
            let processedData=JSON.parse(value);
            let nRows=Object.keys(processedData).length
            thtml+=`<tr><td id=`+key+` rowspan="`+(nRows+1)+`"><iframe width="448" height="252" src="https://www.youtube.com/embed/`+key+`" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></td></tr>`;
            for (const [key2, value2] of Object.entries(processedData)) {
                thtml+=`<tr><td>`+value2.desc+`</td><td class="bookmark" key="`+key+`" timestamp="`+value2.time+`" id="bookmark-`+key+`-`+value2.time+`"><img class=`+key+` key="`+key+`" timestamp="`+value2.time+`" src = "assets/delete.png"/></td></tr>`;
            }
            
          }
          thtml+=`</tbody></table>`;
          imageArea.innerHTML+=thtml;
          for(let i = 0; i < allImages.length ; i++) {
            
            allImages[i].addEventListener("click",onDelete);
          }
          
          });
        
});
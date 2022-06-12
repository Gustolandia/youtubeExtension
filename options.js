import {getActiveTabURL} from "/util.js";

document.addEventListener("DOMContentLoaded", async () => {
    const imageArea = document.getElementsByClassName("image-area")[0];
    chrome.storage.sync.get(null, async (data) => {
        let thtml=`<table id="tableOfContents"><tbody>`;
        
        for (const [key, value] of Object.entries(data)) {
            let processedData=JSON.parse(value);
            let nRows=Object.keys(processedData).length
            thtml+=`<tr><td rowspan="`+(nRows+1)+`"><a href="https://www.youtube.com/watch?v=`+key+`">https://www.youtube.com/watch?v=`+key+`</a></td></tr>`;
            for (const [key, value] of Object.entries(processedData)) {
                thtml+=`<tr><td>`+value.desc+`</td><td></td></tr>`;
                console.log(value.desc);
            }
            
            console.log(key, JSON.parse(value));
          }
          thtml+=`</tbody></table>`;
          console.log(thtml);
          imageArea.innerHTML+=thtml;
          });
});
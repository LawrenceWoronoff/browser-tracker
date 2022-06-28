var server_url = "http://localhost/trackerbackend/index.php/api"; // Backend API endpoint base url

// Event triggered when user open new tab
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {   
    
    // If empty url or undefined, ignore event
    if(tab.url === undefined || tab.url.indexOf("chrome://") >= 0 || !tab.url.indexOf("chrome-extension://") || tab.url == 'about:blank') 
        return;

    let title;
    if(changeInfo.title !== undefined)
        title = changeInfo.title;

    if(changeInfo.status === "complete" && tab.active === true)
    {
        var jsonObj = {
            tabId: tabId,
            title: tab.title,
            tabUrl: tab.url,
        };

        fetch(server_url + "/insertTab", {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(jsonObj) // body data type must match "Content-Type" header
          }).then(response => {console.log(response)});
    }
});

// Event triggered when user close the tab
chrome.tabs.onRemoved.addListener(function(tabId) {
    var jsonObj = {
        tabId: tabId
    };

    fetch(server_url + "/closeTab", {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(jsonObj) // body data type must match "Content-Type" header
      }).then(response => {console.log(response)});
});

chrome.runtime.onInstalled.addListener(function(details) {  // install 
    console.log("On Installed Event");
    chrome.tabs.create({url:"html/download.html"});
})

chrome.runtime.onStartup.addListener(function() {
    console.log("Start UP");
});

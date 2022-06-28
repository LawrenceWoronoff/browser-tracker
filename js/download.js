$(document).ready(function() {
    
    var nextEndTimeToUse = 0;

    var allItems = [];
    var itemIdToIndex = {};

    function getMoreHistory() {
        var params = {text:"", maxResults:20000};
        params.startTime = 0;
        if (nextEndTimeToUse > 0)
            params.endTime = nextEndTimeToUse;

        chrome.history.search(params, function(items) {
            var newCount = 0;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.id in itemIdToIndex)
                    continue;
                newCount += 1;
                allItems.push(item);
                itemIdToIndex[item.id] = allItems.length - 1;
            }
            if (items && items.length > 0) {
                nextEndTimeToUse = items[items.length-1].lastVisitTime;
            }
            console.log(newCount);
            
            // callback(newCount);
            if(newCount > 0)
                getMoreHistory()

            if(newCount == 0)
            {
                var index = 0;
                var exportData = [];
                allItems.forEach(function(item){
                    index ++;
                    exportData.push({
                        "No": index, 
                        "URL" : item.url,
                        "Title" : item.title,
                        "Last Visit Time" : unixToString(item.lastVisitTime),
                        "Visited Count" : item.visitCount
                    })
                });

                var ws = XLSX.utils.json_to_sheet(exportData);
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "History Sheet");
                /* write workbook and force a download */
                XLSX.writeFile(wb, "History-" + getToday() + ".xlsx");

                // chrome.tabs.getCurrent(function(tab) {
                //     setTimeout(function(){
                //         chrome.tabs.remove(tab.id, function() { });
                //     }, 3000)
                // });
            }
        });
    }

    getMoreHistory();
});


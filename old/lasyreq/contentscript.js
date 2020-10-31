chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
        if(request.method == "getHTML"){
            sendResponse({html: document.all[0].outerHTML});
        }
    }
);
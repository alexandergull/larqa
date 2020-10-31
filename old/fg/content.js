// Listen for message...
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    // If the request asks for the DOM content...
    if (request.method && (request.method === "getDOM")) {
        // ...send back the content of the <html> element
        // (Note: You can't send back the current '#document',
        //  because it is recognised as a circular object and 
        //  cannot be converted to a JSON string.)
        var html = document.all[0];
        sendResponse({ "htmlContent": html.innerHTML });
    }
});
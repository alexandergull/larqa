window.addEventListener("DOMContentLoaded", function() {
    var inp = document.getElementById("search");
    var btn = document.getElementById("searchBtn");

    btn.addEventListener("click", function() {
        var searchTerm = inp.value;
            // Get the active tab
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                // If there is an active tab...
                if (tabs.length > 0) {
                    // ...send a message requesting the DOM...
                    chrome.tabs.sendMessage(tabs[0].id, {
                        method: "getDOM"
                    }, function(response) {
                        //if (chrome.runtime.lastError) {
                            // An error occurred :(
                           // console.log("ERROR: ", chrome.runtime.lastError);
                        //} else {
                            // Do something useful with the HTML content
                            alert(
                                response.htmlContent,
                            );
                        //}
                    });
                }
            });
    });
});
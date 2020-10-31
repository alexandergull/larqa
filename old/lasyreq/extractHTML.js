//Извращение конечно.. Но по другому plain HTML не вытащить.
function getHTML()
{

    chrome.tabs.getSelected(null, function(tab) {
        chrome.tabs.sendRequest(tab.id, {method: "getHTML"}, function(response) {
            if(respond.method="getHTML"){
                alert(response.html);
            }
        });
    });
}
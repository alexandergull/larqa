(function () {
    let html = document.documentElement.outerHTML;
    chrome.runtime.sendMessage({command:"pageHtml", html: html})
})();

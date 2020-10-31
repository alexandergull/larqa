//Функция смены имени URL

// определение URL окна

function get_URL(){

    let pdurl  =  document.getElementById('got-url_id');

    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        var ct_url  =  tabs[0].url;
        console.log(ct_url);
        pdurl.textContent  = 'Изменено с помощью JS :' + ct_url;

    });
}



//Назначение кнопок

// Кнопка Изменение URL
let changeURL_button = document.getElementById('get-url-button-id');

if (changeURL_button) {

    changeURL_button.addEventListener("click", get_URL);

} else {

    console.log("Не удалось загрузить eventlistener для get-url-button-id");

}

// Кнопка Взять HTML
let changeURL_button = document.getElementById('get-html-button-id');

if (changeURL_button) {

    changeURL_button.addEventListener("click", get_URL);

} else {

    console.log("Не удалось загрузить getHTMLclick.eventlistener");

}
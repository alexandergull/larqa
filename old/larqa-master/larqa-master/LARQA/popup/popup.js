let lrq_aoe  =  { //array of entries

    //0,0 EMAIL BLOCK

    "sender_email":"",      //<td>sender_email&nbsp;</td>
    "bl_email":"",          //<td>email_in_list&nbsp;</td>
    "sc_email":"",          //<td>short_cache_email&nbsp;</td>
    "is_temp_domain":"",         //<td>mail_domain_one_raz&nbsp;</td>


    //0,1 IP BLOCK

    "sender_ip":"",         //<td>sender_ip&nbsp;</td>
    "bl_ip":"",             //<td>ip_in_list&nbsp;</td>
    "sc_ip":"",             //<td>short_cache_ip&nbsp;</td>

    //0,2 STATUS BLOCK

    //0,3 AGENT BLOCK

    "ct_agent":"",          //<td>agent&nbsp;</td>

    //1,0 MAIN BLOCK

    "js_on":"",         //<td>js_on&nbsp;</td>
    "submit_time":"",          //<td>submit_time&nbsp;</td>
    "has_cookies":"",          //<td>cookies_enabled&nbsp;</td>
    "ref":"",                   //<td>REFFERRER&nbsp;</td>
    "pre_ref":"",               //<td>REFFERRER_PREVIOUS&nbsp;</td>
    "http_ref":"",              //<td>http_refferrer&nbsp;</td>
    "sender_url":"",          //<td>sender_url&nbsp;</td>
    "comment_type":"",          //<td>comment_type&nbsp;</td>
    "is_greylist":"",          //<td>greylist&nbsp;</td>
    "is_mobile":"",         //<td>is_mobile_UA&nbsp;</td>
    "has_links":"",         //<td>links&nbsp;</td>
    "is_pla":"",         //<td>private_list_allow&nbsp;</td>
    "is_pld":"",         //<td>private_list_deny&nbsp;</td>
    "count_plr":"",         //<td>private_list_detected&nbsp;</td>


    //1,1 SENDER BLOCK

    //==

    //1,2 ALL HEADERS BLOCK

    "all_headers":"", //<td>all_headers&nbsp;</td>

    //1,3 CT OPTIONS BLOCK

    "ct_options":"", //<td>ct_options&nbsp;</td>

};


function lrq_html_to_array($html){

    //


}

function lrq_array_to_blocks($aoe){

    //

}

window.addEventListener("DOMContentLoaded", function() {
    var btn = document.getElementById("searchBtn");

    btn.addEventListener("click", function() {
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
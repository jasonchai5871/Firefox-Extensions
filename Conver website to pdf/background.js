

function createPdf(tab, apiUrl) {
    

    
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = onDataReady(xhr, {
        onSuccess: function(data) {
            if (data.status === 'ok') {
                chrome.tabs.update(tab.id, {url: data.url});
	        } else if (data.status === 'error') {
	            alert("Convert Fail!");
            } else if (data.status === 'redirect') {
                alert("Convert Fail!");
            }

        },
       
        onError: function(responseText) {
            alert("Convert Fail!");
        },

        onComplete: function() { 
            animation.stop(); 
        }
    });

    xhr.open('POST', apiUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send("src=" + escape(tab.url));
};


function init() {

    image = document.getElementById("standard_icon")
    canvas = document.getElementById("canvas");
    canvasContext = canvas.getContext("2d");
   // updateBadgeAndTitle();

}

var baseUrl = 'https://pdfcrowd.com'
var apiUrls = {
    1: baseUrl + '/session/json/convert/uri/',
    2: baseUrl + '/session/json/convert/uri/v2/'
}

var apiVersionUrl = baseUrl + '/session/api-version/'

chrome.browserAction.onClicked.addListener(function(tab) {
    if (!canRunConversion(tab)) {
        return;
    }

    animation.start();

    // find out the api version for the current user
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = onDataReady(xhr, {
        onSuccess: function(data) {
            var apiUrl = apiUrls[data.api_version];
            if (apiUrl === undefined) {
                apiUrl = apiUrls[2];
            }
            // create pdf
            createPdf(tab, apiUrl);
        },
        onError: function(responseText) {
            showError("Can't connect to Pdfcrowd");
            animation.stop();
        },
    });
    xhr.open('GET', apiVersionUrl, true);
    xhr.send(null);
});

init();

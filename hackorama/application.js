//# sourceURL=application.js

var THAMBURUTRONICA_URL = null

App.onLaunch = function(options) {
    console.log("launching ...")
    var home = createHome(options.BASEURL, "Hackorama");
    navigationDocument.pushDocument(home);
}

App.onResume = function(options) {
    console.log("resuming ...")
    //navigationDocument.clear(); // TODO Check doc clear
    var home = createHome(options.BASEURL, "Hackorama");
    navigationDocument.pushDocument(home);
}

App.onWillResignActive = function() {

}

App.onDidEnterBackground = function() {

}

App.onWillEnterForeground = function() {
    
}

App.onDidBecomeActive = function() {
    
}

function no_cache(url) {
    return url + '?_=' + new Date().getTime();
}

function readTemplate(fileName, asyncProc) {
    var xhr = new XMLHttpRequest();
    if (asyncProc) {
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                asyncProc(this);
            }
        };
    }
    xhr.open('GET', no_cache(fileName), !(!asyncProc));
    // Disable caching
    xhr.setRequestHeader("Cache-Control", "no-cache, no-store, max-age=0");
    xhr.setRequestHeader("Expires", "Tue, 01 Jan 1980 1:00:00 GMT");
    xhr.setRequestHeader("Pragma", "no-cache");
    xhr.send();
    return xhr.responseText;
}

var createHome = function(url, title) {
    var homeTemplate = readTemplate(url + "home.xml");
    var dataJson = JSON.parse(readTemplate(url + "data.json"));
    THAMBURUTRONICA_URL = dataJson["thamburutronica"]  // TODO FIXME global
    var epicalUrl = dataJson["epical"]
    var updatedHomeTemplate = homeTemplate.replaceAll("${title}", title).replaceAll("${tvbaseurl}", url).replaceAll("${epicalurl}", no_cache(epicalUrl))
    var parser = new DOMParser();
    var homeDoc = parser.parseFromString(updatedHomeTemplate, "application/xml");
    homeDoc.addEventListener("select", handleSelectEvent);
    
    var rows = dataJson["data"]
    var eventSection = homeDoc.getElementById("events");
    eventSection.dataItem = new DataItem();
    var newEventItems = rows.map((result) => {
                                   let objectItem = new DataItem(result.type, result.id);
                                   objectItem.thumb = url + result.thumb;
                                   objectItem.title = result.title;
                                   objectItem.items = result.items;
                                   return objectItem;
                                   });
        
    eventSection.dataItem.setPropertyPath("events", newEventItems);
    
    var gameSection = homeDoc.getElementById("games");
    gameSection.dataItem = new DataItem();
    var newGameItems = rows.map((result) => {
                                   let objectItem = new DataItem(result.type, result.id);
                                   objectItem.thumb = url + result.thumb;
                                   objectItem.title = result.title;
                                   objectItem.items = result.items;
                                   return objectItem;
                                   });
        
    gameSection.dataItem.setPropertyPath("games", newGameItems);
    
    return homeDoc;
}


function handleSelectEvent(event) {
    var clicked = event.target.getAttribute("id");
    if (clicked.startsWith("chord")) {
        var playing = "🎶 🎼 🎵";
        var chord = clicked.split("_")[1];
        var chordTitle = event.target.lastChild;
        var chordImage = event.target.firstChild;
        
        homeDoc = navigationDocument.documents[0] // Update when handling multiple docs
        homeDoc.getElementById("chordTitle1").innerHTML = "";
        homeDoc.getElementById("chordTitle2").innerHTML = "";
        homeDoc.getElementById("chordTitle3").innerHTML = "";
        homeDoc.getElementById("chordTitle4").innerHTML = "";
        
        var playing = "🎶 🎼 🎵";
        
        if (chordTitle.getAttribute("status") == "clicked") {
            chordTitle.setAttribute("status", "");
            chord = 0;
            playing = "";
        } else {
            chordTitle.setAttribute("status", "clicked");
        }
        
        chordTitle.innerHTML = "...";
        var response = readTemplate(THAMBURUTRONICA_URL + "/" + chord);
        chordTitle.innerHTML = playing;
        
        console.log("Thambura chord = " +  chord + " -> " + THAMBURUTRONICA_URL  + "/" + chord + " = " + response);
        // TODO TVML does not seem to update images, DOM will update only on .pushDocument() ?
        // chordImage.src = "..."
    }
}

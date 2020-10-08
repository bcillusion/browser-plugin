window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
 })();

// function readTextFile(file, callback) {
//    var rawFile = new XMLHttpRequest();
//    rawFile.overrideMimeType("application/json");
//    rawFile.open("GET", file, true);
//    rawFile.onreadystatechange = function() {
//        if (rawFile.readyState === 4 && rawFile.status == "200") {
//            callback(rawFile.responseText);
//        }
//    }
//    rawFile.send(null);
// }
// readTextFile("data/listBlock.json", function(text){
//    var data = JSON.parse(text);
//    alert(JSON.stringify(data))
//    //updateFilters(data)
//    //alert(JSON.stringify(data));
// });
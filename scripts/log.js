window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
 })();
function loadLog()
{
    var data = localStorage.getItem("logs")
    //alert(data)
    document.getElementById("logText").value=data
    // browser.storage.local.get(['logs'], function (result) {
        
    // })
}
loadLog()
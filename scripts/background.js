window.browser = (function () {
   return window.msBrowser ||
       window.browser ||
       window.chrome;
})();

browser.runtime.onInstalled.addListener(function () {
   browser.storage.sync.set({ token: '' });
});

var listBlock = new Array()

function getBlockListAndBlockDomain() {
   // var token = (localStorage.getItem("token") != "undefined" || localStorage.getItem("token") != "" ) ? localStorage.getItem("token") : ""
   var token = browser.storage.sync.get(['token'], function (result) {
      return result ? result : ""
   })
   fetch("http://localhost:8089/api/v1/blocked_list/", {
      headers: {
         'Authorization': "Bearer " + token
      }
   }
   ).then(Response => {
      if (Response.status == 200)
         return (Response.json())
      else
         return ({ data: null })
   })
      .then(res => {
         if (res.data != null) {
            for (let i = 0; i < res.data.length; i++) {
               listBlock[i] = "*://*." + res.data[i].ip_address + "/*"
            }
            return listBlock
         }
         else {
            return []
         }

      })
      .then(res => {
         if (res.length != 0)
            updateFilters(res)
      })

}

//usage:
function blockRequest(details) {
   // if("chrome-extension://nkdhmfonnmhacncjkamhecgoimkbijlc/html/login.html"==(details.url))
   //  {
   //      return;
   //  }
   //  else
   return { cancel: true };
}

function updateFilters(listBlock) {

   if (browser.webRequest.onBeforeRequest.hasListener(blockRequest)) {
      browser.webRequest.onBeforeRequest.removeListener(blockRequest);
   }
   browser.webRequest.onBeforeRequest.addListener(blockRequest, { "urls": listBlock }, ['blocking']);
}

browser.browserAction.onClicked.addListener(function () {
   browser.tabs.create({ url: browser.runtime.getURL("html/login.html") });
});


getBlockListAndBlockDomain()



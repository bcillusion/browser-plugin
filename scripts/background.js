window.browser = (function() {
   return window.msBrowser ||
       window.browser ||
       window.chrome;
})();

var config = browser.extension.getBackgroundPage().config
var ac1 = browser.extension.getBackgroundPage().ac1
var ac2 = browser.extension.getBackgroundPage().ac2

browser.runtime.onInstalled.addListener(function() {
   browser.storage.sync.set({
       token: ''
   });
   localStorage.setItem("logs", new Date() + ": Install plugin blockwebsite");
});

var listBlockURL = new Array()
var listBlockWord = new Array()

function getBlockListAndBlockDomain() {
   browser.storage.sync.get(['token'], function(result) {
       /* #region Fetch list block URL */
       fetch(config.blockListAPI, {
               headers: {
                   'Authorization': "Bearer " + result.token
               }
           }).then(Response => {
               if (Response.status == 200)
                   return (Response.json())
               else
                   return ({
                       data: null
                   })
           })
           .then(res => {
               if (res.data != null) {
                   for (let i = 0; i < res.data.length; i++) {
                       let handle1 = res.data[i].ip_address.replace(new RegExp("https://|http://"), "")
                       let handle2 = handle1.replace(new RegExp("[/]+$"), "")
                       listBlockURL.push(handle2)
                       //listBlockURL.push(res.data[i].ip_address);
                   }
                   //browser.storage.sync.set({'listBlockURL': listBlockURL});
                   //buildTables(listBlockURL)
                   return listBlockURL
               } else {
                   //browser.storage.sync.set({'listBlockURL': []});
                   return []
               }

           })
           .then(res => {

               if (res.length != 0) {
                   //alert(res)
                   ac1.buildTables(res)
               }
           })
           .catch(err => {
               alert(err)
           })
       /* #endregion */

       /* #region Fetch data list block Word */
       fetch(config.blockWordAPI, {
               headers: {
                   'Authorization': "Bearer " + result.token
               }
           }).then(Response => {
               if (Response.status == 200)
                   return (Response.json())
               else
                   return ({
                       data: null
                   })
           })
           .then(res => {
               if (res.data != null) {
                   for (let i = 0; i < res.data.length; i++) {
                       listBlockWord.push(res.data[i].ip_address)
                       //listBlockWord.push(res.data[i].ip_address);
                   }
                   //browser.storage.sync.set({'listBlockWord': listBlockWord});
                   //buildTables(listBlockWord)
                   return listBlockWord
               } else {
                   //browser.storage.sync.set({'listBlockWord': []});
                   return []
               }
           })
           .then(res => {
               if (res.length != 0) {
                   //alert(res)
                   ac2.buildTables(res)
                   
               }
           })
           .catch(err => {
               alert(err)
           })
       /* #endregion */

       updateFilters()
   })
}




function updateFilters() {

   if (browser.webRequest.onBeforeRequest.hasListener(blockRequest)) {
       browser.webRequest.onBeforeRequest.removeListener(blockRequest);
   }
   browser.webRequest.onBeforeRequest.addListener(blockRequest, {
       "urls": ["<all_urls>"]
   }, ['blocking']);
}

function blockRequest(details) {

       /* Filter URL */
       //use Aho Corasick:
       var handle1 = details.url.replace(new RegExp("https://|http://"), "")
       var handle2 = handle1.replace(new RegExp("[/]+$"), "")
       //alert(search(handle2).length)
       var t = ac1.search(handle2)
       for (let i = 0; i < t.length; i++)
           for (let j = 1; j < t[i].length; j++)
               for (let k = 0; k < t[i][j].length; k++) {
                   if ((t[i][j][k] == handle2))
                       return {
                           cancel: true
                       };
               }

       //use RegEx:
       // for(let i = 0;i<listBlockWord.length;i++)
       // {
       //       var urlHandle1 = listBlockWord[i].replace(new RegExp("https://|http://"),"")
       //       var urlHandle2 = urlHandle1.replaceAll(".","[.]")
       //       var urlHandle3 =urlHandle2.replaceAll("/","[/]")
       //       var reg = new RegExp("^"+urlHandle3+"/*$"); 
       //       var url = details.url.replace(new RegExp("https://|http://"),"")+"/"
       //    if(url.match(reg)!=null)
       //    {            
       //      //alert(url+" in blocked List!!!")
       //       data = localStorage.getItem("logs")+"\n" +new Date()+": Blocked: "+details.url
       //       localStorage.setItem("logs",data)
       //       return { cancel: true };
       //    }
       // }
       /* Filter URL */


       /*Filter Word */
       if (ac2.search(details.url).length != 0)
           return {
               cancel: true
           };
       /*Filter Word */
   
}
// browser.webRequest.onBeforeRedirect.addListener(writeLog, {"urls":["<all_urls>"]}, ['extraHeaders']);
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   console.log(tab)
   if (changeInfo.url) {
       data = localStorage.getItem("logs") + "\n" + new Date() + ": Request: " + changeInfo.url
       localStorage.setItem("logs", data)
   }
});


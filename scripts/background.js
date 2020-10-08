window.browser = (function () {
   return window.msBrowser ||
       window.browser ||
       window.chrome;
})();
var config = browser.extension.getBackgroundPage().config
browser.runtime.onInstalled.addListener(function () {
   browser.storage.sync.set({ token: ''});
   localStorage.setItem("logs",new Date()+ ": Install plugin blockwebsite");
});

var listBlock = new Array()
function getBlockListAndBlockDomain() {
   browser.storage.sync.get(['token'], function (result) {
      
   fetch(config.blockListAPI, {
      headers: {
         'Authorization': "Bearer " + result.token
      }
   }
   ).then(Response => {
      if (Response.status == 200)
         return (Response.json())
      else
         return ({ data: null })
   })
      .then(res => {
         if (res.data != null)
         {
            for (let i = 0; i < res.data.length; i++)
               listBlock.push(res.data[i].ip_address)

            browser.storage.sync.set({'ListBlock': listBlock});
            return listBlock
         }
         else
         {
            browser.storage.sync.set({'ListBlock': []});
            return []
         }

      })
      .then(res => {
         if (res.length != 0)
            updateFilters()
      })
      .catch(err=>{alert(err)})
   })

}

//usage:

function updateFilters() {

   if (browser.webRequest.onBeforeRequest.hasListener(blockRequest)) {
      browser.webRequest.onBeforeRequest.removeListener(blockRequest);
   }
   browser.webRequest.onBeforeRequest.addListener(blockRequest, {"urls":["<all_urls>"]}, ['blocking']);
}

function blockRequest(details) {
   
   let keyWord="zing"
   let blockKeyword = false
   if(!blockKeyword)
      for(let i = 0;i<listBlock.length;i++)
      {
            var urlHandle1 = listBlock[i].replace(new RegExp("https://|http://"),"")
            var urlHandle2 = urlHandle1.replaceAll(".","[.]")
            var urlHandle3 =urlHandle2.replaceAll("/","[/]")
            var reg = new RegExp("^"+urlHandle3+"/*$"); 
            var url = details.url.replace(new RegExp("https://|http://"),"")+"/"
         if(url.match(reg)!=null)
         {            
           //alert(url+" in blocked List!!!")
            data = localStorage.getItem("logs")+"\n" +new Date()+": Blocked: "+details.url
            localStorage.setItem("logs",data)
            return { cancel: true };
         }
      }
   else
      for(let i = 0;i<listBlock.length;i++)
      {
         var reg = new RegExp(keyWord); 
         if(details.url.match(reg)!=null)
         {            
            //alert(details.url +"contain keyword blocked: "+keyWord)
            data = localStorage.getItem("logs")+"\n" +new Date()+": Blocked: "+details.url
            localStorage.setItem("logs",data)
            return { cancel: true };
         }
      }
        
      // browser.storage.sync.get(['ListBlock'], function (result) {
      //    for(let i = 0;i<result.ListBlock.length;i++)
      // {
      //       var urlHandle1 = result.ListBlock[i].replace(new RegExp("https://|http://"),"")
      //       var urlHandle2 = urlHandle1.replaceAll(".","[.]")
      //       var urlHandle3 =urlHandle2.replaceAll("/","[/]")
      //       var reg = new RegExp("^"+urlHandle3+"/*$"); 
      //       // create RegExp from url
      //       var url = details.url.replace(new RegExp("https://|http://"),"")+"/"
      //    if(url.match(reg)!=null)
      //    {            
      //       //alert(url)
      //       return { cancel: true };
      //    }
      // }         
      // })
       
}
// browser.webRequest.onBeforeRedirect.addListener(writeLog, {"urls":["<all_urls>"]}, ['extraHeaders']);
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
   console.log(tab)
   if (changeInfo.url) {
      data = localStorage.getItem("logs")+"\n" +new Date()+": Request: "+changeInfo.url
      localStorage.setItem("logs",data)
   }
});

//getBlockListAndBlockDomain()



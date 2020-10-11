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
      
   fetch(config.blockWordAPI, {
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
            //buildTables(listBlock)
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
         {
            buildTables(res)
            updateFilters()
         }
            
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
   let blockKeyword = true
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
   {
      if(search(details.url).length!=0)
         return { cancel: true };
   }
      // for(let i = 0;i<listBlock.length;i++)
      // {
      //    var reg = new RegExp(keyWord); 
      //    if(details.url.match(reg)!=null)
      //    {            
      //       //alert(details.url +"contain keyword blocked: "+keyWord)
      //       data = localStorage.getItem("logs")+"\n" +new Date()+": Blocked: "+details.url
      //       localStorage.setItem("logs",data)
      //       return { cancel: true };
      //    }
      // }
        
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










var GotoFn ={
   0: {}
};
var Output =[]
var Failure=[]

function buildTables(keywords) {
      var gotoFn = {
          0: {}
      };
      var output = {};

      var state = 0;
      keywords.forEach(function(word) {
         word=word.toString();
          var curr = 0;
          for (var i=0; i<word.length; i++) {
              var l = word[i];
              if (gotoFn[curr] && l in gotoFn[curr]) {
                  curr = gotoFn[curr][l];
              }
              else {
                  state++;
                  gotoFn[curr][l] = state;
                  gotoFn[state] = {};
                  curr = state;
                  output[state] = [];
              }
          }

          output[curr].push(word);
      });

      var failure = {};
      var xs = [];

      // f(s) = 0 for all states of depth 1 (the ones from which the 0 state can transition to)
      for (var l in gotoFn[0]) {
          var state = gotoFn[0][l];
          failure[state] = 0;
          xs.push(state);
      }

      while (xs.length) {
          var r = xs.shift();
          // for each symbol a such that g(r, a) = s
          for (var l in gotoFn[r]) {
              var s = gotoFn[r][l];
              xs.push(s);

              // set state = f(r)
              var state = failure[r];
              while(state > 0 && !(l in gotoFn[state])) {
                  state = failure[state];
              }

              if (l in gotoFn[state]) {
                  var fs = gotoFn[state][l];
                  failure[s] = fs;
                  output[s] = output[s].concat(output[fs]);
              }
              else {
                  failure[s] = 0;
              }
          }
      }

      GotoFn = gotoFn;
      Output = output;
      Failure = failure;
  };


   function search(string) {
   var state = 0;
   var results = [];
   for (var i=0; i<string.length; i++) {
       var l = string[i];
       while (state > 0 && !(l in GotoFn[state])) {
           state = Failure[state];
       }
       if (!(l in GotoFn[state])) {
           continue;
       }

       state = GotoFn[state][l];

       if (Output[state].length) {
           var foundStrs = Output[state];
           results.push([i, foundStrs]);
       }
   }

   return results;
};





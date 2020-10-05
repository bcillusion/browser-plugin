window.browser = (function () {    
    return window.msBrowser ||
        window.browser ||
        window.chrome;
 })();
 
document.getElementById("loginBtn").addEventListener("click", login);

function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    fetch("http://localhost:8089/api/v1/login", {
        method: 'POST',
        headers: {
            'lang': 'en-US',
            'x-tenant': 'tmasolutions'
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
        .then(res => {
            if (res.status == 200)
                return res.json()
            else
                return { msg: null }

        })
        .then(res => {
            if (res.msg == "ok") {
                // chrome.storage.local.set({ token: res.data.access_token });
                browser.storage.local.set({ 'token': res.data.access_token }, function() {
                    alert(res.data.access_token);
                  });

                // localStorage.setItem("token", res.data.access_token)
                alert("Login successful!")
                getBlockListAndBlockDomain()
                // var a = document.createElement("a");
                // a.href="../html/index.html"
                // a.click();
                window.location.href = "../html/index.html";
            }
            else {
                // localStorage.setItem("token", "")
                //updateFilters([])
                alert("Login failed!!!")
            }

        }).catch(err => {
            alert(err)
        })

}

function logout() {
    browser.storage.sync.set({
        token: "",
    });
}

function getBlockListAndBlockDomain() {
    var listBlock = new Array()
    browser.storage.sync.get(['token'], function (result) {
        fetch("http://localhost:8089/api/v1/blocked_list/", {
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
    })
    // var token = (localStorage.getItem("token") != "undefined" || localStorage.getItem("token") != "" ) ? localStorage.getItem("token") : ""
    

}

//usage:
function blockRequest(details) {
    // if("chrome-extension://nkdhmfonnmhacncjkamhecgoimkbijlc/html/login.html"==(details.url))
    // {
    //     return{cancel:false};
    // }
    // else
    return { cancel: true };
}

function updateFilters(listBlock) {
    if (browser.webRequest.onBeforeRequest.hasListener(blockRequest)) {
        browser.webRequest.onBeforeRequest.removeListener(blockRequest);
    }
    browser.webRequest.onBeforeRequest.addListener(blockRequest, { "urls": listBlock }, ['blocking']);
}

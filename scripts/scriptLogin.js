window.browser = (function () {    
    return window.msBrowser ||
        window.browser ||
        window.chrome;
 })();
var config = browser.extension.getBackgroundPage().config
document.getElementById("loginBtn").addEventListener("click", login);

function login() {
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    fetch(config.loginAPI, {
        method: 'POST',
        headers: {
            'lang': config.lang,
            'x-tenant': config.tenant
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
                browser.storage.sync.set({ 'token': res.data.access_token }, function() {
                //alert(res.data.access_token);                                  
                browser.extension.getBackgroundPage().getBlockListAndBlockDomain()
                alert("Login successful!")
                window.location.href = "../html/afterLogin.html";
                  });

            }
            else {

                browser.storage.sync.set({
                    'token': "",
                });
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
        'token': "",
    });
}


// function getBlockListAndBlockDomain() {
//     var listBlock = new Array()
//     browser.storage.sync.get(['token'], function (result) {
//         fetch(config.blockListAPI, {
//             headers: {
//                 'Authorization': "Bearer " + result.token
//             }
//         }
//         ).then(Response => {
//             if (Response.status == 200)
//                 return (Response.json())
//             else
//                 return ({ data: null })
//         })
//             .then(res => {
//                 if (res.data != null) {
//                     for (let i = 0; i < res.data.length; i++) {
//                         listBlock[i] = "*://" + res.data[i].ip_address
//                     }
//                     return listBlock
//                 }
//                 else {
//                     return []
//                 }
    
//             })
//             .then(res => {
//                 if (res.length != 0)
//                 {
//                     alert("update filter")
//                     updateFilters(res)
//                 }
                    
//             })
//     })   

// }

function checkLogin()
{
    browser.storage.sync.get(['token'], function (result) {
        // alert("token: " + result.token)
        if(result.token!="")
            window.location.href = "../html/afterLogin.html";
    })
}

//logout()
checkLogin()
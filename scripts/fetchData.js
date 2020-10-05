window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();

// var token = (localStorage.getItem("token") != "undefined" || localStorage.getItem("token") != "" ) ? localStorage.getItem("token") : ""

function getBlockList() {
    browser.storage.sync.get(['token'], function (result) {
        fetch(config.baseAPI + "api/v1/blocked_list/", {
            headers: {
                'Authorization': "Bearer " + result.token
            }
        }
        ).then(Response => {
            return (Response.json())
        })
            .then(res => {
                for (let i = 0; i < res.data.length; i++) {
                    listBlock[i] = "*://*." + res.data[i].ip_address + "/*"
                }
                return listBlock
            })
    })

}


function login(email, password) {
    fetch("http://localhost:8089/api/login/", {
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
            return res.json()

        })
        .then(res => {
            if (res.data != null) {
                browser.storage.sync.set({ token: res.data.access_token });
                // localStorage.setItem("token", res.data.access_token)
                return res.data.access_token
            }
            else {
                browser.storage.sync.set({ token: "" });
                localStorage.setItem("token", "")
                return "";
            }

        })

}

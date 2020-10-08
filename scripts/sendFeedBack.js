window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
 })();

document.getElementById("confirmBtn").addEventListener("click", confirm);
function confirm() {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        fetch("http://localhost:8089/api/sendFeedBack", {
            method: 'POST',
            headers: {
                'lang': 'en-US',
                'x-tenant': 'tmasolutions'
            },
            body: JSON.stringify({
                url: tabs[0].url,
            })
        })
            .then(res => {
                if (res.status == 200)
                    return res.json()
                else
                    return { msg: null }
            })
            .then(res => {
                alert(JSON.stringify(res))
            }).catch(err => {
                alert(err)
            })
    });
}

document.getElementById("cancelBtn").addEventListener("click", cancel)
function cancel() {
    history.back()
}
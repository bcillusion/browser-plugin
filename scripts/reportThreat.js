window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
})();
var config = browser.extension.getBackgroundPage().config
document.addEventListener('DOMContentLoaded', function() {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var input = document.getElementById('threatUrl');
        input.value = tabs[0].url
        input.focus();
        input.select();
    })
})


document.getElementById("confirmBtn").addEventListener("click", confirm);
function confirm() {
    browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        fetch(config.reprortThreatAPI, {
            method: 'POST',
            headers: {
                'lang': config.lang,
                'x-tenant': config.tenant,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url: document.getElementById('threatUrl').value,
            })
        })
            .then(res => {
                if (res.status == 200)
                    return res.json()
                else
                    return { msg: null }
            })
            .then(res => {
                alert(JSON.stringify(res.msg))
                window.location.href = "../html/afterLogin.html";
            }).catch(err => {
                alert(err)
            })
    });
}

document.getElementById("cancelBtn").addEventListener("click", cancel)
function cancel() {
    history.back()
}

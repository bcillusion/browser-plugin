window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
 })();

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
        fetch("http://localhost:8089/api/v1/sendFeedBack", {
            method: 'POST',
            headers: {
                'lang': 'en-US',
                'x-tenant': 'tmasolutions',
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
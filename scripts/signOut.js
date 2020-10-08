window.browser = (function () {
    return window.msBrowser ||
        window.browser ||
        window.chrome;
 })();
function logout() {
    browser.storage.sync.set({
        'token': "",
    });
    window.location.href="../html/login.html"
}
logout()

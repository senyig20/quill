function getStoredJWT() {
    return Cookies.get('jwt');
}

function storeJWT(jwt) {
    Cookies.set("jwt", jwt);
}

function getRedirectURL() {
    return 'login.html';
}

function apiCall(url, data, callback, error) {
    $.get({url: url,
                 beforeSend: function (xhr) {
                    xhr.setRequestHeader("x-access-token", getStoredJWT());
                 },
                 data: data,
                 success: callback,
               error: error });
}

function apiCallPost(url, data, callback, error) {
    $.post({url: url,
                 beforeSend: function (xhr) {
                    xhr.setRequestHeader("x-access-token", getStoredJWT());
                 },
                 data: data,
                 success: callback,
               error: error });
}

function validateJWT(success) {
    apiCall(API_ROOT + '/users/stats', undefined,
    function(data) {
        console.log("[DEBUG] Session is valid!");
        // success();
    },
    function(data, code) {
        if (code == "error") {
            redirectToReg();
        }
    });
}

function isAdmin() {
    return true; // FIXME Jank
}

function throwError(message) {
    redirectToReg();
}

function redirectToReg() {
    window.location.replace(getRedirectURL());
}

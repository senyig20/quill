angular.module('reg')
    .factory('UserService', [
        '$http',
        'Session',
        function ($http, Session) {

            var users = '/api/users';
            var base = users + '/';

            return {

                // ----------------------
                // Basic Actions
                // ----------------------
                getCurrentUser: function () {
                    return $http.get(base + Session.getUserId());
                },

                get: function (id) {
                    return $http.get(base + id);
                },

                getAll: function () {
                    return $http.get(base);
                },

                getAllCompaniesSelected: function(){
                    return $http.get(base + 'sponsorsSelected');
                },
                getAllAdmitted: function(){
                    return $http.get(base + 'allAdmitted');
                },
                getAllConfirmed: function(){
                    return $http.get(base + 'allConfirmed');
                },
                getAllUnpaid: function(){
                    return $http.get(base+ 'allUnpaid');
                },

                getAllFinal: function(){
                    return $http.get(base+ 'allFinal');
                },
                getCSV: function (type, partial, adminID) {
                    // console.log('getCSV');
                    console.log(type);
                    adminID = Session.getUserId();
                    console.log(adminID);
                    return $http.get(base + 'exportcsv?type=' + type + '&adminID=' + adminID).success(function (data, status, headers) {
                        headers = headers();
                        var filename = headers['x-filename'];
                        var contentType = headers['content-type'];

                        var linkElement = document.createElement('a');
                        try {
                            var blob = new Blob([data], {type: contentType});
                            var url = window.URL.createObjectURL(blob);
                            linkElement.setAttribute('href', url);
                            linkElement.setAttribute("download", filename);
                            var clickEvent = new MouseEvent("click", {
                                "view": window,
                                "bubbles": true,
                                "cancelable": false
                            });
                            linkElement.dispatchEvent(clickEvent);
                        } catch (ex) {
                            console.log(ex);
                        }
                    }).error(function (data) {
                        console.log(data);
                    });
                },


                getAdmittedCSV: function () {
                    console.log("getAdmittedCSV");
                    this.getCSV("admitted", true);
                },

                getConfirmedCSV: function () {
                    console.log("getConfirmedCSV");
                    this.getCSV("confirmed");
                },

                getPage: function (page, size, text, statusFilters) {
                    return $http.get(users + '?' + $.param(
                        {
                            text: text,
                            page: page ? page : 0,
                            size: size ? size : 100,
                            statusFilters: statusFilters ? statusFilters : {}
                        })
                    );
                },

                updateProfile: function (id, profile) {
                    return $http.put(base + id + '/profile', {
                        profile: profile
                    });
                },

                updateConfirmation: function (id, confirmation) {
                    return $http.put(base + id + '/confirm', {
                        confirmation: confirmation
                    });
                },

                declineAdmission: function (id) {
                    return $http.post(base + id + '/decline');
                },

                // -------------------------
                // Admin Only
                // -------------------------

                getStats: function () {
                    return $http.get(base + 'stats');
                },

                admitUser: function (id) {
                    return $http.post(base + id + '/admit');
                },

                checkIn: function (id) {
                    return $http.post(base + id + '/checkin');
                },

                checkOut: function (id) {
                    return $http.post(base + id + '/checkout');
                },
                makeAdmin: function (id) {
                    return $http.post(base + id + '/makeadmin');
                },
                acceptPayment: function (id) {
                    return $http.post(base + id + '/acceptpayment');
                },
                unacceptPayment: function (id) {
                    return $http.post(base + id + '/unacceptpayment');
                },
                sendLaggerPaymentEmails: function () {
                    return $http.post(base + 'sendlagpayemails');
                },


                removeAdmin: function (id) {
                    return $http.post(base + id + '/removeadmin');
                },

                sendLaggerEmails: function () {
                    return $http.post(base + 'sendlagemails');
                },
                sendAcceptEmails: function (email) {
                    return $http.post(base + email + '/sendacceptemails');
                },
                sendPaymentEmails: function (email) {
                    return $http.post(base + email + '/sendpaymentemails');
                },
            };
        }
    ]);

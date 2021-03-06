angular.module('reg')
    .controller('AdminStatsCtrl', [
        '$scope',
        '$http',
        'UserService',
        function ($scope, $http, UserService) {

            UserService
                .getStats()
                .success(function (stats) {
                    $scope.stats = stats;
                    $scope.loading = false;
                });

            $scope.fromNow = function (date) {
                return moment(date).fromNow();
            };
            $scope.sendSponsor = function () {
                swal({
                    title: "Are you sure?",
                    text: "This will send an email to every user that are confirmed to request their selections?.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, send.",
                    closeOnConfirm: false
                }, function () {
                    UserService
                        .sendSponsor()
                        .then(function () {
                            sweetAlert('Your emails have been sent.');
                        });
                });
            };

            $scope.sendLaggerPaymentEmails = function () {
                swal({
                    title: "Are you sure?",
                    text: "This will send an email to every user who has not confirmed an application. Are you sure?.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, send.",
                    closeOnConfirm: false
                }, function () {
                    UserService
                        .sendLaggerPaymentEmails()
                        .then(function () {
                            sweetAlert('Your emails have been sent.');
                        });
                });
            };


            $scope.sendLaggerEmails = function () {
                swal({
                    title: "Are you sure?",
                    text: "This will send an email to every user who has not submitted an application. Are you sure?.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, send.",
                    closeOnConfirm: false
                }, function () {
                    UserService
                        .sendLaggerEmails()
                        .then(function () {
                            sweetAlert('Your emails have been sent.');
                        });
                });
            };
        }]);

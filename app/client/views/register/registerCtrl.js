angular.module('reg')
    .controller('RegisterCtrl', [
        '$scope',
        '$http',
        '$state',
        'settings',
        'Utils',
        'AuthService',
        function ($scope, $http, $state, settings, Utils, AuthService) {

            // Is registration open?
            var Settings = settings.data;
            $scope.regIsOpen = Utils.isRegOpen(Settings);

            // Start state for login

            function onSuccess() {
                $scope.loading = false;
                $state.go('app.dashboard');
            }

            function onError(data) {
                $scope.loading = false;
                $scope.error = data.message;
            }

            function resetError() {
                $scope.error = null;
            }

            $scope.loginPage = function () {
                $state.go('login');
            };

            $scope.register = function () {
                resetError();
                $scope.loading = true;
                AuthService.register(
                    $scope.email, $scope.password, $scope.confirmpassword, onSuccess, onError);
            };

        }
    ]);

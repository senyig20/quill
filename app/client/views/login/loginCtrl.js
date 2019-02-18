angular.module('reg')
    .controller('LoginCtrl', [
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
            $scope.loginState = 'login';

            function onSuccess() {
                $state.go('app.dashboard');
            }

            function onError(data) {
                $scope.error = data.message;
            }

            function resetError() {
                $scope.error = null;
            }

            $scope.login = function () {
                resetError();
                AuthService.loginWithPassword(
                    $scope.email, $scope.password, onSuccess, onError);
            };

            $scope.goToRegister = function () {
                $state.go('register');
            };

            $scope.register = function () {
                resetError();
                AuthService.register(
                    $scope.email, $scope.password, onSuccess, onError);
            };

            $scope.setLoginState = function (state) {
                $scope.loginState = state;
            };

            $scope.sendResetEmail = function () {
                var email = $scope.email;
                AuthService.sendResetEmail(email);
                sweetAlert({
                    title: "E-Posta Kutunu Kontrol Et!",
                    text: "Az sonra bir e-posta gelecek.",
                    type: "success",
                    confirmButtonColor: "#31517e"
                });
            };

        }
    ]);

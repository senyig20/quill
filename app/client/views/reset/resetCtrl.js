angular.module('reg')
    .controller('ResetCtrl', [
        '$scope',
        '$stateParams',
        '$state',
        'AuthService',
        function ($scope, $stateParams, $state, AuthService) {
            var token = $stateParams.token;

            $scope.loading = true;

            $scope.changePassword = function () {
                var password = $scope.password;
                var confirm = $scope.confirm;

                if (password !== confirm) {
                    $scope.error = "Şifreler uyuşmuyor!";
                    $scope.confirm = "";
                    return;
                }

                AuthService.resetPassword(
                    token,
                    $scope.password,
                    function (message) {
                        sweetAlert({
                            title: "Harika!",
                            text: "Şifren değiştirildi!",
                            type: "success",
                            confirmButtonColor: "#31517e"
                        }, function () {
                            $state.go('login');
                        });
                    },
                    function (data) {
                        $scope.error = data.message;
                        $scope.loading = false;
                    });
            };

        }]);
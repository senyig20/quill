angular.module('reg')
    .controller('GAdminCtrl', [
        '$scope',
        'UserService',
        function ($scope, UserService) {
            $scope.loading = true;
        }]);

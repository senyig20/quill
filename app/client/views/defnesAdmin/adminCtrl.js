angular.module('reg')
    .controller('DAdminCtrl', [
        '$scope',
        'UserService',
        function ($scope, UserService) {
            $scope.loading = true;
        }]);

angular.module('reg')
    .controller('PaymentCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        'currentUser',
        'Utils',
        'UserService',
        function ($rootScope, $scope, $state, currentUser, Utils, UserService) {
            var user = currentUser.data;
            $scope.user = user;
        }]);

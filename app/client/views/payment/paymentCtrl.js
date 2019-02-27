angular.module('reg')
    .controller('PaymentCtrl', [
        '$rootScope',
        '$scope',
        '$state',
        'currentUser',
        'Utils',
        'UserService',
        function ($rootScope, $scope, $state, currentUser, Utils, UserService) {
            const user = currentUser.data;
            $scope.user = user;
        }]);

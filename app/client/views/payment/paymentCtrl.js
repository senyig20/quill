angular.module('reg')
  .controller('PaymentCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    function($scope, $rootScope, $state, currentUser, Utils, UserService){
      var user = currentUser.data;
      $scope.user = user;
    }]);

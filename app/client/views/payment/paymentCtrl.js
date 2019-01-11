angular.module('reg')
  .controller('PaymentCtrl', [
        '$rootScope',
        '$scope',
        '$sce',
        'currentUser',
        'settings',
        'Utils',
        'AuthService',
        'UserService',
        function($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService){
          var Settings = settings.data;
          var user = currentUser.data;
          $scope.user = user;

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
        'EVENT_INFO',
        'DASHBOARD',
        function($rootScope, $scope, $sce, currentUser, settings, Utils, AuthService, UserService, EVENT_INFO, DASHBOARD){
          var Settings = settings.data;
          var user = currentUser.data;
          $scope.user = user;

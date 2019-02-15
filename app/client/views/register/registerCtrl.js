angular.module('reg')
  .controller('RegisterCtrl', [
    '$scope',
    '$http',
    '$state',
    'settings',
    'Utils',
    'AuthService',
    function($scope, $http, $state, settings, Utils, AuthService){

      // Is registration open?
      var Settings = settings.data;
      $scope.regIsOpen = Utils.isRegOpen(Settings);

      // Start state for login

      function onSuccess() {
        $state.go('app.dashboard');
      }

      function onError(data){
        $scope.error = data.message;
      }

      function resetError(){
        $scope.error = null;
      }

      $scope.loginPage = function(){
        $state.go('login');
      };

      $scope.register = function(){
        if ($scope.password != $scope.confirmpassword) {
          input.setCustomValidity('Password Must be Matching.');
        } else {
          // input is valid -- reset the error message
          input.setCustomValidity('');
        }

        resetError();
        AuthService.register(
          $scope.email, $scope.password, onSuccess, onError);
      };

    }
  ]);

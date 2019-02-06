angular.module('reg')
  .controller('ConfirmationCtrl', [
    '$scope',
    '$rootScope',
    '$state',
    'currentUser',
    'Utils',
    'UserService',
    function($scope, $rootScope, $state, currentUser, Utils, UserService){

      // Set up the user
      var user = currentUser.data;
      $scope.user = user;

      $scope.pastConfirmation = Date.now() > user.status.confirmBy;

      $scope.formatTime = Utils.formatTime;

      _setupForm();

      $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");


      function _updateUser(e){
        var confirmation = $scope.user.confirmation;
        // Get the dietary restrictions as an array
        var drs = [];


        UserService
          .updateConfirmation(user._id, confirmation)
          .then(response => {
            swal({
                title: "Tamamlandı!",
                text: "Teyidini aldık!",
                type: "success",
                confirmButtonColor: "#31517e"

            },function() {
                $state.go("app.dashboard");
              });
          }, response => {
            swal({
                title: "Hay Aksi!",
                text: "Bir şeyler yanlış gitti.",
                type: "error",
                confirmButtonColor: "#31517e"});
          });
      }



      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            signatureLiability: {
              identifier: 'signatureLiabilityWaiver',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Lütfen okuduğunu doğrula.'
                }
              ]
            },
            receiptConfirmation: {
              identifier: 'receiptConfirmation',
              rules: [
                {
                  type: 'checked',
                  prompt: 'Lütfen yüklediğini/girdiğini doğrula.'
                }
              ]
            },
          }
        });
      }

      $scope.submitForm = function(){
        if ($('.ui.form').form('is valid')){
          _updateUser();
        }
      };

    }]);

angular.module('reg')
  .controller('SponsorCtrl', [
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
        var sponsor = $scope.user.sponsor;

        UserService
          .updateSponsors(user._id, sponsor)
          .then(response => {
            swal({
                title: "Tamamlandı!",
                text: "Şirket kayıtlarını aldık!",
                type: "success",
                confirmButtonColor: "#31517e"

            },function() {
                document.location.reload(true);
                $state.go("app.dashboard");
              });
          }, response => {
            swal("Hay Aksi!", "Bir şeyler yanlış gitti.", "error");
          });
      }


      function _setupForm(){
        // Semantic-UI form validation
        $('.ui.form').form({
          fields: {
            choice1: {
              identifier: 'choice1',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Lütfen tercihini yap.'
                }
              ]
            },
            choice2: {
              identifier: 'choice2',
              rules: [
                {
                  type: 'empty',
                  prompt: 'Lütfen tercihini yap.'
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

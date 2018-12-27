angular.module('reg')
  .controller('AdminStatsCtrl', [
    '$scope',
    '$http',
    'UserService',
    function ($scope, $http, UserService) {
      $http
        .get('/assets/schools.json')
        .then(function (res) {
          $scope.schoolList = res.data;
        });

      UserService
        .getStats()
        .success(function (stats) {
          $scope.stats = stats;

          $scope.stats.demo.schools.forEach(function (school) {
            var schoolName = $scope.schoolList[school.email];

            if (schoolName) {
              school.email = school.email + ' (' + schoolName.school + ')';
            }
          })

          $scope.loading = false;
        });

      $scope.fromNow = function (date) {
        return moment(date).fromNow();
      };

      $scope.sendLaggerEmails = function(){
        swal({
          title: "Are you sure?",
          text: "This will send an email to every user who has not submitted an application. Are you sure?.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send.",
          closeOnConfirm: false
          }, function(){
            UserService
              .sendLaggerEmails()
              .then(function(){
                sweetAlert('Your emails have been sent.');
            });
          });
      };
      
      $scope.sendAcceptEmails = function(){
        swal({
          title: "Are you sure?",
          text: "This will send an email to every user who has been accepted and not confirmed. Are you sure?.",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, send.",
          closeOnConfirm: false
          }, function(){
            UserService
              .sendAcceptEmails()
              .then(function(){
                sweetAlert('Your emails have been sent.');
            });
          });
      };
    }]);
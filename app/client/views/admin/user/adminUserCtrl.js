angular.module('reg')
  .controller('AdminUserCtrl',[
    '$scope',
    '$http',
    '$window',
    'user',
    'UserService',
    function ($scope, $http, $window, User, UserService){
      $scope.selectedUser = User.data;

      // Populate the school dropdown
      populateSchools();
      populateDisciplines();

      /**
       * TODO: JANK WARNING
       */
      function populateSchools(){
        $http
          .get('/assets/schools.json')
          .then(function(res){
            var schools = res.data;
            var email = $scope.selectedUser.email.split('@')[1];

            if (schools[email]){
              $scope.selectedUser.profile.school = schools[email].school;
              $scope.autoFilledSchool = true;
            }
          });

        $http
          .get('/assets/schools.csv')
          .then(function(res){ 
            $scope.schools = res.data.split('\n');
            $scope.schools.push('Other');

            var content = [];

            for(i = 0; i < $scope.schools.length; i++) {                                          
              $scope.schools[i] = $scope.schools[i].trim(); 
              content.push({title: $scope.schools[i]})
            }

            $('#school.ui.search')
              .search({
                source: content,
                cache: true,     
                onSelect: function(result, response) {                                    
                  $scope.selectedUser.profile.school = result.title.trim();
                }        
              })             
          });          
      }

      function populateDisciplines(){
        $http
          .get('/assets/disciplines.csv')
          .then(function(res){ 
            $scope.disciplines = res.data.split('\n');
            $scope.disciplines.push('Other');

            var content = [];

            for(i = 0; i < $scope.disciplines.length; i++) {                                          
              $scope.disciplines[i] = $scope.disciplines[i].trim(); 
              content.push({title: $scope.disciplines[i]})
            }

            $('#discipline.ui.search')
              .search({
                source: content,
                cache: true,     
                onSelect: function(result, response) {                                    
                  $scope.selectedUser.profile.discipline = result.title.trim();
                }        
              })             
          });          
      }


      $scope.updateProfile = function(){
        UserService
          .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
          .success(function(data){
            $selectedUser = data;
            swal("Updated!", "Profile updated.", "success");
          })
          .error(function(){
            swal("Oops, you forgot something.");
          });
      };

      $scope.openResume = function () {
        var id = $scope.selectedUser.id;
        var resumeWindow = $window.open('', '_blank');
        $http
          .get('/api/resume/' + id)
          .then(function (response) {
            resumeWindow.location.href = '/api/resume/view/' + response.data.token;
          });
      }

      $scope.formatTime = function (time) {
        return moment(time).format('MMMM Do YYYY, h:mm:ss a');
      }

    }]);
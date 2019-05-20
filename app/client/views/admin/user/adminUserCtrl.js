angular.module('reg')
    .controller('AdminUserCtrl', [
        '$scope',
        '$http',
        '$window',
        'user',
        'UserService',
        function ($scope, $http, $window, User, UserService) {
            $scope.selectedUser = User.data;

            // Populate the school dropdown

            /**
             * TODO: JANK WARNING
             */

            $scope.updateProfile = function () {
                UserService
                    .updateProfile($scope.selectedUser._id, $scope.selectedUser.profile)
                    .success(function (data) {
                        $selectedUser = data;
                        swal("Updated!", "Profile updated.", "success");
                    })
                    .error(function () {
                        swal("Oops, you forgot something.");
                    });
            };

            $scope.formatTime = function (time) {
                return moment(time).format('MMMM Do YYYY, h:mm:ss a');
            }

        }]);
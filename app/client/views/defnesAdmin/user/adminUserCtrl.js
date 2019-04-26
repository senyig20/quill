angular.module('reg')
    .controller('DAdminUserCtrl', [
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


            $scope.formatTime = function (time) {
                return moment(time).format('MMMM Do YYYY, h:mm:ss a');
            }

        }]);

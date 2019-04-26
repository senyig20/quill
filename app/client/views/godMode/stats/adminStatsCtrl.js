angular.module('reg')
    .controller('GAdminStatsCtrl', [
        '$scope',
        '$http',
        'UserService',
        function ($scope, $http, UserService) {

            UserService
                .getStats()
                .success(function (stats) {
                    $scope.stats = stats;
                    $scope.loading = false;
                });

            $scope.fromNow = function (date) {
                return moment(date).fromNow();
            };
        }]);

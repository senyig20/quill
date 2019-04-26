angular.module('reg')
    .controller('SidebarCtrl', [
        '$rootScope',
        '$scope',
        'settings',
        'Utils',
        'AuthService',
        'Session',
        'EVENT_INFO',
        function ($rootScope, $scope, Settings, Utils, AuthService, Session, EVENT_INFO) {

            const settings = Settings.data;
            const user = $rootScope.currentUser;

            $scope.EVENT_INFO = EVENT_INFO;

            $scope.pastConfirmation = Utils.isAfter(user.status.confirmBy);
            $scope.selectionsOpen = settings.enableSponsors;
            $scope.logout = function () {
                AuthService.logout();
            };

            $scope.showSidebar = false;
            $scope.toggleSidebar = function () {
                $scope.showSidebar = !$scope.showSidebar;
            };

            $scope.isDefneSaylik = function (user) {
                if (user.email == "senyig.20@robcol.k12.tr"){
                    return true;
                }
                else{
                    return false;
                }
            }


            $scope.isYigitSen = function (user) {
                if (user.email == "saydef.20@robcol.k12.tr"){
                    return true;
                }
                else{
                    return false;
                }
            }


            // oh god jQuery hack
            $('.item').on('click', function () {
                $scope.showSidebar = false;
            });

        }]);

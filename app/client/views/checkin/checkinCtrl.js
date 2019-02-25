angular.module('reg')
    .controller('CheckinCtrl', [
        '$scope',
        '$state',
        '$stateParams',
        'UserService',
        function ($scope, $state, $stateParams, UserService) {

            $scope.pages = [];
            $scope.users = [];

            // Semantic-UI moves modal content into a dimmer at the top level.
            // While this is usually nice, it means that with our routing will generate
            // multiple modals if you change state. Kill the top level dimmer node on initial load
            // to prevent this.
            $('.ui.dimmer').remove();
            // Populate the size of the modal for when it appears, with an arbitrary user.


            function updatePage(data) {
                $scope.users = data.users;
                $scope.currentPage = data.page;
                $scope.pageSize = data.size;

                var p = [];
                for (var i = 0; i < data.totalPages; i++) {
                    p.push(i);
                }
                $scope.pages = p;
            }

            UserService
                .getPage($stateParams.page, $stateParams.size, $stateParams.query, $scope.statusFilters)
                .success(function (data) {
                    updatePage(data);
                });

            $scope.$watch('queryText', function (queryText) {
                UserService
                    .getPage($stateParams.page, $stateParams.size, queryText, $scope.statusFilters)
                    .success(function (data) {
                        updatePage(data);
                    });
            });
            $scope.applyStatusFilter = function () {
                UserService
                    .getPage($stateParams.page, $stateParams.size, $scope.queryText, $scope.statusFilters)
                    .success(function (data) {
                        updatePage(data);
                    });
            };


            $scope.goToPage = function (page) {
                $state.go('app.checkin', {
                    page: page,
                    size: $stateParams.size || 100
                });
            };

            $scope.goUser = function ($event, user) {
                $event.stopPropagation();

                $state.go('app.checkin', {
                    id: user._id
                });
            };

            $scope.toggleCheckIn = function ($event, user, index) {
                $event.stopPropagation();

                if (!user.status.checkedIn) {
                    swal({
                            title: "Whoa, wait a minute!",
                            text: "You are about to check in " + user.profile.name + "!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, check them in.",
                            closeOnConfirm: false
                        },
                        function () {
                            UserService
                                .checkIn(user._id)
                                .success(function (user) {
                                    $scope.users[index] = user;
                                    swal("Accepted", user.profile.name + ' has been checked in.', "success");
                                    drawLabel(user.profile.name, user.profile.school);
                                });
                        }
                    );
                } else {
                    UserService
                        .checkOut(user._id)
                        .success(function (user) {
                            $scope.users[index] = user;
                            swal("Accepted", user.profile.name + ' has been checked out.', "success");
                        });
                }
            };

            $scope.rowClass = function (user) {
                if (user.admin) {
                    return 'admin';
                }
                if (user.status.confirmed) {
                    return 'positive';
                }
                if (user.status.admitted && !user.status.confirmed) {
                    return 'warning';
                }
            };



            function openInNewTab(url) {
                var win = window.open(url, '_blank');
                win.focus();
            }

            function drawLabel(name, school) {
                var canvas = document.getElementById("labelCanvas");
                var context = canvas.getContext("2d");

                // Clear canvas
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.font = 'bold 35px Open Sans';
                context.fillText(name, canvas.width / 2 - context.measureText(name).width / 2, 100);
                context.font = '23px Open Sans';
                context.fillText(school, canvas.width / 2 - context.measureText(school).width / 2, 140);
                var dataURL = canvas.toDataURL("image/png");
                openInNewTab(dataURL);
            }

        }]);

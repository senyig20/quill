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
            $scope.selectedUser = {};
            $scope.selectedUser.sections = generateSections({
                status: '', confirmation: {
                    dietaryRestrictions: []
                }, profile: ''
            });

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


            function formatTime(time) {
                if (time) {
                    return moment(time).format('MMMM Do YYYY, h:mm:ss a');
                }
            }

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

            function selectUser(user) {
                $scope.selectedUser = user;
                $scope.selectedUser.sections = generateSections(user);
                $('.long.user.modal')
                    .modal('show');
            }


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

            function generateSections(user) {
                return [
                    {
                        name: 'Basic Info',
                        fields: [
                            {
                                name: 'Created On',
                                value: formatTime(user.timestamp)
                            }, {
                                name: 'Last Updated',
                                value: formatTime(user.lastUpdated)
                            }, {
                                name: 'Confirm By',
                                value: formatTime(user.status.confirmBy) || 'N/A'
                            }, {
                                name: 'Checked In',
                                value: formatTime(user.status.checkInTime) || 'N/A'
                            }, {
                                name: 'Email',
                                value: user.email
                            }
                        ]
                    }, {
                        name: 'Profile',
                        fields: [
                            {
                                name: 'Name',
                                value: user.profile.name
                            }, {
                                name: 'School',
                                value: user.profile.school
                            }, {
                                name: 'Graduation Year',
                                value: user.profile.graduationYear
                            }
                        ]
                    }, {
                        name: 'Confirmation',
                        fields: [
                            {
                                name: 'Phone Number',
                                value: user.profile.phoneNumber
                            }, {
                                name: 'BBQ Reservation?',
                                value: user.profile.bbqChoice
                            }, {
                                name: 'Opening Night Reservation?',
                                value: user.profile.openingChoice
                            }, {
                                name: 'Veggie?',
                                value: user.profile.veggie
                            }, {
                                name: 'ReceiptUploaded?',
                                value: user.confirmation.receiptConfirmation
                            }, {
                                name: 'Additional Notes',
                                value: user.confirmation.notes
                            }, {
                                name: 'Payment Controlled by JARC and Approved?',
                                value: user.status.paymentMade
                            }, {
                                name: 'Group Payment?',
                                value: user.confirmation.groupPayment
                            }, {
                                name: 'Group Payment ID (If by group)',
                                value: user.confirmation.groupid
                            }, {
                                name: 'Receipt Upload Verification (If by themselves) OR Group Payment ID Verification',
                                value: user.confirmation.receiptConfirmation
                            }
                        ]
                    }
                ];
            }

            $scope.selectUser = selectUser;

        }]);

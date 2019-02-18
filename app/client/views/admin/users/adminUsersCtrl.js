angular.module('reg')
    .controller('AdminUsersCtrl', [
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
                $state.go('app.admin.users', {
                    page: page,
                    size: $stateParams.size || 100
                });
            };

            $scope.goUser = function ($event, user) {
                $event.stopPropagation();

                $state.go('app.admin.user', {
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

            $scope.acceptUser = function ($event, user, index) {
                $event.stopPropagation();

                swal({
                    title: "Whoa, wait a minute!",
                    text: "You are about to accept " + user.profile.name + "!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, accept them.",
                    closeOnConfirm: false
                }, function () {

                    swal({
                        title: "Are you sure?",
                        text: "Your account will be logged as having accepted this user. " +
                            "Remember, this power is a privilege.",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, accept this user.",
                        closeOnConfirm: false
                    }, function () {

                        UserService
                            .admitUser(user._id)
                            .success(function (user) {
                                UserService
                                    .sendAcceptEmails(user.email);
                                $scope.users[index] = user;
                                swal("Accepted", user.profile.name + ' has been admitted.', "success");


                            });

                    });

                });

            };
            $scope.toggleAdmin = function ($event, user, index) {
                $event.stopPropagation();

                if (!user.admin) {
                    swal({
                            title: "Whoa, wait a minute!",
                            text: "You are about make " + user.profile.name + " and admin!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, make them an admin.",
                            closeOnConfirm: false
                        },
                        function () {
                            UserService
                                .makeAdmin(user._id)
                                .success(function (user) {
                                    $scope.users[index] = user;
                                    swal("Made", user.profile.name + ' an admin.', "success");
                                });
                        }
                    );
                } else {
                    UserService
                        .removeAdmin(user._id)
                        .success(function (user) {
                            $scope.users[index] = user;
                            swal("Removed", user.profile.name + ' as admin', "success");
                        });
                }
            };
            $scope.acceptPayment = function ($event, user, index) {
                $event.stopPropagation();

                if (!user.status.paymentMade) {
                    swal({
                            title: "Whoa, wait a minute!",
                            text: "You are about accept " + user.profile.name + "'s payment'!",
                            type: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Yes, accept the payment.",
                            closeOnConfirm: false
                        },
                        function () {
                            UserService
                                .acceptPayment(user._id)
                                .success(function (user) {
                                    UserService
                                        .sendPaymentEmails(user.email);
                                    $scope.users[index] = user;
                                    swal("Accepted", user.profile.name + ' has been paid in.', "success");
                                });
                        }
                    );
                } else {
                    UserService
                        .unacceptPayment(user._id)
                        .success(function (user) {
                            $scope.users[index] = user;
                            swal("Accepted", user.profile.name + 's payment has been deleted.', "success");
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

            $scope.exportCSV = function () {
                UserService
                    .getAll()
                    .success(function (data) {

                        var output = '"sep=;"\n"';
                        var titles = generateSections(data[0]);
                        for (var i = 0; i < titles.length; i++) {
                            for (var j = 0; j < titles[i].fields.length; j++) {
                                if (j == titles[i].fields.length) {
                                    output += titles[i].fields[j].name + '";';
                                } else {
                                    output += titles[i].fields[j].name + '"; "';
                                }
                            }
                        }
                        output += '\n';

                        for (var rows = 0; rows < data.length; rows++) {
                            row = generateSections(data[rows]);
                            for (var i = 0; i < row.length; i++) {
                                for (var j = 0; j < row[i].fields.length; j++) {
                                    if (!row[i].fields[j].value) {
                                        output += ";";
                                        continue;
                                    }
                                    var field = row[i].fields[j].value;
                                    try {
                                        output += ' "' + field.replace(/(\r\n|\n|\r)/gm, " ") + '";';
                                    } catch (err) {
                                        output += ' "' + field + '";';
                                    }
                                }
                            }
                            output += "\n";
                        }

                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
                        element.setAttribute('download', "Remixopolis Export " + new Date().toDateString() + ".csv");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                    });
            }


            $scope.getAllAdmittedCSV = function () {
                UserService
                    .getAllAdmitted()
                    .success(function (data) {

                        var output = '"sep=;"\n"';
                        var titles = generateSections(data[0]);
                        for (var i = 0; i < titles.length; i++) {
                            for (var j = 0; j < titles[i].fields.length; j++) {
                                if (j == titles[i].fields.length) {
                                    output += titles[i].fields[j].name + '";';
                                } else {
                                    output += titles[i].fields[j].name + '"; "';
                                }
                            }
                        }
                        output += '\n';

                        for (var rows = 0; rows < data.length; rows++) {
                            row = generateSections(data[rows]);
                            for (var i = 0; i < row.length; i++) {
                                for (var j = 0; j < row[i].fields.length; j++) {
                                    if (!row[i].fields[j].value) {
                                        output += ";";
                                        continue;
                                    }
                                    var field = row[i].fields[j].value;
                                    try {
                                        output += ' "' + field.replace(/(\r\n|\n|\r)/gm, " ") + '";';
                                    } catch (err) {
                                        output += ' "' + field + '";';
                                    }
                                }
                            }
                            output += "\n";
                        }

                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
                        element.setAttribute('download', "Remixopolis Export " + new Date().toDateString() + ".csv");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                    });
            }

            $scope.getConfirmedCSV = function () {
                console.log("Requesting server to export confirmed users as CSV file");
                UserService
                    .getAllConfirmed()
                    .success(function (data) {

                        var output = '"sep=;"\n"';
                        var titles = generateSections(data[0]);
                        for (var i = 0; i < titles.length; i++) {
                            for (var j = 0; j < titles[i].fields.length; j++) {
                                if (j == titles[i].fields.length) {
                                    output += titles[i].fields[j].name + '";';
                                } else {
                                    output += titles[i].fields[j].name + '"; "';
                                }
                            }
                        }
                        output += '\n';

                        for (var rows = 0; rows < data.length; rows++) {
                            row = generateSections(data[rows]);
                            for (var i = 0; i < row.length; i++) {
                                for (var j = 0; j < row[i].fields.length; j++) {
                                    if (!row[i].fields[j].value) {
                                        output += ";";
                                        continue;
                                    }
                                    var field = row[i].fields[j].value;
                                    try {
                                        output += ' "' + field.replace(/(\r\n|\n|\r)/gm, " ") + '";';
                                    } catch (err) {
                                        output += ' "' + field + '";';
                                    }
                                }
                            }
                            output += "\n";
                        }

                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
                        element.setAttribute('download', "Remixopolis Export " + new Date().toDateString() + ".csv");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                    });
            }
            $scope.getUnpaidCSV = function () {
                console.log("Requesting server to export confirmed users as CSV file");
                UserService
                    .getAllUnpaid()
                    .success(function (data) {

                        var output = '"sep=;"\n"';
                        var titles = generateSections(data[0]);
                        for (var i = 0; i < titles.length; i++) {
                            for (var j = 0; j < titles[i].fields.length; j++) {
                                if (j == titles[i].fields.length) {
                                    output += titles[i].fields[j].name + '";';
                                } else {
                                    output += titles[i].fields[j].name + '"; "';
                                }
                            }
                        }
                        output += '\n';

                        for (var rows = 0; rows < data.length; rows++) {
                            row = generateSections(data[rows]);
                            for (var i = 0; i < row.length; i++) {
                                for (var j = 0; j < row[i].fields.length; j++) {
                                    if (!row[i].fields[j].value) {
                                        output += ";";
                                        continue;
                                    }
                                    var field = row[i].fields[j].value;
                                    try {
                                        output += ' "' + field.replace(/(\r\n|\n|\r)/gm, " ") + '";';
                                    } catch (err) {
                                        output += ' "' + field + '";';
                                    }
                                }
                            }
                            output += "\n";
                        }

                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
                        element.setAttribute('download', "Remixopolis Export " + new Date().toDateString() + ".csv");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                    });
            }

            $scope.getFinalCSV = function () {
                console.log("Requesting server to export confirmed users as CSV file");
                UserService
                    .getAllFinal()
                    .success(function (data) {

                        var output = '"sep=;"\n"';
                        var titles = generateSections(data[0]);
                        for (var i = 0; i < titles.length; i++) {
                            for (var j = 0; j < titles[i].fields.length; j++) {
                                if (j == titles[i].fields.length) {
                                    output += titles[i].fields[j].name + '";';
                                } else {
                                    output += titles[i].fields[j].name + '"; "';
                                }
                            }
                        }
                        output += '\n';

                        for (var rows = 0; rows < data.length; rows++) {
                            row = generateSections(data[rows]);
                            for (var i = 0; i < row.length; i++) {
                                for (var j = 0; j < row[i].fields.length; j++) {
                                    if (!row[i].fields[j].value) {
                                        output += ";";
                                        continue;
                                    }
                                    var field = row[i].fields[j].value;
                                    try {
                                        output += ' "' + field.replace(/(\r\n|\n|\r)/gm, " ") + '";';
                                    } catch (err) {
                                        output += ' "' + field + '";';
                                    }
                                }
                            }
                            output += "\n";
                        }

                        var element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
                        element.setAttribute('download', "Remixopolis Export " + new Date().toDateString() + ".csv");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                    });
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

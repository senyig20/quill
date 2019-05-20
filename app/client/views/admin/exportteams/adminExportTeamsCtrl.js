angular.module('reg')
    .controller('AdminExportTeamsCtrl', [
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

                const p = [];
                for (let i = 0; i < data.totalPages; i++) {
                    p.push(i);
                }
                $scope.pages = p;
            }

            UserService
                .getCheckedPageSponsor($stateParams.page, $stateParams.size, $stateParams.query)
                .success(function (data) {
                    updatePage(data);
                });

            $scope.$watch('queryText', function (queryText) {
                UserService
                    .getCheckedPageSponsor($stateParams.page, $stateParams.size, queryText)
                    .success(function (data) {
                        updatePage(data);
                    });
            });


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


            function formatTime(time) {
                if (time) {
                    return moment(time).format('MMMM Do YYYY, h:mm:ss a');
                }
            }

            $scope.rowClass = function (user) {
                if (user.admin) {
                    return 'admin';
                }
                if (user.confirmation.sponsorSelected) {
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
                    .getAllCompaniesSelected()
                    .success(function (data) {

                        let i;
                        let j;
                        let output = '"sep=;"\n"';
                        const titles = generateSections(data[0]);
                        for (i = 0; i < titles.length; i++) {
                            for (j = 0; j < titles[i].fields.length; j++) {
                                if (j == titles[i].fields.length) {
                                    output += titles[i].fields[j].name + '";';
                                } else {
                                    output += titles[i].fields[j].name + '"; "';
                                }
                            }
                        }
                        output += '\n';

                        for (let rows = 0; rows < data.length; rows++) {
                            row = generateSections(data[rows]);
                            for (i = 0; i < row.length; i++) {
                                for (j = 0; j < row[i].fields.length; j++) {
                                    if (!row[i].fields[j].value) {
                                        output += ";";
                                        continue;
                                    }
                                    const field = row[i].fields[j].value;
                                    try {
                                        output += ' "' + field.replace(/(\r\n|\n|\r)/gm, " ") + '";';
                                    } catch (err) {
                                        output += ' "' + field + '";';
                                    }
                                }
                            }
                            output += "\n";
                        }

                        const element = document.createElement('a');
                        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(output));
                        element.setAttribute('download', "Remixopolis Team Export " + new Date().toDateString() + ".csv");
                        element.style.display = 'none';
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);

                    });
            };


            function generateSections(user) {
                return [
                    {
                        name: 'Profile',
                        fields: [
                            {
                                name: 'Name',
                                value: user.profile.name
                            }, {
                                name: 'School',
                                value: user.profile.school
                            }
                        ]
                    }, {
                        name: 'Confirmation',
                        fields: [
                            {
                                name: 'First Choice',
                                value: user.confirmation.firstSponsorChoice
                            }, {
                                name: 'Second Choice',
                                value: user.confirmation.secondSponsorChoice
                            }, {
                                name: 'Final WS Choices in order',
                                value: user.confirmation.signatureLiability
                            }
                        ]
                    }
                ];
            }

            $scope.selectUser = selectUser;

        }]);


angular.module('reg')
    .controller('ApplicationCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        '$http',
        '$window',
        'currentUser',
        'settings',
        'Session',
        'UserService',
        function ($scope, $rootScope, $state, $http, $window, currentUser, Settings, Session, UserService) {


            // Set up the user
            $scope.user = currentUser.data;

            $scope.submitButtonDisabled = true;

            // Is the student from RC?
            $scope.isRCStudent = $scope.user.email.split('@')[1] == 'robcol.k12.tr';

            $scope.$watch('user', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    $scope.submitButtonDisabled = false;
                }
            }, true);

            // Populate the school dropdown
            _setupForm();

            $scope.regIsClosed = Date.now() > Settings.data.timeClose;

            /**
             * TODO: JANK WARNING
             */


            function _updateUser() {
                UserService
                    .updateProfile(Session.getUserId(), $scope.user.profile)
                    .then(response => {
                        swal({
                            title: "Tamamlandı!",
                            text: "Başvurunu aldık!",
                            type: "success",
                            confirmButtonColor: "#31517e"

                        }, function () {
                            $state.go("app.dashboard");

                        });
                    }, response => {
                        swal("Hay Aksi!", "Bir şeyler yanlış gitti.", "error");
                    });
            }



            $scope.formatDate = function (date) {
                if (!date) {
                    return "Invalid Date";
                }

                // Hack for timezone
                return moment(date).format('dddd, MMMM Do YYYY, h:mm a') +
                    " " + date.toTimeString().split(' ')[2];
            };

            // Take a date and remove the seconds.
            function cleanDate(date) {
                return new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    date.getHours(),
                    date.getMinutes()
                );
            }

            $scope.updateRegistrationTimes = function () {
                // Clean the dates and turn them to ms.
                const bday = cleanDate($scope.settings.timeOpen).getTime();

                if (bday < 0 || bday === undefined) {
                    return swal('Oops...', 'You need to enter valid times.', 'error');
                }

                SettingsService
                    .updateRegistrationTimes(open, close)
                    .success(function (settings) {
                        updateSettings(settings);
                    });
            };

            function _setupForm() {

                // Semantic-UI form validation
                $('.ui.form').form({
                    inline: true,
                    fields: {
                        name: {
                            identifier: 'name',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen ismini gir.'
                                }
                            ]
                        },
                        school: {
                            identifier: 'school',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen okulunu gir.'
                                }
                            ]
                        },
                        bday: {
                            identifier: 'bday',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen doğum gününü gir.'
                                }
                            ]
                        },
                        phoneNumber: {
                            identifier: 'phoneNumber',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen cep telefonu numaranı gir.'
                                }
                            ]
                        },
                        bbqChoice: {
                            identifier: 'bbqChoice',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen tercihini seç.'
                                }
                            ]
                        },
                        openingChoice: {
                            identifier: 'openingChoice',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen tercihini seç.'
                                }
                            ]
                        },
                        veggie: {
                            identifier: 'veggie',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen tercihini seç.'
                                }
                            ]
                        }
                    }
                });
            }

            $scope.submitForm = function () {
                if ($('.ui.form').form('is valid')) {
                    _updateUser();
                } else {
                    swal("Hay Aksi!", "Lütfen Formun Gerekli Olan Sorularını Doldur", "error", {confirmButtonColor: "#31517e",});
                }
            };
        }]);

angular.module('reg')
    .controller('SponsorCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        'currentUser',
        'Utils',
        'UserService',
        function ($scope, $rootScope, $state, currentUser, Utils, UserService) {

            // Set up the user
            var user = currentUser.data;
            $scope.user = user;

            $scope.pastConfirmation = Date.now() > user.status.confirmBy;

            $scope.formatTime = Utils.formatTime;

            _setupForm();

            $scope.fileName = user._id + "_" + user.profile.name.split(" ").join("_");

            function _updateUser(e) {
                $scope.user.confirmation.sponsorSelected = true;
                var confirmation = $scope.user.confirmation;
                // Get the dietary restrictions as an array
                var drs = [];


                UserService
                    .updateConfirmation(user._id, confirmation)
                    .then(response => {
                        swal({
                            title: "Tamamlandı!",
                            text: "Firma tercihlerini aldık!",
                            type: "success",
                            confirmButtonColor: "#31517e"

                        }, function () {
                            document.location.reload(true);
                            $state.go("app.dashboard");
                        });
                    }, response => {
                        swal("Hay Aksi!", "Bir şeyler yanlış gitti.", "error");
                    });
            }


            function _setupForm() {
                // Semantic-UI form validation
                $('.ui.form').form({
                    fields: {
                        choice1: {
                            identifier: 'choice1',
                            rules: [
                                {
                                    type: 'different[choice2]',
                                    prompt: 'Lütfen tercihlerini farklı şirketlerden yap.'
                                },
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen tercihini yap.'
                                }
                            ]
                        },
                        choice2: {
                            identifier: 'choice2',
                            rules: [
                                {
                                    type: 'different[choice1]',
                                    prompt: 'Lütfen tercihlerini farklı şirketlerden yap.'
                                },
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen tercihini yap.'
                                }
                            ]
                        },
                    }
                });
            }

            $scope.submitForm = function () {
                if ($('.ui.form').form('is valid')) {
                    _updateUser();
                }
            };

        }]);

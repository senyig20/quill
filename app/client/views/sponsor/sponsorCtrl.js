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
            const user = currentUser.data;
            $scope.user = user;

            $scope.pastConfirmation = Date.now() > user.status.confirmBy;

            $scope.formatTime = Utils.formatTime;

            _setupForm();

            function _updateUser() {

                $scope.user.confirmation.sponsorSelected = true;
                $scope.user.confirmation.signatureLiability = $scope.wshop1 + " " + $scope.wshop2 + " " + $scope.wshop3;
                const confirmation = $scope.user.confirmation;
                // Get the dietary restrictions as an array



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
                        wshop1: {
                            identifier: 'wshop1',
                            rules: [
                                {
                                    type: 'different[wshop2]',
                                    prompt: 'Lütfen tercihlerini farklı şirketlerden yap.'
                                },
                                {
                                    type: 'different[wshop3]',
                                    prompt: 'Lütfen tercihlerini farklı şirketlerden yap.'
                                },
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen tercihini yap.'
                                }
                            ]
                        },
                        wshop2: {
                            identifier: 'wshop2',
                            rules: [
                                {
                                    type: 'different[wshop1]',
                                    prompt: 'Lütfen tercihlerini farklı şirketlerden yap.'
                                },
                                {
                                    type: 'different[wshop3]',
                                    prompt: 'Lütfen tercihlerini farklı şirketlerden yap.'
                                },
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen tercihini yap.'
                                }
                            ]
                        },
                        wshop3: {
                            identifier: 'wshop3',
                            rules: [
                                {
                                    type: 'different[wshop2]',
                                    prompt: 'Lütfen tercihlerini farklı şirketlerden yap.'
                                },
                                {
                                    type: 'different[wshop1]',
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

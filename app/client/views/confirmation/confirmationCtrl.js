angular.module('reg')
    .controller('ConfirmationCtrl', [
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

            function _updateUser(e) {
                const confirmation = $scope.user.confirmation;
                // Get the dietary restrictions as an array

                UserService
                    .updateConfirmation(user._id, confirmation)
                    .then(response => {
                        swal({
                            title: "Tamamlandı!",
                            text: "Teyidini aldık!",
                            type: "success",
                            confirmButtonColor: "#31517e"

                        }, function () {
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
                        signatureLiability: {
                            identifier: 'signatureLiabilityWaiver',
                            rules: [
                                {
                                    type: 'empty',
                                    prompt: 'Lütfen okuduğunu doğrula.'
                                }
                            ]
                        },
                        billPhone: {
                            identifier: 'billPhone',
                            rules: [
                                {
                                    type: 'checked',
                                    prompt: 'Lütfen telefon numaranı gir.'
                                }
                            ]
                        },
                        billID: {
                            identifier: 'billID',
                            rules: [
                                {
                                    type: 'checked',
                                    prompt: 'Lütfen kimlik numaranı gir.'
                                }
                            ]
                        },
                        billAddress: {
                            identifier: 'billAddress',
                            rules: [
                                {
                                    type: 'checked',
                                    prompt: 'Lütfen adresini gir.'
                                }
                            ]
                        },
                        billName: {
                            identifier: 'billName',
                            rules: [
                                {
                                    type: 'checked',
                                    prompt: 'Lütfen fatura ismini gir.'
                                }
                            ]
                        },

                        receiptConfirmation: {
                            identifier: 'receiptConfirmation',
                            rules: [
                                {
                                    type: 'checked',
                                    prompt: 'Lütfen yüklediğini/girdiğini doğrula.'
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

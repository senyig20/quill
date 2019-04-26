angular.module('reg')
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function (
            $stateProvider,
            $urlRouterProvider,
            $locationProvider) {

            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/404");

            // Set up de states
            $stateProvider
                .state('login', {
                    url: "/login",
                    templateUrl: "views/login/login.html",
                    controller: 'LoginCtrl',
                    data: {
                        requireLogin: false
                    },
                    resolve: {
                        'settings': function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }
                    }
                })
                .state('register', {
                    url: "/register",
                    templateUrl: "views/register/register.html",
                    controller: 'RegisterCtrl',
                    data: {
                        requireLogin: false
                    },
                    resolve: {
                        'settings': function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }
                    }
                })

                .state('app', {
                    views: {
                        '': {
                            templateUrl: "views/base.html"
                        },
                        'sidebar@app': {
                            templateUrl: "views/sidebar/sidebar.html",
                            controller: 'SidebarCtrl',
                            resolve: {
                                'settings': function (SettingsService) {
                                    return SettingsService.getPublicSettings();
                                }
                            }

                        }
                    },
                    data: {
                        requireLogin: true
                    }
                })
                .state('app.dashboard', {
                    url: "/",
                    templateUrl: "views/dashboard/dashboard.html",
                    controller: 'DashboardCtrl',
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        },
                        settings: function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }
                    },
                })
                .state('app.application', {
                    url: "/application",
                    templateUrl: "views/application/application.html",
                    controller: 'ApplicationCtrl',
                    data: {
                        requireVerified: true
                    },
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        },
                        settings: function (SettingsService) {
                            return SettingsService.getPublicSettings();
                        }
                    }

                })

                .state('app.checkin', {
                    url: "/checkin",
                    templateUrl: "views/checkin/checkin.html",
                    controller: 'CheckinCtrl',
                    data: {
                        requireAdmin: true
                    },
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        }
                    }
                })
                .state('app.confirmation', {
                    url: "/confirmation",
                    templateUrl: "views/confirmation/confirmation.html",
                    controller: 'ConfirmationCtrl',
                    data: {
                        requireAdmitted: true
                    },
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        }
                    }
                })
                .state('app.sponsor', {
                    url: "/caseSelection",
                    templateUrl: "views/sponsor/sponsor.html",
                    controller: 'SponsorCtrl',
                    data: {
                        requireAdmitted: true
                    },
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        }
                    }
                })
                .state('app.payment', {
                    url: "/payment",
                    templateUrl: "views/payment/payment.html",
                    controller: 'PaymentCtrl',
                    data: {
                        requireAdmitted: true
                    },
                    resolve: {
                        currentUser: function (UserService) {
                            return UserService.getCurrentUser();
                        }
                    }
                })
                .state('app.admin', {
                    views: {
                        '': {
                            templateUrl: "views/admin/admin.html",
                            controller: 'AdminCtrl'
                        }
                    },
                    data: {
                        requireAdmin: true
                    }
                })
                .state('app.admin.stats', {
                    url: "/admin",
                    templateUrl: "views/admin/stats/stats.html",
                    controller: 'AdminStatsCtrl'
                })
                .state('app.admin.exportteams', {
                    url: "/admin/exportteams",
                    templateUrl: "views/admin/exportteams/exportTeams.html",
                    controller: 'AdminExportTeamsCtrl'
                })
                .state('app.admin.users', {
                    url: "/admin/users?" +
                        '&page' +
                        '&size' +
                        '&query',
                    templateUrl: "views/admin/users/users.html",
                    controller: 'AdminUsersCtrl'
                })
                .state('app.admin.user', {
                    url: "/admin/users/:id",
                    templateUrl: "views/admin/user/user.html",
                    controller: 'AdminUserCtrl',
                    resolve: {
                        'user': function ($stateParams, UserService) {
                            return UserService.get($stateParams.id);
                        }
                    }
                })
                .state('app.admin.settings', {
                    url: "/admin/settings",
                    templateUrl: "views/admin/settings/settings.html",
                    controller: 'AdminSettingsCtrl',
                })

                .state('app.godMode', {
                    views: {
                        '': {

                            templateUrl: "views/godMode/admin.html",
                            controller: 'GAdminCtrl'
                        }
                    },
                    data: {
                        requireAdmin: true
                    }
                })
                .state('app.godMode.stats', {
                    url: "/godMode",
                    templateUrl: "views/godMode/stats/stats.html",
                    controller: 'GAdminStatsCtrl'
                })
                .state('app.godMode.exportteams', {
                    url: "/godMode/exportteams",
                    templateUrl: "views/godMode/exportteams/exportTeams.html",
                    controller: 'GAdminExportTeamsCtrl'
                })
                .state('app.godMode.users', {
                    url: "/godMode/users?" +
                        '&page' +
                        '&size' +
                        '&query',
                    templateUrl: "views/godMode/users/users.html",
                    controller: 'GAdminUsersCtrl'
                })
                .state('app.godMode.user', {
                    url: "/godMode/users/:id",
                    templateUrl: "views/godMode/user/user.html",
                    controller: 'GAdminUserCtrl',
                    resolve: {
                        'user': function ($stateParams, UserService) {
                            return UserService.get($stateParams.id);
                        }
                    }
                })
                .state('app.godMode.settings', {
                    url: "/godMode/settings",
                    templateUrl: "views/godMode/settings/settings.html",
                    controller: 'GAdminSettingsCtrl',
                })


                .state('reset', {
                    url: "/reset/:token",
                    templateUrl: "views/reset/reset.html",
                    controller: 'ResetCtrl',
                    data: {
                        requireLogin: false
                    }
                })
                .state('verify', {
                    url: "/verify/:token",
                    templateUrl: "views/verify/verify.html",
                    controller: 'VerifyCtrl',
                    data: {
                        requireLogin: false
                    }
                })
                .state('404', {
                    url: "/404",
                    templateUrl: "views/404.html",
                    data: {
                        requireLogin: false
                    }
                });

            $locationProvider.html5Mode({
                enabled: true,
            });

        }])
    .run([
        '$rootScope',
        '$state',
        'Session',
        function (
            $rootScope,
            $state,
            Session) {

            $rootScope.$on('$stateChangeSuccess', function () {
                document.body.scrollTop = document.documentElement.scrollTop = 0;
            });

            $rootScope.$on('$stateChangeStart', function (event, toState) {
                const requireLogin = toState.data.requireLogin;
                const requireAdmin = toState.data.requireAdmin;
                const requireVerified = toState.data.requireVerified;
                const requireAdmitted = toState.data.requireAdmitted;
                const requireCompletedProfile = toState.data.requireCompletedProfile;


                if (requireLogin && !Session.getToken()) {
                    event.preventDefault();
                    $state.go('login');
                }

                if (requireAdmin && !Session.getUser().admin) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

                if (requireVerified && !Session.getUser().verified) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

                if (requireAdmitted && !Session.getUser().status.admitted) {
                    event.preventDefault();
                    $state.go('app.dashboard');
                }

                if (requireCompletedProfile && !Session.getUser().admin && !Session.getUser().status.completedProfile) {
                    event.preventDefault();
                    $state.go('app.application');
                }

            });

        }]);

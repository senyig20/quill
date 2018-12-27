angular.module('reg')
  .factory('UserService', [
  '$http',
  'Session',
  function($http, Session){

    var users = '/api/users';
    var base = users + '/';

    return {

      // ----------------------
      // Basic Actions
      // ----------------------
      getCurrentUser: function(){
        return $http.get(base + Session.getUserId());
      },

      get: function(id){
        return $http.get(base + id);
      },

      getAll: function(){
        return $http.get(base);
      },

      getPage: function(page, size, text, statusFilters){
        return $http.get(users + '?' + $.param(
          {
            text: text,
            page: page ? page : 0,
            size: size ? size : 100,
            statusFilters: statusFilters ? statusFilters : {}
          })
        );
      },

      updateProfile: function(id, profile){
        return $http.put(base + id + '/profile', {
          profile: profile
        });
      },

      updateConfirmation: function(id, confirmation){
        return $http.put(base + id + '/confirm', {
          confirmation: confirmation
        });
      },

      declineAdmission: function(id){
        return $http.post(base + id + '/decline');
      },

      // -------------------------
      // Admin Only
      // -------------------------

      getStats: function(){
        return $http.get(base + 'stats');
      },

      admitUser: function(id){
        return $http.post(base + id + '/admit');
      },

      checkIn: function(id){
        return $http.post(base + id + '/checkin');
      },

      checkOut: function(id){
        return $http.post(base + id + '/checkout');
      },
      makeAdmin: function(id){
        return $http.post(base + id + '/makeadmin');
      },

      removeAdmin: function(id){
        return $http.post(base + id + '/removeadmin');
      },

      sendLaggerEmails: function() {
        return $http.post(base + 'sendlagemails');
      },
      sendAcceptEmails: function() {
        return $http.post(base + 'sendacceptemails');
      },
    };
  }
  ]);

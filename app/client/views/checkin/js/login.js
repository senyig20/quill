$(document).ready(function() {
  // Config stuff
  $(".header-text").text(APP_NAME);
});

function doLogin() {
  $('.error').text('');
  var username = $('#email').val();
  var password = $('#password').val();
  $.ajax({
    type: "POST",
    url: API_ROOT + '/auth/login',
    data: {email: username, password: password},
    success: function(data) {
      storeJWT(data.token);
      window.location.replace('home.html');
    },
    error: function() {
      $('.error').text('Login failed!');
    }
  });
}

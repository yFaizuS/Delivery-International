$(document).ready(function () {
  $('#form').submit(function (event) {
    event.preventDefault();
    const data = {
      email: $('#email').val(),
      password: $('#password').val()
    };
    const headers = {
      'Content-Type': 'application/json'
    };
    // Get API Login dengan menggunakan method POST
    ajaxRequest(
      'api/account/login',
      'POST',
      JSON.stringify(data),
      function (response) {
        localStorage.setItem('token', response.token)
        window.location.href = 'index.html'
        alert("Login Success");
      },
      function (jqXHR, textStatus, errorThrown) {
        alert(jqXHR.responseJSON.message);
      },
      headers
    );
  });
})
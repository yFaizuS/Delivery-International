$(document).ready(function () {
  $('#form').submit(function (event) {
    event.preventDefault();
    const data = gatherFormData();
    const headers = {
      'Content-Type': 'application/json'
    };
    registerUser(data, headers);
  });
  
  function gatherFormData() {
    return {
      fullName: $('#fullName').val(),
      password: $('#password').val(),
      email: $('#email').val(),
      address: $('#address').val(),
      birthDate: $('#date').val(),
      gender: $('#gender').val(),
      phoneNumber: $('#phoneNumber').val()
    };
  }
  
  function registerUser(data, headers) {
    ajaxRequest(
      'api/account/register',
      'POST',
      JSON.stringify(data),
      function (response) {
        alert('Register berhasil!');
      },
      function (jqXHR, textStatus, errorThrown) {
        alert('Register gagal!');
      },
      headers
    );
  }
  
})


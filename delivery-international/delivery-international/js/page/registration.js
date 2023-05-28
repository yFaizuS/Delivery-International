$(document).ready(function () {
  $('#form').submit(function (event) {
    event.preventDefault();
    const data = {
      fullName: $('#fullName').val(),
      password: $('#password').val(),
      email: $('#email').val(),
      address: $('#address').val(),
      birthDate: $('#date').val(),
      gender: $('#gender').val(),
      phoneNumber: $('#phoneNumber').val()
    }
    const headers = {
      'Content-Type': 'application/json'
    };
    // Fungsi untuk membuat data baru pada API register dan menggunakan endpoint POST
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
  });
})


$(document).ready(function () {
  // Fungsi untuk menampilkan data pada menu profile
  const getProfileAjax = () => {
    const data = "";
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    ajaxRequest(
      'api/account/profile',
      'GET',
      JSON.stringify(data),
      function (response) {
        getProfile(response)
      },
      function (jqXHR, textStatus, errorThrown) {
        // alert(jqXHR);
      },
      headers
    );
  }
  getProfileAjax()
  const getProfile = (data) => {
    $('#fullName').val(data.fullName),
      $('#staticEmail').val(data.email),
      $('#address').val(data.address),
      $('#dateofBirth').val(data.birthDate.split("T")[0]),
      $('#gender').val(data.gender),
      $('#phoneNumber').val(data.phoneNumber)
  }
  // Fungsi untuk mengedit data dengan menggunakan endpoint PUT
  $("#formProfile").on('submit', (e) => {
    e.preventDefault()
    const data = {
      fullName: $('#fullName').val(),
      birthDate: $('#dateofBirth').val(),
      gender: $('#gender').val(),
      address: $('#address').val(),
      phoneNumber: $('#phoneNumber').val()
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    ajaxRequest(
      'api/account/profile',
      'PUT',
      JSON.stringify(data),
      function (response) {
        getProfileAjax()
        alert("Berhasil update data")
      },
      function (jqXHR, textStatus, errorThrown) {
        // alert(jqXHR);
        if (jqXHR.status == 200) {
          alert("Berhasil update data")
        } else {
          alert("gagal")
        }
      },
      headers
    );
  })
})





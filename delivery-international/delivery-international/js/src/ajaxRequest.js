$(document).ready(function () {
  const token = localStorage.getItem('token')
  const currentPath = window.location.href;
  const splitUrl = currentPath.split("/")
  const urlPath = splitUrl[splitUrl.length - 1].split(".")[0]
  if ((urlPath != 'registration' || urlPath != 'login') && !token) {
    $('#statusUser').attr('href', "login.html");
    $('#statusUser').html('login');
  } else if (token) {
    getUser()
    if (urlPath == 'registration' || urlPath == 'login') {
      window.location.href = "index.html"
    }
    $('#statusUser').attr('href', '');
    $('#statusUser').html('logout');
    const email = localStorage.getItem('email')
    $('#navEmail').html(`${email || 'example@mail.ru'}`);
    $("#statusUser").click(function (event) {
      event.preventDefault();
      logout(splitUrl)
    });
  }
})
function ajaxRequest(url, method, data = {}, successCallback, errorCallback, headers = {}) {
  const currentPath = window.location.href;
  const splitUrl = currentPath.split("/")
  const urlPath = splitUrl[splitUrl.length - 1].split(".")[0]
  $.ajax({
    url: `https://food-delivery.kreosoft.ru/${url}`, //Mendefinisikan link API yang akan dipakai
    method: method,
    data: data,
    dataType: 'json',
    headers: headers,
    success: function (response) {
      successCallback(response);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      errorCallback(jqXHR, textStatus, errorThrown);
      if (jqXHR.status == 401) {
        localStorage.clear()
        alert("sesi login habis")
        if (urlPath != "login" || urlPath != "register")
          window.location.href = "index.html"
      }
    }
  });
}
// Fungsi untuk menampilkan data pengguna pada profile
const getUser = () => {
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
      localStorage.setItem('email', response.email)
    },
    function (jqXHR, textStatus, errorThrown) {
      // alert(jqXHR);
    },
    headers
  );
}
// Fungsi untuk log out
const logout = () => {
  localStorage.clear()
  window.location.href = "index.html"
  alert("Berhasil logout")
}

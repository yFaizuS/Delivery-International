$(document).ready(function () {
  const urlParams = new URLSearchParams(window.location.search);
  const idParams = urlParams.get('id')
  const data = {}
  // Fungsi untuk mehit API dish sesuai dengan id nya dan menggunakan endpoint get
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  };
  ajaxRequest(
    `api/dish/${idParams}`,
    'GET',
    JSON.stringify(data),
    function (response) {
      console.log(response.description)
      $("#title").html(`Dish category - ${response.category} <br> ${response.vegetarian ? 'vegetarian' : 'Not vegetarian'}`)
      $("#deskripsi").html(`${response.description}`)
      $("#harga").text(`${response.price} p`)
    },
    function (jqXHR, textStatus, errorThrown) {
      // window.location.href = "order.html"
    },
    headers
  );
  // Fungsi untuk memberikan rating mulai dengan 1 - 10
  const a = Array(10).fill(1)
  for (let i = 1; i <= a.length; i++) {
    const a = $(`#star${i}`)
    a.on('click', () => {
      const rate = i
      const data = {}
      // Fungsi untuk memberikan rating sesuai dengan idnya dan berdasarkan perulangan yang udah dibuat diatas menggunakan endpoint POST
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      };
      ajaxRequest(
        `api/dish/${idParams}/rating?ratingScore=${i}`,
        'POST',
        JSON.stringify(data),
        function (response) {
          alert("Berhasil Memberi Rate")
        },
        function (jqXHR, textStatus, errorThrown) {
          // alert(jqXHR);
          if (jqXHR.status == 200) {
            alert("Berhasil Memberi Rate")
            window.location.href = "order.html"
          } else {
            alert("Gagal Memberi Rate")
          }
        },
        headers
      );

    })
  }
});
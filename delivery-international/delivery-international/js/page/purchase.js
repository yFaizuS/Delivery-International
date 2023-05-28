$(document).ready(function () {
  const getCart = () => {
    const data = "";
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    ajaxRequest(
      'api/basket',
      'GET',
      JSON.stringify(data),
      function (response) {
        $.each(response, function (index, item) {
          const html = `
                  <div class="row mb-3 border py-2" >
                    <div for="fullName" class="col-sm-2 text-center text-md-start">
                      <img src="${item.image}" width="100" height="80" alt="Image" class="rounded border rounded-5">
                    </div>
                    <div for="fullName" class="col-sm-3 text-center text-md-start">
                      <p class="text-bold">${item.name}</p>
                      <p>Price/dish: ${item.price} P</p>
                      <p>Quantitiy: 2</p>
                    </div>
                    <div class="col-sm-7 text-center text-md-end">
                        <p class="mt-md-5 pt-md-4"><strong>Total order cost:</strong> ${item.totalPrice} P</p>
                    </div>      
                  </div>      
            `
          $('#cartItemsContainer').append(html)
        })
        const total = response.reduce(function (accumulator, item) {
          return accumulator + item.totalPrice;
        }, 0);
        $("#totalPriceAll").html(`<strong>Total:</strong> ${total} P`);
      },
      function (jqXHR, textStatus, errorThrown) {
      },
      headers
    );

  }
  getCart()
  // Fungsi untuk membuat sebuah orderan berdasarkan data didalam fungsi data
  const getPurchaseAjax = () => {
    const data = {
      deliveryTime: $("#date").val(),
      address: $("#address").val(),
      email: $("#email").val(),
      phoneNumber: $("#phoneNumber").val()
    }
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    ajaxRequest(
      'api/order',
      'POST',
      JSON.stringify(data),
      function (response) {
        purchaseSuccess()
      },
      function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 200) {
          purchaseSuccess()
        }
      },
      headers
    );
  }
  const purchaseSuccess = () => {
    window.location.href = "orders.html"
  }
  $("#submitPurchase").on("submit", (e) => {
    e.preventDefault()
    getPurchaseAjax()
  })

});
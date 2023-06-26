const jquery = require('jquery');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
const { window } = dom;

global.window = window;
global.document = window.document;
const $ = jquery(window);

global.localStorage = {
  store: {},
  getItem(key) {
    return this.store[key];
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
};

const ajaxRequest = (
  url,
  method,
  data,
  successCallback,
  errorCallback,
  headers,
  xhr = new XMLHttpRequest() // Default to new XMLHttpRequest if not provided
) => {
  xhr.addEventListener('load', () => {
    if (xhr.status === 200) {
      successCallback(JSON.parse(xhr.responseText));
    } else {
      errorCallback(xhr, xhr.statusText, xhr.responseText);
    }
  });

  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  for (const header in headers) {
    if (headers.hasOwnProperty(header)) {
      xhr.setRequestHeader(header, headers[header]);
    }
  }
  xhr.send(data);
};

module.exports = ajaxRequest;

$(document).ready(function () {
  const localStorageId = localStorage.getItem("detailOrderId")
  const urlParams = new URLSearchParams(window.location.search);
  const idParams = urlParams.get('id')
  const convertDate = (originalDateTime) => {
    const dateTime = new Date(originalDateTime);
    const returnDate = dateTime.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.');
    return `${returnDate} ${dateTime.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }
  // Fungsi untuk melihat data pada detail order dengan menggunakan API order dan endpoint GET
  const getDetailOrderajax = (id) => {
    const data = "";
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    ajaxRequest(
      `api/order/${id}`,
      'GET',
      JSON.stringify(data),
      function (response) {
        getDetailOrder(response)
      },
      function (jqXHR, textStatus, errorThrown) {
      },
      headers
    );
  }
  if (localStorageId == idParams) {
    getDetailOrderajax(idParams)
  } else {
    getDetailOrderajax(localStorageId)
  }
  // Fungsi untuk menampilkan data yang sudah dihit di atas dan ditampilakn di HTML dibawah
  const getDetailOrder = (res) => {
    $.each(res.dishes, function (index, item) {
      const html = `
              <div for="fullName" class="row mb-3 border py-2" id="redirecttoItem" data-item-id="${item.id}">
                <div for="fullName" class="col-sm-2 text-center text-md-start">
                  <img src="${item.image}" width="100" height="80" alt="Image" class="rounded border rounded-5">
                </div>
                <div for="fullName" class="col-sm-3 text-center text-md-start">
                  <p class="text-bold">${item.name}</p>
                  <p>Price/dish: ${item.price} P</p>
                  <p>Quantitiy: ${item.amount}</p>
                </div>
                <div class="col-sm-7 text-center text-md-end">
                    <p class="mt-md-5 pt-md-4"><strong>Total order cost:</strong> ${item.totalPrice} P</p>
                </div>      
              </div>      
        `
      $('#cartItemsContainer').append(html)
      $("#total").html(`<strong>Total:</strong> ${res.price} P`)
    })
    // Fungsi convertDate merupakan convert data yang sesuai dengan API
    const html = `
      <p>Created at: ${convertDate(res.orderTime)}</p> 
      <p>Delivery time: ${convertDate(res.deliveryTime)}</p>
      <p>Delivery address: ${res.address}</p>
      <p>Order status - ${res.status}</p>
    `
    $("#detailInfo").html(html)
  }
  $(document).on("click", "#redirecttoItem", function(){
    const id = $(this).data("item-id")
    window.location.href = `item.html?id=${id}`
  })
});
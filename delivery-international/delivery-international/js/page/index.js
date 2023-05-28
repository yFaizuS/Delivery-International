// Fungsi untuk checkbox
document.addEventListener('DOMContentLoaded', function () {
  const vegetarianCheckbox = document.getElementById('vegetarianCheckbox');
  vegetarianCheckbox.addEventListener('change', function () {
    const isChecked = vegetarianCheckbox.checked;
    const label = document.querySelector('.form-check-label');
    if (isChecked) {
      label.classList.add('text-warning');
    } else {
      label.classList.remove('text-warning');
    }
  });
});


$(document).ready(function () {
  let type = ""
  let urutan = ""
  let vegetarianCheckbox = ""
  const data = "";
  const headers = {
    'Content-Type': 'application/json',
  };
  // Fungsi untuk menampilkan semua data makanan dan minuman pada API dish dengan menggunakan method GET
  ajaxRequest(
    'api/dish',
    'GET',
    JSON.stringify(data),
    function (response) {
      getDish(response.dishes)
    },
    function (jqXHR, textStatus, errorThrown) {
    },
    headers
  );
  // Fungsi untuk menampilkan semua data yang sudah di hit diatas dan diimplementasikan dalam HTML dibawah
  const getDish = (data) => {
    $("#dishId").empty()
    $.each(data, function (index, item) {
      const html = `<div class="col-sm-3 text-center text-md-start">
    <img src="${item.image}" width="100%" height="30%" alt="testing">
    <div class="border">
        <div class="px-2 py-2">
            <p>${item.name}</p>
            <P>Dish Category - ${item.category}</P>
            <div class="rating text-center py-1 pb-1 d-flex justify-content-center">
              <span class="fa fa-star ${item.rating >= 1 ? 'checkeds' : ''}"></span>
              <span class="fa fa-star ${item.rating >= 2 ? 'checkeds' : ''}"></span>
              <span class="fa fa-star ${item.rating >= 3 ? 'checkeds' : ''}"></span>
              <span class="fa fa-star ${item.rating >= 4 ? 'checkeds' : ''}"></span>
              <span class="fa fa-star ${item.rating >= 5 ? 'checkeds' : ''}"></span>
              <span class="fa fa-star ${item.rating >= 6 ? 'checkeds' : ''}"></span>
              <span class="fa fa-star ${item.rating >= 7 ? 'checkeds' : ''}"></span>
              <span class="fa fa-star ${item.rating >= 8 ? 'checkeds' : ''}"></span>
              <span class="fa fa-star ${item.rating >= 9 ? 'checkeds' : ''}"></span>
              <span class="fa fa-star ${item.rating >= 10 ? 'checkeds' : ''}"></span>
            </div>
            <p>${item.description}</p>
            <div class="row bg-light">
                <div class="col-sm-6 text-center text-lg-start pt-1 pt-lg-3">
                    <p>Price - ${item.price}</p>
                </div>
                <div class="col-sm-6 text-center text-lg-end py-1 py-lg-2">
                    <button class="btn btn-primary" id="buttonClick" data-item-id="${item.id}">Add to
                        cart</button>
                </div>
            </div>
        </div>
    </div>
    </div>`
      $("#dishId").append(html);
    });
  }
  // Fungsi untuk membuat cart baru denan menggunakan api dish dan berdasarkan Id dengan method POST
  const createCart = (id) => {
    const data = "";
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    };
    ajaxRequest(
      `api/basket/dish/${id}`,
      'POST',
      JSON.stringify(data),
      function (response) {
        alert("Berhasil menambahkan ke cart")
      },
      function (jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 200) {
          alert("Berhasil menambahkan ke cart")
        } else {
          alert("Gagal menambahkan ke cart")
        }
      },
      headers
    );
  }

  $(document).on("click", "#buttonClick", function () {
    const itemId = $(this).data("item-id");
    createCart(itemId);
  });

  //pagination
  const paginationData = {
    size: 5,
    count: 8,
    current: 1
  };

  var paginationElement = $('#pagination');
  var previousItem = $('<li class="page-item" id="sebelum"><a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>');
  var nextItem = $('<li class="page-item" id="sesudah"><a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>');


  const currentChange = (j) => {
    paginationElement.empty();
    // Menambahkan tombol "Previous"
    if (paginationData.current > 1) {
      paginationData.current++
    } else {
      previousItem.addClass('disabled');
    }
    paginationElement.append(previousItem);

    // Menambahkan halaman-halaman
    for (var i = paginationData.current - Math.floor(paginationData.size / 2); i <= paginationData.current + Math.floor(paginationData.size / 2); i++) {
      if (i > 0 && i <= paginationData.count) {
        var listItem = $(`<li class="page-item" id="itemLink" data-item-bgt="${i}"><a class="page-link" href="#">` + i + '</a></li>');
        if (i === j) {
          listItem.addClass('active');
        }
        paginationElement.append(listItem);
      }
    }

    // Menambahkan tombol "Next"
    if (paginationData.current < paginationData.count) {
      // nextItem.find('a').attr('href', "#");
    } else {
      nextItem.addClass('disabled');
    }
    paginationElement.append(nextItem);
  }

  const proxy = new Proxy(paginationData, {
    set(target, key, value) {
      currentChange(value)
      console.log(target)
      const typeUrl = `&categories=${type}`
      const urutanUrl = `&sorting=${urutan}`
      const url = `api/dish?vegetarian=${vegetarianCheckbox || false}${type != 0 ? typeUrl : ''}${urutan != 0 ? urutanUrl : ''}&page=${value}`
      ajaxRequest(
        url,
        'GET',
        JSON.stringify(data),
        function (response) {
          getDish(response.dishes)
        },
        function (jqXHR, textStatus, errorThrown) {
        },
        headers
      );
      target[key] = value;
      return true;
    },

  })
  $(document).on("click", "#sebelum", function (e) {
    e.preventDefault()
    if (paginationData.current > 1) {
      proxy.current--
    }
  });
  $(document).on("click", "#sesudah", function (e) {
    e.preventDefault()
    if (paginationData.current < paginationData.count) {
      proxy.current++
    }
  });
  $(document).on("click", "#itemLink", function () {
    const itemId = $(this).data("item-bgt");
    proxy.current = itemId
  });
  currentChange(1)
  $("#aplyFilter").on("click", () => {
    type = $("#type").val()
    urutan = $("#urutan").val()
    vegetarianCheckbox = $("#vegetarianCheckbox").prop("checked");
    const typeUrl = `&categories=${type}`
    const urutanUrl = `&sorting=${urutan}`
    const url = `api/dish?vegetarian=${vegetarianCheckbox}${type != 0 ? typeUrl : ''}${urutan != 0 ? urutanUrl : ''}`
    ajaxRequest(
      url,
      'GET',
      JSON.stringify(data),
      function (response) {
        getDish(response.dishes)
        proxy.current = 1
        currentChange(1)
      },
      function (jqXHR, textStatus, errorThrown) {
      },
      headers
    );

  })
});









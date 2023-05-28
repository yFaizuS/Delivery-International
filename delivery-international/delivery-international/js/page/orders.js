$(document).ready(function () {
    const convertDate = (originalDateTime, format) => {
        const dateTime = new Date(originalDateTime);
        const returnDate = dateTime.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        }).replace(/\//g, '.');
        if (format === 1) {
            return returnDate
        } else {
            return `${returnDate} ${dateTime.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
        }
    }
    const getOrdersAjax = () => {
        const data = "";
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
        ajaxRequest(
            'api/order',
            'GET',
            JSON.stringify(data),
            function (response) {
                getOrders(response)
            },
            function (jqXHR, textStatus, errorThrown) {
            },
            headers
        );
    }
    getOrdersAjax()
    const getOrders = (res) => {
        $("#cartItemsContainer").empty()
        $.each(res, function (index, item) {
            let buttonHtml = '';
            if (item.status === 'InProcess') {
                buttonHtml = `<button type="submit" class="btn btn-outline-success" id="confirmDelivery" data-delifery-id="${item.id}">Confirm delivery</button>`;
            } else {
                buttonHtml = '';
            }
            const html = `<div class="row mb-3 border py-2" id="keditail" data-detail-id="${item.id}">
                        <div class="col-sm-8 text-center text-md-start">
                            <p class="text-bold">Order from ${convertDate(item.orderTime, 1)}</p>
                            <p>Order status - ${item.status}</p>
                            <p>Delivery time: ${convertDate(item.deliveryTime, 2)}</p>
                        </div>
                        <div class="col-sm-4 text-center text-md-end">
                            ${buttonHtml}
                            <p class="mt-4"><strong>Total order cost:</strong> ${item.price} P</p>
                        </div>                          
                    </div>`
            $("#cartItemsContainer").append(html)
        })
    }
    $(document).on("click", "#confirmDelivery", function (e) {
        e.stopPropagation();
        const itemId = $(this).data("delifery-id");
        const data = "";
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        };
        ajaxRequest(
            `api/order/${itemId}/status`,
            'POST',
            JSON.stringify(data),
            function (response) {
                getOrdersAjax()
            },
            function (jqXHR, textStatus, errorThrown) {
                if (jqXHR.status == 200) {
                    getOrdersAjax()
                    alert("Orderan telah dikonfirmasi")
                } else {
                    alert("Gagal mengkonfirmasi orderan")
                }
            },
            headers
        );
    });
    $(document).on("click", "#keditail", function () {
        const id = $(this).data("detail-id")
        localStorage.setItem("detailOrderId", id)
        window.location.href = `order.html?id=${id}`
    })

});

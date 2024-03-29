let stripe = Stripe('pk_test_51MeGJpIG6iYiFUbaIobIBXCSuSzXZea0wToMDNxGsGOeg2aEztxCRfMPe59ICUGgiJglpgsMp7lHC5lHNIvPzEOo00376jyI5R');

let elem = document.getElementById('submit');
clientsecret = elem.getAttribute('data-secret');

// Set up Stripe.js and Elements to use in checkout form
let elements = stripe.elements();
    let style = {
        base: {
          color: "#000",
          lineHeight: '2.4',
          fontSize: '16px'
    }
};
let card = elements.create("card", { style: style });
card.mount("#card-element");

card.on('change', function(event) {
    let displayError = document.getElementById('card-errors')
    if (event.error) {
      displayError.textContent = event.error.message;
      $('#card-errors').addClass('alert alert-info');
    } else {
      displayError.textContent = '';
      $('#card-errors').removeClass('alert alert-info');
    }
});

let form = document.getElementById('payment-form');

form.addEventListener('submit', function(ev) {
    ev.preventDefault();

let custName = document.getElementById("custName").value;
let custAdd = document.getElementById("custAdd").value;
let custAdd2 = document.getElementById("custAdd2").value;
let postCode = document.getElementById("pos tCode").value;


  $.ajax({
    type: "POST",
    url: 'http://127.0.0.1:8000/order/add/',
    data: {
      order_key: clientsecret,
      csrfmiddlewaretoken: CSRF_TOKEN,
      action: "post",
    },
    success: function (json) {
      console.log(json.success)

      stripe.confirmCardPayment(clientsecret, {
        payment_method: {
          card: card,
          billing_details: {
            address:{
                line1:custAdd,
                line2:custAdd2
            },
            name: custName
          },
        }
      }).then(function(result) {
        if (result.error) {
          console.log('payment error')
          console.log(result.error.message);
        } else {
          if (result.paymentIntent.status === 'succeeded') {
            console.log('payment processed')
            window.location.replace("http://127.0.0.1:8000/payment/orderplaced/");
          }
        }
      });
    },
    error: function (xhr, errmsg, err) {},
  });
});

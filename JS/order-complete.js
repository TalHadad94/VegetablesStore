paypal.Buttons({
    createOrder: function (data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: "10.00" // Replace with actual order amount
                }
            }]
        });
    },
    onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
            alert("Payment successful! Thank you, " + details.payer.name.given_name);
        });
    },
    onError: function (err) {
        console.error("PayPal Checkout Error:", err);
    }
}).render("#paypal-button-container");
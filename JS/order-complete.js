// Get the total from localStorage
const total = parseFloat(localStorage.getItem('orderTotal'));

// Check if the total was retrieved correctly
if (!isNaN(total)) {
    console.log('Total retrieved:', total);  // Verify the total
} else {
    console.log('Total not found!');
}

// PayPal button integration
paypal.Buttons({
    createOrder: function (data, actions) {
        return actions.order.create({
            purchase_units: [{
                amount: {
                    value: total.toFixed(2)  // Use the dynamic total here
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

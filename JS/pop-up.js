// Pop-Up
document.addEventListener("DOMContentLoaded", function () {
    const addressInput = document.getElementById("address");
    const phoneInput = document.getElementById("phone");
    const confirmButton = document.getElementById("confirm-order");

    function openPopup(type) {
        const total = document.getElementById('total-price').textContent;
        document.getElementById('popup-message').textContent = `סה\"כ לתשלום: ${total}`;
        
        const addressLabel = document.getElementById('address-label');
        
        if (type === 'Delivery') {
            addressLabel.textContent = "כתובת למשלוח:";
            addressInput.value = "";
            addressInput.placeholder = "הכנס כתובת למשלוח";
            addressInput.disabled = false;
        } else {
            addressLabel.textContent = "כתובת לאיסוף:";
            addressInput.value = "חיים משה שפירא 17, אשדוד";
            addressInput.disabled = true;
        }

        document.getElementById('popup').classList.remove('hidden');
    }

    function closePopup() {
        document.getElementById('popup').classList.add('hidden');
    }

    document.getElementById('pick-up').addEventListener('click', () => openPopup('Pick Up'));
    document.getElementById('delivery').addEventListener('click', () => openPopup('Delivery'));
    document.getElementById('close-popup').addEventListener('click', () => closePopup());

    document.addEventListener('click', (event) => {
        const popupContent = document.getElementById('popup-content');
        if (!popupContent.contains(event.target) && !event.target.closest('#customer-preference')) {
            closePopup();
        }
    });

    function isValidPhone(phone) {
        return /^05\d{8}$/.test(phone);
    }

    function isValidAddress(address) {
        return address.length > 5;
    }

    function validateForm() {
        const addressValid = isValidAddress(addressInput.value);
        const phoneValid = isValidPhone(phoneInput.value);

        confirmButton.disabled = !(addressValid && phoneValid);
    }

    addressInput.addEventListener("input", validateForm);
    phoneInput.addEventListener("input", validateForm);
});

document.getElementById("confirm-order").addEventListener("click", function () {
    window.location.href = "HTML/order-complete.html";
});
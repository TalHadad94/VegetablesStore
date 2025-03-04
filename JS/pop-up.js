let orderType = ""; // Will store "Pick Up" or "Delivery"

// Pop-Up
document.addEventListener("DOMContentLoaded", function () {
    const addressInput = document.getElementById("address");
    const phoneInput = document.getElementById("phone");
    const nameInput = document.getElementById("customer");
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

    document.getElementById('pick-up').addEventListener('click', () => {
        orderType = "איסוף עצמי";
        openPopup('Pick Up');
    });

    document.getElementById('delivery').addEventListener('click', () => {
        orderType = "משלוח";
        openPopup('Delivery');
    });

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
        return address.length > 3;
    }

    function isValidName(name) {
        return /^[a-zA-Zא-ת\s]{2,}$/.test(name.trim());
    }

    function validateForm() {
        const addressValid = isValidAddress(addressInput.value);
        const phoneValid = isValidPhone(phoneInput.value);
        const nameValid = isValidName(nameInput.value);

        confirmButton.disabled = !(addressValid && phoneValid && nameValid);
    }

    addressInput.addEventListener("input", validateForm);
    phoneInput.addEventListener("input", validateForm);
    nameInput.addEventListener("input", validateForm);
});

// Redirect the page to order-complete.html and send message to Cloudflare Worker
document.getElementById("confirm-order").addEventListener("click", function () {
    const workerUrl = "https://workers-telegram-broad-sun-41e6.talsmd95-a82.workers.dev/"; // Change this!

    // Get input values
    const address = document.getElementById("address").value || "חיים משה שפירא 17, אשדוד"; // Default for Pick-up
    const phoneNumber = document.getElementById("phone").value;
    const customerName = document.getElementById("customer").value;
    const total = document.getElementById('total-price').textContent;

    // Get the current date and time
    const now = new Date();
    const daysHebrew = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    const dayOfWeek = daysHebrew[now.getDay()];
    const date = `${now.getDate()}/${now.getMonth() + 1}`;
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
    const dateTime = `יום ${dayOfWeek} ${date} בשעה ${time}`;

    // Get the items list
    let itemsList = "";
    const basketList = document.querySelectorAll(".basket-item");

    basketList.forEach((item) => {
        const itemName = item.childNodes[0]?.textContent.trim() || "שם לא נמצא"; 
        itemsList += `\n📌 ${itemName}\n`;
    });

    // Prepare data for Cloudflare Worker
    const orderData = {
        customerName,
        address,
        phoneNumber,
        total,
        itemsList,
        orderType: "משלוח", // You can modify this dynamically if needed
        dateTime
    };

    // Send the message via Cloudflare Worker
    fetch(workerUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "HTML/order-complete.html";
        } else {
            console.error("Error sending order:", data);
        }
    })
    .catch(error => console.error("Error:", error));
});

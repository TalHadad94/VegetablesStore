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

// Redirect the page to order-complete.html and send message to Telegram Bot
document.getElementById("confirm-order").addEventListener("click", function () {
    const botToken = "7829854073:AAGpJRL6779AtCHoNS84gFfDkycCraXFzeo";
    const chatId = "-1002438314464";

    // Get the input values
    const address = document.getElementById("address").value || "חיים משה שפירא 17, אשדוד"; // Default for Pick-up
    const phoneNumber = document.getElementById("phone").value;
    const customerName = document.getElementById("customer").value;

    // Get the price value
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

    basketList.forEach((item, index) => {
        // Extract name dynamically
        const itemName = item.childNodes[0]?.textContent.trim() || "שם לא נמצא"; 

        // Append to itemsList
        itemsList += `\n📌 ${itemName}\n`;
    });

    // Create the message for Telegram
    const message = `${dateTime}\nסוג הזמנה: ${orderType}\nשם הלקוח: ${customerName}\nכתובת: ${address}\nטלפון: ${phoneNumber}\n\n💰 סה"כ לתשלום: ${total}\n\n🛒 פרטי ההזמנה: ${itemsList}`;
    console.log("Final Message to Telegram:\n", message);
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

    // Send the message to Telegram and store total before redirect
    fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: message })
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = "HTML/order-complete.html";
    })
    .catch(error => console.error("Error sending message:", error));
});

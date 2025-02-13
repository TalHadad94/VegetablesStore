// Navbar Scroll Fix
document.querySelectorAll("#main-nav a").forEach(link => {
    link.addEventListener("click", function(event) {
        event.preventDefault(); // Prevent default jump
        let targetId = this.getAttribute("href").substring(1); // Get section ID
        let targetElement = document.getElementById(targetId);

        if (targetElement) {
            let headerHeight = document.querySelector("header").offsetHeight; // Get header height
            let targetPosition = targetElement.offsetTop - headerHeight; // Adjust for header

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth" // Smooth scroll effect
            });
        }
    });
});

// Function to dynamically generate items and attach advanced basket controls
function generateItems() {
    fetch('output.json') // Fetch data from the JSON file
        .then(response => response.json())
        .then(items => {
            // Clear previous items in sections
            document.querySelectorAll('.menu').forEach(menu => (menu.innerHTML = ''));

            // Loop through all items
            items.forEach(item => {
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("product-item"); // Generic class for styling
                itemDiv.dataset.name = item.name; // Store the item's name as a data attribute
                itemDiv.dataset.unit = item.units; // Store the item's unit type
                itemDiv.dataset.price = item.price; // Store the item's price

                const detailsContainer = document.createElement("div");
                detailsContainer.classList.add("details-container");

                // Add product image
                const img = document.createElement("img");
                img.src = item.imagePath;
                img.alt = item.name;
                img.classList.add("product-img");
                detailsContainer.appendChild(img);

                // Add text details
                const textDetails = document.createElement("div");
                textDetails.classList.add("text-details");
                
                const name = document.createElement("p");
                name.textContent = item.name;
                name.classList.add("item-name");
                textDetails.appendChild(name);
                
                const price = document.createElement("p");
                price.textContent = `${item.price.toFixed(2)} ₪ | ל${item.units}`;
                price.classList.add("item-price");
                textDetails.appendChild(price);
                
                detailsContainer.appendChild(textDetails);

                // Add quantity control buttons and display
                const controlContainer = document.createElement("div");
                controlContainer.classList.add("control-container");

                const decreaseButton = document.createElement("button");
                decreaseButton.textContent = "-";
                decreaseButton.classList.add("decrease-button");

                const amountDisplay = document.createElement("span");
                amountDisplay.textContent = item.units === "יחידה" || item.units === "מארז" ? "0" : "0";
                amountDisplay.classList.add("amount-display");

                const increaseButton = document.createElement("button");
                increaseButton.textContent = "+";
                increaseButton.classList.add("increase-button");

                controlContainer.appendChild(increaseButton);
                controlContainer.appendChild(amountDisplay);
                controlContainer.appendChild(decreaseButton);

                detailsContainer.appendChild(controlContainer);
                
                itemDiv.appendChild(detailsContainer);

                // Add event listeners for quantity control
                const basketList = document.getElementById('basket-list');

                const updateBasket = (operation) => {
                    let amount = parseFloat(amountDisplay.textContent);
                    const step = item.units === "יחידה" || item.units === "מארז" ? 1 : 0.5;
                    const minAmount = item.units === "יחידה" || item.units === "מארז" ? 0 : 0.0;

                    if (operation === "increase") {
                        amount += step;
                    } else if (operation === "decrease") {
                        amount = Math.max(minAmount, amount - step);
                    }

                    amount = parseFloat(amount.toFixed(1));
                    amountDisplay.textContent = amount;

                    if (amount === minAmount && operation === "decrease") {
                        removeBasketItem(item.name); // Remove if below minimum
                    } else {
                        addBasketItem(item.name, amount, item.price); // Update basket
                    }
                };

                decreaseButton.addEventListener("click", () => updateBasket("decrease"));
                increaseButton.addEventListener("click", () => updateBasket("increase"));

                // Append item to the correct section
                const section = document.querySelector(`#${item.section} .menu`);
                if (section) {
                    section.appendChild(itemDiv);
                }
            });
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// Initialize items
document.addEventListener("DOMContentLoaded", () => {
    generateItems();
});


// Add or update item in the basket
function addBasketItem(itemName, amount, price) {
    const basketList = document.getElementById('basket-list');
    let listItem = Array.from(basketList.children).find(item => item.dataset.name === itemName);

    // Check screen width and truncate itemName for smaller screens
    const isSmallScreen = window.innerWidth < 600;
    const truncatedItemName = isSmallScreen && itemName.length > 22 
        ? itemName.slice(0, 19) + '...' 
        : itemName;

    // Calculate total price
    const ItemTotal = (amount * price).toFixed(2);

    if (!listItem) {
        listItem = document.createElement('li');
        listItem.dataset.name = itemName;

        // Apply styles for spacing and list dots
        listItem.style.display = 'flex';
        listItem.style.alignItems = 'center';
        listItem.style.justifyContent = 'space-between';
        listItem.style.maxWidth = '600px';
        listItem.style.padding = '0 10px';
        listItem.style.listStyleType = 'disc';

        // Left side: Item details
        const textSpan = document.createElement('span');
        textSpan.style.flex = '1';
        textSpan.style.whiteSpace = 'nowrap';
        textSpan.textContent = `${truncatedItemName} - ${amount} ${document.querySelector(`[data-name="${itemName}"]`).dataset.unit}`;

        // Right side: Total price and remove button
        const priceSpan = document.createElement('span');
        priceSpan.style.marginRight = '10px';
        priceSpan.textContent = `₪${ItemTotal}`;

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.textContent = 'הסר';
        removeButton.style.marginLeft = '10px';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.cursor = 'pointer';

        removeButton.addEventListener('click', () => {
            removeBasketItem(itemName);
            updateTotalPrice();
        });

        listItem.appendChild(textSpan);
        listItem.appendChild(priceSpan);
        listItem.appendChild(removeButton);

        basketList.appendChild(listItem);
    } else {
        listItem.querySelector('span').textContent = `${truncatedItemName} - ${amount} ${document.querySelector(`[data-name="${itemName}"]`).dataset.unit}`;
        listItem.querySelector(':nth-child(2)').textContent = `₪${ItemTotal}`;
    }

    updateTotalPrice();
    toggleBasketVisibility();
}

// Modify the removeBasketItem function to reset the item's amount in the product display
function removeBasketItem(itemName) {
    const basketList = document.getElementById('basket-list');
    const listItem = Array.from(basketList.children).find(item => item.dataset.name === itemName);

    if (listItem) {
        basketList.removeChild(listItem);

        const productItem = document.querySelector(`[data-name="${itemName}"]`);
        if (productItem) {
            const amountDisplay = productItem.querySelector('.amount-display');
            if (amountDisplay) {
                amountDisplay.textContent = "0";
            }
        }
    }

    updateTotalPrice();
    toggleBasketVisibility();
}

// Function to update total price
function updateTotalPrice() {
    const basketList = document.getElementById('basket-list');
    let total = 0;
    
    basketList.querySelectorAll('li').forEach(item => {
        const priceText = item.querySelector(':nth-child(2)').textContent;
        total += parseFloat(priceText.replace('₪', '')) || 0;
    });

    document.getElementById('total-price').textContent = '₪' + total.toFixed(2);
    
    // Enable delivery button only if total > 130
    document.getElementById('delivery').disabled = total <= 129;
}

// Function to toggle the visibility of the empty/full basket
function toggleBasketVisibility() {
    const basketList = document.getElementById('basket-list');
    const basketEmpty = document.getElementById('basket-empty');
    const basketFull = document.getElementById('basket-full');

    if (basketList.children.length === 0) {
        basketEmpty.style.display = 'block';
        basketFull.style.display = 'none';
    } else {
        basketEmpty.style.display = 'none';
        basketFull.style.display = 'block';
    }
}

// Initialize visibility when the page loads
document.addEventListener("DOMContentLoaded", () => {
    toggleBasketVisibility();
    updateTotalPrice();
});

function openPopup(type) {
    const total = document.getElementById('total-price').textContent;
    document.getElementById('popup-message').textContent = `סה"כ לתשלום: ${total}`;
    
    const addressLabel = document.getElementById('address-label');
    const addressInput = document.getElementById('address');

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

// Close the pop-up if the user clicks outside of it
document.addEventListener('click', (event) => {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');

    if (!popupContent.contains(event.target) && !event.target.closest('#customer-preference')) {
        closePopup();
    }
});

// Validation & Logic in pop-up
document.addEventListener("DOMContentLoaded", function () {
    const addressInput = document.getElementById("address");
    const phoneInput = document.getElementById("phone");
    const paymentMethod = document.getElementById("payment-method");
    const confirmButton = document.getElementById("confirm-payment");
    const creditCardFields = document.getElementById("credit-card-fields");
    const cardInputs = creditCardFields.querySelectorAll("input");

    // Function to validate an Israeli phone number
    function isValidPhone(phone) {
        return /^05\d{8}$/.test(phone);
    }

    // Function to validate an address (basic check, can be improved)
    function isValidAddress(address) {
        return address.length > 5; // Adjust as needed
    }

    // Function to validate credit card fields
    function isValidCard() {
        const cardName = document.getElementById("card-name").value.trim();
        const cardNumber = document.getElementById("card-number").value.replace(/\s+/g, "");
        const expiryDate = document.getElementById("expiry-date").value;
        const cvc = document.getElementById("cvc").value;

        return (
            cardName.length > 2 &&
            /^\d{16}$/.test(cardNumber) &&
            /^\d{2}\/\d{2}$/.test(expiryDate) &&
            /^\d{3}$/.test(cvc)
        );
    }

    // Function to check if all fields are valid
    function validateForm() {
        const addressValid = isValidAddress(addressInput.value);
        const phoneValid = isValidPhone(phoneInput.value);
        const paymentValid = paymentMethod.value !== "";
        let cardValid = true;

        if (paymentMethod.value === "credit-card") {
            cardValid = isValidCard();
        }

        confirmButton.disabled = !(addressValid && phoneValid && paymentValid && cardValid);
    }

    // Event listeners
    addressInput.addEventListener("input", validateForm);
    phoneInput.addEventListener("input", validateForm);
    paymentMethod.addEventListener("change", function () {
        if (this.value === "credit-card") {
            creditCardFields.classList.remove("hidden");
        } else {
            creditCardFields.classList.add("hidden");
        }
        validateForm();
    });

    cardInputs.forEach(input => input.addEventListener("input", validateForm));
});

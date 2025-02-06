// Creating a Sticky Navbar
let navbar = document.getElementById("main-nav");
let navPos = navbar.getBoundingClientRect().top;

window.addEventListener("scroll", () => {
let scrollPos = window.scrollY;
if (scrollPos > navPos) {
navbar.classList.add("sticky");
} else {
navbar.classList.remove("sticky");
}
});

// Show the active main section with error handling and optimizations
function handleLinkClick(e) {
    e.preventDefault(); // Prevent default link behavior

    // Hide all sections
    document.querySelectorAll('main section').forEach(section => {
        if (section) {
            section.style.display = 'none';
            section.classList.remove('active');
        }
    });

    // Show the correct section
    const sectionId = this.getAttribute('href').slice(1); // Remove '#' from href
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
        section.classList.add('active');
        
        // Scroll to the section smoothly
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Attach event listeners to navigation links
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', handleLinkClick);
});

// Attach event listeners to basket-empty links
document.querySelectorAll('#basket-empty a').forEach(link => {
    link.addEventListener('click', handleLinkClick);
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
                price.textContent = `מחיר: ${item.price.toFixed(2)} ₪ | ל${item.units}`;
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
document.getElementById('pick-up').addEventListener('click', () => openPopup('Pick Up'));
document.getElementById('delivery').addEventListener('click', () => openPopup('Delivery'));
document.getElementById('close-popup').addEventListener('click', () => closePopup());

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

function openPopup(type) {
    const total = document.getElementById('total-price').textContent;
    document.getElementById('popup-message').textContent = `${type} - Total: ${total}`;
    document.getElementById('popup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
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

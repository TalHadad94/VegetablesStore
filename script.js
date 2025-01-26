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
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
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
                        addBasketItem(item.name, amount); // Update basket
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
function addBasketItem(itemName, amount) {
    const basketList = document.getElementById('basket-list');
    let listItem = Array.from(basketList.children).find(item => item.dataset.name === itemName);

    if (!listItem) {
        listItem = document.createElement('li');
        listItem.dataset.name = itemName;

        const textSpan = document.createElement('span');
        textSpan.textContent = `${itemName} - `;

        const amountSpan = document.createElement('span');
        amountSpan.classList.add('item-amount');
        amountSpan.textContent = amount;

        const unitSpan = document.createElement('span');
        unitSpan.textContent = ` ${document.querySelector(`[data-name="${itemName}"]`).dataset.unit}`;

        const removeButton = document.createElement('button');
        removeButton.classList.add('remove-button');
        removeButton.textContent = 'הסר';
        removeButton.style.marginRight = '10px';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.cursor = 'pointer';

        removeButton.addEventListener('click', () => removeBasketItem(itemName));

        listItem.appendChild(textSpan);
        listItem.appendChild(amountSpan);
        listItem.appendChild(unitSpan);
        listItem.appendChild(removeButton);
        basketList.appendChild(listItem);
    } else {
        listItem.querySelector('.item-amount').textContent = amount;
    }
}

// Remove an item from the basket
function removeBasketItem(itemName) {
    const basketList = document.getElementById('basket-list');
    const listItem = Array.from(basketList.children).find(item => item.dataset.name === itemName);

    if (listItem) {
        basketList.removeChild(listItem);
    }
}
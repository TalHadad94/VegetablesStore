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

// dynamically generate the HTML for each item and append it to the appropriate section
function generateItems() {
    fetch('output.json') // Fetch data from the JSON file
        .then(response => response.json())
        .then(items => {
            // Clear previous items in sections
            document.querySelectorAll('.menu').forEach(menu => (menu.innerHTML = ''));

            // Loop through all items
            items.forEach(item => {
                // Create a div for each item
                const itemDiv = document.createElement("div");
                itemDiv.classList.add("product-item"); // Generic class for styling
                itemDiv.dataset.name = item.name; // Store the item's name as a data attribute

                // Add an image to the div
                const img = document.createElement("img");
                img.src = item.imagePath;
                img.alt = item.name;
                img.classList.add("product-img");
                itemDiv.appendChild(img);

                // Add a button to the div
                const button = document.createElement("button");
                button.textContent = "הוסף לסל";
                button.classList.add("add-to-basket");
                button.addEventListener("click", () => addBasketItem(item.name)); // Add item to basket on click
                itemDiv.appendChild(button);

                // Find the correct section to append the item
                const section = document.querySelector(`#${item.section} .menu`);
                if (section) {
                    section.appendChild(itemDiv);
                }
            });
        })
        .catch(error => console.error('Error loading JSON:', error));
}

// Function to add an item to the basket
function addBasketItem(itemName) {
    const basketList = document.getElementById('basket-list');
    if (basketList) {
        const listItem = document.createElement('li');
        listItem.textContent = itemName;

        // Add a remove button for each item
        const removeButton = document.createElement('button');
        removeButton.textContent = 'הסר';
        removeButton.style.marginLeft = '10px';
        removeButton.style.backgroundColor = 'red';
        removeButton.style.color = 'white';
        removeButton.style.border = 'none';
        removeButton.style.cursor = 'pointer';

        // Handle removing the item from the basket
        removeButton.addEventListener('click', function() {
            removeBasketItem(listItem);
        });

        listItem.appendChild(removeButton);
        basketList.appendChild(listItem);
    }
}

// Function to remove an item from the basket
function removeBasketItem(item) {
    const basketList = document.getElementById('basket-list');
    if (basketList && item) {
        basketList.removeChild(item);
    }
}

// Handle adding vegetables to the basket
document.querySelectorAll('.add-to-basket').forEach(button => {
    button.addEventListener('click', function() {
        // Get the item name from the parent element's data-name attribute
        const itemName = this.parentElement.getAttribute('data-name');
        if (itemName) {
            addBasketItem(itemName);
        }
    });
});

// Load items dynamically when the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    generateItems(); // Populate the items dynamically
});

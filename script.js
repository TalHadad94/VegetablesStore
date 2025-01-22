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

// Item handeling
const items = [
    { name: "עגבנייה", image: "Images/Vegetables/Tomatos.jpg", category: "vegetables" },
    { name: "מלפפון", image: "Images/Vegetables/Cucumbers.jpg", category: "vegetables" },
    { name: "גמבה", image: "Images/Vegetables/Bell Pepper.jpg", category: "vegetables" },
    { name: "קיווי", image: "Images/Fruits/Kiwi.jpg", category: "fruits" },
    { name: "ענבים", image: "Images/Fruits/Grape.jpg", category: "fruits" },
    { name: "תפוח", image: "Images/Fruits/Apple.jpg", category: "fruits" },
];

// dynamically generate the HTML for each item and append it to the appropriate section
function generateItems() {
    // Loop through all items
    items.forEach(item => {
        // Create a div for each item
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("product-item"); // Generic class for styling
        itemDiv.dataset.name = item.name; // Store the item's name as a data attribute

        // Add an image to the div
        const img = document.createElement("img");
        img.src = item.image;
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
        const section = document.querySelector(`#${item.category} .menu`);
        if (section) {
            section.appendChild(itemDiv);
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    generateItems(); // Populate the items dynamically
});

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

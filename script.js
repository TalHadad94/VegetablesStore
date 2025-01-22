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

            // Accessibility: Focus the section
            section.setAttribute('tabindex', '-1'); // Ensure focusable
            section.focus();
        }
    });
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

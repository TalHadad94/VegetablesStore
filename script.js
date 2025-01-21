// Show the active main section
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default link behavior

        // Remove 'active' class from all sections
        document.querySelectorAll('main section').forEach(section => {
            section.style.display = 'none';
            section.classList.remove('active');
        });

        // Show the correct section
        const sectionId = this.getAttribute('href').slice(1); // Remove '#' from href
        const section = document.getElementById(sectionId);
        section.style.display = 'block';
        section.classList.add('active');
    });
});

// Handle adding vegetables to the basket
document.querySelectorAll('.add-to-basket').forEach(button => {
    button.addEventListener('click', function() {
        // Get the vegetable name from the parent element's data-name attribute
        const vegetableName = this.parentElement.getAttribute('data-name');

        // Add the vegetable to the basket list
        const basketList = document.getElementById('basket-list');
        const listItem = document.createElement('li');
        listItem.textContent = vegetableName;

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
            basketList.removeChild(listItem);
        });

        listItem.appendChild(removeButton);
        basketList.appendChild(listItem);
    });
});
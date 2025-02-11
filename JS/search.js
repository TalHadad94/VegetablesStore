document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
  
    sections.forEach(section => {
      const searchDiv = section.querySelector('.search');
      const menuDiv = section.querySelector('.menu');
  
      if (searchDiv && menuDiv) {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'חפש...';
        searchDiv.appendChild(searchInput);
  
        // Create clear button
        const clearButton = document.createElement('button');
        clearButton.textContent = 'נקה'; // Clear in Hebrew
        clearButton.addEventListener('click', () => {
          searchInput.value = ''; // Clear the input field
          // Trigger the search to show all items again (optional)
          const event = new Event('input'); // Create an 'input' event
          searchInput.dispatchEvent(event); // Dispatch the event on the input
        });
        searchDiv.appendChild(clearButton); // Add the clear button to the search div
  
        searchInput.addEventListener('input', () => {
          const searchTerm = searchInput.value.toLowerCase();
          const productItems = menuDiv.querySelectorAll('.product-item');
  
          productItems.forEach(productItem => {
            const itemNameElement = productItem.querySelector('.item-name');
            if (itemNameElement) {
              const itemName = itemNameElement.textContent.toLowerCase();
  
              if (itemName.includes(searchTerm)) {
                productItem.style.display = '';
              } else {
                productItem.style.display = 'none';
              }
            }
          });
        });
      } else {
        console.error("Search or menu div not found in section:", section.id);
      }
    });
  });
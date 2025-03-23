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

// Attach event listeners to Delivery section in the footer
document.querySelectorAll('footer a[href="#about"]').forEach(link => {
    link.addEventListener('click', handleLinkClick);
});

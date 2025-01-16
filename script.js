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
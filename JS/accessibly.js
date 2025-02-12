document.addEventListener("DOMContentLoaded", () => {
    const accessibilityBtn = document.createElement("div");
    accessibilityBtn.id = "accessibility-btn";
    accessibilityBtn.innerHTML = "&#9881;"; // Gear icon

    const accessibilityPanel = document.createElement("div");
    accessibilityPanel.id = "accessibility-panel";
    accessibilityPanel.innerHTML = `
        <button id="increase-text">הגדלת טקסט</button>
        <button id="decrease-text">הקטנת טקסט</button>
        <button id="high-contrast">מצב ניגודיות</button>
        <button id="close-panel">סגור</button>
    `;

    document.body.appendChild(accessibilityBtn);
    document.body.appendChild(accessibilityPanel);

    let footer = document.querySelector("footer");
    let isPanelOpen = false;

    // Show/hide panel on button click
    accessibilityBtn.addEventListener("click", () => {
        isPanelOpen = !isPanelOpen;
        accessibilityPanel.style.display = isPanelOpen ? "block" : "none";
    });

    // Close panel
    document.getElementById("close-panel").addEventListener("click", () => {
        accessibilityPanel.style.display = "none";
        isPanelOpen = false;
    });

    // Increase text size
    document.getElementById("increase-text").addEventListener("click", () => {
        document.body.style.fontSize = "larger";
    });

    // Decrease text size
    document.getElementById("decrease-text").addEventListener("click", () => {
        document.body.style.fontSize = "smaller";
    });

    // Toggle high contrast
    document.getElementById("high-contrast").addEventListener("click", () => {
        document.body.classList.toggle("high-contrast");
    });

    // Adjust icon position on scroll
    window.addEventListener("scroll", () => {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top < window.innerHeight) {
            accessibilityBtn.style.opacity = "0";
        } else {
            accessibilityBtn.style.opacity = "1";
        }
    });
});

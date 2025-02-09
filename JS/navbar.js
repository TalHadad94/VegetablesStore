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
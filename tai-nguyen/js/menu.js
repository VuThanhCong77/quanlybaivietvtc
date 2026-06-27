function toggleMenu(){

    document
    .getElementById("menuDrawer")
    .classList
    .toggle("active");

    document
    .getElementById("menuOverlay")
    .classList
    .toggle("active");

}

const btn = document.querySelector('.dropdown-btn');
const menu = document.querySelector('.dropdown-menu');

if (btn && menu) {
    btn.addEventListener('click', () => {
        menu.classList.toggle('show');
    });
}

/*Omdirigera användare vid klick på boka-animation*/
const bookAnimation = document.querySelector(".book");

bookAnimation.addEventListener("click", () => {
    window.location.href = "/book.html";
});

/*Omdirigera användare vid klick på menyknapp*/
const menuBtn = document.querySelector("#menuBtn");

bookAnimation.addEventListener("click", () => {
    window.location.href = "/dinner-menu.html";
});
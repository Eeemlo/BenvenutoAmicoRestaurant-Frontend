/*Eventlyssnare för animeringar*/
/* Kod från: https://www.sliderrevolution.com/resources/css-animations-on-scroll/ som är modifierad med hjälp av chatgpt*/


// Funktion för att kolla och köra animeringar utan fördröjning (för scroll)
function animateOnScroll() {
    var animatables = document.querySelectorAll(".animate");
    var images = document.querySelectorAll(".image-animate");

    var windowHeight = window.innerHeight;

    animatables.forEach(function (animatable) {
        var elementBottom = animatable.getBoundingClientRect().bottom;
        var elementTop = animatable.getBoundingClientRect().top;
        if (elementBottom <= windowHeight && elementTop >= 0) {
            animatable.classList.remove("animatable");
            animatable.classList.add("animated");
        }
    });

    images.forEach(function (image) {
        var imageBottom = image.getBoundingClientRect().bottom;
        var imageTop = image.getBoundingClientRect().top;
        if (imageBottom <= windowHeight && imageTop >= 0) {
            image.classList.add("animated");
        }
    });
}

// Funktion för att kolla och köra animeringar med fördröjning (för sidladdning)
function animateOnLoad() {
    var animatables = document.querySelectorAll(".animate");
    var images = document.querySelectorAll(".image-animate");

    var windowHeight = window.innerHeight;

    animatables.forEach(function (animatable) {
        var elementBottom = animatable.getBoundingClientRect().bottom;
        var elementTop = animatable.getBoundingClientRect().top;
        if (elementBottom <= windowHeight && elementTop >= 0) {
            setTimeout(function() {
                animatable.classList.remove("animatable");
                animatable.classList.add("animated");
            }, 2000); // Fördröjning på 1,5 sekunder
        }
    });

    images.forEach(function (image) {
        var imageBottom = image.getBoundingClientRect().bottom;
        var imageTop = image.getBoundingClientRect().top;
        if (imageBottom <= windowHeight && imageTop >= 0) {
            setTimeout(function() {
                image.classList.add("animated");
            }, 1500); // Fördröjning på 1,5 sekunder
        }
    });
}

// Kör animateOnLoad vid sidladdning
document.addEventListener("DOMContentLoaded", function () {
    animateOnLoad();
});

// Kör animateOnScroll vid scroll
document.addEventListener("scroll", function () {
    animateOnScroll();
});


/*Toggla hamburgermeny*/

window.onload = function () {
    const menuBtn = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".smallNav")
    menuBtn.addEventListener("click", () => {
        menuBtn.classList.toggle("is-active");
        mobileMenu.classList.toggle("is-active");
    })
}

/*Omdirigera användare vid klick på boka-animation*/
const bookAnimation = document.querySelector(".book");

if(bookAnimation) {
bookAnimation.addEventListener("click", () => {
    window.location.href = "/book.html";
});
}


/*Omdirigera användare vid klick på menyknapp*/
const menuBtn = document.querySelector("#menuBtn");

if(menuBtn) {
menuBtn.addEventListener("click", () => {
    window.location.href = "/dinner-menu.html";
});
}
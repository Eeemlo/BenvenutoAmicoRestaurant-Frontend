/*Eventlyssnare för animeringar*/
/* Kod från: https://www.sliderrevolution.com/resources/css-animations-on-scroll/*/

document.addEventListener("scroll", function (event) {
    var animatables = document.querySelectorAll(".animate");

    animatables.forEach(function (animatable) {
        var elementBottom = animatable.getBoundingClientRect().bottom;
        var windowHeight = window.innerHeight;

        if (elementBottom < windowHeight) {
            animatable.classList.remove("animatable");
            animatable.classList.add("animated");
        }
    });
});


document.addEventListener("scroll", function (event) {
    var images = document.querySelectorAll(".image-animate");

    images.forEach(function (image) {
        var imageBottom = image.getBoundingClientRect().top;
        var windowHeight = window.innerHeight;

        if (imageBottom < windowHeight + 1) {
            image.classList.add("animated");
        }
    });
});
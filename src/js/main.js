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



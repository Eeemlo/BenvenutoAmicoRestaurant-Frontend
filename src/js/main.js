

/* Kod från: https://www.sliderrevolution.com/resources/css-animations-on-scroll/*/

document.addEventListener('scroll', function(event) {
    var offset = event.target.scrollingElement.scrollTop + window.innerHeight;
    var animatables = document.querySelectorAll('.animate');
    
    animatables.forEach(function(animatable) {
      if ((animatable.getBoundingClientRect().top + event.target.scrollingElement.scrollTop + animatable.offsetHeight - 10) < offset) {
        animatable.classList.remove('animatable');
        animatable.classList.add('animated');
      }
    });
  
    // Unbind scroll handler if we have no animatables
    if (animatables.length === 0) {
      window.removeEventListener('scroll', doAnimations);
    }
  });
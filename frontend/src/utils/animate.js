import $ from 'jquery';

// @see https://github.com/daneden/animate.css
const style = require('../../node_modules/animate.css/animate.min.css');

let animate = (() => {
  // Create our base style element
  let elStyle = document.createElement('style');
  elStyle.innerHTML = style.toString();
  document.head.appendChild(elStyle);

  // Determines all available animation types by creating an element and parsing it out
  // See https://github.com/daneden/animate.css/issues/644
  let animationEnd = (function(el) {
    let animations = {
      animation: 'animationend',
      OAnimation: 'oAnimationEnd',
      MozAnimation: 'mozAnimationEnd',
      WebkitAnimation: 'webkitAnimationEnd'
    };

    for (let t in animations) {
      if (el.style[t] !== undefined) {
        return animations[t];
      }
    }
  })(document.createElement('div'));

  // Returns a Promise and can utilize a complete handler, at the same time
  return (el, animateFxName, onAnimateComplete) => {
    return new Promise((resolve, reject) => {
      try {
        $(el).one(animationEnd, (evt) => {
          // Remove the animation
          $(el).removeClass(`animated ${animateFxName}`);
    
          if (typeof onAnimateComplete === 'function') {
            onAnimateComplete(evt);
          }

          return resolve(true);
        });
    
        // Begin the animation
        $(el).addClass(`animated ${animateFxName}`);
      } catch (exc) {
        return reject(exc);
      }
    });
  };
})();

export default animate;
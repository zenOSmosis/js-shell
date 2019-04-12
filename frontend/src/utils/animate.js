// TODO: Remove jQuery dependency
import $ from 'jquery';

// @see https://github.com/daneden/animate.css
const style = require('../../node_modules/animate.css/animate.min.css');

let ANIMATION_GROUPS = {};

// Attention seekers
export const ANIMATION_GROUP_ATTENTION_SEEKERS = 'Attention Seekers';
export const ANIMATE_BOUNCE = 'bounce';
export const ANIMATE_FLASH = 'flash';
export const ANIMATE_PULSE = 'pulse';
export const ANIMATE_RUBBER_BAND = 'rubberBand';
export const ANIMATE_SHAKE = 'shake';
export const ANIMATE_SWING = 'swing';
export const ANIMATE_TADA = 'tada';
export const ANIMATE_WOBBLE = 'wobble';
export const ANIMATE_JELLO = 'jello';
export const ANIMATE_HEARTBEAT = 'heartBeat';
ANIMATION_GROUPS[ANIMATION_GROUP_ATTENTION_SEEKERS] = [
  ANIMATE_BOUNCE,
  ANIMATE_FLASH,
  ANIMATE_PULSE,
  ANIMATE_RUBBER_BAND,
  ANIMATE_SHAKE,
  ANIMATE_SWING,
  ANIMATE_TADA,
  ANIMATE_WOBBLE,
  ANIMATE_JELLO,
  ANIMATE_HEARTBEAT
];

// Bouncing Entrances
export const ANIMATION_GROUP_BOUNCING_ENTRANCES = 'Bouncing Entrances';
export const ANIMATE_BOUNCE_IN = 'bounceIn';
export const ANIMATE_BOUNCE_IN_DOWN = 'bounceInDown';
export const ANIMATE_BOUNCE_IN_LEFT = 'bounceInLeft';
export const ANIMATE_BOUNCE_IN_RIGHT = 'bounceInRight';
export const ANIMATE_BOUNCE_IN_UP = 'bounceInUp';
ANIMATION_GROUPS[ANIMATION_GROUP_BOUNCING_ENTRANCES] = [
  ANIMATE_BOUNCE_IN,
  ANIMATE_BOUNCE_IN_DOWN,
  ANIMATE_BOUNCE_IN_LEFT,
  ANIMATE_BOUNCE_IN_RIGHT,
  ANIMATE_BOUNCE_IN_UP
];

// Bouncing Exits
export const ANIMATION_GROUP_BOUNCING_EXITS = 'Bouncing Exits';
export const ANIMATE_BOUNCE_OUT = 'bounceOut';
export const ANIMATE_BOUNCE_OUT_DOWN = 'bounceOutDown';
export const ANIMATE_BOUNCE_OUT_LEFT = 'bounceOutLeft';
export const ANIMATE_BOUNCE_OUT_RIGHT = 'bounceOutRight';
export const ANIMATE_BOUNCE_OUT_UP = 'bounceOutUp';
ANIMATION_GROUPS[ANIMATION_GROUP_BOUNCING_EXITS] = [
  ANIMATE_BOUNCE_OUT,
  ANIMATE_BOUNCE_OUT_DOWN,
  ANIMATE_BOUNCE_OUT_LEFT,
  ANIMATE_BOUNCE_OUT_RIGHT,
  ANIMATE_BOUNCE_OUT_UP
];

// Fading Entrances
export const ANIMATION_GROUP_FADING_ENTRANCES = 'Fading Entrances';
export const ANIMATE_FADE_IN = 'fadeIn';
export const ANIMATE_FADE_IN_DOWN = 'fadeInDown';
export const ANIMATE_FADE_IN_DOWN_BIG = 'fadeInDownBig';
export const ANIMATE_FADE_IN_LEFT = 'fadeInLeft';
export const ANIMATE_FADE_IN_LEFT_BIG = 'fadeInLeftBig';
export const ANIMATE_FADE_IN_RIGHT = 'fadeInRight';
export const ANIMATE_FADE_IN_RIGHT_BIG = 'fadeInRightBig';
export const ANIMATE_FADE_IN_UP = 'fadeInUp';
export const ANIMATE_FADE_IN_UP_BIG = 'fadeInUpBig';
ANIMATION_GROUPS[ANIMATION_GROUP_FADING_ENTRANCES] = [
  ANIMATE_FADE_IN,
  ANIMATE_FADE_IN_DOWN,
  ANIMATE_FADE_IN_DOWN_BIG,
  ANIMATE_FADE_IN_LEFT,
  ANIMATE_FADE_IN_LEFT_BIG,
  ANIMATE_FADE_IN_RIGHT,
  ANIMATE_FADE_IN_RIGHT_BIG,
  ANIMATE_FADE_IN_UP,
  ANIMATE_FADE_IN_UP_BIG
];

// Fading Exits
export const ANIMATION_GROUP_FADING_EXITS = 'Fading Exits';
export const ANIMATE_FADE_OUT = 'fadeOut';
export const ANIMATE_FADE_OUT_DOWN = 'fadeOutDown';
export const ANIMATE_FADE_OUT_DOWN_BIG = 'fadeOutDownBig';
export const ANIMATE_FADE_OUT_LEFT = 'fadeOutLeft';
export const ANIMATE_FADE_OUT_LEFT_BIG = 'fadeOutLeftBig';
export const ANIMATE_FADE_OUT_RIGHT = 'fadeOutRight';
export const ANIMATE_FADE_OUT_RIGHT_BIG = 'fadeOutRightBig';
export const ANIMATE_FADE_OUT_UP = 'fadeOutUp';
export const ANIMATE_FADE_OUT_UP_BIG = 'fadeOutUpBig';
ANIMATION_GROUPS[ANIMATION_GROUP_FADING_EXITS] = [
  ANIMATE_FADE_OUT,
  ANIMATE_FADE_OUT_DOWN,
  ANIMATE_FADE_OUT_DOWN_BIG,
  ANIMATE_FADE_OUT_LEFT,
  ANIMATE_FADE_OUT_LEFT_BIG,
  ANIMATE_FADE_OUT_RIGHT,
  ANIMATE_FADE_OUT_RIGHT_BIG,
  ANIMATE_FADE_OUT_UP,
  ANIMATE_FADE_OUT_UP_BIG
];

// Flippers
export const ANIMATION_GROUP_FLIPPERS = 'Flippers';
export const ANIMATE_FLIP = 'flip';
export const ANIMATE_FLIP_IN_X = 'flipInX';
export const ANIMATE_FLIP_IN_Y = 'flipInY';
export const ANIMATE_FLIP_OUT_X = 'flipOutX';
export const ANIMATE_FLIP_OUT_Y = 'flipOutY';
ANIMATION_GROUPS[ANIMATION_GROUP_FLIPPERS] = [
  ANIMATE_FLIP,
  ANIMATE_FLIP_IN_X,
  ANIMATE_FLIP_IN_Y,
  ANIMATE_FLIP_OUT_X,
  ANIMATE_FLIP_OUT_Y
];

// Lightspeed
export const ANIMATION_GROUP_LIGHT_SPEED = 'LightSpeed';
export const ANIMATE_LIGHT_SPEED_IN = 'lightSpeedIn';
export const ANIMATE_LIGHT_SPEED_OUT = 'lightSpeedOut';
ANIMATION_GROUPS[ANIMATION_GROUP_LIGHT_SPEED] = [
  ANIMATE_LIGHT_SPEED_IN,
  ANIMATE_LIGHT_SPEED_OUT
];

// Rotating Entrances
export const ANIMATION_GROUP_ROTATING_ENTRANCES = 'Rotating Entrances';
export const ANIMATE_ROTATE_IN = 'rotateIn';
export const ANIMATE_ROTATE_IN_DOWN_LEFT = 'rotateInDownLeft';
export const ANIMATE_ROTATE_IN_DOWN_RIGHT = 'rotateInDownRight';
export const ANIMATE_ROTATE_IN_UP_LEFT = 'rotateInUpLeft';
export const ANIMATE_ROTATE_IN_UP_RIGHT = 'rotateInUpRight';
ANIMATION_GROUPS[ANIMATION_GROUP_ROTATING_ENTRANCES] = [
  ANIMATE_ROTATE_IN,
  ANIMATE_ROTATE_IN_DOWN_LEFT,
  ANIMATE_ROTATE_IN_DOWN_RIGHT,
  ANIMATE_ROTATE_IN_UP_LEFT,
  ANIMATE_ROTATE_IN_UP_RIGHT
];

// Rotating Exits
export const ANIMATION_GROUP_ROTATING_EXITS = 'Rotating Exits';
export const ANIMATE_ROTATE_OUT = 'rotateOut';
export const ANIMATE_ROTATE_OUT_DOWN_LEFT = 'rotateOutDownLeft';
export const ANIMATE_ROTATE_OUT_DOWN_RIGHT = 'rotateOutDownRight';
export const ANIMATE_ROTATE_OUT_UP_LEFT = 'rotateOutUpLeft';
export const ANIMATE_ROTATE_OUT_UP_RIGHT = 'rotateOutUpRight';
ANIMATION_GROUPS[ANIMATION_GROUP_ROTATING_EXITS] = [
  ANIMATE_ROTATE_OUT,
  ANIMATE_ROTATE_OUT_DOWN_LEFT,
  ANIMATE_ROTATE_OUT_DOWN_RIGHT,
  ANIMATE_ROTATE_OUT_UP_LEFT,
  ANIMATE_ROTATE_OUT_UP_RIGHT
];

// Sliding Entrances
export const ANIMATION_GROUP_SLIDING_ENTRANCES = 'Sliding Entrances';
export const ANIMATE_SLIDE_IN_UP = 'slideInUp';
export const ANIMATE_SLIDE_IN_DOWN = 'slideInDown';
export const ANIMATE_SLIDE_IN_LEFT = 'slideInLeft';
export const ANIMATE_SLIDE_IN_RIGHT = 'slideInRight';
ANIMATION_GROUPS[ANIMATION_GROUP_SLIDING_ENTRANCES] = [
  ANIMATE_SLIDE_IN_UP,
  ANIMATE_SLIDE_IN_DOWN,
  ANIMATE_SLIDE_IN_LEFT,
  ANIMATE_SLIDE_IN_RIGHT
];

// Sliding Exits
export const ANIMATION_GROUP_SLIDING_EXITS = 'Sliding Exits';
export const ANIMATE_SLIDE_OUT_UP = 'slideOutUp';
export const ANIMATE_SLIDE_OUT_DOWN = 'slideOutDown';
export const ANIMATE_SLIDE_OUT_LEFT = 'slideOutLeft';
export const ANIMATE_SLIDE_OUT_RIGHT = 'slideOutRight';
ANIMATION_GROUPS[ANIMATION_GROUP_SLIDING_EXITS] = [
  ANIMATE_SLIDE_OUT_UP,
  ANIMATE_SLIDE_OUT_DOWN,
  ANIMATE_SLIDE_OUT_LEFT,
  ANIMATE_SLIDE_OUT_RIGHT
];

// Zoom Entrances
export const ANIMATION_GROUP_ZOOM_ENTRANCES = 'Zoom Entrances';
export const ANIMATE_ZOOM_IN = 'zoomIn';
export const ANIMATE_ZOOM_IN_DOWN = 'zoomInDown';
export const ANIMATE_ZOOM_IN_LEFT = 'zoomInLeft';
export const ANIMATE_ZOOM_IN_RIGHT = 'zoomInRight';
export const ANIMATE_ZOOM_IN_UP = 'zoomInUp';
ANIMATION_GROUPS[ANIMATION_GROUP_ZOOM_ENTRANCES] = [
  ANIMATE_ZOOM_IN,
  ANIMATE_ZOOM_IN_DOWN,
  ANIMATE_ZOOM_IN_LEFT,
  ANIMATE_ZOOM_IN_RIGHT,
  ANIMATE_ZOOM_IN_UP
];

// Zoom Exits
export const ANIMATION_GROUP_ZOOM_EXITS = 'Zoom Exits';
export const ANIMATE_ZOOM_OUT = 'zoomOut';
export const ANIMATE_ZOOM_OUT_DOWN = 'zoomOutDown';
export const ANIMATE_ZOOM_OUT_LEFT = 'zoomOutLeft';
export const ANIMATE_ZOOM_OUT_RIGHT = 'zoomOutRight';
export const ANIMATE_ZOOM_OUT_UP = 'zoomOutUp';
ANIMATION_GROUPS[ANIMATION_GROUP_ZOOM_EXITS] = [
  ANIMATE_ZOOM_OUT,
  ANIMATE_ZOOM_OUT_DOWN,
  ANIMATE_ZOOM_OUT_LEFT,
  ANIMATE_ZOOM_OUT_RIGHT,
  ANIMATE_ZOOM_OUT_UP
];

// Specials
export const ANIMATION_GROUP_SPECIALS = 'Specials';
export const ANIMATE_HINGE = 'hinge';
export const ANIMATE_JACK_IN_THE_BOX = 'jackInTheBox';
export const ANIMATE_ROLL_IN = 'rollIn';
export const ANIMATE_ROLL_OUT = 'rollOut';
ANIMATION_GROUPS[ANIMATION_GROUP_SPECIALS] = [
  ANIMATE_HINGE,
  ANIMATE_JACK_IN_THE_BOX,
  ANIMATE_ROLL_IN,
  ANIMATE_ROLL_OUT
];

// All animations, as a flat array
export const ANIMATIONS = (() => {
  const animations = [];

  Object.keys(ANIMATION_GROUPS).forEach(group => {
    const localAnimations = ANIMATION_GROUPS[group];
    localAnimations.forEach(animation => {
      animations.push(animation);
    });
  });

  return animations;
})();

export {
  ANIMATION_GROUPS
};

let animate = (() => {
  // Create our base style element
  let elStyle = document.createElement('style');
  elStyle.innerHTML = style.toString();
  document.head.appendChild(elStyle);

  // Determines all available animation types by creating an element and parsing it out
  // See https://github.com/daneden/animate.css/issues/644
  let animationEnd = (function (el) {
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
        const $el = $(el);
        let animatedCSSClass = 'animated';

        $el.one(animationEnd, (evt) => {
          // Remove the animation
          $el.removeClass(`${animatedCSSClass} ${animateFxName}`);

          if (typeof onAnimateComplete === 'function') {
            onAnimateComplete(evt);
          }

          return resolve(true);
        });

        // Begin the animation
        $el.addClass(`${animatedCSSClass} ${animateFxName}`);
      } catch (exc) {
        return reject(exc);
      }
    });
  };
})();

export default animate;
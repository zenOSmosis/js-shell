/**
 * @see https://stackoverflow.com/questions/50763813/disable-chromes-pull-to-refresh-on-iphone
 * 
 * @param {DOMElement} elem 
 */
const preventPullToRefresh = (elem) => {
  var prevent = false;

  elem.addEventListener('touchstart', function(e){
    if (e.touches.length !== 1) { return; }

    var scrollY = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
    prevent = (scrollY === 0);
  });

  elem.addEventListener('touchmove', function(e){
    if (prevent) {
      prevent = false;
      e.preventDefault();
    }
  });
};

export default preventPullToRefresh;
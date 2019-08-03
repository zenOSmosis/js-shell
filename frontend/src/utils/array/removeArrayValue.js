/**
 * Removes an array value.
 * 
 * IMPORTANT! The default is to remove the value in place.  Setting inPlace to
 * false creates and returns a copy.
 * 
 * @param {Array} arr 
 * @param {any} value 
 * @param {boolean} inPlace? [default = true] Whether the passed array should
 * be modified, or a new one should be created.
 * 
 * @return {undefined | Array} If the value is removed in place, no value is
 * returned; otherwise a copied version is returned, minus the removed values.
 */
const removeArrayValue = (arr, value, inPlace = true) => {
  let areAllRemoved = false;

  let copy;
  if (!inPlace) {
    copy = [...arr];
  }

  do {
    if (inPlace) {
      // Work with the original

      const index = arr.indexOf(value);
    
      if (index !== -1) {
        arr.splice(index, 1);
      } else {
        areAllRemoved = true;
      }
    } else {
      // Work w/ the copy

      const index = copy.indexOf(value);

      if (index !== -1) {
        copy = copy.slice(index, 1);
      } else {
        areAllRemoved = true;
      }
    }
  } while (
    !areAllRemoved
  );

  if (!inPlace) {
    return copy;
  }
};

export default removeArrayValue;
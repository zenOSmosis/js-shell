let defaultTitle = document.title;

/**
 * Overrides the defaultTitle with a new default.
 * 
 * @param {string} title 
 */
const setDefaultNativeWindowTitle = (title) => {
  defaultTitle = title;
};

/**
 * Sets the browser's title.
 * 
 * @param {string} title 
 */
const setNativeWindowTitle = (title = null) => {
  if (title) {
    if (title === defaultTitle) {
      document.title = title;
    } else {
      document.title = `${title} | ${defaultTitle}`;
    }
  } else {
    document.title = defaultTitle;
  }
};

/**
 * Resets browser title back to the default.
 */
const resetNativeWindowTitle = () => {
  this.setNativeWindowTitle(defaultTitle);
}

export default setNativeWindowTitle;
export {
  setDefaultNativeWindowTitle,
  resetNativeWindowTitle
};
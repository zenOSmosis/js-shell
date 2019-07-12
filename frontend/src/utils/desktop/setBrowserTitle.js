let defaultTitle = document.title;

/**
 * Overrides the defaultTitle with a new default.
 * 
 * @param {String} title 
 */
const setDefaultTitle = (title) => {
  defaultTitle = title;
};

/**
 * Sets the browser's title.
 * 
 * @param {String} title 
 */
const setBrowserTitle = (title = null) => {
  if (title) {
    document.title = `${title} | ${defaultTitle}`;
  } else {
    document.title = defaultTitle;
  }
};

/**
 * Resets browser title back to the default.
 */
const resetBrowserTitle = () => {
  this.setBrowserTitle(defaultTitle);
}

export default setBrowserTitle;
export {
  setDefaultTitle,
  resetBrowserTitle
};
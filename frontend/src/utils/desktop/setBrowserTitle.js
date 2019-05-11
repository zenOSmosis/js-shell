const defaultTitle = document.title;

/**
 * Sets the browser's title.
 * 
 * @param {string} title 
 */
const setBrowserTitle = (title) => {
  document.title = `${title} | ${defaultTitle}`;
};

/**
 * Resets browser title back to default.
 */
const resetBrowserTitle = () => {
  this.setBrowserTitle(defaultTitle);
}

export default setBrowserTitle;
export {
  resetBrowserTitle
};
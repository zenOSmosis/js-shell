/**
 * Retrieves information about the current Shell build for both frontend &
 * backend packages.
 * 
 * Note: Refer to config-overrides.js for composition.
 * 
 * @return {Object}
 */
const getShellUIBuildInfo = () => {
  const data = process.env.REACT_APP_SHELL_UI_BUILD_INFO;

  if (!data) {
    return {};
  }

  const json = process.env.REACT_APP_SHELL_UI_BUILD_INFO;

  return JSON.parse(json);
};

export default getShellUIBuildInfo;
const getShellUIBuildInfo = () => {
  const json = process.env.REACT_APP_SHELL_UI_BUILD_INFO;

  return JSON.parse(json);
};

export default getShellUIBuildInfo;
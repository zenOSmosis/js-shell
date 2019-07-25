export const CURSOR_OPTIONS = [
  {
    api: 'always',
    title: 'Always',
    helpText: 'The mouse cursor should always be captured in the generated stream.'
  },
  {
    api: 'motion',
    title: 'Motion',
    helpText: 'The cursor should only be visible while moving, and, at the discretion of the user agent, for a brief time before after moving. Then the cursor is removed from the stream.'
  },
  {
    api: 'never',
    title: 'Never',
    helpText: 'The cursor should never be visible in the generated stream.'
  }
];

/**
 * @typedef {Object} DisplaySurface
 * @property {string} api
 * @property {string} title
 * @property {string} helpText
 */

 /**
  * @type {DisplaySurface[]} DISPLAY_SURFACES
  */
export const DISPLAY_SURFACES = [
  {
    api: 'application',
    title: 'Application',
    helpText: `Allow the user to select one running application. Upon doing so, the generated stream contains all of that application's windows accumulated into the output stream. Each frame of video contains all of the application windows. The layout and style of the frames are up to the user agent.`
  },
  {
    api: 'browser',
    title: 'Browser',
    helpText: `The user is allowed to select one browser tab to share. The contents of its document are shared as a stream.`
  },
  {
    api: 'monitor',
    title: 'Monitor',
    helpText: `The user's entire screen is shared, or, if they have mutliple screens, they are able to select a screen to share. User agents are also permitted to offer to combine the contents of all of the user's screens into a single track in the stream and share them all at once.`
  },
  {
    api: 'window',
    title: 'Window',
    helpText: `Allow the user to choose one application window on their computer to be captured.`
  }
];
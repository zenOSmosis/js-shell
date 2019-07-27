/**
 * Note: Each app registers itself with the Desktop.
 * 
 * Important!  This file in included in /components/Desktop/Desktop.jsx. It
 * should not be included in the baseline core, as the entire Desktop will
 * reload when changing the source code to an app, thus losing hot module
 * replacement (HMR) functionality.
 */

import './FilesApp';
// import './HelloWorldApp';
import './UserProfileApp';
import './P2PConnectionApp';
import './VoiceInputApp';
import './ScreenRecorderApp';
import './SourceCodeApp';
import './SystemDetailApp';

// Non-ported apps

// import './SettingsApp';
// import './WindowManagerApp';
// import './DocsApp';
// import './AboutApp';
// import './ProcessTesterApp';
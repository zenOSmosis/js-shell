import ClientGUIProcess, {
  EVT_GUI_PROCESS_FOCUS,
  EVT_FIRST_RENDER
} from '../ClientGUIProcess';
import { EVT_BEFORE_EXIT } from '../ClientProcess';
import { commonDesktopLinkedState } from 'state/commonLinkedStates';

let focusedGUIProcess = null;

/**
 * Base on which AppRuntime extends.
 * 
 * Most GUI processes should use this as a base.
 * 
 * TODO: Consider renaming to StackableGUIProcess and move focus / blur
 * functionality here.
 */
export default class DesktopChildGUIProcess extends ClientGUIProcess {
  async _init() {
    try {
      this.on(EVT_FIRST_RENDER, () => {
        // Automatically focus on first render
        this.focus();
      });

      this.on(EVT_GUI_PROCESS_FOCUS, () => {
        // Ignore if already focused
        if (Object.is(this, focusedGUIProcess)) {
          return;
        }
  
        // Blur existing GUI process, if present
        if (focusedGUIProcess) {
          focusedGUIProcess.blur();
        }
  
        focusedGUIProcess = this;
        commonDesktopLinkedState.setFocusedDesktopChildGUIProcess(this);
      });

      this.once(EVT_BEFORE_EXIT, () => {
        if (Object.is(this, focusedGUIProcess)) {
          focusedGUIProcess = null;
          commonDesktopLinkedState.setFocusedDesktopChildGUIProcess(null);
        }
      });

      await super._init();
    } catch (exc) {
      throw exc;
    }
  }
}
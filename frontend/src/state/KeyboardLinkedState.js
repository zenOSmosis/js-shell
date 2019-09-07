import LinkedState from './LinkedState';

export const STATE_PRESSED_MODIFIERS = 'pressedModifiers';
export const STATE_PRESSED_NORMALIZED_KEY = 'pressedNormalizedKey';
export const STATE_PRESSED_KEY_CODE = 'pressedKeyCode';
export const STATE_PRESSED_EVT = 'pressedEvt';

export const ACTION_HANDLE_KEY_DOWN = 'handleKeyDown';
export const ACTION_HANDLE_KEY_UP = 'handleKeyUp';

export const NORMALIZED_KEY_ENTER = 'ENTER';
export const NORMALIZED_KEY_ESCAPE = 'ESCAPE';
export const NORMALIZED_KEY_ARROW_UP = 'ARROWUP';
export const NORMALIZED_KEY_ARROW_RIGHT = 'ARROWRIGHT';
export const NORMALIZED_KEY_ARROW_DOWN = 'ARROWDOWN';
export const NORMALIZED_KEY_ARROW_LEFT = 'ARROWLEFT';

class KeyboardLinkedState extends LinkedState {
  constructor() {
    super('keyboard-linked-state', {
      [STATE_PRESSED_MODIFIERS]: null,
      [STATE_PRESSED_NORMALIZED_KEY]: null,
      [STATE_PRESSED_KEY_CODE]: null,
      [STATE_PRESSED_EVT]: null
    }, {
      actions: {
        [ACTION_HANDLE_KEY_UP]: (linkedState, evt) => {
          const keys = this._initialDefaultKeys;

          const updatedState = {};
          for (let i = 0; i < keys.length; i++) {
            updatedState[keys[i]] = null;
          }

          this.setState(updatedState);
        },

        [ACTION_HANDLE_KEY_DOWN]: (linkedState, evt) => {
          const pressedModifiers = {
            isAlt: evt.altKey,
            isCtrl: evt.ctrlKey,
            isMeta: evt.metaKey,
            isShift: evt.shiftKey
          };
      
          const pressedNormalizedKey = evt.key.toUpperCase();
          const pressedKeyCode = evt.code;
    
          const updatedState = {
            [STATE_PRESSED_MODIFIERS]: pressedModifiers,
            [STATE_PRESSED_NORMALIZED_KEY]: pressedNormalizedKey,
            [STATE_PRESSED_KEY_CODE]: pressedKeyCode,
            [STATE_PRESSED_EVT]: evt
          };

          this.setState(updatedState);

          // TODO: Remove
          /*
          console.debug({
            updatedState
          });
          */
      
          /*
          if (normalizedKey === 'I' && 
              modifiers.isShift && 
              modifiers.isCtrl) {
            // Stop here; allow event to be passed through to the browser to open up the developer tools
      
            return;
          } else {
            
          }
          */
      
          /*
          if (evt.ctrlKey || evt.metaKey) {
            switch (String.fromCharCode(evt.which).toLowerCase()) {
              case 'S':
                console.debug('Ctrl+S');
                break;
              case 'F':
                console.debug('Ctrl+F');
                break;
              case 'G':
                console.debug('Ctrl+G');
                break;
            }
          }
          */
        }
      }
    })
  }
}

export default KeyboardLinkedState;
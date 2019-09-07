import LinkedState from './LinkedState';

export const ACTION_HANDLE_KEY_DOWN = 'handleKeyDown';
export const ACTION_HANDLE_KEY_UP = 'handleKeyUp';

class KeyboardLinkedState extends LinkedState {
  constructor() {
    super('keyboard-linked-state', {
      pressedModifiers: null,
      pressedNormalizedKey: null,
      pressedKeyCode: null,
      pressedEvt: null
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
            pressedModifiers,
            pressedNormalizedKey,
            pressedKeyCode,
            pressedEvt: evt
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
// TODO: Add support for these
// const DESIRED_FPS = 90;
// const BUFFER_MS = parseInt(1000 / DESIRED_FPS);

/**
 * Adds a short-term buffer between rapid GUI changes in order to free CPU time
 * and prevent the UI from periodically locking up.
 *
 * Note:  Some frames may be skipped if duplicate onChange signatures are
 * passed within the BUFFER_MS time period.  If so, the last frame passed
 * will be executed within that stack.
 */
const bufferUIChange = (() => {
  // TODO: Make able to be set externally
  const BUFFER_MS = 5;

  class UIChangeStack {
    _changeFrames = [];

    _nativeTimeout = null;

    addChangeFrame(onChange) {
      const changeSignature = onChange.toString();

      // Remove existing change frames with same function signature
      this._changeFrames = this._changeFrames.filter((changeFrame) => {
        const testChangeSignature = changeFrame.toString();

        if (changeSignature === testChangeSignature) {
          return false;
        }

        return true;
      });

      // Add new frame to stack
      this._changeFrames.push(onChange);

      clearTimeout(this._nativeTimeout);

      this._nativeTimeout = setTimeout(() => {
        this.render();
      }, BUFFER_MS);
    }

    /**
     * Runs all change frames, then clears the stack.
     */
    render() {
      // Create local buffer
      const changeFrames = this._changeFrames;
      
      // Empty class buffer
      this.clearChangeFrames();

      const totalChangeFrames = changeFrames.length;

      if (totalChangeFrames) {
        // Run
        window.requestAnimationFrame(() => {
          // Execute each change frame
          for (let i = 0; i < totalChangeFrames; i++) {
            changeFrames[i]();
          }
        }); 
      }
    }

    /**
     * Empties the change frame stack.
     */
    clearChangeFrames() {
      this._changeFrames = [];
    }
  }

  const uiChangeStack = new UIChangeStack();

  return (onChange) => {
    uiChangeStack.addChangeFrame(onChange);
  };
})();

export default bufferUIChange;
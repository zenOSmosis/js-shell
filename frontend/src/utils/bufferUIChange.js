/**
 * Adds a short-term buffer between rapid GUI changes in order to free CPU time
 * and prevent the UI from periodically locking up.
 *
 * Note:  Some frames may be skipped if duplicate onChange signatures are
 * passed within the BUFFER_MS time period.  If so, the last frame passed
 * will be executed within that stack.
 */
const bufferUIChange = (() => {
  // const DESIRED_FPS = 90;
  // const BUFFER_MS = parseInt(1000 / DESIRED_FPS);
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

      this._changeFrames.push(onChange);

      clearTimeout(this._nativeTimeout);

      this._nativeTimeout = setTimeout(() => {
        this.execChangeFrames();
      }, BUFFER_MS);
    }

    /**
     * Runs all change frames, then clears the stack.
     */
    execChangeFrames() {
      window.requestAnimationFrame(() => {
        let totalChangeFrames = this._changeFrames.length;

        // Execute each change frame
        for (let i = 0; i < totalChangeFrames; i++) {
          this._changeFrames[i]();
        }

        this.clearChangeFrames();
      });
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
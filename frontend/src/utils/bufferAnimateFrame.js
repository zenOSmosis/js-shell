// TODO: Add support for these
// const DESIRED_FPS = 90;
// const BUFFER_MS = parseInt(1000 / DESIRED_FPS, 10);

/**
 * Adds a short-term buffer between rapid GUI changes in order to free CPU time
 * and prevent the UI from periodically locking up.
 *
 * Note:  Some frames may be skipped if duplicate animationFrame signatures are
 * passed within the BUFFER_MS time period.  If so, the last frame passed
 * will be executed within that stack.
 */
const bufferAnimateFrame = (() => {
  // TODO: Make able to be set externally
  const BUFFER_MS = 5;

  class UIChangeStack {
    _animationFrames = [];

    _nativeTimeout = null;

    addAnimationFrame(animationFrame) {
      const changeSignature = animationFrame.toString();

      // Remove existing change frames with same function signature
      this._animationFrames = this._animationFrames.filter((changeFrame) => {
        const testChangeSignature = changeFrame.toString();

        if (changeSignature === testChangeSignature) {
          return false;
        }

        return true;
      });

      // Add new frame to stack
      this._animationFrames.push(animationFrame);

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
      const changeFrames = this._animationFrames;
      
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
      this._animationFrames = [];
    }
  }

  const uiChangeStack = new UIChangeStack();

  return (animationFrame) => {
    uiChangeStack.addAnimationFrame(animationFrame);
  };
})();

export default bufferAnimateFrame;
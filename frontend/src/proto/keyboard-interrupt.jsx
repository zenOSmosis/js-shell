const { ClientProcess, ClientGUIProcess, React, zdComponents } = this;
const { Window } = zdComponents;

const doc = nativeWindow.document;

class Keyboard extends ClientProcess {
  constructor() {
    super((proc) => { });

    this._handleKeyboardInteract = this._handleKeyboardInteract.bind(this);

    doc.addEventListener('keydown', this._handleKeyboardInteract);
    doc.addEventListener('keypress', this._handleKeyboardInteract);
    doc.addEventListener('keyup', this._handleKeyboardInteract);
  }

  _handleKeyboardInteract(evt) {
    if (evt.type === 'keyup') {
        // Write event to output stream
        this.stdout.write(evt);
    }
  }

  kill() {
    doc.removeEventListener('keydown', this._handleKeyboardInteract);
    doc.removeEventListener('keypress', this._handleKeyboardInteract);
    doc.removeEventListener('keyup', this._handleKeyboardInteract);

    super.kill();
  }
}

new ClientGUIProcess((proc) => {
  const keyboard = new Keyboard();

  // A string of the keys pressed
  let buffer = '';

  keyboard.stdout.on('data', (data) => {
    console.log(data);
    
    buffer += data.key;

    proc.emit('update');
  });

  proc.setView((props) => {
    return (
      <Window
        title={`Total Presses: ${buffer.length}`}
      >
        {buffer}
      </Window>
    )
  });

  proc.on('beforeExit', () => {
    keyboard.kill();
  });
});
const { ClientGUIProcess, React, zdComponents } = this;
const { Window } = zdComponents;

new ClientGUIProcess(
  (proc) => {
    // proc.retain();

    proc.setName('xterm');

    proc.setDesktopMenubarData([
      {
        title: 'File',
        items: [
          {
            title: 'New',
            onClick: (evt) => { alert('clicked new') }
          },

          {
            title: 'Open',
            onClick: (evt) => { alert('clicked open') }
          },

          {
            title: 'Save',
            onClick: (evt) => { alert('clicked save') }
          },

          {
            title: 'Save As',
            onClick: (evt) => { alert('clicked save as') }
          },
        ]
      }
    ]);

    proc.on('beforeexit', () => {
      console.debug('about to exit xterm', proc);
    });

    proc.setReactRenderer(
      (props) => {
        return (
          <Window
            onReady={win => console.warn('window ready', win)}
            title={proc.getName()}
            proc={proc}
          >
            Hello World!
          </Window>
        );
      }
    );

    /*
    setTimeout(() => {
      proc.setName('xterm 1 2 3');
    }, 2000);
    */
  }
);
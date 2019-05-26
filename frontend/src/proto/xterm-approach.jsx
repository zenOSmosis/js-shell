const { ClientGUIProcess, React, zdComponents } = this;
const { Window } = zdComponents;

new ClientGUIProcess(
  (proc) => {
    // proc.retain();

    proc.setName('xterm');

    proc.on('beforeexit', () => {
      console.debug('about to exit xterm', proc);
    });

    proc.setReactRenderer(
      (props) => {
        console.debug(props);

        return (
          <Window
            onReady={win => console.warn('window ready', win)}
            title={proc.getName()}
          >
            Hello World!
          </Window>
        );
      }
    );

    setTimeout(() => {
      // TODO: Assert window receives this update
      proc.setName('Hello1111');
    }, 2000);
  }
);
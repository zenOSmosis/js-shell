const { components, ClientGUIProcess  } = this;
const { Window } = components;

new ClientGUIProcess(process, (proc) => {
    proc.setView(props => {
        return (
            <Window>Hello</Window>
        );
    });
});
const { components, ClientGUIProcess  } = this;
const { Window } = components;

new ClientGUIProcess(process, (proc) => {
    proc.setContent(props => {
        return (
            <Window>Hello</Window>
        );
    });
});
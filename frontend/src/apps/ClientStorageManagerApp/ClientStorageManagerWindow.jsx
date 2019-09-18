import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import Layout, { Header, Content } from 'components/Layout';
import {
  getAllKeys as getAllLocalStorageKeys,
  removeItem
} from 'utils/encryptedLocalStorage';

export default class ClientStorageManagerWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingKey: false,
      localStorageKeys: []
    };

    this._encryptedLocalStorageLinkedState = this.props.encryptedLocalStorageLinkedState;
  }

  componentDidMount() {
    this._encryptedLocalStorageLinkedState.on('update', this._handleLocalStorageKeysUpdate);

    // Perform initial sync
    this._handleLocalStorageKeysUpdate();
  }

  componentWillUnount() {
    this._encryptedLocalStorageLinkedState.off('update', this._handleLocalStorageKeysUpdate);
  }

  _handleLocalStorageKeysUpdate = () => {
    const localStorageKeys = getAllLocalStorageKeys();

    this.setState({
      localStorageKeys
    });
  }

  render() {
    const { appRuntime, ...propsRest } = this.props;
    const { isAddingKey, localStorageKeys } = this.state;

    return (
      <Window
        {...propsRest}
        appRuntime={appRuntime}
        subToolbar={
          <div style={{ textAlign: 'center' }}>
            <button disabled={isAddingKey} onClick={evt => this.setState({ isAddingKey: true })}>
              Add Key +
            </button>

            <button>
              Clear
            </button>
          </div>
        }
      >
        <Layout>
          {
            isAddingKey &&
            <Header>
              <input type="text" placeholder="Key Name" />
              <input type="text" placeholder="Key Value" />
              <button>
                Add
              </button>

              <button onClick={evt => this.setState({ isAddingKey: false })}>
                Cancel
              </button>
            </Header>
          }
          <Content>
            {
              localStorageKeys.length === 0 &&
              <Center>
                Encrypted Local Storage is empty.
              </Center>
            }
            {
              localStorageKeys.length > 0 &&
              <table>
              {
                localStorageKeys.map((itemKey, idx) => {
                  return (
                    <tr key={idx}>
                      <td>
                        { itemKey }
                      </td>
                      <td>
                        <button onClick={ evt => removeItem(itemKey) }>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              }
            </table>
            }
            {
              /*
              <p>
                {appRuntime.getTitle()} manages simple key-value-pairs for local storage and session storage APIs, providing an additional layer of encryption on top of them.
              </p>
              */
            }
          </Content>
        </Layout>
      </Window>
    );
  }
}
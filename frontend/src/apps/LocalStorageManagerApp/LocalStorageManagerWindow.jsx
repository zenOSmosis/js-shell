import React, { Component } from 'react';
import Window from 'components/Desktop/Window';
import Center from 'components/Center';
import Layout, { Header, Content, Footer } from 'components/Layout';
import AddKeyForm from './subComponents/AddKeyForm';
import {
  getAllKeys as getAllLocalStorageKeys,
  clear,
  setItem,
  getItem,
  removeItem,
  removeAllItems
} from 'utils/encryptedLocalStorage';

export default class LocalStorageManagerWindow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAddingItem: false,
      localStorageKeys: [],
      displayedItemKeys: []
    };

    this._defaultState = { ...this.state };

    const { encryptedLocalStorageLinkedState } = this.props.appRuntime.getState();
    this._encryptedLocalStorageLinkedState = encryptedLocalStorageLinkedState;

    this._handleLocalStorageKeysUpdate = this._handleLocalStorageKeysUpdate.bind(this);
  }

  componentDidMount() {
    // TODO: Use constant for event name
    this._encryptedLocalStorageLinkedState.on('update', this._handleLocalStorageKeysUpdate);

    // Perform initial sync
    this._handleLocalStorageKeysUpdate();
  }

  componentWillUnount() {
    // TODO: Use constant for event name
    this._encryptedLocalStorageLinkedState.off('update', this._handleLocalStorageKeysUpdate);
  }

  _handleLocalStorageKeysUpdate() {
    const localStorageKeys = getAllLocalStorageKeys();

    this.setState({
      localStorageKeys
    });
  }

  _handleAddItem(itemName, value) {
    if (itemName.length === 0 || value.length === 0) {
      alert('Item name and value must be set.');
      return;
    }

    const itemExists = getItem(itemName).length > 0 ? true : false;

    if (itemExists) {
      alert('Item already exists');
      return;
    }

    setItem(itemName, value);

    this.setState({
      isAddingItem: false
    });
  };

  _handleRemoveAllItems() {
    this.setState(this._defaultState);

    removeAllItems();
  }

  displayItem(itemKey) {
    const { displayedItemKeys } = this.state;

    if (!displayedItemKeys.includes(itemKey)) {
      displayedItemKeys.push(itemKey);

      this.setState({
        displayedItemKeys
      });
    }
  }

  hideItem(itemKey) {
    const { displayedItemKeys } = this.state;
    const itemIdx = displayedItemKeys.indexOf(itemKey);
    displayedItemKeys.splice(itemIdx, 1);

    this.setState({
      displayedItemKeys
    });
  }

  toggleDisplayItem(itemKey) {
    const { displayedItemKeys } = this.state;
    if (!displayedItemKeys.includes(itemKey)) {
      this.displayItem(itemKey);
    } else {
      this.hideItem(itemKey);
    }
  }

  render() {
    const { appRuntime, ...propsRest } = this.props;
    const { isAddingItem, localStorageKeys, displayedItemKeys } = this.state;

    return (
      <Window
        {...propsRest}
        appRuntime={appRuntime}
        subToolbar={
          <div style={{ textAlign: 'center' }}>
            <button disabled={isAddingItem} onClick={evt => this.setState({ isAddingItem: true })}>
              Add Key +
            </button>

            <button onClick={evt => this._handleRemoveAllItems()}>
              Remove All Keys -**
            </button>
          </div>
        }
      >
        <Layout>
          {
            isAddingItem &&
            <Header>
              <AddKeyForm
                onAddRequest={([itemName, value]) => this._handleAddItem(itemName, value)}
                onCancelRequest={evt => this.setState({ isAddingItem: false })}
              />
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
              <table style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <td>
                      Key
                    </td>
                    <td>
                      Value
                    </td>
                    <td>
                      f/x
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {
                    localStorageKeys.map((itemKey, idx) => {
                      const isDisplayed = displayedItemKeys.includes(itemKey);
                      let renderedItemValue = null;
                      if (isDisplayed) {
                        const itemValue = getItem(itemKey);
                        if (typeof itemValue === 'string') {
                          renderedItemValue = itemValue;
                        } else {
                          renderedItemValue = JSON.stringify(itemValue);
                        }
                      }

                      return (
                        <tr key={idx}>
                          <td>
                            {itemKey}
                          </td>
                          <td style={{ width: '100%' }}>
                            {
                              (
                                !isDisplayed ?
                                  <span style={{ fontStyle: 'italic' }}>Hidden</span>
                                  :
                                  renderedItemValue
                              )
                            }
                          </td>
                          <td>
                            <div style={{ whiteSpace: 'nowrap' }}>
                              <button onClick={evt => this.toggleDisplayItem(itemKey)}>
                                {(!isDisplayed ? 'View' : 'Hide')}
                              </button>
                              <button>
                                Edit
                              </button>
                              <button onClick={evt => removeItem(itemKey)}>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
              </table>
            }
          </Content>
          <Footer>
            <p>
              {appRuntime.getTitle()} manages simple key-value-pairs for the underlying EncryptedLocalStorage engine.
            </p>
          </Footer>
        </Layout>
      </Window>
    );
  }
}
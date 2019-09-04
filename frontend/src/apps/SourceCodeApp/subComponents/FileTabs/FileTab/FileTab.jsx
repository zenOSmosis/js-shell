import React, { Component } from 'react';
import TransparentButton from 'components/TransparentButton';
// import textEllipsis from 'utils/text/textEllipsis';
import style from './FileTab.module.css';
import { Row, Column } from 'components/Layout';
import activateFile from '../../../utils/file/activateFile';
import closeFile from '../../../utils/file/closeFile';

class FileTab extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      base: null
    };
  }

  // TODO: Move pathDetail aquisition to file open & handle there
  async componentDidMount() {
    try {
      const { file } = this.props;

      if ('fileDetail' in file) {
        const { fileDetail } = file;

        const { base } = fileDetail;
  
        this.setState({
          base
        });
      }
    } catch (exc) {
      throw exc;
    }
  }

  async _handleActivate() {
    try {
      const { editorLinkedState, file } = this.props;

      await activateFile(editorLinkedState, file);
    } catch (exc) {
      throw exc;
    }
  }

  async _handleClose() {
    try {
      const { editorLinkedState, file } = this.props;

      await closeFile(editorLinkedState, file);  
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { base } = this.state;

    return (
      <div
        className={style['file-tab']}
      >
        <Row>
          <Column>
            <TransparentButton onClick={evt => this._handleActivate()}>
              i
            </TransparentButton>
          </Column>

          <Column>
            <TransparentButton onClick={evt => this._handleActivate()}>
              <div className={style['file-name']}>
                {
                  base &&
                  <span>{base}</span>
                }
                {
                  !base &&
                  <span style={{fontStyle: 'italic'}}>Untitled</span>
                }
              </div>
            </TransparentButton>
          </Column>

          <Column>
            <TransparentButton
              onClick={evt => this._handleClose()}
            >
              x
            </TransparentButton>
          </Column>
        </Row>

        { /* textEllipsis(filePath, 20) */}
      </div>
    );
  }
}

export default FileTab;
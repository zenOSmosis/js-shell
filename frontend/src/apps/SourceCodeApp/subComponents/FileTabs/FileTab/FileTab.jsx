import React, { Component } from 'react';
import TransparentButton from 'components/TransparentButton';
// import textEllipsis from 'utils/text/textEllipsis';
import styles from './FileTab.module.css';
import { Row, Column } from 'components/Layout';
import {
  activateAppFile,
  closeAppFile
} from 'utils/appFile';
import PropTypes from 'prop-types';

class FileTab extends Component {
  static propTypes = {
    appFile: PropTypes.object.isRequired,

    // TODO: Validate instanceOf
    editorLinkedState: PropTypes.object.isRequired
  };

  constructor(...args) {
    super(...args);

    this.state = {
      base: null
    };
  }

  // TODO: Move pathDetail aquisition to file open & handle there
  async componentDidMount() {
    try {
      const { appFile } = this.props;

      const { fileDetail } = appFile;
     
      if (fileDetail) {
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
      const { editorLinkedState, appFile } = this.props;

      await activateAppFile(editorLinkedState, appFile);
    } catch (exc) {
      throw exc;
    }
  }

  async _handleClose() {
    try {
      const { editorLinkedState, appFile } = this.props;

      await closeAppFile(editorLinkedState, appFile);  
    } catch (exc) {
      throw exc;
    }
  }

  render() {
    const { base } = this.state;

    return (
      <div
        className={styles['file-tab']}
      >
        <Row>
          <Column>
            <TransparentButton onClick={evt => this._handleActivate()}>
              i
            </TransparentButton>
          </Column>

          <Column>
            <TransparentButton onClick={evt => this._handleActivate()}>
              <div className={styles['file-name']}>
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
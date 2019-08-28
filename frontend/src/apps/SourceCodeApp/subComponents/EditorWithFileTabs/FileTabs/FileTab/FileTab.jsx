import React, { Component } from 'react';
import TransparentButton from 'components/TransparentButton';
// import textEllipsis from 'utils/text/textEllipsis';
import style from './FileTab.module.css';
import { Row, Column } from 'components/Layout';
import { pathDetail } from 'utils/socketFS';

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
      const { filePath } = this.props;

      const detail = await pathDetail(filePath);

      const { base } = detail;

      this.setState({
        base
      });
    } catch (exc) {
      throw exc;
    }
  }

  _handleClose() {
    const { onClose } = this.props;

    onClose();
  }

  render() {
    const { base } = this.state;

    if (!base) {
      return false;
    }

    return (
      <div
        className={style['file-tab']}
      // onClick={evt => }
      >
        <Row>
          <Column>
            i  
          </Column>

          <Column>
            <div className={style['file-name']}>{base}</div>
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
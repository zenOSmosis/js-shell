import React, {Component} from 'react';
import './style.css';
import ViewTransition from '../ViewTransition';

const DEFAULT_IN_TRANSITION = 'flipInY';
const DEFAULT_OUT_TRANSITION = 'flipOutY';

export default class FullViewportPanel extends Component {
  state = {
    viewTransition: DEFAULT_IN_TRANSITION,
    isOpen: false,
    openCode: null
  };

  componentDidMount() {
    const {openCode} = this.props;
    this.setOpenCode(openCode);
  }

  componentDidUpdate() {
    const {openCode} = this.props;
    this.setOpenCode(openCode);
  }

  setOpenCode(openCode) {
    if (openCode === -1 || openCode === null) {
      return;
    }

    const {openCode: oldOpenCode} = this.state;

    if (openCode !== oldOpenCode) {
      this.setState({
        openCode,
        isOpen: true
      }, () => {
        this._base.style.display = 'block';

        this._viewTransition.animate();
      });
    }
  }

  open() {
    const openCode = this.state.openCode || 0;

    this.setOpenCode(openCode);
  }

  close() {
    this.setState({
      viewTransition: DEFAULT_OUT_TRANSITION
    }, () => {
      
      // TODO: Wait for transition to end before continuing
      this._viewTransition.once('transitionend', () => {
        this._base.style.display = 'none';

        this.setState({
          viewTransition: DEFAULT_IN_TRANSITION,
          isOpen: false
        });
      });      
    });
  }

  render() {
    const {isOpen, viewTransition} = this.state;
    let {title, description, children, uicloseable: isUICloseable} = this.props;
    isUICloseable = (typeof isUICloseable === 'undefined' ? true : false);

    return (
        <div
          ref={ c => this._base = c }
          className={`FullViewportPanel ${isOpen ? 'open' : ''}`}
        >
          <ViewTransition
            ref={ c=> this._viewTransition = c }
            className="FullViewportPanelTransitioner"
            effect={viewTransition}
          >
            <div className="FullViewportPanelHeader">
              <div className="Title">
                {title}
              </div>
              <div className="Description">
                {description}
              </div>
              {
                isUICloseable &&
                <button onClick={this.onCloseButtonClick}>X</button>
              }
              
            </div>
            <div className="FullViewportPanelBody">
              {children}
            </div>
          </ViewTransition>
        </div>
    );
  }

  onCloseButtonClick = (evt) => {
    this.close();
  }
}
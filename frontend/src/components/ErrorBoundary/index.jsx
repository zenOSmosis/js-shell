import React, { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  /*
  getDerivedStateFromError(error, errorInfo) {
    console.warn(error, errorInfo);
  }
  */

  clearState() {
    this.setState({
      error: null,
      errorInfo: null
    });
  }
  
  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong</h2>
          <button onClick={ evt => this.clearState() }>Resume</button>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    // Render children if there's no error
    return this.props.children;
  }  
}
import React, { Component } from 'react'

class DropFile extends Component {
  constructor() {
    super();
    this.state = {
      dragging: false
    }

    this.dragCounter = 0;
  }

  handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.dragCounter++
    this.setState({dragging: true})
  }

  handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()

    this.dragCounter--
    if (this.dragCounter === 0) {
      this.setState({dragging: false})
    }
  }

  handleDrop = (e) => {
    const {handleDrop} = this.props;
    e.preventDefault()
    e.stopPropagation()

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if(typeof handleDrop != 'undefined') {
        handleDrop(e.dataTransfer.files)
      }
      this.setState({dragging: false})
      e.dataTransfer.clearData()
      this.dragCounter = 0    
    }
  }

  componentDidMount() {
    let div = this.dropRef
    div.addEventListener('dragenter', this.handleDragIn.bind(this))
    div.addEventListener('dragleave', this.handleDragOut.bind(this))
    div.addEventListener('dragover', this.handleDrag.bind(this))
    div.addEventListener('drop', this.handleDrop.bind(this))
  }

  componentWillUnmount() {
    let div = this.dropRef
    div.removeEventListener('dragenter', this.handleDragIn)
    div.removeEventListener('dragleave', this.handleDragOut)
    div.removeEventListener('dragover', this.handleDrag)
    div.removeEventListener('drop', this.handleDrop)
  }

  render() {
    const { dragging } = this.state;
    return (
      <div
        id="dropZone"
        style={{widht: '100%', height: '100%'}}
        ref={ref => this.dropRef = ref}
      >
        {dragging &&
          <div 
            style={{
              border: 'dashed grey 2px',
              backgroundColor: 'rgba(255,255,255,.5)',
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0, 
              right: 0,
              zIndex: 9999
            }}
          >
            <div 
              style={{
                position: 'absolute',
                top: '50%',
                right: 0,
                left: 0,
                textAlign: 'center',
                color: '#000',
                fontSize: 24
              }}
            >
              <div>Upload files</div>
            </div>
          </div>
        }
        {this.props.children}
      </div>
    )
  }
}
export default DropFile
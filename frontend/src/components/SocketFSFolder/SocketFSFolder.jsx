import React, { Component } from 'react';
import Full from '../Full';
import ScrollableReactTable from '../ScrollableReactTable';
import SocketFSFolderNode from './SocketFSFolderNode';
import { dirDetail } from 'utils/socketFS';
import unixTimeToHumanReadable from 'utils/time/unixTimeToHumanReadable';
import PropTypes from 'prop-types';
import style from './SocketFSFolderNode.module.scss';
import classNames from 'classnames';
import arrayEquals from 'utils/array/arrayEquals';

class SocketFSFolder extends Component {
  static propTypes = {
    onDirChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      cwd: '/',

      dirChildren: [],
      selectedDirChildren: []
    };
  }

  setState(newState, callback = null) {
    // const { selectedDirChildren } = this.state;
    const { selectedDirChildren: newSelectedDirChildren } = newState;

    if (newSelectedDirChildren !== undefined) {
      const { onSelectedDirChildrenChange } = this.props;

      if (typeof onSelectedDirChildrenChange === 'function') {
        onSelectedDirChildrenChange(newSelectedDirChildren);
      }
    }

    return super.setState(newState, callback);
  }

  componentDidMount() {
    this.chdir('/');
  }

  async chdir(path) {
    try {
      const detail = await dirDetail(path);

      // Normalize the path
      path = detail.path;

      let { children: dirChildren } = detail;

      // Filter out errored children
      dirChildren = dirChildren.filter(child => {
        if (child.error) {
          console.error(child.error);

          return false;
        } else {
          return true;
        }
      });

      this.setState({
        dirChildren,
        selectedDirChildren: []
      });

      const { onDirChange } = this.props;
      if (typeof onDirChange === 'function') {
        onDirChange(detail);
      }
    } catch (exc) {
      throw exc;
    }    
  }

  selectDirChild(dirChild) {
    const { selectedDirChildren } = this.state;

    selectedDirChildren.push(dirChild);

    this.setState({
      selectedDirChildren
    });
  }

  unselectDirChild(dirChild) {
    const { selectedDirChildren } = this.state;

    for (let i = 0; i < selectedDirChildren.length; i++) {
      if (Object.is(selectedDirChildren[i], dirChild)) {
        selectedDirChildren.splice(i, 1);
      }
    }

    this.setState({
      selectedDirChildren
    });
  }

  _handleDirChildInteract(evt, dirChild) {
    let { selectedDirChildren } = this.state;

    const which = evt.nativeEvent.which;
    const isLeftClick = which === 1;

    if (!isLeftClick) {
      return;
    }

    const isCurrentlySelected = selectedDirChildren.includes(dirChild);

    const isShift = evt.shiftKey;
    const isCtrl = evt.ctrlKey;

    if (!isShift && !isCtrl) {
      selectedDirChildren = [];
    }

    if (!isCurrentlySelected) {
      selectedDirChildren.push(dirChild);
    }

    this.setState({
      selectedDirChildren
    });
  }

  render() {
    const { dirChildren, selectedDirChildren } = this.state;

    return (
      <ScrollableReactTable
        data={dirChildren}
        showPagination={false}
        pageSize={dirChildren.length}
        getTrProps={(state, rowInfo, column) => {
          const dirChild = rowInfo.original;

          const isSelected = selectedDirChildren.includes(dirChild);

          return {
            className: classNames(style['node'], (isSelected ? style['selected'] : null)),
            onMouseDown: (evt) => this._handleDirChildInteract(evt, dirChild),
            onTouchStart: (evt) => this._handleDirChildInteract(evt, dirChild)
          };
        }}
        columns={[
          {
            Header: 'Name',
            accessor: 'name',
            Cell: (props) =>
              <SocketFSFolderNode
                dirChild={props.original}
                socketFSFolderComponent={this}
              >
                {props.value}
              </SocketFSFolderNode>
          },
          {
            Header: 'Kind',
            accessor: 'kind',
            Cell: (props) => 
              <SocketFSFolderNode
                dirChild={props.original}
                socketFSFolderComponent={this}
              >
                {
                  props.value
                }
              </SocketFSFolderNode>
            }
          ,
          /*
          {
            Header: 'Created',
            accessor: 'stats.ctimeMs',
            Cell: (props) => 
              <SocketFSFolderNode
                dirChild={props.original}
                socketFSFolderComponent={this}
              >
                {
                  unixTimeToHumanReadable(Math.floor(props.value) / 1000)
                }
              </SocketFSFolderNode>
          },
          */
          {
            Header: 'Modified',
            accessor: 'stats.mtimeMs',
            Cell: (props) => 
              <SocketFSFolderNode
                dirChild={props.original}
                socketFSFolderComponent={this}
              >
                {
                  unixTimeToHumanReadable(Math.floor(props.value) / 1000)
                }
              </SocketFSFolderNode>
          },
          /*
          {
            Header: 'Accessed',
            accessor: 'stats.atimeMs',
            Cell: (props) => 
              <SocketFSFolderNode
                dirChild={props.original}
                socketFSFolderComponent={this}
              >
                {
                  unixTimeToHumanReadable(Math.floor(props.value) / 1000)
                }
              </SocketFSFolderNode>
          },
          */
          {
            Header: 'Size',
            accessor: 'stats.size',
            Cell: (props) => 
              <SocketFSFolderNode
                dirChild={props.original}
                socketFSFolderComponent={this}
              >
               {
                 props.value
               }
              </SocketFSFolderNode>
          },
        ]}
      />
    );

    /*
    return (
      <Full>
        {
          dirChildren.map((dirChild, idx) => {
            console.debug({
              child: dirChild
            });

            const { base } = dirChild;

            return (
              <div
                key={idx}
                onMouseDown={evt => console.debug('mouseDown', {evt, ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey})}
                onDoubleClick={ evt => this._handleDirNav(dirChild) }
                onTouchEnd={ evt => this._handleDirNav(dirChild) }
              >
                { base }
              </div>
            )
          })
        }
      </Full>
    );
    */
  }
}

export default SocketFSFolder;
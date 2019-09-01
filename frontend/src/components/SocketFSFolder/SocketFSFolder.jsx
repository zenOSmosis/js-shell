import React, { Component } from 'react';
import Full from '../Full';
import ScrollableReactTable from '../ScrollableReactTable';
import SocketFSFolderNode from './SocketFSFolderNode';
import { dirDetail } from 'utils/socketFS';
import unixTimeToHumanReadable from 'utils/time/unixTimeToHumanReadable';
import PropTypes from 'prop-types';
import style from './SocketFSFolderNode.module.scss';
import classNames from 'classnames';

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
        dirChildren
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

  /*
  async _handleDirNav(dirChild) {
    try {
      const { isDir, path } = dirChild;

      if (isDir) {
        await this.chdir(path);
      } else {
        alert(`TODO: Handle path: ${path}`);
      }
    } catch (exc) {
      throw exc;
    }
  }
  */

  render() {
    const { dirChildren, selectedDirChildren } = this.state;

    return (
      <ScrollableReactTable
        data={dirChildren}
        showPagination={false}
        pageSize={dirChildren.length}
        getTrProps={(state, rowInfo, column) => {
          const dirChild = rowInfo.original;

          if (selectedDirChildren.includes(dirChild)) {
            return {
              className: classNames(style['node'], style['selected'])
            }
          } else {
            return {
              className: classNames(style['node'])
            }
          }
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
import React, { Component } from 'react';
import Full from '../Full';
import ScrollableReactTable from '../ScrollableReactTable';
import SocketFSFolderNode from './SocketFSFolderNode';
import { dirDetail } from 'utils/socketFS';
import unixTimeToHumanReadable from 'utils/time/unixTimeToHumanReadable';
import PropTypes from 'prop-types';

class SocketFSFolder extends Component {
  static propTypes = {
    onDirChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      cwd: '/',

      dirChildren: []
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

  render() {
    const { dirChildren } = this.state;

    return (
      <ScrollableReactTable
        data={dirChildren}
        showPagination={false}
        pageSize={dirChildren.length}
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
          }
          /*
          {
            Header: 'Created',
            id: 'created',
            accessor: child => child.stat.ctimeMS
          },
          */
          /*
          {
            Header: 'Visits',
            // id: 'visits',
            accessor: 'visits'
          }
          */
        ]}
      />
    );

    /*
    return (
      <Full>
        <table style={{width: '100%'}}>
          <thead>
            <tr>
              <td>Name</td>
              <td>Created</td>
              <td>Modified</td>
              <td>Size</td>
            </tr>
          </thead>
          <tbody>
            {
              dirChildren.map((dirChild, idx) => {
                const { base, stats, error } = dirChild;

                if (error) {
                  console.error(error);
                  return false;
                }

                const { ctimeMs, mtimeMs, size } = stats;

                return (
                  <tr
                    key={idx}
                    onMouseDown={evt => console.debug('mouseDown', {evt, ctrlKey: evt.ctrlKey, shiftKey: evt.shiftKey})}
                    onDoubleClick={ evt => this._handleDirNav(dirChild) }
                    onTouchEnd={ evt => this._handleDirNav(dirChild) }
                  >
                    <td>
                      { base }
                    </td>
                    <td>
                      { unixTimeToHumanReadable(Math.floor(ctimeMs) / 1000, 'dddd, MMMM Do, YYYY h:mm:ss A') }
                    </td>
                    <td>
                      { unixTimeToHumanReadable(Math.floor(mtimeMs) / 1000, 'dddd, MMMM Do, YYYY h:mm:ss A') }
                    </td>
                    <td>
                      { size }
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </Full>
    )
    */

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
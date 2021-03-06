import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Full from '../Full';
import ScrollableReactTable from '../ScrollableReactTable';
import SocketFSFolderNode from './SocketFSFolderNode';
import { dirDetail } from 'utils/socketFS';
import unixTimeToHumanReadable from 'utils/time/unixTimeToHumanReadable';
import bytesToSize from 'utils/string/bytesToSize';
import styles from './SocketFSFolderNode.module.scss';
import classNames from 'classnames';
import debounce from 'debounce';

export const LAYOUT_TYPE_ICON = 'icon';
export const LAYOUT_TYPE_TABLE = 'table';
export const LAYOUT_TYPES = [
  LAYOUT_TYPE_ICON,
  LAYOUT_TYPE_TABLE
];

class SocketFSFolder extends Component {
  static propTypes = {
    onDirChange: PropTypes.func,
    onExternalFileOpenRequest: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      cwd: '/',

      dirChildren: [],
      selectedDirChildren: []
    };

    // Apply debounce (see method comments for documentation)
    this._handleDebouncedNodeInteract = debounce(this._handleDebouncedNodeInteract, 50);
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
    const { cwd } = this.props;
    if (cwd) {
      this.chdir(cwd);
    }
  }

  componentDidUpdate(prevProps) {
    const { cwd: prevCwd } = prevProps;
    const { cwd } = this.props;

    if (prevCwd !== cwd) {
      this.chdir(cwd);
    }
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

  _handleNodeInteract(evt, dirChild) {
    evt.persist();
    this._handleDebouncedNodeInteract(evt, dirChild);
  }

  /**
   * IMPORTANT! Debouncing is applied so that dblclick can be intercepted
   * without triggering prior state change resulting from left-click.
   * 
   * @param {Object} evt 
   * @param {Object} dirChild 
   */
  _handleDebouncedNodeInteract(evt, dirChild) {
    if (evt.type === 'dblclick') {
      if (dirChild.isDir) {
        this.chdir(dirChild.path);
      } else if (dirChild.isFile) {
        const { onExternalFileOpenRequest } = this.props;
        if (typeof onExternalFileOpenRequest === 'function') {
          onExternalFileOpenRequest(dirChild.path);
        }
      } else {
        console.error('Unhandled dirChild open request', dirChild);
      }
    } else {
      let { selectedDirChildren } = this.state;

      const which = evt.nativeEvent.which;
      const isLeftClick = which === 1;

      if (!isLeftClick) {
        return;
      }

      // const isCurrentlySelected = selectedDirChildren.includes(dirChild);

      const isShift = evt.shiftKey;
      const isCtrl = evt.ctrlKey;

      if (!isShift && !isCtrl) {
        selectedDirChildren = [];
      }

      selectedDirChildren.push(dirChild);

      this.setState({
        selectedDirChildren
      });
    }
  }

  render() {
    const { dirChildren, selectedDirChildren } = this.state;
    const { layoutType } = this.props;

    switch (layoutType) {
      case LAYOUT_TYPE_TABLE:
        return (
          <ScrollableReactTable
            data={dirChildren}
            showPagination={false}
            pageSize={dirChildren.length}
            getTrProps={(state, rowInfo /*, column */) => {
              const dirChild = rowInfo.original;

              const isSelected = selectedDirChildren.includes(dirChild);

              return {
                className: classNames(styles['node'], (isSelected ? styles['selected'] : null)),
                onDoubleClick: (evt) => this._handleNodeInteract(evt, dirChild),
                onMouseDown: (evt) => this._handleNodeInteract(evt, dirChild),
                // onTouchStart: (evt) => this._handleNodeInteract(evt, dirChild)
              };
            }}
            columns={[
              {
                Header: 'Name',
                accessor: 'base',
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
              },
              {
                Header: 'Size',
                accessor: 'stats.size',
                Cell: (props) => {
                  const { isDir } = props.original;

                  if (isDir) {
                    return <Fragment>--</Fragment>;
                  }

                  return (
                    <SocketFSFolderNode
                      dirChild={props.original}
                      socketFSFolderComponent={this}
                    >
                      {
                        bytesToSize(props.value)
                      }
                    </SocketFSFolderNode>
                  );
                }
              },
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
            ]}
          />
        );
      // break; // returned before

      case LAYOUT_TYPE_ICON:
      default:
        return (
          <Full>
            {
              dirChildren.map((dirChild, idx) => {
                const isSelected = selectedDirChildren.includes(dirChild);

                const { base } = dirChild;

                return (
                  <div
                    key={idx}
                    className={classNames(styles['node'], (isSelected ? styles['selected'] : null))}
                    onMouseDown={evt => this._handleNodeInteract(evt, dirChild)}
                  // onTouchStart={evt => this._handleNodeInteract(evt, dirChild)}
                  >
                    {base}
                  </div>
                )
              })
            }
          </Full>
        );
      // break; // returned before
    }
  }
}

export default SocketFSFolder;
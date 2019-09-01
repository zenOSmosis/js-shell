import { dirDetail } from 'utils/socketFS';

// Used to mute compiler warnings for variables which aren't utilized directly
// in code, but as strings
const absorb = () => null;

const fetchDirTreeData = async (path) => {
  try {
    const rawDirDetail = await dirDetail(path);

    const branchData = {
      isDir: rawDirDetail.isDir,
      name: rawDirDetail.base,
      path: rawDirDetail.path, // Normalized path
      toggled: true,
      children: (() => {
        if (!rawDirDetail.children) {
          return undefined;
        }

        return rawDirDetail.children.filter(child => {
          // Skip error nodes
          if (child.error) {
            console.warn('Skipping errored child', child);
          }
          return !child.error
        }).map(child => {
          const { base: childBase, isDir, ...childRest } = child;

          return {
            // Sub-children don't need to render values at this branch level,
            // and setting undefined as the value removes the dropdown toggle
            children: (isDir ? [] : undefined),
            
            ...childRest,
            isDir,
            name: childBase,
            toggled: false
          }
        });
      })()
    };

    return branchData;
  } catch (exc) {
    throw exc;
  }
};

/**
 * @param {string} path
 * @return {SocketFSFileTreeNodeWithWalkPath} 
 */
const findSocketFSFileTreeNodeWithPath = (treeData, path) => {
  // Absorb fileTreeNode data to mute compiler warnings with eval'd code
  absorb(treeData);

  const SEARCH_KEY_PATH = 'path';
  const SEARCH_KEY_CHILDREN = 'children';

  // Recursively walks the path in order to find the searched tree node
  const r_find = (path, walkPath = '') => {
    // eslint-disable-next-line 
    const subKeys = Object.keys(eval(`treeData${walkPath}`));
    for (const key of subKeys) {
      switch (key) {
        case SEARCH_KEY_PATH:
          // eslint-disable-next-line 
          const treeDataPath = eval(`treeData${walkPath}[key]`);

          if (path === treeDataPath) {
            return walkPath;
          }
          break;

        case SEARCH_KEY_CHILDREN:
          // eslint-disable-next-line 
          const treeDataChildren = eval(`treeData${walkPath}[key]`);

          if (Array.isArray(treeDataChildren)) {
            const lenTreeDataChildren = treeDataChildren.length;

            for (let i = 0; i < lenTreeDataChildren; i++) {
              const child = treeDataChildren[i];

              const { path: childPath } = child;

              if (path === childPath) {
                // Add the current path to the walkPath
                walkPath = `${walkPath}.${SEARCH_KEY_CHILDREN}[${i}]`;

                return walkPath;
              } else {
                // Determine if the current child path is within our search path
                if (path.includes(childPath)) {
                  // Add the current path to the walkPath
                  walkPath = `${walkPath}.${SEARCH_KEY_CHILDREN}[${i}]`;

                  return r_find(path, walkPath);
                }
              }
            }
          }
          break;

        default:
          // Ignore
          break;
      }
    }
  };

  let walkPath = r_find(path);

  if (!walkPath) {
    console.warn('Could not obtain walk path for path', path);

    walkPath = '';
  }

  // if (walkPath) {
  // eslint-disable-next-line 
  const fileTreeNode = eval(`treeData${walkPath}`);

  return {
    walkPath,
    fileTreeNode
  };
  // }
};

export {
  absorb,
  fetchDirTreeData,
  findSocketFSFileTreeNodeWithPath
};
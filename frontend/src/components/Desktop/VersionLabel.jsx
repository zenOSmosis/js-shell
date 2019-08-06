import React from 'react';

const year = new Date().getFullYear();

const PublicGitSignature = () => {
  let {REACT_APP_PUBLIC_GIT_SIGNATURE: publicGitSignature} = process.env;

  if (!publicGitSignature) {
    console.warn('Unable to aquire public git signature');
    return false;
  }

  return (
    <div>
      Build info:<br />
      {
        publicGitSignature.split('\n').map((line, idx) => 
          (idx===2 ? new Date(line).toLocaleString() : line + ' ')
        )
      }
    </div>
  );
};

const VersionLabel = () => {
  return (
    <div style={{
      position: 'absolute',
      bottom: 10,
      right: 10,
      color: 'rgba(255,255,255,.8)',
      zIndex: 1
    }}

    // TODO: Make this all dynamic
    >
      JS Shell Prototype<br />
      Copyright &copy; { year } zenOSmosis<br />
      <PublicGitSignature />
    </div>
  );
};

export default VersionLabel;
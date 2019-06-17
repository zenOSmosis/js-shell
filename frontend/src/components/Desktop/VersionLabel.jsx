import React from 'react';

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
      JS Shell Evaluation<br />
      Copyright &copy; 2019 zenOSmosis<br />
      TODO: Add licensing information<br />
      TODO: Add current git hash, etc.<br />
    </div>
  );
};

export default VersionLabel;
import React from 'react';

const year = new Date().getFullYear();

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
      TODO: Add git hash / version
    </div>
  );
};

export default VersionLabel;
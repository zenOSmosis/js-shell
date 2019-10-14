import React from 'react';
import { LaptopIcon, MobileIcon } from 'components/componentIcons';
import PropTypes from 'prop-types';

/**
 * A dynamic icon, which represents either Laptop / Desktop, or Mobile,
 * depending on the passed platformType.
 * 
 * @param {Object} props 
 */
const SystemIcon = (props) => {
  // TODO: Derive platformType from remotePeer
  const { platformType, ...propsRest } = props;

  return platformType === 'desktop' ?
    <LaptopIcon {...propsRest} />
    :
    <MobileIcon {...propsRest} />
};

SystemIcon.propTypes = {
  platformType: PropTypes.oneOf(['desktop', 'mobile'])
};

export default SystemIcon;
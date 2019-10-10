import React from 'react';
import { LaptopIcon, MobileIcon } from 'components/componentIcons';
import PropTypes from 'prop-types';

const SystemIcon = (props) => {
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
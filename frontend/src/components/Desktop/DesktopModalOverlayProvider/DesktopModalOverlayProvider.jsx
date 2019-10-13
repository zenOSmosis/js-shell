import React, { Fragment } from 'react';
import DesktopLinkedState, {
  STATE_DESKTOP_MODALS,
  hocConnect
} from 'state/DesktopLinkedState';

const DesktopModalOverlayProvider = (props) => {
  const { children, desktopModals } = props;

  return (
    <Fragment>
      {
        children
      }

      {
        desktopModals.map((modal, idx) => {
          const { Component } = modal;
          
          return (
            <Fragment key={idx}>
              <Component />
            </Fragment>
          );
        })
      }
    </Fragment>
  );
};

export default hocConnect(DesktopModalOverlayProvider, DesktopLinkedState, (updatedState) => {
  const { [STATE_DESKTOP_MODALS]: desktopModals } = updatedState;

  if (desktopModals !== undefined) {
    return {
      desktopModals
    };
  }
});
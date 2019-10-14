import React from 'react';
import { CallAnswererOverlay } from 'components/Chat';
import { EVT_LINKED_STATE_UPDATE } from 'state/LinkedState';
import DesktopLinkedState, {
  ACTION_ADD_DESKTOP_MODAL,
  ACTION_REMOVE_DESKTOP_MODAL_WITH_UUID
} from 'state/DesktopLinkedState';
import P2PLinkedState, { STATE_INCOMING_CALL_REQUESTS } from 'state/P2PLinkedState';

(() => {
  const _p2pLinkedState = new P2PLinkedState();
  const _desktopLinkedState = new DesktopLinkedState();

  _p2pLinkedState.on(EVT_LINKED_STATE_UPDATE, (updatedState) => {
    const { [STATE_INCOMING_CALL_REQUESTS]: incomingCallRequests } = updatedState;

    if (incomingCallRequests && incomingCallRequests.length) {
      const lastIncomingCallRequest = incomingCallRequests[incomingCallRequests.length - 1];

      // TODO: Implement automatic modal removal if remote rejects before local accepts
      const modalUuid = _desktopLinkedState.dispatchAction(ACTION_ADD_DESKTOP_MODAL, () => {
        return (
          <CallAnswererOverlay
            incomingCallRequest={lastIncomingCallRequest}
            p2pLinkedState={_p2pLinkedState}
            onResponse={() => {
              _desktopLinkedState.dispatchAction(ACTION_REMOVE_DESKTOP_MODAL_WITH_UUID, modalUuid);
            }}
          />
        );
      });
    }
  });
})();
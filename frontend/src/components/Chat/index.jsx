// @see https://developers.livechatinc.com/docs/react-chat-ui-kit/#chatlist

import Chat from './Chat';
import NormalizedNickname from './NormalizedNickname';
import SocketPeerList from './SocketPeerList';
import StreamGrid from './StreamGrid';
import SystemIcon from './SystemIcon';

// Enables automatic overlay support when incoming calls are present
import './CallAnswererOverlay';

export default Chat;
export {
  NormalizedNickname,
  SocketPeerList,
  StreamGrid,
  SystemIcon
};
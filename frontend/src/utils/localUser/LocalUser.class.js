import Peer from '../p2p/Peer.class.js';

class LocalUser extends Peer {
  constructor() {
    super(true);
  }
}

export default LocalUser;
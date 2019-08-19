import { commonDesktopLinkedState } from 'state/commonLinkedStates';

/**
 * Redirects to a URL path registered within the app.
 * 
 * Note!  This method does not directly redirect.  Look to
 * components/Desktop/URLRedirector for the redirect
 * implementation.
 * 
 * @param {string} redirectLocation [default = '/']
 */
const redirectTo = (redirectLocation = '/') => {
  commonDesktopLinkedState.setState({
    redirectLocation
  });
};

export default redirectTo;
import React from 'react';
import { withAuthenticator } from 'aws-amplify-react';

export const App = () => 'hello';

export default withAuthenticator(App);

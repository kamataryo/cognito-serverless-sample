import React from 'react';
import { render } from 'react-dom';
import Amplify from 'aws-amplify';
import App from './components/app';

Amplify.configure({
  Auth: {
    identityPoolId: AWS_COGNITO_IDENTITY_POOL_ID,
    region: AWS_REGION,
    userPoolId: AWS_COGNITO_USER_POOL_ID,
    userPoolWebClientId: AWS_COGNITO_USER_POOL_CLIENT_ID,
    mandatorySignIn: true
  }
});

const root = document.getElementById('app');
render(<App />, root);

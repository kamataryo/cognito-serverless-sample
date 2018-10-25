const AWS = require('aws-sdk');

const createUserPool = (userPoolName) => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  const params = {
    PoolName: userPoolName,
    AutoVerifiedAttributes: ['email']
  };

  return cognitoidentityserviceprovider
    .createUserPool(params)
    .promise()
    .then(({ UserPool }) => ({ UserPool }));
};

const createUserPoolClient = (UserPool, userPoolClientName) => {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  const params = {
    ClientName: userPoolClientName,
    UserPoolId: UserPool.Id
  };

  return cognitoidentityserviceprovider
    .createUserPoolClient(params)
    .promise()
    .then(({ UserPoolClient }) => ({ UserPool, UserPoolClient }));
};

const createIdentityPool = (UserPool, UserPoolClient, identityPoolName) => {
  const cognitoidentity = new AWS.CognitoIdentity({ apiVersion: '2014-06-30' });

  const params = {
    AllowUnauthenticatedIdentities: true,
    IdentityPoolName: identityPoolName,
    CognitoIdentityProviders: [
      {
        ClientId: UserPoolClient.ClientId,
        ProviderName: `cognito-idp.${AWS.config.region}.amazonaws.com/${
          UserPool.Id
        }`,
        ServerSideTokenCheck: true
      }
    ]
  };

  return cognitoidentity
    .createIdentityPool(params)
    .promise()
    .then((IdentityPool) => ({ UserPool, UserPoolClient, IdentityPool }));
};

module.exports = { createUserPool, createUserPoolClient, createIdentityPool };

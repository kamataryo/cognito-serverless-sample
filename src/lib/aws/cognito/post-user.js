const AWS = require('../');
const createError = require('../../error');

const { SAMPLE_APP_AWS_COGNITO_USER_POOL_ID: UserPoolId } = process.env;
const serviceProvider = new AWS.CognitoIdentityServiceProvider();

const postUser = (attributes) => {
  return new Promise((resolve, reject) => {
    const params = {
      UserPoolId: UserPoolId,
      Username: attributes.username,
      MessageAction: 'SUPPRESS',
      TemporaryPassword: attributes.password,
      UserAttributes: [{ Name: 'email', Value: attributes.email }]
    };

    serviceProvider.adminCreateUser(params, (err, data) => {
      if (err) {
        let statusCode;
        let message;
        let issue;

        if (
          'MissingRequiredParameter' === err.code ||
          'InvalidParameterException' === err.code ||
          'UsernameExistsException' === err.code
        ) {
          statusCode = 400;
          message = err.message;
          issue = params;
        } else {
          statusCode = 500;
          message = 'Sorry! We are working to fix this problem.';
          issue = err;
        }
        reject(createError(statusCode, message, issue));
      } else {
        resolve(data.User);
      }
    });
  });
};

module.exports = postUser;

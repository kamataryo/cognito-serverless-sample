const AWS = require('../');
const createError = require('../../error');

const { SAMPLE_APP_AWS_COGNITO_USER_POOL_ID: UserPoolId } = process.env;
const serviceProvider = new AWS.CognitoIdentityServiceProvider();

module.exports = (Username, attributes) =>
  new Promise((resolve, reject) => {
    const params = {
      UserPoolId,
      Username,
      UserAttributes: Object.keys(attributes).map((Name) => ({
        Name,
        Value: attributes[Name].toString()
      }))
    };

    serviceProvider.adminUpdateUserAttributes(params, (err, data) => {
      if (err) {
        let statusCode;
        let message;
        let issue;

        if ('UserNotFoundException' === err.code) {
          statusCode = 404;
          message = err.message;
          issue = Username;
        } else if ('InvalidParameterException' === err.code) {
          statusCode = 400;
          message = err.message;
          issue = attributes;
        } else {
          statusCode = 500;
          message = 'Sorry! We are working to fix this problem.';
          issue = err;
        }
        reject(createError(statusCode, message, issue));
      } else {
        resolve(data);
      }
    });
  });

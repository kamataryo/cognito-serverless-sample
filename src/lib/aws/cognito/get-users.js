const AWS = require('../');
const createError = require('../../error');

const { SAMPLE_APP_AWS_COGNITO_USER_POOL_ID: UserPoolId } = process.env;
const serviceProvider = new AWS.CognitoIdentityServiceProvider();

const getUsers = (username) =>
  new Promise((resolve, reject) => {
    if (username) {
      const params = {
        UserPoolId,
        Username: username
      };
      serviceProvider.adminGetUser(params, (err, data) => {
        if (err) {
          let statusCode;
          let message;
          let issue;

          if ('UserNotFoundException' === err.code) {
            statusCode = 404;
            message = err.message;
            issue = username;
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
    } else {
      const params = {
        UserPoolId,
        // TODO: We need paging if total user counts exceeds 60.
        Limit: 60
      };
      serviceProvider.listUsers(params, (err, data) => {
        if (err) {
          const statusCode = 500;
          const message = 'Sorry! We are working to fix this problem.';
          const issue = err;
          reject(createError(statusCode, message, issue));
        } else {
          resolve(data.Users);
        }
      });
    }
  });

module.exports = getUsers;

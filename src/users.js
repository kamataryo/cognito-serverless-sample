'use strict';

const getUsers = require('./lib/aws/cognito/get-users');
const postUser = require('./lib/aws/cognito/post-user');
const putUser = require('./lib/aws/cognito/put-user');
const deleteUser = require('./lib/aws/cognito/delete-user');
const createError = require('./lib/error');

const driver = {
  get: getUsers,
  post: postUser,
  put: putUser,
  delete: deleteUser
};

const handler = (event, context, callback) => {
  const method = 'string' === typeof event.method && event.method.toUpperCase();

  if (!method) {
    callback(createError(400, 'invalid request'));
  }

  switch (method) {
    case 'GET':
      {
        const { user: username } = event.path || {};
        driver
          .get(username)
          .then((users) => callback(null, users))
          .catch(callback);
      }
      break;
    case 'POST':
      {
        if ('object' !== typeof event.body) {
          callback(
            createError(400, 'invalid request body', { body: event.body })
          );
        } else {
          driver
            .post(event.body)
            .then((user) => callback(null, user))
            .catch(callback);
        }
      }
      break;
    case 'PUT': {
      const { user: username } = event.path;
      if ('object' !== typeof event.body) {
        callback(
          createError(400, 'invalid request body', { body: event.body })
        );
      } else {
        driver
          .put(username, event.body)
          .then(() => callback(null, { success: true }))
          .catch(callback);
      }
      break;
    }
    case 'DELETE':
      {
        const { user: username } = event.path;
        driver
          .delete(username)
          .then(() => callback(null, { success: true }))
          .catch(callback);
      }
      break;
    default:
      callback(createError(405, 'Method not allowed.', method));
  }
};

module.exports = { driver, handler };

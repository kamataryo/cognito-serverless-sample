const chai = require('chai');
const assert = chai.assert;
const _ = require('../src/users');

describe('Tests for `user.js`.', () => {
  describe('GET', () => {
    const event = { method: 'GET' };

    it('GET a user successfully.', (done) => {
      // inject mock
      _.driver.get = (username) =>
        new Promise((resolve) => resolve({ name: username }));

      const getEvent = {
        ...event,
        path: { user: 'user-1' }
      };
      _.handler(getEvent, {}, (error, data) => {
        assert.isTrue(null === error);
        assert.isTrue('user-1' === data.name);
        done();
      });
    });

    it('fails to GET a user', (done) => {
      // inject mock
      _.driver.get = () =>
        new Promise((resolve, reject) => reject(new Error('some error')));

      const getEvent = {
        ...event,
        path: { user: 'user-1' }
      };

      _.handler(getEvent, {}, (error) => {
        assert.isTrue(null !== error);
        done();
      });
    });

    it('GET users successfully.', (done) => {
      // inject mock
      _.driver.get = () =>
        new Promise((resolve) =>
          resolve([{ name: 'user-1' }, { name: 'user-2' }])
        );

      _.handler(event, {}, (error, data) => {
        assert.isTrue(null === error);
        assert.isTrue(2 === data.length);
        done();
      });
    });

    it('fails to GET users', (done) => {
      // inject mock
      _.driver.get = () =>
        new Promise((resolve, reject) => reject(new Error('some error')));

      _.handler(event, {}, (error) => {
        assert.isTrue(null !== error);
        done();
      });
    });
  });

  describe('POST', () => {
    const event = {
      method: 'POST',
      body: {
        username: 'user-1',
        email: 'user-1@example.com',
        password: 'my-password'
      }
    };

    it('POST users successfully.', (done) => {
      // inject mock
      _.driver.post = (user) => new Promise((resolve) => resolve(user));

      _.handler(event, {}, (error, data) => {
        assert.isTrue(null === error);
        assert.isTrue('user-1' === data.username);
        done();
      });
    });

    it('fails to POST users with invalid POST body.', (done) => {
      // inject mock
      _.driver.post = (user) => new Promise((resolve) => resolve(user));

      _.handler(
        { ...event, body: 'This is invalid JSON string.' },
        {},
        (error) => {
          const { statusCode } = JSON.parse(error);
          assert.isTrue(400 === statusCode);
          done();
        }
      );
    });

    it('fails to POST users', (done) => {
      // inject mock
      _.driver.post = () =>
        new Promise((resolve, reject) => reject(new Error('some error')));

      _.handler(event, {}, (error) => {
        assert.isTrue(null !== error);
        done();
      });
    });

    describe('PUT', () => {
      const event = {
        method: 'PUT',
        path: 'user-1',
        body: {
          email: 'user-1@example.com'
        }
      };

      it('PUT users successfully.', (done) => {
        // inject mock
        _.driver.put = (username, userAttributes) =>
          new Promise((resolve) => resolve(username, userAttributes));

        _.handler(event, {}, (error) => {
          assert.isTrue(null === error);
          done();
        });
      });

      it('fails to PUT users with invalid PUT body.', (done) => {
        // inject mock
        _.driver.put = (user) => new Promise((resolve) => resolve(user));

        _.handler(
          { ...event, body: 'This is invalid JSON string.' },
          {},
          (error) => {
            const { statusCode } = JSON.parse(error);
            assert.isTrue(400 === statusCode);
            done();
          }
        );
      });

      it('fails to PUT users', (done) => {
        // inject mock
        _.driver.put = () =>
          new Promise((resolve, reject) => reject(new Error('some error')));

        _.handler(event, {}, (error) => {
          assert.isTrue(null !== error);
          done();
        });
      });
    });
  });

  describe('DELETE', () => {
    const event = {
      method: 'DELETE',
      path: 'user-1'
    };

    it('DELETE a user successfully.', (done) => {
      // inject mock
      _.driver.delete = (username) =>
        new Promise((resolve) => resolve({ username }));

      _.handler(event, {}, (error) => {
        assert.isTrue(null === error);
        done();
      });
    });

    it('fails to DELETE a user', (done) => {
      // inject mock
      _.driver.delete = () =>
        new Promise((resolve, reject) => reject(new Error('some error')));

      _.handler(event, {}, (error) => {
        assert.isTrue(null !== error);
        done();
      });
    });
  });

  describe('Mehod not allowed', () => {
    const event = { method: 'PATCH' };

    it('fails', (done) => {
      _.handler(event, {}, (error) => {
        const { statusCode } = JSON.parse(error);
        assert.isTrue(405 === statusCode);
        done();
      });
    });
  });
});

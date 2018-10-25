const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
const { configure } = require('./lib/aws');
const {
  createUserPool,
  createUserPoolClient,
  createIdentityPool
} = require('./lib/aws/cognito');

let self;
try {
  self = yaml.safeLoad(
    fs.readFileSync(path.join(__dirname, '..', 'serverless.yml'), 'utf8')
  );
} catch (e) {
  process.stderr.write(e);
  process.exit(1);
}

const stage =
  ('--stage' === process.argv[2] || '-s' === process.argv[2]
    ? process.argv[3]
    : false) || self.provider.stage;

const region = self.provider.region;
const stackName = `${self.service}-${stage || stage}`;
const planeStackName = [...self.service.split('-'), stage]
  .map(([a, ...b]) => a.toUpperCase() + b.join('')) // capitalize
  .join(' ');

const userPoolName = `${stackName}_user-pool`;
const userPoolClientName = `${stackName}_user-pool-client`;
const identityPoolName = `${planeStackName}`;

configure({ region });

createUserPool(userPoolName)
  .then(({ UserPool }) => createUserPoolClient(UserPool, userPoolClientName))
  .then(({ UserPool, UserPoolClient }) =>
    createIdentityPool(UserPool, UserPoolClient, identityPoolName)
  )
  .then(({ UserPool, UserPoolClient, IdentityPool }) => {
    const result = `
SAMPLE_APP_AWS_COGNITO_USER_POOL_ID_${stage.toUpperCase()}=${UserPool.Id}
SAMPLE_APP_AWS_COGNITO_USER_POOL_CLIENT_ID_${stage.toUpperCase()}=${
      UserPoolClient.ClientId
    }
SAMPLE_APP_AWS_COGNITO_IDENTITY_POOL_ID_${stage.toUpperCase()}=${
      IdentityPool.IdentityPoolId
    }
    `;

    process.stdout.write('UserPool and client creation: successed\n');
    process.stdout.write(result);
    process.exit(0);
  })
  .catch((err) => {
    process.stderr.write('failed.\n');
    process.stderr.write(err);
    process.stderr.write('\n');
    process.exit(2);
  });

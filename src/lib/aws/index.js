const AWS = require('aws-sdk');
const { SAMPLE_APP_AWS_REGION } = process.env;

AWS.config.update({ region: SAMPLE_APP_AWS_REGION });
module.exports = AWS;

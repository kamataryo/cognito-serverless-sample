const AWS = require('aws-sdk');

const configure = ({ region }) => {
  AWS.config.setPromisesDependency(Promise);
  AWS.config.region = region;
};

module.exports = { configure };

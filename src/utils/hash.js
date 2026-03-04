const crypto = require('crypto');

// ##############################################################
// hash // turns a secret token into a fixed hash string
// ##############################################################
module.exports.hash = (value) => {
  return crypto.createHash('sha256').update(value).digest('hex');
};
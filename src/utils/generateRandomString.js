const crypto = require('crypto');

function generateRandomString(leght) {
  return crypto.randomBytes(leght).toString('hex');
}

module.exports = { generateRandomString };

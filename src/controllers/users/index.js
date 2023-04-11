const loginUser = require('./loginUser');
const newUser = require('./newUser');
const updateUserLocation = require('./updateUserLocation');
const userAddress = require('./userAddress');
const validateUser = require('./validateUser');

module.exports = {
  newUser,
  validateUser,
  loginUser,
  updateUserLocation,
  userAddress,
};

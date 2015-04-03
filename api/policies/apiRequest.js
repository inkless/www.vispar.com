/**
 * apiRequest
 *
 * @module      :: Policy
 * @description :: Simple policy to handle api request
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {

  // is API request, proceed to the next policy, 
  // or if this is the last policy, the controller
  req.apiRequest = true;
  return next();
};

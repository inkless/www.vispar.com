/**
 * UtiliyService
 *
 * @description :: Utilities
 */

module.exports = {
  getClientIp: function(req) {
    return (req.get && req.get('x-forwarded-for')) || req.ip;
  }
}
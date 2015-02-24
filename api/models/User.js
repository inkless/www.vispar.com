/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var sha1 = require('sha1');
var _ = require('lodash');
var salt = '_$VISPAR_PASSWORD$_';

function pwdHash(pwd) {
  return sha1(pwd + salt);
}

module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    token: {
      type: 'string',
      required: false
    },
    expired: {
      type: 'integer',
      required: false
    }
  },


  /**
   * Create a new user using the provided inputs,
   * but encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • name     {String}
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  signup: function (inputs, cb) {
    // Create a user
    User.create({
      name: inputs.name,
      email: inputs.email,
      password: pwdHash(inputs.password),
      // TODO: temp code
      token: sha1(+new Date),
      expired: 1451548800
    })
    .exec(cb);
  },

  /**
   * Check validness of a login using the provided inputs.
   * But encrypt the password first.
   *
   * @param  {Object}   inputs
   *                     • email    {String}
   *                     • password {String}
   * @param  {Function} cb
   */

  attemptLogin: function (inputs) {
    return User.findOne()
    .where({
      email: inputs.email,
      password: pwdHash(inputs.password)
    })
    .then(function(user) {
      if (user) {
        user.token = sha1(+new Date);
        user.expired = 1451548800;
        user.save();
      }
      return user;
    });
  },

  retrieveInfo: function(user) {
    return _.pick(user, ['id', 'name', 'email', 'token', 'expired']);
  }
};

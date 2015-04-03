/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var sha1 = require('sha1');
var _ = require('lodash');
var salt = '_$VISPAR_PASSWORD$_';
var Promise = require('bluebird');

function pwdHash(pwd) {
  return sha1(pwd + salt);
}

module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true
    },
    token: {
      type: 'string',
      required: false
    },
    resetToken: {
      type: 'string',
      required: false
    },
    expired: {
      type: 'integer',
      required: false
    },
    rooms: {
      collection: "Room",
      via: "participants"
    },
    chats: {
      collection: "Chat",
      via: "participants"
    },
    ownRooms: {
      collection: "Room",
      via: "owner"
    },
    toJSON: function() {
      var obj = this.toObject();
      return _.pick(obj, ['id', 'name', 'email', 'token', 'expired']);
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

  signup: function (inputs) {
    var user = {
      name: inputs.name,
      email: inputs.email,
      password: pwdHash(inputs.password),
      // TODO: temp code
      token: sha1(+new Date),
      expired: 1451548800
    };

    var validInfo = UserService.validator(user);

    if (validInfo.valid) {
      return User.create(user);
    } else {
      return new Promise(function(resolver, reject) {
        resolver({
          err: validInfo.err
        })
      });
    }
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

  sendResetEmail: function(inputs) {
    var resetToken = sha1('reset' + (+new Date));
    var nodemailer = require('nodemailer');
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: sails.config.gmail
    });

    transporter.sendMail({
      from: 'vispar.corp@gmail.com',
      to: inputs.email,
      subject: 'Reset Password',
      text: inputs.baseUrl + '/resetpassword?v=' + resetToken
    }, function(err, data) {
      console.log(err || data);
    });

    return User.findOne()
    .where({
      email: inputs.email
    })
    .then(function(user) {
      if (user) {
        user.resetToken = resetToken;
        user.save();
      }
      return user;
    });
  },

  checkReset: function(resetToken) {
    return User.findOne()
    .where({
      resetToken: resetToken
    });
  },

  resetPassword: function(inputs) {
    return User.findOne()
    .where({
      resetToken: inputs.resetToken
    })
    .then(function(user) {
      if (user) {
        user.password = pwdHash(inputs.password);
        user.resetToken = '';
        user.save();
      }
      return user;
    });
  }
};


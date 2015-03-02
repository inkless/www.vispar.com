/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  /**
   * `UserController.login()`
   */
  login: function (req, res) {

    // See `api/responses/login.js`
    return res.login({
      email: req.param('email'),
      password: req.param('password'),
      successRedirect: '/',
      invalidRedirect: '/login'
    });
  },


  /**
   * `UserController.logout()`
   */
  logout: function (req, res) {

    // "Forget" the user from the session.
    // Subsequent requests from this user agent will NOT have `req.session.user`.
    req.session.user = null;
    // console.log('logout');

    // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
    // send a simple response letting the user agent know they were logged out
    // successfully.
    if (req.wantsJSON) {
      return res.ok('Logged out successfully!');
    }

    // Otherwise if this is an HTML-wanting browser, do a redirect.
    return res.redirect('/');
  },


  /**
   * `UserController.signup()`
   */
  signup: function (req, res) {

    // Attempt to signup a user using the provided parameters
    User.signup({
      name: req.param('name'),
      email: req.param('email'),
      password: req.param('password')
    }, function (err, user) {
      // res.negotiate() will determine if this is a validation error
      // or some kind of unexpected server error, then call `res.badRequest()`
      // or `res.serverError()` accordingly.
      if (err) return res.negotiate(err);

      // Go ahead and log this user in as well.
      // We do this by "remembering" the user in the session.
      // Subsequent requests from this user agent will have `req.session.user` set.
      req.session.user = user;

      // If this is not an HTML-wanting browser, e.g. AJAX/sockets/cURL/etc.,
      // send a 200 response letting the user agent know the signup was successful.
      if (req.wantsJSON) {
        return res.ok(User.retrieveInfo(user));
      }

      // Otherwise if this is an HTML-wanting browser, redirect to /welcome.
      return res.redirect('/welcome');
    });
  },

  forgetPassword: function(req, res) {
    var toEmail = req.param('email');

    User.sendResetEmail({
      email: toEmail
    }).then(function(user) {
      if (!user) {
        if (req.wantsJSON) {
          return res.badRequest('reset token failed');
        }
        return res.redirect('/');
      }

      if (req.wantsJSON) {
        return res.ok(User.retrieveInfo(user));
      }

      return res.redirect('/');
    })
    .catch(function(err) {
      if (err) return res.negotiate(err);
    });
  },

  // get view
  showResetPassword: function(req, res) {
    var resetToken = req.param('v');
    User.checkReset(resetToken)
    .then(function(user) {
      if (!user) {
        return res.redirect('/');
      }

      req.session.email = user.email;
      req.session.resetToken = resetToken;
      res.view('user/resetpassword');
    })
    .catch(function(err) {
      if (err) return res.negotiate(err);
    });
  },

  resetPassword: function(req, res) {
    var resetToken = req.param('resetToken');
    var password = req.param('password');
    User.resetPassword({
      resetToken: resetToken,
      password: password
    })
    .then(function(user) {
      if (!user) {
        if (req.wantsJSON) {
          return res.badRequest('reset password failed');
        }
        return res.redirect('/');
      }

      if (req.wantsJSON) {
        return res.ok(User.retrieveInfo(user));
      }

      return res.redirect('/');
    })
    .catch(function(err) {
      if (err) return res.negotiate(err);
    });
  }
};


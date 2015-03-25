/**
 * HomeController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  /**
   * `HomeController.index()`
   */
  index: function (req, res) {
    res.view('homepage');
  }
};


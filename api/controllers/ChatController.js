/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  /**
   * `ChatController.room()`
   */
  room: function (req, res) {
    if (!req.session.user) {
      return res.redirect('/login?redirect=' + encodeURIComponent(req.path));
    }

    var roomId = req.param('roomId');
    var data = {
      user: _.pick(req.session.user, ['id', 'name', 'email']),
      room: roomId
    }

    return res.view('chat/room', {
      roomId: roomId,
      user: JSON.stringify(data)
    });
  },
  message: function() {
    
  }
};


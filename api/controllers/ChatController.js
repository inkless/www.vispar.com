/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	


  /**
   * `ChatController.index()`
   */
  index: function (req, res) {
    return res.json({
      todo: 'index() is not implemented yet!'
    });
  },


  /**
   * `ChatController.new()`
   */
  new: function (req, res) {
    return res.json({
      todo: 'new() is not implemented yet!'
    });
  },


  /**
   * `ChatController.createNew()`
   */
  createNew: function (req, res) {
    return res.json({
      todo: 'createNew() is not implemented yet!'
    });
  },


  /**
   * `ChatController.room()`
   */
  room: function (req, res) {
    var roomId = req.param('roomId');
    return res.view('chat/room', {
      roomId: roomId
    });
  }
};


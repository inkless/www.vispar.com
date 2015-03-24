/**
 * RoomController
 *
 * @description :: Server-side logic for managing rooms
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');

module.exports = {

  /* View */
  // get /room/:roomId
  index: function(req, res) {
    if (!req.session.user) {
      return res.redirect('/login?redirect=' + encodeURIComponent(req.path));
    }

    Room
      .findOneByShortId(req.params.roomId)
      .then(function(room) {
        if (!room) return res.redirect('/');
        res.view('room/index', {
          roomName: room.name,
          room: JSON.stringify(room),
          user: JSON.stringify(req.session.user)
        });
      }).catch(function(err) {
        sails.log.error(err);
        res.view('room/index', {
          room: {},
          user: {},
          error: err
        });
      });
  },

  /* End Point */

  // post /room
  new: function(req, res) {
    Room
      .createRoom(_.pick(req.body, ['name', 'password', 'owner']))
      .then(function(room) {
        sails.sockets.broadcast('lobby', 'roomadd', room);
        res.redirect('/room/' + room.shortId);
      }).catch(function(err) {
        sails.log.error(err);
        res.redirect('/');
      });
  },

  /* API */

  // join the lobby
  joinLobby: function(req, res) {
    Room
      .find()
      .then(function(rooms) {
        sails.sockets.join(req.socket, 'lobby');
        res.send(rooms);
      })
      .catch(function(err) {
        sails.log.error(err);
        res.send(err);
      });
  },

  // join one room
  join: function(req, res) {
    //find or create for new rooms
    var roomShortId = req.body.roomShortId,
      userId = req.body.userId;

    Room.findOneByShortId(roomShortId)
      .populate('participants')
      .populate('messages')
      .then(function(room) {
        var user = _.find(room.participants, {id: userId});
        if (user) {
          handleSockets(roomShortId, user, room);
        } else {
          Room.addParticipant(roomShortId, userId)
          .then(function() {
            User.findOne(userId)
            .then(function(user) {
              room.participants.push(user);
              handleSockets(roomShortId, user, room);
            });
          })
          
        }
      })
      .catch(function(err) {
        res.send([]);
      });

    function handleSockets(roomId, user, room) {
      user = user.toJSON();

      sails.sockets.broadcast('chat_' + roomId, 'userjoin', user);
      sails.sockets.broadcast('lobby', 'useradded', {
        id: roomId
      });
      sails.sockets.join(req.socket, 'chat_' + roomId);

      req.socket.on('disconnect', function() {
        sails.sockets.broadcast('chat_' + roomId, 'userleave', user);
        sails.sockets.broadcast('lobby', 'userremoved', {
          id: roomId
        });
      });

      res.send(room);
    }
  },
};
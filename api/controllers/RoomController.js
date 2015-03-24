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
      .findOne(req.params.roomId)
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
        res.redirect('/room/' + room.id);
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
    var roomId = req.body.roomId,
      userId = req.body.userId;

    Room.findOne()
      .where({id: roomId})
      .populate('participants')
      .populate('messages', {
        limit: 100,
        sort : 'createdAt asc'
      })
      .then(function(room) {
        var messageUsers = User.find({
            id: _.pluck(room.messages, 'sender')
          })
          .then(function(messageUsers) {
            return messageUsers;
          });
        return [room, messageUsers];
      })
      .spread(function(room, messageUsers) {
        _.each(room.messages, function(message) {
          message.sender = _.find(messageUsers, 
            {id: message.sender}
          );
        });
        var user = _.find(room.participants, {
          id: userId
        });
        if (user) {
          handleSockets(roomId, user, room);
        } else {
          Room.addParticipant(roomId, userId)
            .then(function() {
              User.findOne(userId)
                .then(function(user) {
                  handleSockets(roomId, user, room);
                });
            })

        }
      })
      .catch(function(err) {
        res.send([]);
      });

    function handleSockets(roomId, user, room) {
      user = user.toJSON();

      sails.sockets.join(req.socket, 'room_' + roomId);
      sails.sockets.broadcast('room_' + roomId, 'userjoin', user);
      sails.sockets.broadcast('lobby', 'useradded', {
        id: roomId
      });

      req.socket.on('disconnect', function() {
        sails.sockets.leave(req.socket, 'room_' + roomId);
        sails.sockets.broadcast('room_' + roomId, 'userleave', user);
        sails.sockets.broadcast('lobby', 'userremoved', {
          id: roomId
        });

        Room.removeParticipant(roomId, user.id);
      });

      res.send(room);
    }
  },

  // send room message
  message: function(req, res) {
    User
      .findOne(req.body.sender)
      .then(function(user) {
        var msgData = _.pick(req.body, ['type', 'contentType', 'content', 'sender', 'room']);

        Message
          .create(msgData)
          .then(function(message) {
            Message
              .findOne(message.id)
              .populate('sender')
              .then(function(message) {
                sails.sockets.broadcast('room_' + message.room, 'new message', message);
                res.send(message);
              })
          })
          .catch(function(err) {
            sails.log.error(err);
            res.send(400, err);
          });
      }).catch(function(err) {
        sails.log.error(err);
        res.send(400, err);
      });
  }
};
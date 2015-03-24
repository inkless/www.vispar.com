/**
* Room.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var shortid = require('shortid'),
  _ = require('lodash');

module.exports = {

  attributes: {
    shortId: {
      type: 'string',
      unique: true
    },
    name: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string'
    },
    owner: {
      model: 'User'
    },
    participants: {
      collection: 'User',
      via: 'rooms',
      dominant: true
    },
    messages: {
      collection: 'Message',
      via: 'room'
    },
    // TODO
    // we need to put all stats field to another table in redis
    participantsCount: {
      type: 'integer',
      defaultsTo: 0
    },
    addParticipant: function(userId) {
      this.participants.add(userId);
      this.participantsCount = this.participantsCount || 0;
      ++ this.participantsCount;
    },
    removeParticipant: function(userId) {
      this.participants.remove(userId);
      if (!this.participantsCount) {
        this.participantsCount = 1;
      }
      -- this.participantsCount;
    }
  },

  createRoom: function(inputs) {
    var roomObj = {
      shortId: shortid.generate(),
      name: inputs.name,
      password: inputs.password || "",
      owner: inputs.owner
    };

    return Room.findOrCreate(roomObj, roomObj).then(_.identity);
  },

  addParticipant: function(shortId, userId) {
    return Room.findOneByShortId(shortId)
      .then(function(room) {
        room.addParticipant(userId);
        room.save();
        return room;
      });
  },

  removeParticipant: function(shortId, userId) {
    return Room.findOneByShortId(shortId)
      .then(function(room) {
        room.removeParticipant(userId);
        room.save();
        return room;
      });
  }
};


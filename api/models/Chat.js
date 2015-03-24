/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    chatId: {
      type: 'string',
      required: true
    },
    participants: {
      collection: 'User',
      via: "chats"
    },
    messages: {
      collection: 'Message',
      via: 'chat'
    }
  },

  createChat: function(userA, userB) {
    var firstId,
      secondId;
    if (userA < userB) {
      firstId = userA;
      secondId = userB;
    } else {
      firstId = userB;
      secondId = userA;
    }
    return Chat.create({chatId: firstId + '_' + secondId})
      .then(function(chat) {
        chat.participants.add(firstId);
        chat.participants.add(secondId);
        chat.save();
      });
  }
};


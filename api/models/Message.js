/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {
    type: {
      type: 'string',
      enum: ['room', 'private', 'system']
    },
    contentType: {
      type: 'string',
      enum: ['text', 'image', 'snippets']
    },
    content: {
      type: 'text'
    },
    imageUrl: {
      type: 'string'
    },
    //// associations
    sender: {
      model: 'User'
    },
    room: {
      model: 'Room'
    },
    chat: {
      model: 'Chat'
    }
  }
  
};
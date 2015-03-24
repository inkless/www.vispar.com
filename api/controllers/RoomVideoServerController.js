/**
 * RoomVideoServerController
 *
 * @description :: Server-side logic for managing roomvideoservers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');

var serverIpMap = {
  CN: '121.40.163.69',
  US: '54.201.108.66:9000'
};

module.exports = {
	find: function(req, res) {
    res.ok('not implemented');
  },
  findOne: function(req, res) {
    var roomId = req.param('roomId');
    RoomVideoServer
      .findOneByRoomId(roomId)
      .then(function(data) {
        res.ok(data);
      })
      .catch(function(err) {
        sails.log.error(err);
        return res.negotiate(err);
      });
  },
  save: function(req, res) {
    var obj = {
      roomId: req.param("roomId"),
      videoServerIp: req.param("ip") || UtilityService.getClientIp(req)
    };

    RoomVideoServer
      .findOrCreate({roomId: obj.roomId}, obj)
      .then(function(data) {
        data.videoServerIp = obj.videoServerIp;
        data.save();
        return data;
      })
      .then(function(data) {
        res.ok(data);
      })
      .catch(function(err) {
        sails.log.error(err);
        return res.negotiate(err);
      });
  },
  destroy: function(req, res) {
    var roomId = req.param('roomId');
    RoomVideoServer
      .destroy({roomId: roomId})
      .then(function(data) {
        res.ok(data);
      })
      .catch(function(err) {
        sails.log.error(err);
        return res.negotiate(err);
      });
  },

  queryServer: function(req, res) {
    var roomId = req.param('roomId'),
      clientIp = req.param('ip') || UtilityService.getClientIp(req);

    RoomVideoServer
      .findOneByRoomId(roomId)
      .then(function(data) {
        if (data) {
          res.ok(data);
        } else {
          request.get(
            'http://127.0.0.1:9090/json/' + clientIp,
            function(error, response, body) {
              if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                var targetIp = serverIpMap[body.country_code];
                targetIp = targetIp || serverIpMap.US;
                RoomVideoServer
                .create({
                  roomId: roomId,
                  videoServerIp: targetIp
                })
                .then(function(data) {
                  res.ok(data);
                });
              } else {
                sails.log.error(error);
                return res.negotiate(error);
              }
            });
        }
        
      })
      .catch(function(err) {
        sails.log.error(err);
        return res.negotiate(err);
      });
  }
};


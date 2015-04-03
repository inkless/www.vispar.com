(function($, io) {

  var chatViewList = $('.room-messages'),
    chatView = $(".messages-container")[0],
    roomUsers = $('#roomUsers'),
    privateChats = $('#privateChats');

  $('#sending-btn').submit(function(event) {
    event.preventDefault();
    var input = $(this).find("input"),
      msg = input.val();

    if (msg === "debug flash" || msg === "restore") {
      if (msg === "debug flash") {
        showDebug();
      } else if (msg === "restore") {
        hideDebug();
      }

      input.val("");
      return;
    }

    var msgData = {
      type: 'room',
      contentType: 'text',
      content: msg,
      sender: VP.userInfo.id,
      room: VP.roomInfo.id
    };
    io.socket.post('/api/room/message', msgData, function(data, jwrs) {
      input.val('');
    });

    return false;
  });

  //setup socket and get initial messages
  io.socket.post('/api/room/join', {
    roomId: VP.roomInfo.id,
    userId: VP.userInfo.id
  }, function(data, jwrs) {
    console.log(data, jwrs);
    if (data) {
      if (data.error) {
        alert(data.error);
      } else if ($.isArray(data.participants) && $.isArray(data.messages)) {
        _.forEachRight(data.messages, addItemToChat);
        _.forEach(data.participants, addRoomUser);
        return true;
      } else {
        window.location.href = '/';
      }
    }
  });

  // queryVideoServer
  io.socket.get('/api/queryvideoserver', {
    roomId: VP.roomInfo.id
  }, function(data, jwrs) {
    if (data.videoServerIp) {
      VP.flashAPI.setServerIp(data.videoServerIp);
    }
    VP.flashAPI.showFlash();
  });

  //listen for user changes
  io.socket.on('userleave', removeRoomUser)
  io.socket.on('userjoin', function(data) {
    addRoomUser(data, true);
  });

  //listen for messages
  io.socket.on('newmessage', addItemToChat)

  //insert new chat message
  function addItemToChat(item) {
    var newItemHtml = [
      '<li>',
      '<i>' + formatTime(item.createdAt) + '</i> ',
      '<a href="#' + item.sender.id + '" class="user-link">',
      escapeHtml(item.sender.name),
      '</a>: ',
      escapeHtml(item.content),
      '</li>'
    ].join("");

    chatViewList.append(newItemHtml);
    chatView.scrollTop = chatView.scrollHeight;
  }

  function addRoomUser(user, announce) {
    roomUsers.append('<li data-id="' + user.id + '"><a href="#' + user.id + '" class="user-link">' + escapeHtml(user.name) + '</a></li>');
    if (announce === true) {
      chatViewList.append('<li>' + user.name + ' has entered the room.</li>');
      chatView.scrollTop = chatView.scrollHeight;
    }
  }

  function removeRoomUser(user) {
    roomUsers.find('li[data-id="' + user.id + '"]').remove();
    chatViewList.append('<li>' + user.name + ' has left the room.</li>');
    chatView.scrollTop = chatView.scrollHeight;
  }

  var showDebug = function() {
    $(".video-container").removeClass("col-xs-6").addClass("col-xs-9");
    $(".chat-container").removeClass("col-xs-6").addClass("col-xs-3");
    $(".video").css("width", "auto");
  };

  var hideDebug = function() {
    $(".video-container").removeClass("col-xs-9").addClass("col-xs-6");
    $(".chat-container").removeClass("col-xs-3").addClass("col-xs-6");
    $(".video").css("width", "");
  }

  function formatTime(dateString) {
    var dateObj = new Date(dateString);
    return dateObj.toLocaleTimeString();
  }

  //from: http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/
  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})(jQuery, io);
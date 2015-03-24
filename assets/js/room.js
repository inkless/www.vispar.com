(function($, io) {

  var chatViewList = $('.room-messages'),
    chatView = $(".messages-container")[0],
    roomUsers = $('#roomUsers'),
    privateChats = $('#privateChats');

  $('#sending-btn').submit(function(event) {
    var input = $(this).find("input");
    // socket.emit('chat message', {
    // 	name: VP.pageInfo.user.name,
    // 	msg: input.val()
    // });

    if (input.val() === "debug flash") {
      showDebug();
    } else if (input.val() === "restore") {
      hideDebug();
    }

    input.val('');
    event.preventDefault();
    return false;
  });

  //setup socket and get initial messages
  io.socket.post('/api/room/join', {
    roomShortId: VP.roomInfo.shortId,
    userId: VP.userInfo.id
  }, function(data, jwrs) {
    console.log(data, jwrs)
    if (data) {
      if (data.error) {
        alert(data.error);
      } else if ($.isArray(data.participants) && $.isArray(data.messages)) {
        data.messages.forEach(addItemToChat)
        data.participants.forEach(addRoomUser);
        return true;
      } else {
        // window.location.href = '/';
      }
    }
  });

  //insert new chat message
  function addItemToChat(item) {
    var newItemHtml = [
      '<li>',
        '<i>' + formatTime(item.createdAt) + '</i> ',
        '<a href="#' + item.sender + '" class="user-link">',
          escapeHtml(item.sender.name),
        '</a>: ',
        escapeHtml(item.content),
      '</li>'
    ].join("");

    chatViewList.append(newItemHtml);
    chatView.scrollTop = chatView.scrollHeight;
  }

  function addRoomUser(user, announce) {
    roomUsers.append('<li><a href="#' + user.id + '" class="user-link">' + escapeHtml(user.name) + '</a></li>');
    if (announce === true) {
      chatViewList.append('<li>' + name + ' has entered the room.</li>');
      chatView.scrollTop = chatView.scrollHeight;
    }
  }

  // socket.on('chat message', function(data) {
  //   $('.room-messages').append($('<li>').text(data.name + ' : ' + data.msg));
  //   var elem = $(".messages-container")[0];
  //   elem.scrollTop = elem.scrollHeight;
  // });

  // swfobject.embedSWF("/flash/vispar.swf", "visparFlashObj", "100%", "550", "9.0.0", "expressInstall.swf");

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

  function formatTime(dateString){
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
(function($, io) {
  var socket = io();
  $('#sending-btn').submit(function(){
  	var input = $(this).find("input");
    socket.emit('chat message', {
    	name: VP.pageInfo.user.name,
    	msg: input.val()
    });

    if (input.val() === "debug flash") {
    	showDebug();
    } else if (input.val() === "restore") {
    	hideDebug();
    }

    input.val('');
    return false;
  });

  socket.on('chat message', function(data){
    $('.room-messages').append($('<li>').text(data.name + ' : ' + data.msg));
    var elem = $(".messages-container")[0];
    elem.scrollTop = elem.scrollHeight;
  }); 

  swfobject.embedSWF("/flash/vispar.swf", "visparFlashObj", "100%", "550", "9.0.0", "expressInstall.swf");

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

})(jQuery, io);
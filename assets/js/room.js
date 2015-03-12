(function($, io) {
  var socket = io();
  $('#sending-btn').submit(function(){
  	var input = $(this).find("input");
    socket.emit('chat message', {
    	name: VP.pageInfo.user.name,
    	msg: input.val()
    });
    input.val('');
    return false;
  });

  socket.on('chat message', function(data){
    $('.room-messages').append($('<li>').text(data.name + ' : ' + data.msg));
  }); 

  swfobject.embedSWF("/flash/vispar.swf", "visparFlashObj", "100%", "550", "9.0.0", "expressInstall.swf");

})(jQuery, io);
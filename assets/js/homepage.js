(function($) {
  var roomList = $('#roomList');

  io.socket.get('/api/room/join_lobby', function(data) {
    data.forEach(addRoom);
  });

  io.socket.on('roomremove', function(data) {
    roomList.find('[data-id="'+data.shortId+'"]').parent().remove();
  });

  io.socket.on('roomadd', addRoom);

  io.socket.on('useradded', function(data) {
    changeUserCount(data.shortId, 1);
  });

  io.socket.on('userremoved', function(data) {
    changeUserCount(data.shortId, -1);
  });

  function addRoom(data) {
    var roomItem = document.createElement('li');
    var hasS = data.participantsCount > 1 ? 's' : '';
    var roomItemHtml = [
      '<li>',
        '<a href="/room/' + data.shortId + '" data-id="' + data.shortId + '" ',
           'data-count="' + data.participantsCount + '">',
          data.name,
        '</a>',
        '<span>(' + data.participantsCount + ' user' + hasS + ')</span>',
      '</li>'
    ].join("");
    roomList.append(roomItemHtml);
  }

  function changeUserCount(roomId, change) {
    var item = roomList.find('[data-id="'+roomId+'"]'),
      count = parseInt(item.attr('data-count')),
      newCount = currentCount + change,
      hasS = newCount > 1 ? 's' : '';

    item.parent().find('span').text("(" + newCount + " user" + hasS + ")");
  }

})(jQuery);
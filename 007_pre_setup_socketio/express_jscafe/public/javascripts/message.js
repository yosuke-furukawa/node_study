$(function(){
  var socket = io.connect();
  socket.on('connect', function() {
    socket.on('message', function (message) {
      appendMessage(message);
    });
    $('#submit').click(function() {
      var message = $('#message').val();
      $('#message').val('');
      if (message && socket) {
        // 自分のメッセージをページに追加してからemitする。
        appendMessage(message);
        socket.emit('message', message);
      }
    });
    function appendMessage(message) {
      var li = $('<li></li>').text(message);
      var list = $('#list');
      list.append(li);
    }
  });
});

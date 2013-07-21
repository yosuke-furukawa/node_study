var http = require('http');

var server = http.createServer(function(req, res) {
    res.end("Hello JSCafe");
});

server.listen(3000, function() {
    // 起動したことを表すメッセージを追加。
     console.log('Server started, listening on : 3000');
});

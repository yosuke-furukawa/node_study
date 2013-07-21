var http = require('http');

var server = http.createServer(function(req, res) {
  res.end("Hello JSCafe");
});

setTimeout(function() {
  server.listen(3000);
}, 10000);

console.log('Server started, listening on : 3000');

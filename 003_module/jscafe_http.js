var http = require('http');

var JSCafe = {
  request : function(url, callback) {
    http.get(url, function(res){
      res.setEncoding('utf-8');
      var buffer = '';
      res.on('readable', function(){
        buffer += res.read();
      });
      res.on('end', function() {
        callback(null, buffer);
      });
      res.on('error', function(e) {
        console.log('Got error: ' + e.message);
        callback(e, buffer);
      });
    });
  }
};

module.exports = JSCafe;

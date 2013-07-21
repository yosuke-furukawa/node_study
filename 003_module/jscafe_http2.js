var http = require('http');
var emitter = require('events').EventEmitter;
var util = require("util");

function JSCafe() {
  emitter.call(this);
}
// event emitterを継承
util.inherits(JSCafe, emitter);

JSCafe.prototype.request = function(url) {
  var self = this;
  http.get(url, function(res){
    res.setEncoding('utf-8');
    var buffer = '';
    res.on('readable', function(){
      buffer += res.read();
    });
    res.on('end', function() {
      // 読み込みが終わったこととデータを通知
      self.emit('end', buffer);
    });
    res.on('error', function(e) {
      // エラーが発生したらその事を通知
      self.emit('error', e);
    });
  });
  return self;
};

module.exports = JSCafe;

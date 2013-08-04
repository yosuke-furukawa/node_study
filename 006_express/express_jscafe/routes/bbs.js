var messages = [];
exports.bbs = function(req, res){
  var message = req.body.message;
  messages.push(message);
  res.render('bbs', { title: 'JSCafe', messages: messages });
};

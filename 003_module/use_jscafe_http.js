var jscafe = require('./jscafe_http');

jscafe.request('https://atnd.org/events/37045', function(e, res){
  if (e) { console.error(e); }
  console.log(res);
});

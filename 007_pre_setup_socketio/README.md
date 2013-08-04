Socket.io
================

Socket.ioは、クライアント、サーバ間での双方向かつリアルタイムな通信をシンプルに記述できるモジュールです。WebSocketを初めとして、Ajax long polling、JSONP Pollingなどに対応しており、クライアント、ネットワーク環境に合わせた最適な通信方式を選択します。本章ではSocket.ioの特徴と利用方法、簡単なサンプルアプリケーションを通した解説を行います。

### Socket.ioの特徴

リアルタイム通信は複雑になりがちです。ブラウザのサポート状況やファイアウォール、プロキシサーバの設定によって通信方式を変える必要があります。これを毎回確認するのは現実的ではありません。Socket.ioはその複雑な処理を解決するために生まれたモジュールです。本節では、Socket.ioが2012年10月時点でサポートしている通信方法の一覧とその豊富な通信方法により可能となるサポートブラウザ一覧を記載します。またSocket.ioは急速な勢いでエンハンスされています。最新の情報については、公式サイト([http://socket.io](http://socket.io/))のブラウザサポートページ([http://socket.io/#browser-support](http://socket.io/#browser-support))から確認する事ができます。

#### サポートする通信方法一覧

- WebSocket
- Adobe&reg; Flash&reg; Socket
- Ajax long polling
- Ajax multipart streaming
- Forever Iframe
- JSONP Polling

#### サポートブラウザ一覧


##### Desktop

- Internet Explorer 5.5+
- Safari 3+
- Google Chrome 4+
- Firefox 3+
- Opera 10.61+

##### Mobile

- iPhone Safari
- iPad Safari
- Android WebKit
- WebOs WebKit

Socket.ioハンズオン
------------------

### 掲示板機能を更新なしで使えるようにする

先程の掲示板機能を拡張して、Socket.ioを使って改良してみましょう。

まずはSocket.ioをセットアップします。

```shell
$ cd express_jscafe
$ npm install socket.io --save
```

以下の様なログが記述されたら完了です。

```shell
socket.io@0.9.16 node_modules/socket.io
├── base64id@0.1.0
├── policyfile@0.0.4
├── redis@0.7.3
└── socket.io-client@0.9.16 (xmlhttprequest@1.4.2, uglify-js@1.2.5, active-x-obfuscator@0.0.1, ws@0.4.27)
```

#### app.jsを変更する


```js

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , bbs = require('./routes/bbs');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/bbs', bbs.bbs);
app.post('/bbs', bbs.bbs);

// createServerの返り値を変数に入れる。
var server = http.createServer(app);
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

// socket.ioのモジュールを読み込み、bbsのモジュールにsocketを渡しておく。
var io = require('socket.io');
var io = io.listen(server);

// io.socketsは接続された全てのsocketを指します。
// on('connection')で接続した時のアクションを登録します。
// ここでは、接続したsocketを受け取り、bbs.message関数に渡します。
io.sockets.on('connection', function(socket) {
  bbs.message(socket);
});

```

### routes/bbs.jsを変更する

```js

var messages = [];
exports.bbs = function(req, res){
  var message = req.body.message;
  messages.push(message);
  res.render('bbs', { title: 'JSCafe', messages: messages });
};

// message関数を外部化する。
// socketを受け取る。
exports.message = function(socket) {
  // socketが messageイベントを受けたら、messages配列にpushする。
  // その後、全体にbroadcastする。
  socket.on('message', function(message) {
    messages.push(message);
    socket.broadcast.emit('message', message);
  });
};

```

### views/layout.jadeを変更する

```js
doctype 5
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
    script(src='http://code.jquery.com/jquery-2.0.3.js')
    script(src='/socket.io/socket.io.js')
    script(src='/javascripts/message.js')
  body
    block content
```

jqueryとsocket.io.js、message.jsを読み込むように変更します。

### views/bbs.jadeを変更する

```js
extends layout

block content
  form
    textarea(id='message', name='message')
    input(id='submit', type='button', value='submit')
  ul(id='list')
    each val in messages
      if val
        li= val
```

### public/javascript/message.jsを追加する。

```js
$(function(){
  var socket = io.connect();
  socket.on('connect', function() {
    //message イベントを受けたらメッセージをlistに追加する
    socket.on('message', function (message) {
      appendMessage(message);
    });

    //submitボタンを押したらmessageを送る。
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
```

まとめ
------

- Socket.ioの動作概要と簡単な使い方
- Socket.ioでブロードキャストを行い、通信する方法

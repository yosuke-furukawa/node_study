ExpressでWebアプリを構築する
=================

その前にExpressが作るテンプレートの説明をします。

app.js
----------------

```javascript
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

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

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
```
Expressのapp.jsは上記のようになっていると思います。
このファイルがNode.js のサーバーを起動している本体です。

今から紹介する3つの部分だけ覚えてください。

```javascript

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');
```

モジュールを読み込んでいる部分です。
外部ファイルをrequireする事で色んなモジュールを利用することができます。


```javascript

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
```

環境を定義している部分です、この部分は今回は編集しませんが、ポートの設定、テンプレートエンジンの選択、静的ファイルの展開を行なっています。

```javascript
app.get('/', routes.index);
app.get('/users', user.list);
```

ルーティングを設定している部分です、ここを多少修正します。
現時点の設定では、'/'で来た時にはroutes.indexを呼出し、'/users'で来た時にはuser.listを呼び出しています。

routes/index.js
---------------

routesフォルダの下にindex.jsファイルが有ると思います。
それは以下のようになっています。

```javascript
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
```

先程のルーティングを設定している部分を思い出してください。

```javascript
app.get('/', routes.index);
app.get('/users', user.list);
```

'/'で来た時にroutes.indexを呼び出すようにしています。
この時に呼ばれているのが上記のroutes/index.jsです。

** res.render **というメソッドは'index'ファイルに対して {title: 'Express'} という値を渡しています。

views
----------------

views フォルダ以下のファイルに view の役目を持つ、ファイルを配置します。ここではindex.jade、layout.jadeというファイルが有ると思います。jade、というのはHTMLを簡易的に表現できるようにしたものです。

### views/layout.jade

```
doctype 5
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content
```

layoutにはCSSやtitle等を読み込むための記述が書かれています。

### views/index.jade

```javascript
extends layout

block content
  h1= title
  p Welcome to #{title}
```

index.jadeには、extends layoutでlayout.jadeを継承し、ヘッダーを設定します。

ファイルの意味がわかった所で少しだけ修正してみる。
--------

### routes/index.js

routes/index.jsで定義している{ title: 'Express' } を修正してみましょう。

```javascript
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'JSCafe', name: 'test' });
};
```

### views/index.jade

また、これをindex.jadeに反映します。

```javascript
extends layout

block content
  h1= title
  p Welcome to #{title}
  p #{name}
```

一旦ctrl-cして、アプリを再起動してください。

```shell
$ node app
```

表示が変わったことがわかると思います。

掲示板機能の作成
-------

コントローラを追加します。

routesフォルダに bbs.js を追加し、中身を以下のようにしましょう。

### routes/bbs.js

```javascript
var messages = [];
exports.bbs = function(req, res){
  // postした時にはreq.bodyの中に値が入ってる。
  var message = req.body.message;
  // 値が存在したらmessagesにpushする。
  if (message) messages.push(message);
  // 最終的にmessagesを返す。
  res.render('bbs', { title: 'JSCafe', messages: messages });
};
```

ビューを追加します。
views/bbs.jadeを追加し、中身を以下のようにしましょう。

### views/bbs.jade

```javascript
extends layout

block content
  form(action='/bbs', method='post')
    textarea(name='message')
    input(type='submit', value='submit')
  ul
    each val in messages
      if val
        li= val
```

app.jsを最後に変更して、今追加したコントローラを使うように修正します。

```javascript

/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  //追加
  , bbs = require('./routes/bbs');
```

```javascript
app.get('/', routes.index);
app.get('/users', user.list);
//コントローラを追加
// GETメソッドで来た時
app.get('/bbs', bbs.bbs);
// POSTメソッドで来た時
app.post('/bbs', bbs.bbs);
```

停止して、node再起動してください。

```shell
$ node app
```

まとめ
---------

- expressのファイル説明
- expressで掲示板機能作成

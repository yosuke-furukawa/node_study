Node.jsで動くものを作ってみる、Helloworld
=======================================

実際にHelloWorldアプリを作ってみましょう。

以下のファイルを作成して、helloworld.jsという名前をつけてください。

```javascript
console.log("Hello World");
```

作成し終わったら実行してみましょう。

```shell
$ node helloworld.js
"Hello World"
```

これで文字列の表示はできたと思います。
この`console.log`はデバッグ表示やエラー時のスタック表示にも使う基礎中の基礎の関数です。

Webアプリを作ってみる。
---------------------------------------

次にブラウザで動くWebアプリを作ってみましょう。

```javascript
var http = require('http');

var server = http.createServer(function(req, res) {
  res.end("Hello JSCafe");
});

server.listen(3000);
```

同様に実行してみましょう。

```shell
$ node hellojscafe.js
```

実行したらブラウザを起動して、以下のURLでアクセスしてください。

[http://localhost:3000/](http://localhost:3000/)

Hello JSCafeと表示されていることがわかると思います。

もう少し説明を捕捉
---------------------------------------

多分、これだけじゃ何をしているのか分かりにくいのでもう少し説明を追加します。

```javascript
// httpモジュールを読み込み、httpという同名の変数に格納しています。
// requireはモジュール読み込みのためのグローバルモジュールです。
// requireを記述する時は慣例として、ファイルの先頭に記述することが多いです。
var http = require('http');

// httpモジュールのメソッドである、createServerを呼出し、
// サーバーを作成します。
var server = http.createServer(function(req, res) {
  // レスポンスに文字列を渡す。
  res.end('Hello JSCafe');
});

// ポート番号3000番で受け付けるサーバーを起動する。
server.listen(3000);
```

console.logを追記してみる
---------------------------------------

もう少し理解を深めましょう。
先ほど説明した`console.log`を使ってちょっとだけ機能を追加しましょう。

```javascript
var http = require('http');

var server = http.createServer(function(req, res) {
  res.end("Hello JSCafe");
});

server.listen(3000);

// 起動したことを表すメッセージを追加。
console.log('Server started, listening on : 3000');
```

ただこれには問題があります。
起動したことを表す、とありますが起動の成功失敗に関わらず出力されます。

また、listenの時に出力されているように見えますが、listenの処理が終わる前に出力されています。

```javascript
var http = require('http');

var server = http.createServer(function(req, res) {
  res.end("Hello JSCafe");
});

server.listen(3000);

// listenの完了を待たずに出力される。
console.log('Server started, listening on : 3000');
```

Node.jsは非同期プログラミングを基本とするため、単純に記述すると今回のような問題が発生します。

コールバック
---------------------------------------

それではどうするべきなのか、いくつか解決策はありますが、コールバックを使う、というのが一番一般的な解決策だと思います。

通常、こういった非同期処理の場合、終わった時に呼び出すメソッドを処理として引数に渡すことができます。
関数を引数に取り、処理が終わったら呼び出される関数のことをコールバックと呼びます。

コールバックで先程の記述を変更してみましょう。

```javascript
var http = require('http');

var server = http.createServer(function(req, res) {
  res.end("Hello JSCafe");
});

server.listen(3000, function() {
  // 起動したことを表すメッセージを追加。
  console.log('Server started, listening on : 3000');
});
```

これで非同期処理のlistenでもサーバーが起動した時に3000番で待ち受けていることが表示されます。



Event Emitter
--------------------------------------

もう一つEvent Emitterと呼ばれるNode.jsの特徴的なモデルを紹介します。

```javascript
var http = require('http');

var server = http.createServer(function(req, res) {
  res.end("Hello JSCafe");
});

// listeningイベントを受け取り、表示する。
server.on('listening', function(){
  console.log('Server started, listening on : 3000');
});

server.listen(3000);

```

イベントが発生する度に処理を呼び出すイベント駆動と呼ばれるモデルで、こっちのほうがjQuery等の記述と似ているため馴染みやすいかもしれません。

この章のまとめ
--------------------------------------

+ console.logを覚えましょう
+ Webアプリを作ってみましょう
+ コールバックとEventEmitterに少しだけ触れました。

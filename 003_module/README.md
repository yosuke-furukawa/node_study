Moduleの作り方
==============

前回、requireによるモジュール読み込みとコールバックとEventEmitterを利用したWebアプリを作ってみました。

今回はrequireで読み込むためのModuleを作成してみましょう。コールバックとEventEmitterも出てくるので抑えてください。

The simplest module
-------------------

最もシンプルなモジュールは以下の通りです。

```javascript
exports.message = "Hello jscafe";
```

まずはこれをjscafe.jsというファイルで保存しましょう。

次にこのモジュールを使うファイルを作成します。

jscafe.jsと同じ場所に以下のファイルを作成してください。

```javascript
var jscafe = require('./jscafe');

console.log(jscafe.message);
```
一旦use_jscafe.jsという名前で保存してください。

```shell
$ node use_jscafe.js
```

と実行すると

メッセージが出力されます。

```shell
$ node use_jscafe.js
Hello jscafe
```

*exports*というオブジェクトのプロパティに対して関数や値を渡せば、requireした側で利用することができます。

もう一つ、`module.exports`を使う方法があります。
基本的な使い方はexportsもmodule.exportsもどちらも変わりませんが、module.exportsの方が少しだけ柔軟で、requireを呼び出した時の戻り値をモジュールではなく、関数や文字列、配列などの任意のオブジェクトの型にすることができます。

先程のjscafeモジュールを以下のように書き換え、jscafe_message.jsという名前で保存してください。

```javascript
module.exports = 'Hello jscafe';
```

use_jscafe.jsに以下の記述を追加しましょう。
```javascript
var jscafe = require('./jscafe');
var jscafe_message = require('./jscafe_message');

console.log(jscafe.message);
console.log(jscafe_message);
```

どちらも同じメッセージが出力されることが分かったと思います。

コールバックを受け付けるメソッドを書いてみる。
---------------------------------------------

モジュールの作成方法が分かった所でコールバックを受けつけるメソッドを書いてみましょう。

```javascript
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
        // コールバックを呼び出している部分。
        // レスポンスが全て返ってきたのでコールバックを呼び出して
        // 内容を第二引数に入れている。
        callback(null, buffer);
      });
      res.on('error', function(e) {
        // エラーが発生したらエラーメッセージを受け取り、コールバックの
        // 第一引数にエラーを入れて返します。
        // 慣例的にエラーを返す事があるメソッドの場合、コールバックの第一引数をエラーにすることが多いです。
        console.log('Got error: ' + e.message);
        callback(e, buffer);
      });
    });
  }
};

module.exports = JSCafe;
```

いきなりわけの分からないコードが増えたなーと思う人も多いかもしれません、一旦そこは無視してください。
コメントがついてるところを中心に見てください。
このモジュールは指定されたURLのページをコールバックで取ってくるモジュールです。

このモジュールを `jscafe_http.js`という名前で保存し、同じ場所にそれを利用するモジュールを書きましょう。

```javascript
var jscafe = require('./jscafe_http');

// ここがコールバック呼出しの部分。
jscafe.request('http://atnd.org/events/37045', function(e, res){
  if (e) { console.error(e); }
  console.log(res);
});
```

これを実行すればATNDのページをコールバックで取得します。

javascriptは引数に関数を受け付けるため、その関数を処理の終わりに呼び出すことで実現します。
コールバック呼出しはこの部分ですね。同期処理との違いこそあれ、コールバックの使い方はそこまで難しくは無いと思います。

```javascript
      res.on('end', function() {
        // コールバックを呼び出している部分。
        // レスポンスが全て返ってきたのでコールバックを呼び出して
        // 内容を第二引数に入れている。
        callback(null, buffer);
      });
```

ただし、callbackの第一引数は慣例的にエラーを返す必要があります。これだけ気をつけてください。


```javascript
      res.on('error', function(e) {
        // エラーが発生したらエラーメッセージを受け取り、コールバックの
        // 第一引数にエラーを入れて返します。
        // 慣例的にエラーを返す事があるメソッドの場合、コールバックの第一引数をエラーにすることが多いです。
        console.log('Got error: ' + e.message);
        callback(e, buffer);
      });
```

EventEmitterを使う
------------------

EventEmitterを使って先程のモジュールを作り直してみましょう。

```javascript
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
```

これをひとまずjscafe_http2.jsとして保存しましょう。使う側のコードはコチラ。

```javascript
var JSCafe = require('./jscafe_http2');
var jscafe = new JSCafe();

jscafe.request('http://atnd.org/events/37045');

jscafe.on('end', function(page){
  console.log(page);
});

jscafe.on('error', function(e){
  console.error(e);
});
```

これを保存して、実行してください。結果は前回とおなじになるはずです。

先程との違いが分かるでしょうか。
まず、request関数に渡していたcallbackの引数がなくなっています。

また、EventEmitterを継承し、`self.emit`でイベントを発行しています。
利用する側も`on('end')`でイベントを補足し、表示しています。

CallbackとEventEmitter、どちらも利点と欠点があります。
Callbackには分かりやすくて手軽に使えるという利点がある一方、他の非同期処理と組み合わせて使おうとするとCallbackが重なり見難いものになります。EventEmitterは記述するコード量は増えるものの、コードのモジュール性は高まります。

特に両方をvsで繋ぐものではなく、適材適所で使うべきかと思います。

まとめ
---------------

- exportsかmodule.exportsを使うとモジュールを作成できる。
- 作成したモジュールはrequireで呼び出せる。
- callbackする関数の作り方
- EventEmitterするモジュールの作り方


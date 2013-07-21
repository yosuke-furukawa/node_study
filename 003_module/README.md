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

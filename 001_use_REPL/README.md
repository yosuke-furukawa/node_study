Node.jsのREPLについて
====================

まずはREPLを使ってNode.jsを触ってみましょう。

REPLとは、、、、という言葉を使うよりもまずは手を動かしてみましょう。

コンソールを起動し、nodeと打ってみてください。
```shell
$ node
```

起動したら以下に記述してある何個か例を実行してみましょう。

```shell
> 1 + 1;
2

> var test = "abc";
undefined
> test
abc

> function test() {
 ... var num = 2;
 ... return num;
 ... }
undefined
> test();
2

> var array = [1, 2, 3];
undefined
> array;
[ 1, 2, 3 ]
> console.log(array);
[ 1, 2, 3 ]
undefined
> array.forEach(function(v) {
... console.log(v);
... });
1
2
3
undefined

```

javascriptの文法やNode.jsのモジュールの動作確認のためにはこのREPLを使うことが多いです。
ctrl-DでREPLを終了します。

REPL小技
---------------

REPLで使える小技をちょっとだけ紹介します。

REPLを利用している時の、`_`という記号は直前の実行結果を表します。
試してみましょう。

```shell
> a = "abc";
'abc'
> _
'abc'
> _.length;
3

> a = "abc";
'abc'
> _ += "d";
'abcd'
```

REPLは補完も使えます。Tabを押せば補完になります。

```shell
> var this_is_a_super_long = "abcdefg";
> this //タブを打つと、保管されます。
```

この章のまとめ
-------------

+ Node.jsにはちょっとした動作を確認するためのREPLがある。

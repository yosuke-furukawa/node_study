NPMモジュール探訪
=================

Node.jsにはnpmと呼ばれるパッケージマネージャがあります。
npmを利用することで第三者が作成したライブラリを活用することができます。

npmの使い方
----------------

使い方は簡単です。大体3種類のコマンドを覚えればひとまず使えると思います。

### npm init

`npm init`コマンドを使うとカレントディレクトリにpackage.jsonと呼ばれる設定ファイルを作成します。その設定ファイルに自分のモジュールの情報を記述するのですが、ひとまず使ってみましょう。

```shell
$ npm init
```

色々聞かれると思いますが適当に回答してください。

終わるとカレントディレクトリにpackage.jsonが作られていることがわかると思います。

### npm search

npm内のモジュールを検索します。

```shell
$ npm search pdf
```

とかで検索します。検索すると色んなモジュールが出るので詳細を知りたければ

```shell
$ npm info node-pdf
```

で詳細情報が得られます。

### npm install

`npm install`コマンドを利用すればnpmのモジュールをインストールすることができます。

ここでは次回に備えてexpressをインストールしてみましょう。

```shell
$ npm install express -g
```

`-g`オプションを入れることで特定のディレクトリの下ではなく、グローバルモジュールとして登録することができます。
expressコマンドが有効になれば成功です。

```shell
$ express --help

  Usage: express [options]

    Options:

        -h, --help          output usage information
        -V, --version       output the version number
        -s, --sessions      add session support
        -e, --ejs           add ejs engine support (defaults to jade)
        -J, --jshtml        add jshtml engine support (defaults to jade)
        -H, --hogan         add hogan.js engine support
        -c, --css <engine>  add stylesheet <engine> support (less|stylus) (defaults to plain css)
        -f, --force         force on non-empty directory
```

まとめ
----------

- npm initで初期化
- npm searchで検索
- npm installでインストール
- npm install -g でグローバルモジュールとしてインストール

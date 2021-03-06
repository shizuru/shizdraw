==========
 shizdraw
==========

これは `Node.jsハンズオン <http://atnd.org/events/28937>`_ のためのサンプルコードですが、 `はじめての共同作業　Canvas編 (node.js + websocket) <http://blog.asial.co.jp/744>`_ をcoffeescriptで書きなおしたものです(感謝)


Requirements
------------
* Node
* Express
* now.js

setup
-----

全体像
~~~~~~

ファイルはこのような感じで配置されます。public以下はjavascript,css,imageなんかの静的なファイルで、viewsはレンダリングに使われる
テンプレートエンジンが配置されます。

::

    .
    ├── app.coffee
    ├── app.js
    ├── node_modules
    ├── package.json
    ├── public
    │   ├── images
    │   ├── javascripts
    │   │   ├── client.coffee
    │   │   └── client.js
    │   └── stylesheets
    │       └── style.css
    ├── routes
    │   └── index.js
    └── views
        ├── index.jade
        └── layout.jade

expressのインストール
~~~~~~~~~~~~~~~~~~~~~

::

    npm install -g express
    npm install -g coffee-script
    npm install -g js2coffee

これで、expressコマンドが使えるようになるのでスケルトンを作成します。

::

    express drawsample
    cd drawsample

依存モジュールのインストール(package.json)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

package.jsonを編集してnow.jsを含めます(Windowsの場合は含めません、後述)。

::

    {
        "name": "application-name"
      , "version": "0.0.1"
      , "private": true
      , "dependencies": {
          "express": "2.5.8"
        , "jade": ">= 0.0.1"
        , "now": ">= 0.8.0"
      }
    }

依存モジュールをインストール

::

    npm install .

Windowsの場合
+++++++++++++

`Running NowJS natively on Windows <http://blog.nowjs.com/running-nowjs-natively-on-windows>`_ を参考にしてVC++ランタイム
とともにwin用バイナリを入れてください。それからsocket.ioは別途インストールする必要があります。

::

    npme install socket.io

CoffeeScriptで開発する
~~~~~~~~~~~~~~~~~~~~~~

app.jsをapp.coffeeにします。javascriptでガリガリ書きたいヒトはこの項目をスキップしてください。

::

    js2coffee app.js

app.coffeeを編集(app.coffee)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~

now.js周りの設定だけです。
disgributeMessageという関数でmessageを受け取って全クライアントのreceiveMessageにブロードキャストするようなイメージです。

portの設定はheroku対策です。

::

    app.get "/", routes.index
    
    everyone = require("now").initialize(app)
    
    everyone.now.distributeMessage = (message) ->
      everyone.now.receiveMessage message
    
    port = process.env.PORT or 3000
    
    app.listen port, ->
      console.log "Express server listening on port %d in %s mode",
        app.address().port, app.settings.env

express@3.0.0beta4の場合はapp.configureでportの設定をよろしくやってあるので、now.jsの設定だけ追加すればいいが、serverを渡さないといけないらしい。

::

    app.get "/", routes.index
    server = http.createServer(app).listen app.get("port"), ->
      console.log "Express server listening on port " + app.get("port")
    
    everyone = require("now").initialize(server)
    
    everyone.now.distributeMessage = (message) ->
      everyone.now.receiveMessage message

client.coffeeを作成します。(public/javascripts/client.coffee)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

内容は省略しますが、canvasを操作するコードです。処理が知りたければ
直接聞いてください。時間があれば丁寧に説明します。


now.jsとjQueryの設定をします。(views/layout.jade)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

jqueryとstylesheetの読み込みをおこないます。
もしかすると/nowjs/now.jsはどこにあるんだ?と疑問に思うかもしれませんが、よろしくやってくれるようになっています。
(socket.ioも一緒だったような)


::

    !!! 5
    html
      head
        title= title
        link(rel='stylesheet', href='/stylesheets/style.css')
        script(src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js')
        script(src='/javascripts/client.js')
        script(src='/nowjs/now.js')
      body!= body

express@3.0.0beta4の場合はblockで設定してあるのであわせたけど別にどっちでもいい。

::

    !!! 5
    html
      head
        title= title
        link(rel='stylesheet', href='/stylesheets/style.css')
        script(src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js')
        script(src='/javascripts/client.js')
        script(src='/nowjs/now.js')
      body
        block content

index.jadeの変更(views/index.jade)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

scriptはpainterインスタンスを生成して、サーバーとの送受信をするコードです。サーバーからのメッセージを受け取る
receiveMessageはここで定義しています。messageを受け取ったらpainterのdrawLineメソッドを呼び出して描画します。

::

    canvas#layer0(width='900px', height='600px')
    script
      $(document).ready(function(){
        var painter = new Painter('layer0');
        now.receiveMessage = function(message){ painter.drawLine(JSON.parse(message)) };
      });

express@3.0.0beta4の場合

::

    extends layout
    block content
      canvas#layer0(width='900px', height='600px')
      script
        $(document).ready(function(){
          var painter = new Painter('layer0');
          now.receiveMessage = function(message){ 
            painter.drawLine(JSON.parse(message))
          };
        });

style.cssへスタイルの追加(public/stylesheets/style.css)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

layer0用のスタイルを追加します。

::

    #layer0 {
      position: absolute;
      top: 0px;
      left: 0px;
      border: 10px solid #dddddd;
    }

動かしてみる
~~~~~~~~~~~~

::

    coffee app.cofee
    # node app.js

時間が余ったら
~~~~~~~~~~~~~~

ぱっと思いついたのはこんなあたり

- Now.jsのチャットのサンプルからアクセス時に名前入力するようにして誰が描いてるのかわかるようにする
- paper.jsを使ってリッチなお絵描きを目指す。 `Draw <http://www.moongift.jp/2012/06/20120612-3/>`_ 

heroku用の設定
~~~~~~~~~~~~~~

herokuにデプロイする時のために、ログを残しておきます。
参考にしてください。

::

    heroku create --stack cedar
    git push heroku master
    heroku ps:scale web=1
    heroku config:add NODE_ENV=production
    heroku run node
    heroku logs

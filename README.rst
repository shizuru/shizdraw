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

expressのインストール

::

    npm install -g express
    npm install -g js2coffee

これで、expressコマンドが使えるようになるのでスケルトンを作成します。

::

    express drawsample
    cd drawsample

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

依存モジュールをインストール

::

    npm install .

Windowsの場合
~~~~~~~~~~~~~

`Running NowJS natively on Windows <http://blog.nowjs.com/running-nowjs-natively-on-windows>`_ を参考にしてVC++ランタイム
とともにwin用バイナリを入れてください。それからsocket.ioは別途インストールする必要があります。

::

    npme install socket.io

app.jsをapp.coffeeにします。

::

    js2coffee app.js

app.coffeeを編集しますが、now.js周りの設定だけです。portの設定はheroku対策

::

    app.get "/", routes.index
    
    everyone = require("now").initialize(app)
    
    everyone.now.distributeMessage = (message) ->
      everyone.now.receiveMessage message
    
    port = process.env.PORT or 3000
    
    app.listen port, ->
      console.log "Express server listening on port %d in %s mode",
        app.address().port, app.settings.env

続いて、client.coffeeを作成します。内容は省略しますが、canvasを操作するコードです。

views/layout.jadeにnow.jsとjQueryの設定をします。

::

    !!!
    html
      head
        title= title
        link(rel='stylesheet', href='/stylesheets/style.css')
        script(src='http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js')
        script(src='/javascripts/client.js')
        script(src='/nowjs/now.js')
      body!= bod

views/index.jadeも変更します。scriptはpainterインスタンスを生成して、サーバーとの送受信をするコードです。

::

    canvas#layer0(width='900px', height='600px')
    script
      $(document).ready(function(){
        var painter = new Painter('layer0');
        now.receiveMessage = function(message){ painter.drawLine(JSON.parse(message)) };
      });

style.cssにlayer0用のスタイルを追加します。

::

    #layer0 {
      position: absolute;
      top: 0px;
      left: 0px;
      border: 10px solid #dddddd;
    }

heroku用の設定

::

    heroku create --stack cedar
    git push heroku master
    heroku ps:scale web=1
    heroku config:add NODE_ENV=production
    heroku run node
    heroku logs

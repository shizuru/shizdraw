fs = require 'fs'

{print} = require 'util'
{spawn} = require 'child_process'

build = (callback) ->
  for cf in ['app.coffee', 'public/javascripts/client.coffee']
    coffee = spawn 'coffee', ['-c', 'app.coffee']
    coffee.stderr.on 'data', (data) ->
      process.stderr.write data.toString()
    coffee.stdout.on 'data', (data) ->
      print data.toString()
    coffee.on 'exit', (code) ->
      callback?() if code is 0

task 'build', 'app.coffee, client.coffee', ->
  build()
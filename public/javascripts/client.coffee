class Painter
  constructor: (@id) ->
    @canvas = document.getElementById(@id)
    @context = @canvas.getContext('2d')
    @init()
    @setEvents()

  init: ->
    @beforX = null
    @beforY = null
    @isDrawing = false
    @strokeStyle = @getRandomColor()
    @lineWidth = 3

  getRandomColor: ->
    r = Math.floor(Math.random() * 255)
    g = Math.floor(Math.random() * 255)
    b = Math.floor(Math.random() * 255)
    return "rgb(#{r},#{g},#{b})"

  setEvents: ->
    @canvas.addEventListener 'mousedown', (event) => @down(event)
    @canvas.addEventListener 'mouseup',   (event) => @up(event)
    @canvas.addEventListener 'mousemove', (event) => @move(event)
    @canvas.addEventListener 'mouseout',  (event) => @up(event)

  down: (event) ->
    @isDrawing = true
    @beforX = event.clientX - 10
    @beforY = event.clientY - 10

  up: (event) ->
    @isDrawing = false

  drawLine: (points) ->
    @context.beginPath()
    @context.strokeStyle = points.c
    @context.lineWidth = @lineWidth
    @context.lineCap = 'round'
    @context.lineJoin = 'round'
    @context.moveTo(points.bx, points.by)
    @context.lineTo(points.ax, points.ay)
    @context.stroke()
    @context.closePath()

  move: (event) ->
    return unless @isDrawing

    points =
      bx: @beforX
      by: @beforY
      ax: event.clientX - 10
      ay: event.clientY - 10
      c: @strokeStyle

    now.distributeMessage(JSON.stringify(points))
    @drawLine(points)

    @beforX = points.ax
    @beforY = points.ay

window.Painter = Painter
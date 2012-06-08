(function() {
  var Painter;

  Painter = (function() {

    function Painter(id) {
      var _this = this;
      this.id = id;
      this.canvas = document.getElementById(this.id);
      this.context = this.canvas.getContext('2d');
      this.beforX = null;
      this.beforY = null;
      this.isDrawing = false;
      this.strokeStyle = this.getRandomColor();
      this.lineWidth = 3;
      this.canvas.addEventListener('mousedown', function(event) {
        return _this.down(event);
      });
      this.canvas.addEventListener('mouseup', function(event) {
        return _this.up(event);
      });
      this.canvas.addEventListener('mousemove', function(event) {
        return _this.move(event);
      });
      this.canvas.addEventListener('mouseout', function(event) {
        return _this.up(event);
      });
    }

    Painter.prototype.getRandomColor = function() {
      var b, g, r;
      r = Math.floor(Math.random() * 255);
      g = Math.floor(Math.random() * 255);
      b = Math.floor(Math.random() * 255);
      return "rgb(" + r + "," + g + "," + b + ")";
    };

    Painter.prototype.down = function(event) {
      this.isDrawing = true;
      this.beforX = event.clientX - 10;
      return this.beforY = event.clientY - 10;
    };

    Painter.prototype.up = function(event) {
      return this.isDrawing = false;
    };

    Painter.prototype.drawLine = function(points) {
      this.context.beginPath();
      this.context.strokeStyle = points.c;
      this.context.lineWidth = this.lineWidth;
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';
      this.context.moveTo(points.bx, points.by);
      this.context.lineTo(points.ax, points.ay);
      this.context.stroke();
      return this.context.closePath();
    };

    Painter.prototype.move = function(event) {
      var points;
      if (!this.isDrawing) return;
      points = {
        bx: this.beforX,
        by: this.beforY,
        ax: event.clientX - 10,
        ay: event.clientY - 10,
        c: this.strokeStyle
      };
      now.distributeMessage(JSON.stringify(points));
      this.drawLine(points);
      this.beforX = points.ax;
      return this.beforY = points.ay;
    };

    return Painter;

  })();

  window.Painter = Painter;

}).call(this);

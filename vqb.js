angular.module('VqbApp', ['firebase'])

.value('fbURL', 'https://vqb.firebaseio.com/')

.factory('VQB', function($firebase, fbURL) {
  return $firebase(new Firebase(fbURL));
})

.controller('BodyCtrl', function ($scope) {
    $scope.theme = undefined;
})
.controller('ListAndEditCtrl', function($scope, VQB) {
  //$scope.vqb = VQB;
  /// We make a 3-way binding instead,
  /// so that later we don't have to bother with updating
  /// Firebase as well.
  VQB.$bind($scope,'vqb');

  $scope.faceToRight=function(s){
      if (s==3)
          return 0;
      else
          return s+1;
  }

  $scope.rotateRight=function(c){
      c.activeface = $scope.faceToRight(c.activeface);
  }

  $scope.drawingInit = function(){
      $scope.mouseDown=0;
      $scope.lastPoint=null;
  }

  $scope.drawingMouseDownHandler = function(c,e){
      $scope.mouseDown=1;
      $scope.drawLine(c,e,$scope.mouseDown,$scope.lastPoint);
  }

  $scope.drawingMouseUpAndMouseLeaveHandler = function(){
      $scope.mouseDown=0;
      $scope.lastPoint=null;
  }

  $scope.drawLine=function(c,e,m,l){

      if (!m) return;

      e.preventDefault();

      // Create points array if it doesn't exist
      if (c.faces[c.activeface].points===undefined)
          c.faces[c.activeface].points=[];

      // Define offsetX and offsetY for Firefox
      if(typeof e.offsetX === "undefined" || typeof e.offsetY === "undefined") {
        var targetOffset = $(e.target).offset();
        e.offsetX = e.pageX - targetOffset.left;
        e.offsetY = e.pageY - targetOffset.top;
      }

      // Bresenham's line algorithm
      // Adapted from the Firebase tutorial's Drawing Example
      var x1 = e.offsetX;
      var y1 = e.offsetY;
      var x0 = (l == null) ? x1 : l[0];
      var y0 = (l == null) ? y1 : l[1];
      var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
      var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;
      while (true) {
        c.faces[c.activeface].points.push({"x":x0, "y":y0, "color":"#333"});
        if (x0 == x1 && y0 == y1) break;
        var e2 = 2 * err;
        if (e2 > -dy) {
          err = err - dy;
          x0 = x0 + sx;
        }
        if (e2 < dx) {
          err = err + dx;
          y0 = y0 + sy;
        }
      }
      l = [x1, y1];
  }
})
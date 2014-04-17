var WhistleGame  = (function() {

   var canv;
   var ctx;
   var map = [{radius: 20, time: 1000},{radius: 80, time: 850},{radius: 50, time: 700},{radius: 50, time: 450},{radius: 100, time: 350},{radius: 50, time: 150}];
   var gameCircle = new CircleEntity(400,250, 50);
   var camera = {x:0, y:0};
   var pitch = 500;
   var circles = [];
   var tarCircles = [];
   var gameWidth;
   var gameHeight;
   var score = 0;

   function drawScore(){

   }

   function init(){
      canv = document.querySelector("#gameCanv");
      ctx = canv.getContext("2d");
      gameHeight = canv.height;
      gameWidth = canv.width;
      window.requestAnimationFrame(update);
   }

   function CircleEntity(x,y,radius, color){
      this.x = x||0;
      this.y = y||0;
      this.radius = radius||0;
      this.color =  color || 'green';
      this.draw = function(context){

         context.beginPath();
         context.arc(this.x - camera.x, this.y -camera.y, this.radius, 0, 2 * Math.PI, false);
         context.fillStyle = this.color;
         if(this.snapFrame&&this.snapFrame>0){
            context.fillStyle = 'blue';
            //console.log("I be purple");
         }
         context.fill();
         context.lineWidth = 5;

         context.strokeStyle = '#003300';
         context.stroke();
      };
   }

   function writeScore(context){
       context.fillStyle = "blue";
      context.font = "bold 16px Arial";
      context.fillText("Score: "+score, 50, 50);
   }



   function stampDown(){
      tarCircles.forEach(function(circle){
         score+= 2*areaOfIntersection(circle.x, circle.y, circle.radius, gameCircle.x, gameCircle.y, gameCircle.radius);
         //console.log(ar);
         //console.log(circle);
      });
      score -= Math.PI*gameCircle.radius*gameCircle.radius;
      //console.log(score);
   }


   function inputProcessor(e){
      switch(e.detail.type){
         case "whistle":
         onWhistle(e);
         break;
         case "snap":
         onSnap(e);
         break;
      }

   }
   window.addEventListener("soundinput.detect", inputProcessor);
   function onWhistle(e){
     var multiple = (e.detail.frequency - 700)/1200;
     gameCircle.radius = 100*multiple;

   }
    // window.addEventListener("snap.detect", onSnap);
   function onSnap(e){
      gameCircle.snapFrame = 5;
      circles.push(new CircleEntity(gameCircle.x, gameCircle.y, gameCircle.radius,"red"));
      stampDown();
   }

   var frameWidth = 200;
     var curFrame = 0;
   function updateMap(){
      //console.log(map[map.length-1].time);
     // console.log(curFrame);
      if(map[map.length-1]&&map[map.length-1].time<curFrame){
         var circle = map.pop();
         var gCircle = new CircleEntity(camera.x+gameWidth, gameHeight/2, circle.radius, 'yellow');
         tarCircles.push(gCircle);

      }
   }



   function update(){
      requestAnimationFrame(update);
      updateMap();
      draw();
      camera.x +=2.5;
      gameCircle.x +=2.5;
      curFrame++;
      gameCircle.snapFrame --;
      if(circles.length>0){
         circles = circles.filter(function(circle){
            if(circle.x+circle.radius-camera.x<0){
               return false;
            }
            return true;
         });
      }
       tarCircles = tarCircles.filter(function(circle){
            if(circle.x+circle.radius-camera.x<0){
               return false;
            }
            return true;
         });

   }

   function draw(){
      ctx.clearRect(0,0, gameWidth, gameHeight);
      ctx.fillStyle = "black";
      ctx.fillRect(0,0,gameWidth, gameHeight);
       tarCircles.forEach(function(circ){
            circ.draw(ctx);

         });

         circles.forEach(function(circ){
            circ.draw(ctx);

         });
         writeScore(ctx);


      gameCircle.draw(ctx);

   }

   init();





   function areaOfIntersection(x0, y0, r0, x1, y1, r1)
{
  var rr0 = r0 * r0;
  var rr1 = r1 * r1;
  var d = Math.sqrt((x1 - x0) * (x1 - x0) + (y1 - y0) * (y1 - y0));

  // Circles do not overlap
  if (d > r1 + r0)
  {
    return 0;
  }

  // Circle1 is completely inside circle0
  else if (d <= Math.abs(r0 - r1) && r0 >= r1)
  {
    // Return area of circle1
    return Math.PI * rr1;
  }

  // Circle0 is completely inside circle1
  else if (d <= Math.abs(r0 - r1) && r0 < r1)
  {
    // Return area of circle0
    return Math.PI * rr0;
  }

  // Circles partially overlap
  else
  {
    var phi = (Math.acos((rr0 + (d * d) - rr1) / (2 * r0 * d))) * 2;
    var theta = (Math.acos((rr1 + (d * d) - rr0) / (2 * r1 * d))) * 2;
    var area1 = 0.5 * theta * rr1 - 0.5 * rr1 * Math.sin(theta);
    var area2 = 0.5 * phi * rr0 - 0.5 * rr0 * Math.sin(phi);

    // Return area of intersection
    return area1 + area2;
  }
}


})();
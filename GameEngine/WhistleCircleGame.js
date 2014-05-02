var WhistleGame  = (function() {

   var canv;
   var ctx;
   var beat = 40;
   var map = [{radius: 20, time: beat*7, track: 1},{radius: 80, time: beat*6, track: 1},{radius: 50, time: beat*5, track: 1},
   {radius: 50, time: beat*4, track: 2},{radius: 100, time: beat*3,track: 0},{radius: 50, time: beat*2,track: 1},
   {radius: 50, time: beat*1,track: 1},{radius: 50, time: 0,track: 1}];

   var beatBox = [-2,-2,1,1,1,1,-2,-2,0,0,-2,-2,0,-2,-2,2,2,0,-2,-2,0,0,1,1,2,2-2,-2,1,1,1,1,-2,-2,0,0,-2,-2,0,-2,-2,2,2,0,-2,-2-2,-2,1,1,1,1,-2,-2,0,0,-2,-2,0,-2,-2,2,2,0,-2,-2,0,0,1,1,2,2-2,-2,1,1,1,1,-2,-2,0,0,-2,-2,0,-2,-2,2,2,0,-2,-2-2,-2,1,1,1,1,-2,-2,0,0,-2,-2,0,-2,-2,2,2,0,-2,-2,0,0,1,1,2,2-2,-2,1,1,1,1,-2,-2,0,0,-2,-2,0,-2,-2,2,2,0,-2,-2-2,-2,1,1,1,1,-2,-2,0,0,-2,-2,0,-2,-2,2,2,0,-2,-2,0,0,1,1,2,2-2,-2,1,1,1,1,-2,-2,0,0,-2,-2,0,-2,-2,2,2,0,-2,-2,-2,-2,-2,-2,-2,-2,1,1,1,1,2,2,2,2,0,0,0,0];
   beatBox.reverse();
   var gameCircle = new CircleEntity(540,250, 10);
   var camera = {x:0, y:0};
   var pitch = 500;
   var circles = [];
   var tarCircles = [];
   var gameWidth;
   var gameHeight;
   var score = 0;
    var linespace;

    var highBar;
    var midBar;
    var lowBar;

   function drawScore(){

   }

   function init(){
      canv = document.querySelector("#gameCanv");
      ctx = canv.getContext("2d");
      ctx.font = "Arial 20px";
      gameHeight = canv.height;
      gameWidth = canv.width;
      linespace = gameHeight/3;
      highBar = new RectEntity(gameWidth/2 -40,0, 80, linespace);
      midBar = new RectEntity(gameWidth/2 -40, linespace, 80, linespace);
      lowBar = new RectEntity(gameWidth/2-40, linespace*2, 80, linespace);

       drawBackground();


   }
   var running = false;
   function start(){
    if(!running){
     window.requestAnimationFrame(update);
     running = true;
   }
   }
   window.start =  start;

   function RectEntity(x,y,width,height){
     this.x = x||0;
     this.y = y||0;
     this.width = width;
     this.height = height;
     this.color = "red";
     this.draw = function(context){
      ctx.fillStyle = this.color;
      if(this.selected){
        ctx.fillStyle = "yellow";
      }
      else{
      //  this.color = "red";
      }
      ctx.fillRect(this.x-camera.x,this.y-camera.y,this.width,this.height);
      ctx.lineWidth = 2;
      ctx.strokeStyle ="gray";
      ctx.strokeRect(this.x-camera.x,this.y-camera.y,this.width,this.height);

      };

   }

   function CircleEntity(x,y,radius, color){
      this.x = x||0;
      this.y = y||0;
      this.radius = radius||0;
      this.color =  color || 'white';
      this.draw = function(context){

          context.lineWidth = 1;
         context.beginPath();
         context.strokeStyle = "";
         context.arc(this.x - camera.x, this.y -camera.y, this.radius, 0, 2 * Math.PI, false);
         context.fillStyle = this.color;
         if(this.snapFrame&&this.snapFrame>0){
            context.fillStyle = 'orange';
            //console.log("I be purple");
         }
         context.fill();
         context.lineWidth = 0;

         //context.strokeStyle = '#003300';
         //context.stroke();
      };
   }

   function writeScore(context){
       context.fillStyle = "white";
      context.font = "bold 24px hero";
      context.fillText("Score: "+Math.floor(score), 10, 50);
   }
   function getActiveBar(){
    if(highBar.selected){
      return highBar;
    }
    else if (midBar.selected){
      return midBar;
    }
    else{
      return lowBar;
    }

   }


   function stampDown(bar){
    activeBar = getActiveBar();
      tarCircles.forEach(function(circle){
        var intersect = rectIntersect(activeBar,circle);
        score+= 2*intersect;
         if(intersect!==0){
           var hit = rectOverlap(activeBar, circle);
            hit.color = "green";
            circles.push(hit);
         }

         //score+= 2*areaOfIntersection(circle.x, circle.y, circle.radius, gameCircle.x, gameCircle.y, gameCircle.radius);
         //console.log(ar);
         //console.log(circle);
      });
      score -= 7000;
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
     var multiple = (e.detail.frequency - 700)/1500;
     gameCircle.y = gameHeight - gameHeight*multiple;
     gameCircle.y = Math.min(gameHeight, gameCircle.y);
     gameCircle.y = Math.max(0, gameCircle.y);

   }
    // window.addEventListener("snap.detect", onSnap);
   function onSnap(e){
      gameCircle.snapFrame = 5;
      var bar = getActiveBar();
     // circles.push(new CircleEntity(gameCircle.x, gameCircle.y, gameCircle.radius,"red"));

      stampDown(bar);
   }

   var frameWidth = 200;
     var curFrame = 0;
   function updateMap(){
      //console.log(map[map.length-1].time);
     // console.log(curFrame);
     //console.log(beatBox[beatBox.length-1]);
      if(beatBox.length>0&&curFrame%beat===0){
        console.log("trying things");
         var circle = beatBox.pop();
         var gCircle = new RectEntity(camera.x+gameWidth, linespace*circle, 50, linespace);
         gCircle.color = "blue";
         tarCircles.push(gCircle);
         console.log(tarCircles.length);

      }
   }



   function update(){
      requestAnimationFrame(update);
      updateMap();
      draw();
      camera.x +=2.5;
      gameCircle.x +=2.5;
      highBar.x +=2.5;
      midBar.x += 2.5;
      lowBar.x += 2.5;
      curFrame++;
      gameCircle.snapFrame --;
      if(circles.length>0){
         circles = circles.filter(function(circle){
            if(circle.x+circle.width-camera.x<0){
               return false;
            }
            return true;
         });
      }
       tarCircles = tarCircles.filter(function(circle){
            if(circle.x+circle.width-camera.x<0){
               return false;
            }
            return true;
         });
      determineZones();

   }

   function drawLines(){
    var context = ctx;
    context.strokeStyle = "gray";
        context.lineWidth = 5;
      context.moveTo(0, linespace);
      context.lineTo(gameWidth, linespace );
      context.stroke();
      context.moveTo(0, linespace*2);
      context.lineTo(gameWidth, linespace*2);
      context.stroke();
   }

   function drawBackground(){
    ctx.clearRect(0,0, gameWidth, gameHeight);
      ctx.fillStyle = "black";
      ctx.fillRect(0,0,gameWidth, gameHeight);
      var context = ctx;
       context.beginPath();



   }
   function drawBars(){
      highBar.draw(ctx);
      midBar.draw(ctx);
      lowBar.draw(ctx);
   }

   function draw(){
     drawBackground();
     drawBars();


       tarCircles.forEach(function(circ){
            circ.draw(ctx);

         });
        circles.forEach(function(circ){
            circ.draw(ctx);

         });


         writeScore(ctx);



      drawLines();
      gameCircle.draw(ctx);

   }
   function determineZones(){
    highBar.selected = false;
    midBar.selected = false;
    lowBar.selected = false;

    if(gameCircle.y<linespace){
      highBar.selected = true;

    }
    else if(gameCircle.y<2*linespace){
      midBar.selected = true;
    }
    else{
      lowBar.selected = true;
    }
   }


 init();


function rectIntersect(rect, rect2){
  var x11 = rect.x;
  var x12 = rect.x + rect.width;
  var x21 = rect2.x;
  var x22 = rect2.x + rect2.width;
   var y11 = rect.y;
  var y12 = rect.y + rect.height;
  var y21 = rect2.y;
  var y22 = rect2.y + rect2.height;

     x_overlap = Math.max(0, Math.min(x12,x22) - Math.max(x11,x21));
      y_overlap = Math.max(0, Math.min(y12,y22) - Math.max(y11,y21));

      return x_overlap*y_overlap;
}
function rectOverlap(rect, rect2){
  var x11 = rect.x;
  var x12 = rect.x + rect.width;
  var x21 = rect2.x;
  var x22 = rect2.x + rect2.width;
   var y11 = rect.y;
  var y12 = rect.y + rect.height;
  var y21 = rect2.y;
  var y22 = rect2.y + rect2.height;
   x_overlap = Math.max(0, Math.min(x12,x22) - Math.max(x11,x21));
   y_overlap = Math.max(0, Math.min(y12,y22) - Math.max(y11,y21));
   var start = Math.max(rect.x, rect2.x);

     return new RectEntity(start, rect.y, x_overlap, rect.height);
}



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
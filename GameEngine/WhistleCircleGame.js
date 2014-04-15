var WhistleGame  = (function() {

   var canv;
   var ctx;
   var map = [{radius: 20, time: 600},{radius: 80, time: 500},{radius: 50, time: 400},{radius: 50, time: 300},{radius: 100, time: 200},{radius: 50, time: 5}];
   var gameCircle = new CircleEntity(400,250, 50);
   var camera = {x:0, y:0};
   var pitch = 500;
   var circles = [];
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



   function stampDown(){

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
   }

   var frameWidth = 200;
     var curFrame = 0;
   function updateMap(){
      //console.log(map[map.length-1].time);
     // console.log(curFrame);
      if(map[map.length-1]&&map[map.length-1].time<curFrame){
         var circle = map.pop();
         var gCircle = new CircleEntity(camera.x+gameWidth, gameHeight/2, circle.radius, 'yellow');
         circles.push(gCircle);

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

   }

   function draw(){
      ctx.clearRect(0,0, gameWidth, gameHeight);
      ctx.fillStyle = "black";
      ctx.fillRect(0,0,gameWidth, gameHeight);

      circles.forEach(function(circ){
         circ.draw(ctx);

      });
      gameCircle.draw(ctx);

   }

   init();


})();
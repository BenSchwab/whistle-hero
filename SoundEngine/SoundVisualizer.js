var AnalyserCanvas = (function(){




function AnalyserCanvas(audioContext, canvas, preferences){
   console.log("AnalyserCanvas being created");
   this.audioContext = audioContext;
   this.canvas = canvas;
   this.context = canvas.getContext('2d');
   this.width =  canvas.width;
   this.height = canvas.height;
   this.renderOnAnimFrame = preferences.renderOnAnimFrame || false;
}
AnalyserCanvas.prototype.renderFrequencySpectrum = function(buffer){

};
AnalyserCanvas.prototype.renderTimeSpectrum = function(buffer){
   console.log("rendering time buffer");
   this.ctx.fillStyle="black";
   this.ctx.fillRect(0,0,this.width, this.height);

};

//window.AnalyserCanvas = AnalyserCanvas;
return AnalyserCanvas;

})();


var TimeCanvas = (function(){
   function TimeCanvas(){

   }

})();


var AmplitudeCanvas = (function(){

   function AmplitudeCanvas(audioContext, canvas, preferences){
      this.width =  preferences.width || canvas.width;
      this.height = preferences.height || canvas.height;
      this.canvas = canvas;
      this.resolution = preferences.resolution || 40;
      console.log("constructing amplitude canvas");
      console.log(this);
      this.setResolution(this.resolution);
      console.log("constructing amplitude canvas2");
      this.buffer = null;

   }
   AmplitudeCanvas.prototype.setResolution = function(resolution){

   };
   AmplitudeCanvas.prototype.setBuffer = function(buffer){
      this.buffer = buffer;
   };
   AmplitudeCanvas.prototype.resizeCanvas = function(){

   };
   //based on the resolution set the width
   AmplitudeCanvas.prototype.render = function(rect, channel){
      console.log("trying to render");
      channel = channel || 0;
        //console.log(reduce);
      //var median = rect.height/2;
     // console.log(this.buffer);
      var context =  this.canvas.getContext("2d");
      var currentPixel = 0;
      context.fillStyle="#000000";
      context.fillRect(0,0, this.width, this.height);
      var step = Math.floor(this.buffer.length/this.width);
      var currentIndex = 0;
      while(currentIndex<this.buffer.length){
        // var amplitude = reduce(this.buffer.getChannelData(0), currentIndex, currentIndex+samplesPerLine);
        // console.log(amplitude);
         var amplitude = this.buffer[currentIndex];
        if(step>1){
            amplitude = reduce(this.buffer, currentIndex, currentIndex+step);
            //console.log(amplitude);
        }

         var lineHeight = this.height/2 * amplitude;
         context.strokeStyle = '#f00'; // red
         context.lineWidth = 1;
         context.beginPath();
         context.moveTo(currentPixel, this.height/2);
         context.lineTo(currentPixel, this.height/2 + lineHeight);
         context.stroke();
         //console.log(currentPixel, amplitude);

         /*
         context.beginPath();
         context.moveTo(currentPixel, this.height/2);
         context.lineTo(currentPixel, this.height/2 - lineHeight);
         context.stroke(); */




         currentPixel++;
         currentIndex+=step;

      }
   };
   function reduce(buffer, start, end){
      var total = 0;
      var max = 0;
      for(var i = start; i<end; i++){
         if(end<buffer.length){
            total += buffer[i];
            if(Math.abs(buffer[i])>Math.abs(max)){
               max = buffer[i];
            }
         }
         else{
            end = buffer.length;
            break;
         }
      }
      //return total/(end-start);
     return max;

   }

   return AmplitudeCanvas;



})();
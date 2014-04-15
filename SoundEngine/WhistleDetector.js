var WhistleDetector = (function(){

   function WhistleDetector(sampleRate, hopsize){
      this.sampleRate = sampleRate || 44100;
      this.cutoff = 0.10;
      this.queue = [];
      this.hopsize = hopsize || 512;
   }

   WhistleDetector.prototype.pushToQueue = function(array){

   };

   WhistleDetector.prototype.processFrame = function(array){
      var min = 0;
      var max = 0;

      for(var i = 0; i<array.length; i++){
         if(array[i]>this.cutoff){
            window.dispatchEvent(new CustomEvent("whistle.detect", { detail:{ type: "whistle", intensity: array[i], frequency: i*(this.sampleRate/array.length)} }));
            console.log("dispatched that!");
         }
         if(array[i]>max){
            max = array[i];
         }

      }
     // console.log(min);
     // console.log(max);

   };

   //peak detection
   WhistleDetector.prototype.peakDetector = function(array){

   };


   return WhistleDetector;

})();



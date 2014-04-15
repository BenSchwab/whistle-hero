var FeatureBuilder = (function(TemporalProcessor, SpectralProcessor){

   function FeatureBuilder(windowSize, hopsize){
      this.queue =  new AudioQueue();
      this.windowSize = windowSize || 2048;
      this.hopSize =  hopsize || 256;
      this.temporalProcessor = new TemporalProcessor();
      this.spectralProcessor = new SpectralProcessor();
   }
   FeatureBuilder.prototype.push = function(audioSample){
      this.queue.push(audioSample);
      processQueue.call(this);
   };


   //Todo: normalize energy?
   function processQueue(){
      var soundEvents =  [];
      var subArray = this.queue.peek(this.windowSize);
      //console.log(this.windowSize);

      while(subArray){
         var soundSample =  new SoundSample(subArray);
         this.temporalProcessor.processSample(soundSample,true);
         this.spectralProcessor.processSample(soundSample);
         soundEvents.push(soundSample);
         this.queue.consume(this.hopSize); //toss out what we are done with
         subArray = this.queue.peek(this.windowSize);
      }
      window.dispatchEvent(new CustomEvent("featurebuilder.samples",{detail:soundEvents}));
   }

   Float32Array.prototype.concat =  function float32Concat(second){
       var firstLength = this.length,
       result = new Float32Array(firstLength + second.length);
       result.set(this);
       result.set(second, firstLength);
       return result;
   };

   function AudioQueue(){
      this.queue = new Float32Array(0);
   }
   AudioQueue.prototype.length = function(){
      return this.queue.length;
   };

   //This currently only consumes properly from the beginning
   AudioQueue.prototype.consume = function(frameSize, start){
      start = start || 0;
      var subArray = this.peek(frameSize, start);
      if(!subArray){
         return false;
      }
      this.queue = this.queue.subarray(start+frameSize);
      return subArray;
   };
   AudioQueue.prototype.peek = function(frameSize, start){
      start = start || 0;
      if(start+frameSize>this.queue.length){
         return false;
      }
      var subArray = this.queue.subarray(start, start + frameSize);
      return subArray;
   };
   AudioQueue.prototype.push =  function(audioArray){
      this.queue = this.queue.concat(audioArray);
   };


   function SoundSample(frame){
      this.frame =  frame;
   }



  return FeatureBuilder;
})(window.TemporalProcessor, window.SpectralProcessor);


var PeakProcessor = {
   processPeak: function(array, neighbors, sensitivity,threshold){
      threshold = threshold || 0;
      sensitivity = sensitivity || 0;
      neighbors = neighbors || 1;
      var peaks = [];
      for(var i = 0; i<array.length; i++){
         var curVal = Math.abs(array[i]);
         if(curVal<threshold){
            continue;
         }
         var start = i-neighbors;
         var end = i+neighbors;
         if(end>array.length){
            end = array.length;
         }
         if(start<0){
            start = 0;
         }
         var peak =  true;
         for(start; start<end; start++){
            if(start===i){
               continue;
            }
            var inspect =  Math.abs(array[start]);
            if(inspect+sensitivity>=curVal){
               peak = false;
               break;
            }
         }
         if(peak){
            peaks.push( {index:i, val: curVal});
         }
      }
      return peaks;

   }
};
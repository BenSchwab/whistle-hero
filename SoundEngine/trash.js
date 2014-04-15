 //Todo: normalize energy?
   function processQueue(){

      while(subArray){
         var subArray = this.queue.peek(this.windowSize);
          if(subArray){
            console.log("setting timeout");
            window.setTimeout(processSubArray, 0, subArray);
         }
         this.queue.consume(this.hopSize); //toss out what we are done with
         subArray = this.queue.peek(this.windowSize);
      }




   }
   function processSubArray(subArray){
      console.log("trying to process");
      if(subArray){
         var soundEvents =  [];
         var soundSample =  new SoundSample(subArray);
         this.temporalProcessor.processSample(soundSample,true);
         this.spectralProcessor.processSample(soundSample);
         soundEvents.push(soundSample);
         window.dispatchEvent(new CustomEvent("featurebuilder.samples",{detail:soundEvents}));
      }
   }
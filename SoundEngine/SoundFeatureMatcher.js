FeatureMatcher = (function(){

   function FeatureMatcher(powerThreshold){
      window.addEventListener('featurebuilder.samples', function(e){ this.matchSamples(e.detail);}.bind(this));
      this.powerThreshold = powerThreshold || 0.02;
      this.history = [];
      this.historySize = 5;
      this.acceptableThreshold = 10;
      this.prevSample = null;
      this.snaps = [];
      this.whistles = [];
      this.snapIndex = [];
      this.whistleIndex = [];
      this.wholeHistory = [];
      //window.wholeHistory = this.wholeHistory;
      this.index = 0;
      //window.failedHP = [];

      ///window.snaps = this.snaps;
      //window.whistles = this.whistles;
   }
   FeatureMatcher.prototype.matchSamples = function(samples){

      for(var i = 0; i<samples.length; i++){


         var sample = samples[i];
        // this.wholeHistory.push(sample);

         if(sample.totalPower<this.powerThreshold){
            this.prevSample = sample;
            this.addToHistory(sample);
            //console.log("failed power");
            continue;
         }
         //console.log(sample);


         this.prevSample = sample;
         var isWhistle = this.determineIfWhistle(sample);
         var isSnap = this.determineIfSnap(sample);
         if(isWhistle){
            sample.isWhistle = true;
            window.dispatchEvent(new CustomEvent("soundinput.detect",{detail:{frequency: sample.maxFrequency, type: "whistle"}}));
         }
         if(isSnap){
            var emit = true;
            sample.isSnap = true;
            for(var k =0; k<this.history.length; k++){
               if(this.history[k].isSnap){
                  emit = false;
                  console.log("REJECTED");
                  break;
               }
            }
            if(emit){
               console.log("got a snap");
               window.dispatchEvent(new CustomEvent("soundinput.detect",{detail:{frequency: sample.maxFrequency, type:"snap"}}));
            }
            //
         }
         this.addToHistory(sample);
         this.index++;

      }



   };

   FeatureMatcher.prototype.determineIfWhistle = function(sample){
       if(sample.spectralStandardDeviation<2000){
           // console.log(sample.spectrumHighPeaks[0].frequency);
            if(sample.temporalFlatness>0.7&&sample.percussivePercent<0.5){
               if(sample.maxFrequency>700&&sample.maxFrequency<3500&&sample.maxFrequencyIntensity>0.1){
                 // console.log("Detected whistle", sample.maxPower);
                // window.update2(sample.spectrum);
                //console.log(sample);
                  //window.dispatchEvent(new CustomEvent("soundinput.detect",{detail:{frequency: sample.maxFrequency, type: "whistle"}}));
                //  this.whistles.push(sample);
                 // this.whistleIndex.push(this.index);
                  return true;
               }
               else{
                  //console.log("filaed frequeny range and power", sample.maxFrequency);
               }
            }
            else{
               //console.log("failed flatness");
            }
         }
         else{
            //console.log("Failed spectralStandardDeviation");
            //window.failedHP.push(sample);
         }
         return false;

   };

   FeatureMatcher.prototype.determineIfSnap = function(sample){
      if(sample.temporalFlatness<0.5){
         if(sample.percussivePercent>0.7){
            if(sample.spectralStandardDeviation>2000){
               if(sample.betterHighPeaks.length===0){

               //this.snaps.push(sample);
                return true;
               }
               else{
                  //console.log("failed peaks",sample.betterPeaks);
                  //console.log(sample.activePercent);
               }
            }
            else{

              //console.log("failed standard dev"+sample.spectralStandardDeviation);
              //failedHP.push(sample);
            }

         }
         else{
            //failedHP.push(sample);
            //console.log(sample.percussivePercent);
         }
      }
      else{
         //console.log("failed temp flat", sample.temporalFlatness);
      }
      /*
      if(sample.percussivePercent>0.2){
            if(sample.spectralCentroid>5000){//sample.temporalFlatness<0.5){
               if(sample.spectralStandardDeviation>2000&&sample.spectralStandardDeviation<4000){//this.prevSample.maxPower<0.6){
                  //console.log(sample.spectralFlatness);
                  //console.log(sample.spectrumLowPeaks);
                  //console.log(JSON.stringify(sample.spectrum));
                  if(sample.maxFrequency>3000){

                  }
                 // window.update2(sample.spectrum);
                 // console.log(sample);
                 this.snaps.push(sample);
                 this.snapIndex.push(this.index);
                 return true;
                  //window.dispatchEvent(new CustomEvent("soundinput.detect",{detail:{frequency: sample.maxFrequency, type:"snap"}}));
               }
              else{
               console.log("failed spectral standard deviation",sample.spectralStandardDeviation);
              // window.failedHP.push(sample);
               return false;
                  //console.log("previous");
               }
               //console.log("yo");
               //console.log(sample);

            }
            else{
               //console.log("temporalFlatness");
               return false;
            }
         }
         else{
            console.log("failed percussivePercent", sample.percussivePercent);
         }*/
      return false;
   };

   FeatureMatcher.prototype.compareEnvelopes = function(){

   };
    FeatureMatcher.prototype.getSampleAtTime = function(time){
      var index = Math.floor(time/(256/44100));
      console.log(index);
      return this.wholeHistory[index];
   };

   FeatureMatcher.prototype.addToHistory = function(samples){
      if(this.history.length>this.historySize){
         this.history.shift();
      }
         this.history.push(samples);
   };

   return FeatureMatcher;
}());
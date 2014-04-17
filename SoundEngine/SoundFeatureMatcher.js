FeatureMatcher = (function(){

   function FeatureMatcher(powerThreshold){
      window.addEventListener('featurebuilder.samples', function(e){ this.matchSamples(e.detail);}.bind(this));
      this.powerThreshold = powerThreshold || 0.01;
      this.history = [];
      this.historySize = 10;
      this.acceptableThreshold = 10;
      this.prevSample = null;
   }
   FeatureMatcher.prototype.matchSamples = function(samples){

      this.addToHistory(samples);
      for(var i = 0; i<samples.length; i++){
         var sample = samples[i];
         if(sample.totalPower<this.powerThreshold){
            //console.log(sample.totalPower);
            //console.log("failed power");
            continue;
         }
         //console.log(sample);
         if(sample.spectrumHighPeaks.length<2&&sample.spectrumHighPeaks.length>0){
           // console.log(sample.spectrumHighPeaks[0].frequency);
            if(sample.temporalFlatness>0.6){
               if(sample.maxFrequency>700&&sample.maxFrequency<3500){
                 // console.log("Detected whistle", sample.maxPower);
                  window.dispatchEvent(new CustomEvent("soundinput.detect",{detail:{frequency: sample.maxFrequency, type: "whistle"}}));
               }
               else{
                  //console.log("filaed frequeny range", sample.maxFrequency);
               }
            }
            else{
               //console.log("failed flatness");
            }
         }
         else{
            //console.log("Failed high points", sample);
         }
         if(sample.maxPower>0.8 ){
            if(sample.temporalFlatness<0.5){
               if(prevSample.maxPower<0.6){
                  window.dispatchEvent(new CustomEvent("soundinput.detect",{detail:{frequency: sample.maxFrequency, type:"snap"}}));
               }
               else{
                  //console.log("previous");
               }
               //console.log("yo");
               //console.log(sample);

            }
            else{
               //console.log("temporalFlatness");
            }
         }
         prevSample = sample;

      }


   };

   FeatureMatcher.prototype.scoreWhistle = function(sample){


   };

   FeatureMatcher.prototype.compareEnvelopes = function(){

   };

   FeatureMatcher.prototype.addToHistory = function(samples){
      if(this.history.length)
      this.history.extend(samples);
   };

   return FeatureMatcher;
}());
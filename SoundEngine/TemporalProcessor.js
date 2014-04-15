var TemporalProcessor = (function(){

   function TemporalProcessor(standardEnergy){
      this.standardMaxEnergy = 0.3;
   }

   TemporalProcessor.prototype.processSample =function(audioSample,normalizeEnergy){
      this.calculateEnergy(audioSample);
      if(normalizeEnergy){
         this.normalizeEnergy(audioSample);
      }
      audioSample.temporalPeaks = PeakProcessor.processPeak(audioSample.frame,5,0,0);
      //console.log(audioSample.temporalPeaks.length);
      audioSample.temporalFlatness = this.calculateFlatness(audioSample.temporalPeaks.map(function(peak){return peak.val;}));
      //console.log(temporalFlatness);

   };
   TemporalProcessor.prototype.calculateEnergy = function(audioSample,timeTwo){
      var totalPower = 0;
      var maxPower = 0;
      for(var i =0; i<audioSample.frame.length; i++){
         var curPower = Math.abs(audioSample.frame[i]);
         curPower = curPower*curPower;
         totalPower += curPower;
         if(curPower>maxPower){
            maxPower = curPower;
         }
      }
      audioSample.totalPower = totalPower;
      audioSample.maxPower = Math.sqrt(maxPower);
     // console.log("mp1 "+audioSample.maxPower);
      if(!isNaN(totalPower)&&timeTwo){
         //console.log("tp"+totalPower);
      }

   };
   TemporalProcessor.prototype.normalizeEnergy = function(audioSample){

      var normalizationCoefficient = this.standardMaxEnergy/audioSample.maxPower;
     // console.log(normalizationCoefficient);
      var normalizedAudio =  new Float32Array(audioSample.frame.length);
      for(var i =0; i<audioSample.frame.length; i++){
         normalizedAudio[i] = audioSample.frame[i]*normalizationCoefficient;
      }
      audioSample.frame = normalizedAudio;
   };
   TemporalProcessor.prototype.calculateFlatness = function(data){
      //var data = audioSample.frame;
      var logSum = 0;
      var normalSum = 0;
       for(var i =0; i<data.length; i++){
            var absData = Math.abs(data[i]);
            logSum += Math.log(absData);
            normalSum +=  absData;
      }
      logSum = Math.exp(logSum/data.length);
      normalSum = normalSum/data.length;
      temporalFlatness = logSum/normalSum;
      return temporalFlatness;
      //console.log(logSum, normalSum);

     // console.log(logSum, normalSum);


   };

   return TemporalProcessor;
})();
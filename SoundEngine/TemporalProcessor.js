var TemporalProcessor = (function(){

   function TemporalProcessor(standardEnergy){
      this.standardMaxEnergy = 0.3;
   }



   TemporalProcessor.prototype.processSample =function(audioSample,normalizeEnergy){
      this.calculateEnergy(audioSample);
      this.percussivePercent(audioSample,400);
      if(normalizeEnergy){
        this.normalizeEnergy(audioSample);
      }
      audioSample.temporalPeaks = PeakProcessor.processPeak(audioSample.frame,5,0,0);
      //console.log(audioSample.temporalPeaks.length);
      audioSample.temporalFlatness = this.calculateFlatness(audioSample.temporalPeaks.map(function(peak){return peak.val;}));
      //console.log(temporalFlatness);

   };
   TemporalProcessor.prototype.calculateEnergy = function(audioSample,timeTwo){

      audioSample.energyValues = SoundMath.squareValues(audioSample.frame);
      audioSample.totalPower = SoundMath.sum(audioSample.energyValues);
      audioSample.maxPower = SoundMath.maxValue(audioSample.frame).value;
      audioSample.meanPower = audioSample.totalPower/(audioSample.energyValues.length);
      audioSample.powerSpread = Math.sqrt(SoundMath.spread(SoundMath.ones(audioSample.energyValues.length), audioSample.energyValues, audioSample.meanPower));
      audioSample.activePercent = SoundMath.activePercent(audioSample.meanPower, audioSample.energyValues);

   };
   TemporalProcessor.prototype.percussivePercent = function(audioSample,size){
      var array = audioSample.frame;
      var sum = 0;
      var max = 0;
      for(var i = 0; i<array.length; i++){
         sum+=Math.abs(array[i]*array[i]);
         if(i>size){
            sum-=(array[i-size]*array[i-size]);
         }
         if(sum>max){
            max = sum;
         }
      }
      audioSample.percussivePercent = max/audioSample.totalPower;
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
var SpectralProcessor = (function(){

   function SpectralProcessor(frameLength, sampleRate){
    this.fft = new FFT(frameLength, sampleRate);
   }
   SpectralProcessor.prototype.processSample = function(audioSample, sampleRate){
      this.sampleRate = sampleRate || 44100;

      //todo: create only one FFT object

      //var fft = new FFT(audioSample.frame.length, this.sampleRate);
      this.fft.forward(audioSample.frame);
      this.fft.calculateSpectrum();
      audioSample.spectrum = this.fft.spectrum;


      this.calculatePeakFrequency(audioSample);
      this.countPeaks(audioSample);

      audioSample.spectralPowerMean = SoundMath.mean(audioSample.dbSpectrum);
     // audioSample.spectralPowerSpread = Math.sqrt(SoundMath.spread(SoundMath.ones(audioSample.dbSpectrum.length),audioSample.dbSpectrum,audioSample.spectralPowerMean));


      audioSample.betterPeaks = this.countPeaksDB(audioSample.dbSpectrum);
      audioSample.betterHighPeaks = PeakProcessor.processPeak(audioSample.dbSpectrum, 64, 0, -3);
      this.computeCentroid(audioSample);
      this.computeLinearRegression(audioSample);
      audioSample.spectralFlatness =  this.calculateFlatness(audioSample.dbSpectrum, 5);
   };
   SpectralProcessor.prototype.calculatePeakFrequency = function(audioSample){
      var max =  0;
      var bucket = 0;
      var logThing = new Float32Array(audioSample.spectrum.length);
      var maxLog = -100;
      var maxLogIndex = 0;
         for(var i =0; i<audioSample.spectrum.length; i++){
            if(audioSample.spectrum[i]>max){
               max = audioSample.spectrum[i];
               bucket = i;
            }
            logThing[i] = Math.log(audioSample.spectrum[i]);
            if(logThing[i]>maxLog){
              maxLog = logThing[i];
              maxLogIndex= i;
            }

         }
      audioSample.maxLog = maxLog;
      audioSample.maxLogIndex = maxLogIndex;
      audioSample.maxFrequencyIndex = bucket;
      var frequencyBucket = (this.sampleRate/2/audioSample.spectrum.length)*bucket;
      audioSample.maxFrequencyIntensity = max;
      audioSample.maxFrequency = frequencyBucket;
      audioSample.dbSpectrum = logThing;
      //console.log(audioSample.spectrum.length);

   };


   SpectralProcessor.prototype.computeLinearRegression = function(audioSample){
      var array = SoundMath.maxReduce(audioSample.dbSpectrum,16);
      //console.log(array);
      audioSample.reducedDBSpectrum = array;
      audioSample.spectralRegression = SoundMath.linearRegression(SoundMath.linspace(1,array.length,array.length),array);
   };

   SpectralProcessor.prototype.computeCentroid = function(audioSample){
    var weight =  audioSample.spectrum;
    var basis = SoundMath.linspace(1,weight.length, weight.length);
    var centroid = SoundMath.centroid(weight,basis);

    audioSample.spectralCentroid = SoundMath.convertBucketToFrequency(this.sampleRate,weight.length,centroid);
    var spread = SoundMath.spread(weight, basis, centroid);
    audioSample.spectralStandardDeviation = Math.sqrt(SoundMath.convertBucketToFrequency(this.sampleRate,weight.length,spread));

   };

   SpectralProcessor.prototype.countPeaksDB = function(array){
   // console.log(array);

      var highPeaks = PeakProcessor.processPeak(array, 64, 0, -8);
     // var Peaks = PeakProcessor.processPeak(array, 64, 0, -3);
      return highPeaks;
   };

   SpectralProcessor.prototype.countPeaks = function(audioSample){
      var highPeaks = PeakProcessor.processPeak(audioSample.spectrum, 10, 0.0001, 0.1);
      var lowPeaks = PeakProcessor.processPeak(audioSample.spectrum, 10, 0.000001, 0.0001);

      //console.log(highPeaks.length);

     var stuff = audioSample.spectrum.length;
      highPeaks = highPeaks.map(function(peak){
         peak.frequency = (44100/2/audioSample.spectrum.length)*peak.index;
         //console.log(peak.frequency);
          return peak;}.bind(this));
       lowPeaks = lowPeaks.map(function(peak){
         peak.frequency = (44100/2/audioSample.spectrum.length)*peak.index;
         //console.log(peak.frequency);
          return peak;}.bind(this));
      //console.log(highPeaks.size);
      audioSample.spectrumHighPeaks = highPeaks;
      audioSample.spectrumLowPeaks = lowPeaks;
   };
   SpectralProcessor.prototype.calculateFlatness = function(array){
      var logSum = 0;
      var normalSum = 0;
     // bucketWidth =  bucketWidth || 1;
      var size = array.length ;
      normalSum = SoundMath.sum(array);
      logSum = SoundMath.logSum(array);
      logSum = Math.exp(logSum/size);
      //console.log(normalSum);
      normalSum = normalSum/size;
     // console.log()



      return  Math.abs(logSum/normalSum);
      //if(!isNaN(audioSample.spectralFlatness))
         //console.log(audioSample.spectralFlatness);
     // console.log(logSum, normalSum);


   };


   return SpectralProcessor;
})();
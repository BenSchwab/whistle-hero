var SpectralProcessor = (function(){

   function SpectralProcessor(){

   }
   SpectralProcessor.prototype.processSample = function(audioSample, sampleRate){
      this.sampleRate = sampleRate || 44100;
      //console.log(audioSample.frame.length);
      var fft = new FFT(audioSample.frame.length, this.sampleRate);
      fft.forward(audioSample.frame);
      fft.calculateSpectrum();
      audioSample.spectrum = fft.spectrum;
      //update2(fft.spectrum);
      this.calculatePeakFrequency(audioSample);
      this.countPeaks(audioSample);
      this.calculateFlatness(audioSample);
   };
   SpectralProcessor.prototype.calculatePeakFrequency = function(audioSample){
      var max =  0;
      var bucket = 0;
         for(var i =0; i<audioSample.spectrum.length; i++){
            if(audioSample.spectrum[i]>max){
               max = audioSample.spectrum[i];
               bucket = i;
            }

         }
      var frequencyBucket = (this.sampleRate/2/audioSample.spectrum.length)*bucket;
      audioSample.maxFrequencyIntensity = max;
      audioSample.maxFrequency = frequencyBucket;

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
   SpectralProcessor.prototype.calculateFlatness = function(audioSample){
      var logSum = 0;
      var normalSum = 0;
       for(var i =0; i<audioSample.spectrum.length; i++){
            logSum += Math.log(audioSample.spectrum[i]);
            normalSum +=  audioSample.spectrum[i];
      }
      logSum = Math.exp(logSum/audioSample.spectrum.length);
      normalSum = normalSum/audioSample.spectrum.length;
      audioSample.spectralFlatness = logSum/normalSum;
      //if(!isNaN(audioSample.spectralFlatness))
         //console.log(audioSample.spectralFlatness);
     // console.log(logSum, normalSum);


   };


   return SpectralProcessor;
})();
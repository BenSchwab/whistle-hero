var PitchVocoder = (function(){

   function PitchVocoder(preferences){
      //this.pitchShift = preferences.pitchShift;

   }
   PitchVocoder.prototype.getPitchScalingFactor = function(semitones){
      return Math.pow(2, semitones/12);

   };
   PitchVocoder.prototype.scaleSpectrum = function(fft, scalingFactor){
      var nyquistPoint = fft.spectrum.length;
      var newSize = Math.ceil(fft.real.length*scalingFactor);
      var newSpectrum =  new Float32Array(newSize);
      var oldRealArray = fft.real;
      var oldImagArray = fft.imag;
      fft.real = new Float32Array(newSize);
      fft.imag = new Float32Array(newSize);
      window.cleaned = fft.real;
      //console.log(newSize);
      for(var i =0; i<oldRealArray.length; i++){
         var shift = (i-nyquistPoint)/nyquistPoint;
         var bucket = Math.floor(nyquistPoint + nyquistPoint*shift*scalingFactor);

         if(isNaN(oldRealArray[i])){
            console.log("Yo FOOL This oldRealArray is NAN");
         }
         fft.real[bucket] += oldRealArray[i];
         fft.imag[bucket] += oldImagArray[i];
      }
      //console.log(fft.real);
      fft.calculateSpectrum();
      window.afterspecscale = fft.real;

   };
   PitchVocoder.prototype.compressSpectrum = function(fft, buckets){
      var stepSize = fft.real.length/buckets;
      var oldRealArray = fft.real;
      var oldImagArray = fft.imag;
      //console.log(stepSize);
      //console.log("ora",oldRealArray);
       fft.real = new Float32Array(buckets);
      fft.imag = new Float32Array(buckets);
      for(var i =0; i<buckets; i++){
         var index = Math.floor(i*stepSize);
         if(index>=oldRealArray.length){
            console.log("Yo dog You MESSED UP!");
         }
         fft.real[i] += oldRealArray[index];
         fft.imag[i] += oldImagArray[index];
      }
      //console.log(index);
      fft.calculateSpectrum();
      window.thisiswhatweareinverting = fft.real;
   };

   PitchVocoder.prototype.scaleTime = function(buffer, buckets){
      var stepSize = buffer.length/buckets;
      var scaled = new Float32Array(buckets);
     // console.log(stepSize);
      //console.log("ora",oldRealArray);
      console.log("scaled version buckets "+ buckets);

      for(var i =0; i<buckets; i++){
         var index = Math.floor(i*stepSize);
         scaled[i] += buffer[index];
         scaled[i] += buffer[index];
      }
      return scaled;

   };


   return PitchVocoder;
})();
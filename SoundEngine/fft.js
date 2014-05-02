FFT = (function(){

   var FFT = function(size){
      var k = Math.floor(Math.log(size) / Math.LN2);
      if (Math.pow(2, k) !== bufferSize) { throw "Size of the FFT must be a power of 2."; }



   };

   function fft2(x, N, s){

   }


   var RootOfUnity = function (n, k){

   }

   var Complex = function(real, imag){
      this.real =  real;
      this.imag = imag;

      this.multiply = function(other, newNumber){
         var a = this.real;
         var b = this.imag;
         var c = other.real;
         var d = other.imag;
         var real = a*c - b*d;
         var complex = a*d+b*c;
         if(newNumber){
            return new Complex(real, complex);
         }
         else{
            this.real = a*c - b*d;
            this.imag = a*d+b*c;
         }
         return this;
      };

   };


   //return FFT;
})();


/*
X0,...,N−1 ← ditfft2(x, N, s):             DFT of (x0, xs, x2s, ..., x(N-1)s):
    if N = 1 then
        X0 ← x0                                      trivial size-1 DFT base case
    else
        X0,...,N/2−1 ← ditfft2(x, N/2, 2s)             DFT of (x0, x2s, x4s, ...)
        XN/2,...,N−1 ← ditfft2(x+s, N/2, 2s)           DFT of (xs, xs+2s, xs+4s, ...)
        for k = 0 to N/2−1                           combine DFTs of two halves into full DFT:
            t ← Xk
            Xk ← t + exp(−2πi k/N) Xk+N/2
            Xk+N/2 ← t − exp(−2πi k/N) Xk+N/2
        endfor
    endif */
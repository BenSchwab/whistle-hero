var SoundMath = {

   maxReduce: function(array, targetDimension){
      var length =  array.length;
      var bucketSize = length/targetDimension;
      var reducedArray = new Float32Array(targetDimension);
      var index= 0;

      for(var i = 0; i<targetDimension; i++){
         var nextValue = index+bucketSize;
         var max = -999999;
         for(index; index<nextValue; index++){
            if(array[index]>max){
               max = array[index];
            }
         }
         reducedArray[i] = max;
      }
      return reducedArray;

   },

   ones: function(length){
      var ones = new Float32Array(length);
      for(var i =length; i--;){
         ones[i] = 1;
      }
      return ones;
   },
   subtract: function(vectorOne, vectorTwo){
      if(vectorOne.length!==vectorTwo.length){
         throw ("Vector's must have same length. " +vectorOne.length + " vs. "+ vectorTwo.length);
      }
       var subtracted = new Float32Array(vectorOne.length);
      for(var i =vectorOne.length; i--;){
         subtracted[i] = vectorOne[i] - vectorTwo[i];
      }
      return subtracted;

   },
   addConstant: function(vectorOne, constant){
      var subtracted = new Float32Array(vectorOne.length);
      for(var i =vectorOne.length; i--;){
         subtracted[i] = vectorOne[i] - constant;
      }
      return subtracted;

   },
   squareValues: function(vectorOne){
      var squared = new Float32Array(vectorOne.length);
      for(var i =vectorOne.length; i--;){
         squared[i] = vectorOne[i]*vectorOne[i];
      }
      return squared;

   },
   scalarMult: function(vectorOne, scalar){
       var resultant = new Float32Array(vectorOne.length);
      for(var i =vectorOne.length; i--;){
         resultant[i] = vectorOne[i]*scalar;
      }
      return resultant;
   },
   zeroes: function(length){
      return new Float32Array(length);
   },
   linspace: function(min, max, size){
      var step = (max-min)/(size-1);
      var array = new Float32Array(size);
      var cur = max;
       for (var i=array.length; i--;) {
         array[i] = cur;
         cur -=step;
      }
      return array;

   },
   dot: function(vectorOne, vectorTwo){
      if(vectorOne.length!==vectorTwo.length){
         throw ("Vector's must have same length. " +vectorOne.length + " vs. "+ vectorTwo.length);
      }
      var dotProduct = new Float32Array(vectorOne.length);
      for(var i =vectorOne.length; i--;){
         dotProduct[i] = vectorOne[i]*vectorTwo[i];
      }
      return dotProduct;
   },
   maxValue: function(array){
      var index = -1;
      value = -999999;
      for (var i=array.length; i--;) {
         if(array[i]>value){
            value = array[i];
            index = i;
         }
      }
      return{index: index, value: value};
   },
   sum : function(array){
      var count=0;
      for (var i=array.length; i--;) {
         count+=array[i];
      }
      return count;
   },
   logSum : function(array){
      var count=0;
      for (var i=array.length; i--;) {
         count+=Math.log(Math.abs(array[i]));
      }
      return count;
   },
   findPeaks: function(array, neighbors, sensitivity,threshold){
      threshold = threshold || 0;
      sensitivity = sensitivity || 0;
      neighbors = neighbors || 1;
      var peaks = [];
      for(var i = 0; i<array.length; i++){
         var curVal = array[i];
         if(curVal<threshold&&threshold!==0){
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
            var inspect =  array[start];
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
   },
   mean: function(array){
      return SoundMath.sum(array)/array.length;
   },
   centroid: function(weight, basis){
      var top = SoundMath.dot(weight,basis);
      return SoundMath.sum(top)/SoundMath.sum(weight);
   },
   spread: function(weight, basis, centroid){
      centroid = centroid || SoundMath.centroid(weight,basis);
      var diff = SoundMath.addConstant(basis, -1*centroid);
      var totalWeight = SoundMath.sum(weight);
      var pdfWeight = SoundMath.scalarMult(weight, 1/totalWeight);
      diff = SoundMath.squareValues(diff);
      diff = SoundMath.dot(diff,pdfWeight);
      diff = SoundMath.sum(diff);
      return diff;

   },
   activePercent: function(threshold, array){
      var count=0;
      for (var i=array.length; i--;) {
         if(array[i]>threshold){
            count++;
         }
      }
      return count/array.length;
   },
   convertBucketToFrequency: function(sampleRate,arrayLength,bucket){
      return sampleRate/2/arrayLength*bucket;
   },
   linearRegression: function(x,y){
      var lr = {};
      var n = y.length;
      var sum_x = 0;
      var sum_y = 0;
      var sum_xy = 0;
      var sum_xx = 0;
      var sum_yy = 0;

      for (var i = 0; i < y.length; i++) {

         sum_x += x[i];
         sum_y += y[i];
         sum_xy += (x[i]*y[i]);
         sum_xx += (x[i]*x[i]);
         sum_yy += (y[i]*y[i]);
      }

      lr['slope'] = (n * sum_xy - sum_x * sum_y) / (n*sum_xx - sum_x * sum_x);
      lr['intercept'] = (sum_y - lr.slope * sum_x)/n;
      lr['r2'] = Math.pow((n*sum_xy - sum_x*sum_y)/Math.sqrt((n*sum_xx-sum_x*sum_x)*(n*sum_yy-sum_y*sum_y)),2);

      return lr;
   }

};
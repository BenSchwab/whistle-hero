var SoundLoader = (function(){

   var context;
   function SoundLoader(ctx){
      context = ctx;
   }
   SoundLoader.prototype.loadSounds = function(soundURLArray){
      var promiseArray = soundURLArray.map(function(curr,index,array){
         return SoundLoader.loadSound(soundURL);
         //return SoundLoader.prototype.loadSound(soundURL);
      });
   };
    SoundLoader.prototype.loadSound = function(soundURL){
      return new Promise(function(resolve, reject){
          //console.log("weird");
         var request = new XMLHttpRequest();
         request.open('GET', soundURL, true);
         request.responseType = 'arraybuffer';

         request.onload = function() {
             context.decodeAudioData(request.response, function(buffer) {
              resolve(buffer);
              console.log("resolved");
             }, onError);
           };
        request.send();
        console.log("promise returned");

         });
    };

    function onError(e){
      console.log("running error");
      reject(e);
    }

   return SoundLoader;

})();
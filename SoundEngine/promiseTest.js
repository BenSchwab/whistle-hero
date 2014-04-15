function aPromise(){
   return new Promise(function(resolve, reject){
      setTimeout(resolve, 1000,100);

   });

}

var whatIsThis = aPromise().then( function(arg){
   console.log("I got "+arg);
   return arg;
} );

var dowhat = whatIsThis.then(function(){console.log("I wonder if I will ever get resolved.");});


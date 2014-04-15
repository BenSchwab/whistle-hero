window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();
var songLoader = new SoundLoader(context);
var songPromise = songLoader.loadSound("testsong.mp3");
songPromise.then(function(buffer){

   console.log("before error");

   console.log("I am being called");
   window.thisBuffer = buffer;
   console.log("nothing happening here");
   var testCanvas = new AmplitudeCanvas(context,document.getElementById('canv'),{resolution: 3});
   testCanvas.setBuffer(buffer);
   testCanvas.render();


}).catch(function(error) {
  console.error(error);
});
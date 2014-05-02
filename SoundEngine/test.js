var context;
window.addEventListener('load', init, false);
function init() {
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
}

setupCanvas();

window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();


function getLiveInput() {
  // Only get the audio stream.
  navigator.webkitGetUserMedia({audio: true}, onStream, onStreamError);
}


var analyser;
function onStream(stream) {
   console.log("OnStream");
  // Wrap a MediaStreamSourceNode around the live input stream.
  var input = context.createMediaStreamSource(stream);
  // Connect the input to a filter.

  var processor = context.createScriptProcessor(512);
  processor.onaudioprocess = testProcess;
  input.connect(processor);

  //analyser = context.createAnalyser();

  // Connect graph.
  processor.connect(context.destination);
  //filter.connect(analyser);
  //filter.connect(context.destination);
  console.log("connected sound to output");


  // Set up an animation.
  //requestAnimationFrame(render);
}

function onStreamError(e) {
  console.error(e);
}
//getLiveInput();

 //var aCanv = new AmplitudeCanvas(context, document.querySelector("#amplitudeCanv"), {});
function playWhistle(buffer){


  console.log("play whistle called!");
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = buffer;
  setup = true;
   var processor = context.createScriptProcessor(512);
   processor.onaudioprocess = testProcess;
   source.connect(processor);
   source.connect(context.destination);
   processor.connect(context.destination);
   source.start(0);
   /*
     window.buff = buffer;
  window.source = source;
  window.acontext = context; */

    //console.log("fail");
  //aCanv.setBuffer(buffer.getChannelData(0));
  //aCanv.render();
  //console.log("Yeah I tried");



}
function playSong(song){

  start();
 // console.log("play whistle called!");
  var source = context.createBufferSource(); // creates a sound source
  source.buffer = song;
  setup = true;
  // var processor = context.createScriptProcessor(512);
   //processor.onaudioprocess = testProcess;
   //source.connect(processor);
   source.connect(context.destination);
   //processor.connect(context.destination);
   source.start(0);
   /*
     window.buff = buffer;
  window.source = source;
  window.acontext = context; */

    //console.log("fail");
  //aCanv.setBuffer(buffer.getChannelData(0));
  //aCanv.render();
  //console.log("Yeah I tried");



}

var featureBuilder = new FeatureBuilder();
var featureMatcher = new FeatureMatcher();
window.featureMatcher = featureMatcher;


function testProcess(e){
  var input = e.inputBuffer.getChannelData(0);
  //console.log("trying to push");
  featureBuilder.push(input);
  /*
  var leftOut = e.outputBuffer.getChannelData(0);
  var rightOut = e.outputBuffer.getChannelData(1);

  for (var i = 0; i < input.length; i++) {
    // Flip left and right channels.
    leftOut[i] = input[i];
    rightOut[i] = input[i];
  } */
   //aCanv.setBuffer(input);
  //aCanv.render();


}




//getLiveInput();
onError =function(e){
   console.log("Error: ", e);
};



//var NOISE_FACTOR = .1;

//var whislteDetector = new WhistleDetector();
window.addEventListener("soundinput.detect", onWhistle);
function onWhistle(e){
  //console.log("got it!");
  onWhistle.h2 = onWhistle.h2 || document.querySelector("h2");
  //onWhistle.h2.innerHTML = ""+e.detail.type+" freq:"  + e.detail.frequency;
}

//play sounds to test or get live input



var setup = false; //indicate if audio is set up yet
var samples = 1024;
var gfx;
var gfx2;
function setupCanvas() {
    var canvas = document.querySelector('#canv');
    gfx = canvas.getContext('2d');
    //webkitRequestAnimationFrame(update);

     var canvas2 = document.querySelector('#canvTwo');
    gfx2 = canvas2.getContext('2d');
    //webkitRequestAnimationFrame(update2);
}

var start = 0;
function update2(data) {
    //webkitRequestAnimationFrame(update2);
    //if(!setup) return;
    console.log("draw" + start);
    gfx2.clearRect(0,start,6000,start+500);
    gfx2.fillStyle = 'gray';
    gfx2.fillRect(0,start,6000,start+500);


    //var data = new Uint8Array(samples);
    //fft.getByteFrequencyData(data);
    //console.log(data);
    gfx2.fillStyle = 'red';
    for(var i=0; i<data.length; i++) {
        gfx2.fillRect(100+i*2,start+100+256-data[i],3,100);
    }
    start += 500;

}
window.update2 = update2;
 var logs = 0;

// function update() {
//     webkitRequestAnimationFrame(update);
//       //console.log("writing canvas one?");
//     return;
//     if(!setup) return;
//     //console.log("writing canvas one");
//     gfx.clearRect(0,0,6000,600);
//     gfx.fillStyle = 'gray';
//     gfx.fillRect(0,0,6000,600);


//     //var data = new Uint8Array(samples);
//     var data = new Float32Array(samples);
//     fft.getFloatFrequencyData(data);
//     //console.log(data);
//     //console.log(data);
//     gfx.fillStyle = 'red';

//     if(logs<20){
//        // console.log(data);
//     }
//     logs++;
//     var max = 0;
//     for(var i=0; i<data.length; i++) {
//         if(data[i]>max){
//           max = data[i];
//         }

//         gfx.fillRect(100+i*4,100+256-data[i]*2,3,100);
//     }


function stopRecording(){

}


getLiveInput();
 var sLoader = new SoundLoader(context);
  //sLoader.loadSound("SoundEngine/Whistles/whistlews.wav",context).then(function(buffer){playWhistle(buffer);});
  console.log("started");


document.getElementById("play").onclick = playBackgroundSong;
var backgroundPromise = sLoader.loadSound("resources/whistle.mp3",context);

function playBackgroundSong(){
  backgroundPromise.then(function(buffer){playSong(buffer);});
}


/*
*  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
*
*  Use of this source code is governed by a BSD-style license
*  that can be found in the LICENSE file in the root of the source
*  tree.
*/

'use strict';

var videoElement = document.querySelector('video');
var arrayCameras = [];
var currentCamera= 0;
var btSwitchCamera = document.getElementById('bt-switch');
var flagResizeCam = false;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");

function gotDevices(deviceInfos) { 
  	
  for (var i = 0; i !== deviceInfos.length; ++i) {
    var deviceInfo = deviceInfos[i];
   
	if (deviceInfo.kind === 'videoinput') {
      arrayCameras.push(deviceInfo.deviceId);
    }
  }
}


navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

function gotStream(stream) {
  window.stream = stream; // make stream available to console
  videoElement.srcObject = stream;
  // Refresh button list in case labels have become available
  
  //setTimeout(resizeCamera, 100);
  return navigator.mediaDevices.enumerateDevices();
}

function start() {
  
  if (window.stream) {
    window.stream.getTracks().forEach(function(track) {
      track.stop();
    });
  }
  //var audioSource = audioInputSelect.value;
  var videoSource = arrayCameras[currentCamera]; //videoSelect.value;
  var constraints = {
    //audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
    video: {deviceId: videoSource ? {exact: videoSource} : undefined}
  };
  navigator.mediaDevices.getUserMedia(constraints).
      then(gotStream).then(gotDevices).catch(handleError);
      
      
  requestAnimationFrame(updateCanvas);
  
   console.log("Start")
     
}


btSwitchCamera.addEventListener("click",function(){
      currentCamera++;
      if(currentCamera >= arrayCameras.length)
      	currentCamera =0;
		
		start();
});


start();

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

function updateCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height); 
    canvas.height = screen.height;
    canvas.width = screen.width;

   
    ctx.drawImage(videoElement, 0, 0,videoElement.videoWidth, videoElement.videoHeight); 
	//,0, 0, screen.width, screen.height);
    
    drawMarkRects();
    
    // all done for display 
    // request the next frame in 1/60th of a second
    requestAnimationFrame(updateCanvas);
}


function drawMarkRects(){
	
   drawRects(10,10,100,100,10);
   console.log(canvas.width, screen.width)
   drawRects(canvas.width  - 110, 10 ,100,100,10);
   drawRects(10, canvas.height-110 ,100,100,10);
   drawRects(canvas.width  - 110, canvas.height-110 ,100,100,10);
}

function drawRects(x,y,w,h,radius){
   ctx.strokeStyle="#111";
   ctx.fillStyle = "rgba(100,100,100, 0.2)";
   var r = x + w;
   var b = y + h;
   ctx.beginPath();
	ctx.moveTo(x+radius, y);
	ctx.lineTo(r-radius, y);
	ctx.quadraticCurveTo(r, y, r, y+radius);
	ctx.lineTo(r, y+h-radius);
	ctx.quadraticCurveTo(r, b, r-radius, b);
	ctx.lineTo(x+radius, b);
	ctx.quadraticCurveTo(x, b, x, b-radius);
	ctx.lineTo(x, y+radius);
	ctx.quadraticCurveTo(x, y, x+radius, y);    
   ctx.stroke();

   ctx.fill();  	
}
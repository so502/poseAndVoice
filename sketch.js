let speech;
let said;
let word = [];
var directionX;

let video;
let poseNet;
let poses = [];

let pkeyHandX, pkeyHandY, keyHandX, keyHandY;
let img;
function preload(){
   img = loadImage("a.png");
}
function setup() {
  createCanvas(640, 360);
  directionX = 1;
  textSize(30);
  speechRec = new p5.SpeechRec("ko-KR", gotSpeech);
  let continuous = true;
  let interimResults = false;
  speechRec.start(continuous, interimResults);

  function gotSpeech() {
    console.log(speechRec);
    if (speechRec.resultValue) {
      said = speechRec.resultString;
      word = said.split("");
      console.log(said);
    }
  }

  video = createCapture(VIDEO);
  video.size(width, height);
  poseNet = ml5.poseNet(video, modelReady);
  poseNet.on("pose", function (results) {
    poses = results;
  });
  video.hide();
}

function modelReady() {
  console.log("Ai Activated!");
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
}

function drawKeypoints() {
  for (let i = 0; i < poses.length; i++) {
    let pose = poses[i].pose;
    let keypoint = pose.keypoints[10];
    if (keypoint.score > 0.2) {
      keyHandX = pkeyHandX;
      keyHandY = pkeyHandY;
      pkeyHandX = keypoint.position.x;
      pkeyHandY = keypoint.position.y;

        if(keyHandX > width/2){
        directionX = -1;
      }
      if(keyHandX < width/2){
        directionX = 1;
      }
      for (var j = 0; j < word.length; j++) {
        image(img, keyHandX-125, keyHandY, 250, 250);
        text(word[j], keyHandX + directionX * j * 25, random(keyHandY - 3, keyHandY + 3));
        console.log(word[j]);
      }
    }
  }
}
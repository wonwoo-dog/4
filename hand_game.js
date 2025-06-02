let video;
let handpose;
let predictions = [];
let circleX = 300;
let circleY = 300;
let score = 0;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化手勢追蹤模型
  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });
}

function modelReady() {
  console.log("Handpose model loaded!");
}

function draw() {
  background(220);

  // 顯示攝影機影像
  image(video, 0, 0, width, height);

  // 繪製遊戲目標
  fill(255, 0, 0);
  ellipse(circleX, circleY, 50);

  // 繪製手勢追蹤結果
  drawHandPoints();

  // 檢查手指是否碰到目標
  if (predictions.length > 0) {
    let hand = predictions[0];
    let indexFinger = hand.landmarks[8]; // 食指尖端座標
    let x = indexFinger[0];
    let y = indexFinger[1];

    // 繪製食指尖端
    fill(0, 255, 0);
    ellipse(x, y, 20);

    // 檢查碰撞
    if (dist(x, y, circleX, circleY) < 25) {
      score++;
      circleX = random(50, width - 50);
      circleY = random(50, height - 50);
    }
  }

  // 顯示分數
  fill(0);
  textSize(24);
  text(`Score: ${score}`, 10, 30);
}

function drawHandPoints() {
  for (let i = 0; i < predictions.length; i++) {
    let hand = predictions[i];
    for (let j = 0; j < hand.landmarks.length; j++) {
      let [x, y, z] = hand.landmarks[j];
      fill(0, 0, 255);
      noStroke();
      ellipse(x, y, 10);
    }
  }
}
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let bird = { x: 50, y: 300, size: 20, dy: 0 };
let gravity = 0.4;
let jump = -6;

let pipes = [];
let pipeGap = 150; // 간격 넓힘
let pipeWidth = 50;
let pipeSpeed = 2;
let score = 0;

let isGameRunning = false;
let isGameOver = false;

// 캔버스 크기를 화면에 맞게 조정
function resizeCanvas() {
  const aspectRatio = 400 / 600; // 고정 비율
  const width = window.innerWidth * 0.9; // 화면의 90% 너비
  const height = width / aspectRatio; // 비율에 맞는 높이

  canvas.width = width;
  canvas.height = height;

  // 크기 변경 후 게임 오브젝트 재배치
  bird = { ...bird, size: width / 20 }; // 새 크기 비례 조정
}

// Pipe 생성
function createPipe() {
  const height = Math.floor(Math.random() * (canvas.height / 2)) + canvas.height / 4;
  pipes.push({
    x: canvas.width,
    y: 0,
    width: pipeWidth,
    height: height,
  });
  pipes.push({
    x: canvas.width,
    y: height + pipeGap,
    width: pipeWidth,
    height: canvas.height - (height + pipeGap),
  });
}

// Draw bird
function drawBird() {
  ctx.fillStyle = "#ff5733";
  ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "#2e8b57";
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
  });
}

// Update game
function update() {
  if (!isGameRunning) return;

  bird.dy += gravity;
  bird.y += bird.dy;

  // Move pipes
  pipes.forEach((pipe) => {
    pipe.x -= pipeSpeed;
  });

  // Remove passed pipes and increment score
  pipes = pipes.filter((pipe) => pipe.x + pipe.width > 0);
  if (pipes.length && pipes[0].x === bird.x) {
    score++;
  }

  // Add new pipes
  if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
    createPipe();
  }

  // Collision detection
  for (let pipe of pipes) {
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.size > pipe.x &&
      bird.y < pipe.y + pipe.height &&
      bird.y + bird.size > pipe.y
    ) {
      endGame();
    }
  }

  // Ground or ceiling collision
  if (bird.y + bird.size > canvas.height || bird.y < 0) {
    endGame();
  }
}

// Reset game
function resetGame() {
  bird.y = canvas.height / 2;
  bird.dy = 0;
  pipes = [];
  score = 0;
  isGameRunning = false;
  isGameOver = false;
}

// End game
function endGame() {
  isGameRunning = false;
  isGameOver = true;
}

// Display score
function displayScore() {
  ctx.fillStyle = "#000";
  ctx.font = `${canvas.width / 20}px Arial`;
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameRunning && !isGameOver) {
    // Show start message
    ctx.fillStyle = "#000";
    ctx.font = `${canvas.width / 15}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText("터치하면 시작합니다!", canvas.width / 2, canvas.height / 2);
  } else if (isGameOver) {
    // Show game over message
    ctx.fillStyle = "#000";
    ctx.font = `${canvas.width / 15}px Arial`;
    ctx.textAlign = "center";
    ctx.fillText(`게임 종료! 점수: ${score}`, canvas.width / 2, canvas.height / 2);
    ctx.fillText("터치해서 다시 시작!", canvas.width / 2, canvas.height / 2 + 40);
  } else {
    drawBird();
    drawPipes();
    update();
    displayScore();
  }

  requestAnimationFrame(gameLoop);
}

// Control bird
canvas.addEventListener("click", () => {
  if (!isGameRunning && !isGameOver) {
    isGameRunning = true;
  } else if (isGameOver) {
    resetGame();
  } else {
    bird.dy = jump;
  }
});

// 화면 크기 변경 시 캔버스 조정
window.addEventListener("resize", resizeCanvas);

// Start game loop
resizeCanvas(); // 초기 화면 크기 설정
gameLoop();

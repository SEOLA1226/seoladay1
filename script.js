const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Game variables
let bird = { x: 50, y: 300, size: 20, dy: 0 };
let gravity = 0.4;
let jump = -6; // 점프 크기 감소

let pipes = [];
let pipeGap = 150; // 간격 넓힘
let pipeWidth = 50;
let pipeSpeed = 2;
let score = 0;

let isGameRunning = false;
let isGameOver = false;

// Create pipes
function createPipe() {
  const height = Math.floor(Math.random() * 200) + 100; // Random height
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
  bird.y = 300;
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
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!isGameRunning && !isGameOver) {
    // Show start message
    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("터치하면 시작합니다!", canvas.width / 2, canvas.height / 2);
  } else if (isGameOver) {
    // Show game over message
    ctx.fillStyle = "#000";
    ctx.font = "24px Arial";
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

// Start game loop
gameLoop();

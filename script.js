const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400; // Canvas width
canvas.height = 600; // Canvas height

// Game variables
let bird = { x: 50, y: 300, size: 20, dy: 0 };
let gravity = 0.5;
let jump = -8;

let pipes = [];
let pipeGap = 120;
let pipeWidth = 50;
let pipeSpeed = 2;
let score = 0;

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
  ctx.fillStyle = "#ff5733"; // Placeholder for bird color
  ctx.fillRect(bird.x, bird.y, bird.size, bird.size);
}

// Draw pipes
function drawPipes() {
  ctx.fillStyle = "#2e8b57"; // Placeholder for pipes
  pipes.forEach((pipe) => {
    ctx.fillRect(pipe.x, pipe.y, pipe.width, pipe.height);
  });
}

// Update game
function update() {
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
      resetGame(); // Restart on collision
    }
  }

  // Ground or ceiling collision
  if (bird.y + bird.size > canvas.height || bird.y < 0) {
    resetGame();
  }
}

// Reset game
function resetGame() {
  bird.y = 300;
  bird.dy = 0;
  pipes = [];
  score = 0;
}

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBird();
  drawPipes();
  update();

  // Display score
  ctx.fillStyle = "#000";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);

  requestAnimationFrame(gameLoop);
}

// Control bird
canvas.addEventListener("click", () => {
  bird.dy = jump;
});

// Start game
createPipe();
gameLoop();

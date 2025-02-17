const canvas = document.getElementById('game');
const context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleWidth = 18,
  paddleHeight = 120,
  paddleSpeed = 8,
  ballRadius = 12,
  initialBallSpeed = 8,
  maxBallSpeed = 40,
  netWidth = 5,
  netColor = 'WHITE';

// Draw net on the canvas
function drawNet() {
  for (let i = 0; i < canvas.height; i += 15) {
    drawRect(canvas.width / 2 - netWidth / 2, i, netWidth, 10, netColor);
  }
}

// Draw Rectangle on canvas
function drawRect(x, y, width, height, color) {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
}

// Draw a Circle on canvas
function drawCircle(x, y, radius, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2, false);
  context.closePath();
  context.fill();
}

// Draw text on canvas
function drawText(
  text,
  x,
  y,
  color,
  fontSize = 60,
  fontWeight = 'bold',
  font = 'Courier New'
) {
  context.fillStyle = color;
  context.font = `${fontWeight} ${fontSize}px ${font}`;
  context.textAlign = 'center';
  context.fillText(text, x, y);
}

// Create a paddle object
function createPaddle(x, y, width, height, color) {
  return { x, y, width, height, color, score: 0 };
}

// Create a ball object
function createBall(x, y, radius, velocityX, velocityY, color) {
  return { x, y, radius, velocityX, velocityY, color: 'blue', speed: initialBallSpeed };
}

// Define user and computer paddle objects
const user = createPaddle(
  0,
  canvas.height / 2 - paddleHeight / 2,
  paddleWidth,
  paddleHeight,
  'WHITE'
);

const com = createPaddle(
  canvas.width - paddleWidth,
  canvas.height / 2 - paddleHeight / 2,
  paddleWidth,
  paddleHeight,
  'WHITE'
);

// Define ball object
const ball = createBall(
  canvas.width / 2,
  canvas.height / 2,
  ballRadius,
  initialBallSpeed,
  initialBallSpeed,
  'WHITE'
);

// Update user paddle position based on mouse movement
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(event) {
  user.y = event.clientY - canvas.offsetTop - user.height / 2;
}

// Check for collision between ball and paddle
function collision(b, p) {
  return (
    b.x + b.radius > p.x &&
    b.x - b.radius < p.x + p.width &&
    b.y + b.radius > p.y &&
    b.y - b.radius < p.y + p.height
  );
}

// Reset ball position and velocity
function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = Math.random() * (canvas.height - ballRadius * 2) + ballRadius;
  ball.velocityX = -ball.velocityX;
  ball.speed = initialBallSpeed;
}

// Update game logic
function update() {
  // Check for score and reset ball if necessary
  if (ball.x - ball.radius < 0) {
    com.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }
  
  // Update ball position
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;
  
  // Update the computer paddle position based on the ball
  com.y += (ball.y - (com.y + com.height / 2)) * 0.1;

  // Top and bottom walls
  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
  }

  // Determine which paddle is being hit by the ball and handle collision
  let player = ball.x + ball.radius < canvas.width / 2 ? user : com;
  if (collision(ball, player)) {
    const collidePoint = ball.y - (player.y + player.height / 2);
    const collisionAngle = (Math.PI / 4) * (collidePoint / (player.height / 2));
    const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(collisionAngle);
    ball.velocityY = ball.speed * Math.sin(collisionAngle);

    // Increase ball speed and limit to max speed
    ball.speed += 0.2;
    if (ball.speed > maxBallSpeed) {
      ball.speed = maxBallSpeed;
    }
  }
}

// Render game on canvas
function render() {
  // Clear the canvas
  context.clearRect(0, 0, canvas.width, canvas.height);

  // Draw net
  drawNet();
  
  // Draw Scores
  drawText(user.score, canvas.width / 4, canvas.height / 2, "GREY", 120, 'bold');
  drawText(com.score, (3 * canvas.width) / 4, canvas.height / 2, "GREY", 120, 'bold');

  // Draw paddles and ball
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(com.x, com.y, com.width, com.height, com.color);

  // Draw ball
  drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

// Run the game
function gameLoop() {
  update();
  render();
}

// Set gameLoop to run at 60 FPS
const framePerSecond = 60;
setInterval(gameLoop, 1000 / framePerSecond);

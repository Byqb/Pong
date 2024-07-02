// JavaScript code for Pong game

const game = document.getElementById('game');
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const ball = document.getElementById('ball');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');
const pauseMenu = document.getElementById('pauseMenu');
const continueBtn = document.getElementById('continueBtn');
const restartBtn = document.getElementById('restartBtn');

let score = 0;
let time = 0;
let lives = 3;
let paused = false;

// Initialize paddles and ball positions
let player1Y = 160; // starting position
let player2Y = 160; // starting position
let ballX = 290; // starting position
let ballY = 190; // starting position
let ballSpeedX = 2;
let ballSpeedY = 2;

function gameLoop() {
    if (!paused) {
        // Update game state
        updatePaddles();
        updateBall();
        checkCollisions();
        updateScoreboard();

        // Check game over condition (e.g., lives === 0 or time runs out)

        // Update timer
        timerDisplay.textContent = `Time: ${time}`;
        time++;

        // Update score
        scoreDisplay.textContent = `Score: ${score}`;

        // Update lives
        livesDisplay.textContent = `Lives: ${lives}`;

        // Request next frame
        requestAnimationFrame(gameLoop);
    } else {
        // Game is paused, show pause menu
        pauseMenu.classList.remove('hidden');
    }
}

// Start the game loop
gameLoop();

// Keyboard controls
let keys = {};

document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

function updatePaddles() {
    const paddleSpeed = 5;

    if (keys['w']) {
        player1Y = Math.max(player1Y - paddleSpeed, 0);
    }
    if (keys['s']) {
        player1Y = Math.min(player1Y + paddleSpeed, 320);
    }
    if (keys['ArrowUp']) {
        player2Y = Math.max(player2Y - paddleSpeed, 0);
    }
    if (keys['ArrowDown']) {
        player2Y = Math.min(player2Y + paddleSpeed, 320);
    }

    player1.style.top = `${player1Y}px`;
    player2.style.top = `${player2Y}px`;
}

function updateBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;
}

function checkCollisions() {
    // Collision with player paddles
    if (ballX <= 20 && ballY >= player1Y && ballY <= player1Y + 80) {
        ballSpeedX = Math.abs(ballSpeedX); // reflect the ball
        score++; // increase score
    }

    if (ballX >= 560 && ballY >= player2Y && ballY <= player2Y + 80) {
        ballSpeedX = -Math.abs(ballSpeedX); // reflect the ball
        score++; // increase score
    }

    // Collision with top and bottom walls
    if (ballY <= 0 || ballY >= 380) {
        ballSpeedY = -ballSpeedY; // reverse Y direction
    }

    // Collision with left and right walls (scoring points)
    if (ballX <= 0) {
        ballX = 290; // reset ball position
        ballY = 190;
        ballSpeedX = 2; // reset ball speed
        ballSpeedY = 2;
        lives--; // lose a life
        if (lives === 0) {
            // Game over logic
            // Implement your game over logic here
            pauseGame();
        }
    }

    if (ballX >= 600) {
        ballX = 290; // reset ball position
        ballY = 190;
        ballSpeedX = -2; // reset ball speed
        ballSpeedY = 2;
        lives--; // lose a life
        if (lives === 0) {
            // Game over logic
            // Implement your game over logic here
            pauseGame();
        }
    }
}

function updateScoreboard() {
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
}

function pauseGame() {
    paused = true;
    pauseMenu.classList.remove('hidden');
}

continueBtn.addEventListener('click', () => {
    paused = false;
    pauseMenu.classList.add('hidden');
    gameLoop();
});

restartBtn.addEventListener('click', () => {
    score = 0;
    time = 0;
    lives = 3;
    paused = false;
    pauseMenu.classList.add('hidden');
    gameLoop();
});

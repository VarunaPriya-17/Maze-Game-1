// Store 15 mazes for each difficulty level
const lowLevels = [
    [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 0, 1, 1, 0, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // Add 14 more low-level mazes
  ];
  
  const mediumLevels = [
    [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 0, 1, 1, 1, 1, 0, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // Add 14 more medium-level mazes
  ];
  
  const highLevels = [
    [
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 1, 0, 1, 0, 0, 0, 1],
      [1, 1, 0, 1, 0, 1, 0, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
      [1, 1, 1, 1, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
      [1, 0, 0, 0, 0, 1, 1, 1, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    // Add 14 more high-level mazes
  ];
  
  // Game state variables
  let currentMaze = [];
  let currentLevel = 0;
  let moveCount = 0;
  let difficulty = '';
  let highScore = localStorage.getItem('highScore') || 0;
  
  // Game UI elements
  const canvas = document.getElementById('mazeCanvas');
  const ctx = canvas.getContext('2d');
  const tileSize = 40;
  
  // Menu and game containers
  const menu = document.querySelector('.menu');
  const gameContainer = document.querySelector('.game-container');
  
  // Start the game based on difficulty and level
  function startGame(levels, levelIndex) {
    menu.style.display = 'none';
    gameContainer.style.display = 'flex';
    currentMaze = levels[levelIndex];
    moveCount = 0;
    document.getElementById('moveCount').innerText = moveCount;
    update();
  }
  
  // Event listeners for menu buttons
  document.getElementById('low').addEventListener('click', () => {
    difficulty = 'low';
    startGame(lowLevels, 0);
  });
  
  document.getElementById('medium').addEventListener('click', () => {
    difficulty = 'medium';
    startGame(mediumLevels, 0);
  });
  
  document.getElementById('high').addEventListener('click', () => {
    difficulty = 'high';
    startGame(highLevels, 0);
  });
  
  // Draw the maze and the player
  function drawMaze() {
    for (let row = 0; row < currentMaze.length; row++) {
      for (let col = 0; col < currentMaze[row].length; col++) {
        ctx.fillStyle = currentMaze[row][col] === 1 ? 'black' : 'white';
        if (row === 1 && col === 1) ctx.fillStyle = 'blue'; // Start point
        if (row === 7 && col === 8) ctx.fillStyle = 'red'; // End point
        ctx.fillRect(col * tileSize, row * tileSize, tileSize, tileSize);
      }
    }
  }
  
  let player = { x: 1, y: 1 };
  
  // Handle player movement
  document.addEventListener('keydown', (e) => {
    let newX = player.x;
    let newY = player.y;
  
    if (e.key === 'ArrowUp') newY--;
    if (e.key === 'ArrowDown') newY++;
    if (e.key === 'ArrowLeft') newX--;
    if (e.key === 'ArrowRight') newX++;
  
    if (currentMaze[newY][newX] === 0) {
      player.x = newX;
      player.y = newY;
      moveCount++;
      document.getElementById('moveCount').innerText = moveCount;
      checkWin();
    }
    update();
  });
  
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    ctx.fillStyle = 'grey';
    ctx.fillRect(player.x * tileSize, player.y * tileSize, tileSize, tileSize);
  }
  
  // Check if the player won the level
  function checkWin() {
    if (player.x === 8 && player.y === 7) {
      alert(`You won in ${moveCount} moves!`);
      if (moveCount < highScore || highScore == 0) {
        highScore = moveCount;
        localStorage.setItem('highScore', highScore);
        document.getElementById('highScore').innerText = highScore;
      }
      currentLevel++;
      if (currentLevel < 15) {
        startGame(
          difficulty === 'low' ? lowLevels : difficulty === 'medium' ? mediumLevels : highLevels,
          currentLevel
        );
      } else {
        alert('You completed all levels!');
        resetGame();
      }
    }
  }
  
  // Reset the game back to the main menu
  function resetGame() {
    menu.style.display = 'flex';
    gameContainer.style.display = 'none';
    player = { x: 1, y: 1 };
    moveCount = 0;
    currentLevel = 0;
  }
  

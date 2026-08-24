// =============================
// START SCREEN
// =============================

const startGameButton = document.getElementById("start-game-button");

function startGame() {
  const gameState = createGameState();

  saveGameState(gameState);

  window.location.href = "character_sets.html";
}

startGameButton.addEventListener("click", startGame);

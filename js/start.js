// =============================
// START SCREEN
// =============================

const startGameButton = document.getElementById("start-game-button");

const playerNameModal = document.getElementById("player-name-modal");

const closePlayerNameButton = document.getElementById(
  "close-player-name-button",
);

const playerNameForm = document.getElementById("player-name-form");

const player1NameInput = document.getElementById("player1-name");

const player2NameInput = document.getElementById("player2-name");


// =============================
// OPEN NAME WINDOW
// =============================

function openPlayerNameModal() {
  playerNameModal.classList.remove("hidden");

  player1NameInput.focus();
}

startGameButton.addEventListener("click", openPlayerNameModal);


// =============================
// CLOSE NAME WINDOW
// =============================

function closePlayerNameModal() {
  playerNameModal.classList.add("hidden");
}

closePlayerNameButton.addEventListener("click", closePlayerNameModal);

playerNameModal.addEventListener("click", function (event) {
  if (event.target === playerNameModal) {
    closePlayerNameModal();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closePlayerNameModal();
  }
});


// =============================
// CONTINUE TO CHARACTER SETS
// =============================

playerNameForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const gameState = createGameState();

  const player1Name = player1NameInput.value.trim();
  const player2Name = player2NameInput.value.trim();

  gameState.player1Name =
    player1Name === "" ? "Player 1" : player1Name;

  gameState.player2Name =
    player2Name === "" ? "Player 2" : player2Name;

  saveGameState(gameState);

  window.location.href = "character_sets.html";
});
// =============================
// START SCREEN
// =============================

const startGameButton = document.getElementById("start-game-button");

const singlePlayerButton = document.getElementById(
  "single-player-button"
);

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

// =============================
// SINGLE PLAYER
// =============================

// =============================
// SINGLE PLAYER
// =============================

function startSinglePlayer() {
  const gameState = createGameState();

  gameState.gameMode = "single-player";
  gameState.player1Name = "Player";
  gameState.characterSetId = "disney";
  gameState.questionsLeft = 8;

  // Disney-Set holen
  const disneySet = getCharacterSet("disney");

  // Sicherheitscheck
  if (disneySet === null || disneySet.characters.length === 0) {
    console.error("Disney character set could not be loaded.");
    return;
  }

  // Zufälligen Disney-Charakter auswählen
  const randomIndex = Math.floor(
    Math.random() * disneySet.characters.length
  );

  const computerCharacter = disneySet.characters[randomIndex];

  // Geheime Figur des Computers speichern
  gameState.player2Secret = computerCharacter;

  gameState.phase = "game";

  saveGameState(gameState);

  window.location.href = "single_player.html";
}

singlePlayerButton.addEventListener(
  "click",
  startSinglePlayer
);

singlePlayerButton.addEventListener("click", startSinglePlayer);
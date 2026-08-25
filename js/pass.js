// =============================
// DOM ELEMENTS
// =============================

const passPlayerName = document.getElementById("pass-player-name");

const continueButton = document.getElementById("continue-button");

const continueToBoardButton = document.getElementById(
  "continue-to-board-button",
);

// =============================
// GAME STATE
// =============================

const gameState = loadGameState();

// =============================
// PASS SCREEN
// =============================

function showPassMessage() {
  // currentPlayer ist der Spieler, der als Nächstes dran ist
  passPlayerName.textContent = getPlayerName(gameState.currentPlayer);
}

// Solange der zweite Spieler seinen geheimen Charakter noch nicht
// gewählt hat, geht es zur Charakter-Wahl und nicht zum Board
function goesToSelection() {
  return gameState.player2Secret === null;
}

function showContinueButton() {
  if (goesToSelection()) {
    continueButton.classList.remove("hidden");

    continueButton.addEventListener("click", continueToSelection);
  } else {
    continueToBoardButton.classList.remove("hidden");

    continueToBoardButton.addEventListener("click", continueToBoard);
  }
}

function continueToSelection() {
  gameState.phase = "selection";

  saveGameState(gameState);

  window.location.href = "character_selection.html";
}

function continueToBoard() {
  gameState.phase = "game";

  saveGameState(gameState);

  window.location.href = "game.html";
}

// =============================
// PAGE SETUP
// =============================

if (gameState === null) {
  // Ohne laufendes Spiel zurück zur Modus-Auswahl
  window.location.replace("index.html");
} else if (gameState.gameMode === "single-player") {
  // Im Single-Player wird das Gerät nie übergeben
  window.location.replace("single_player.html");
} else if (gameState.phase !== "pass") {
  // Der Pass-Screen ist gerade nicht dran
  if (gameState.phase === "game") {
    window.location.replace("game.html");
  } else {
    window.location.replace("character_selection.html");
  }
} else {
  showPassMessage();

  showContinueButton();
}

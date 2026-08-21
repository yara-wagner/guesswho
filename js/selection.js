// =============================
// DOM ELEMENTS
// =============================

const selectionGrid = document.getElementById("selection-grid");

const selectionTitle = document.getElementById("selection-title");

// =============================
// GAME STATE
// =============================

const gameState = loadGameState();

// =============================
// SECRET CHARACTER SELECTION
// =============================

function renderSelectionCharacters() {
  selectionGrid.innerHTML = "";

  characters.forEach((character) => {
    selectionGrid.appendChild(
      createCharacterCard(character, selectSecretCharacter),
    );
  });
}

function showSelectionScreen() {
  selectionTitle.textContent = `${getPlayerName(gameState.currentPlayer)}: Choose your character`;

  renderSelectionCharacters();
}

function selectSecretCharacter(character) {
  if (gameState.currentPlayer === 1) {
    gameState.player1Secret = character;

    gameState.currentPlayer = 2;
  } else {
    gameState.player2Secret = character;

    gameState.currentPlayer = 1;
  }

  gameState.phase = "pass";

  saveGameState(gameState);

  window.location.href = "pass.html";
}

// =============================
// PAGE SETUP
// =============================

if (gameState === null) {
  // Ohne laufendes Spiel zurück zur Modus-Auswahl
  window.location.replace("index.html");
} else if (gameState.phase === "pass") {
  window.location.replace("pass.html");
} else if (gameState.player2Secret !== null) {
  // Beide Charaktere sind gewählt (das Spiel läuft bereits)
  window.location.replace("game.html");
} else {
  showSelectionScreen();
}

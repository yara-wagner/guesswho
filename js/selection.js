// =============================
// DOM ELEMENTS
// =============================

const selectionGrid = document.getElementById("selection-grid");

const selectionTitle = document.getElementById("selection-title");

const selectionHint = document.getElementById("selection-hint");

const confirmSelectionButton = document.getElementById(
  "confirm-selection-button",
);

// =============================
// GAME STATE
// =============================

const gameState = loadGameState();

// =============================
// SECRET CHARACTER SELECTION
// =============================

// Der angetippte Charakter. Er wird erst mit dem Bestätigen-Button
// übernommen, vorher kann die Auswahl beliebig geändert werden.
let selectedCharacter = null;

function renderSelectionCharacters() {
  selectionGrid.innerHTML = "";

  getSetCharacters(gameState).forEach((character) => {
    const card = createCharacterCard(character, selectCharacter);

    if (selectedCharacter !== null && selectedCharacter.id === character.id) {
      card.classList.add("selected");
    }

    selectionGrid.appendChild(card);
  });
}

function showSelectionScreen() {
  selectionTitle.textContent = `${getPlayerName(gameState.currentPlayer)}: Choose your character`;

  renderSelectionCharacters();

  updateConfirmButton();
}

function selectCharacter(character) {
  selectedCharacter = character;

  renderSelectionCharacters();

  updateConfirmButton();
}

function updateConfirmButton() {
  if (selectedCharacter === null) {
    selectionHint.textContent = "Tap a character to choose it.";
  } else {
    selectionHint.textContent = `Selected: ${selectedCharacter.name}`;
  }

  confirmSelectionButton.disabled = selectedCharacter === null;
}

// =============================
// CONFIRM SELECTION
// =============================

function confirmSelection() {
  if (selectedCharacter === null) {
    return;
  }

  if (gameState.currentPlayer === 1) {
    gameState.player1Secret = selectedCharacter;

    gameState.currentPlayer = 2;
  } else {
    gameState.player2Secret = selectedCharacter;

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
} else if (getCharacterSet(gameState.characterSetId) === null) {
  // Es fehlt noch ein Charakter-Set
  window.location.replace("character_sets.html");
} else if (gameState.phase === "pass") {
  window.location.replace("pass.html");
} else if (gameState.player2Secret !== null) {
  // Beide Charaktere sind gewählt (das Spiel läuft bereits)
  window.location.replace("game.html");
} else {
  confirmSelectionButton.addEventListener("click", confirmSelection);

  showSelectionScreen();
}

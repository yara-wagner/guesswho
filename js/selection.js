// =============================
// DOM ELEMENTS
// =============================

const selectionGrid = document.getElementById("selection-grid");

const selectionTitle = document.getElementById("selection-title");

const selectionHint = document.getElementById("selection-hint");

const confirmSelectionButton = document.getElementById(
  "confirm-selection-button",
);

const randomSelectionButton = document.getElementById(
  "random-selection-button",
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

// Würfelt einen Charakter aus. Die Auswahl landet wie ein Antippen nur in
// selectedCharacter und muss noch bestätigt werden.
function selectRandomCharacter() {
  const characters = getSetCharacters(gameState);

  if (characters.length === 0) {
    return;
  }

  const randomIndex = Math.floor(Math.random() * characters.length);

  selectCharacter(characters[randomIndex]);

  scrollToSelectedCard();
}

// Der ausgewürfelte Charakter kann ausserhalb des sichtbaren Bereichs
// liegen, darum scrollen wir ihn in die Mitte
function scrollToSelectedCard() {
  const card = selectionGrid.querySelector(".character-card.selected");

  if (card === null) {
    return;
  }

  card.scrollIntoView({ behavior: "smooth", block: "center" });
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
} else if (gameState.gameMode === "single-player") {
  // Im Single-Player wählt niemand einen geheimen Charakter aus
  window.location.replace("single_player.html");
} else if (gameState.phase === "pass") {
  window.location.replace("pass.html");
} else if (gameState.player2Secret !== null) {
  // Beide Charaktere sind gewählt (das Spiel läuft bereits)
  window.location.replace("game.html");
} else {
  randomSelectionButton.addEventListener("click", selectRandomCharacter);

  confirmSelectionButton.addEventListener("click", confirmSelection);

  showSelectionScreen();
}
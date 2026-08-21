// =============================
// DOM ELEMENTS
// =============================

const characterGrid = document.getElementById("character-grid");

const remainingCounter = document.getElementById("remaining-counter");

const currentPlayerTitle = document.getElementById("current-player-title");

const resetButton = document.getElementById("reset-button");

const endTurnButton = document.getElementById("end-turn-button");

// =============================
// GAME STATE
// =============================

const gameState = loadGameState();

// =============================
// CREATE CHARACTER CARDS
// =============================

function renderCharacters() {
  characterGrid.innerHTML = "";

  const eliminatedCharacters = getEliminatedCharacters(gameState);

  characters.forEach((character) => {
    const card = createCharacterCard(character, () => {
      toggleCharacter(character.id);
    });

    if (eliminatedCharacters.includes(character.id)) {
      card.classList.add("eliminated");
    }

    characterGrid.appendChild(card);
  });

  updateCounter();
}

// =============================
// ELIMINATE / RESTORE CHARACTER
// =============================

function toggleCharacter(characterId) {
  const eliminatedCharacters = getEliminatedCharacters(gameState);

  const index = eliminatedCharacters.indexOf(characterId);

  if (index === -1) {
    eliminatedCharacters.push(characterId);
  } else {
    eliminatedCharacters.splice(index, 1);
  }

  saveGameState(gameState);

  renderCharacters();
}

// =============================
// UPDATE COUNTER
// =============================

function updateCounter() {
  const eliminatedCharacters = getEliminatedCharacters(gameState);

  const remaining = characters.length - eliminatedCharacters.length;

  remainingCounter.textContent = `Remaining: ${remaining}`;
}

// =============================
// RESET BOARD
// =============================

function resetGame() {
  setEliminatedCharacters(gameState, []);

  saveGameState(gameState);

  renderCharacters();
}

// =============================
// START TURN
// =============================

function startTurn() {
  currentPlayerTitle.textContent = getPlayerName(gameState.currentPlayer);

  renderCharacters();
}

// =============================
// END TURN
// =============================

function endTurn() {
  if (gameState.currentPlayer === 1) {
    gameState.currentPlayer = 2;
  } else {
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
  // Das Gerät wird gerade übergeben
  window.location.replace("pass.html");
} else if (
  gameState.player1Secret === null ||
  gameState.player2Secret === null
) {
  // Es fehlt noch ein Charakter
  window.location.replace("character_selection.html");
} else {
  resetButton.addEventListener("click", resetGame);

  endTurnButton.addEventListener("click", endTurn);

  startTurn();
}

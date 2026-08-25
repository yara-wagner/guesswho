// =============================
// DOM ELEMENTS
// =============================

const characterGrid = document.getElementById("character-grid");

const remainingCounter = document.getElementById("remaining-counter");

const currentPlayerTitle = document.getElementById("current-player-title");

const resetButton = document.getElementById("reset-button");

const endTurnButton = document.getElementById("end-turn-button");

const winOverlay = document.getElementById("win-overlay");

const winTitle = document.getElementById("win-title");

const winText = document.getElementById("win-text");

const winCharacterImage = document.getElementById("win-character-image");

const winConfetti = document.getElementById("win-confetti");

const newGameButton = document.getElementById("new-game-button");

const homeButton = document.getElementById("home-button");

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

  getSetCharacters(gameState).forEach((character) => {
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
  if (gameState.phase === "finished") {
    // Das Spiel ist vorbei, das Board ist nur noch Anzeige
    return;
  }

  const eliminatedCharacters = getEliminatedCharacters(gameState);

  const index = eliminatedCharacters.indexOf(characterId);

  if (index === -1) {
    eliminatedCharacters.push(characterId);
  } else {
    eliminatedCharacters.splice(index, 1);
  }

  saveGameState(gameState);

  renderCharacters();

  checkForWin();
}

// =============================
// WIN CONDITION
// =============================

// Die Charaktere, die der aktuelle Spieler noch nicht ausgeschlossen hat
function getRemainingCharacters() {
  const eliminatedCharacters = getEliminatedCharacters(gameState);

  return getSetCharacters(gameState).filter(
    (character) => eliminatedCharacters.includes(character.id) === false,
  );
}

// Gewonnen hat, wer alle Charaktere ausser dem geheimen Charakter
// des Gegenspielers ausgeschlossen hat
function hasCurrentPlayerWon() {
  const remaining = getRemainingCharacters();

  if (remaining.length !== 1) {
    return false;
  }

  const secret = getOpponentSecret(gameState);

  if (secret === null) {
    return false;
  }

  return remaining[0].id === secret.id;
}

function checkForWin() {
  if (hasCurrentPlayerWon() === false) {
    return;
  }

  gameState.winner = gameState.currentPlayer;

  gameState.phase = "finished";

  saveGameState(gameState);

  showWinDialog();
}

function showWinDialog() {
  const winner = gameState.winner;

  let loser = 1;

  let secret = gameState.player1Secret;

  if (winner === 1) {
    loser = 2;

    secret = gameState.player2Secret;
  }

  winTitle.textContent = `${getPlayerName(winner)} wins!`;

  winText.textContent = `Congratulations! You found the character of ${getPlayerName(loser)}: ${secret.name}`;

  winCharacterImage.src = secret.image;
  winCharacterImage.alt = secret.name;

  winOverlay.classList.remove("hidden");

  playConfetti();
}

function playConfetti() {
  // Die Web-Component wird als Modul geladen und ist eventuell noch nicht
  // bereit – dann startet sie über das autoplay-Attribut, sobald sie da ist
  if (winConfetti.dotLottie) {
    winConfetti.dotLottie.setFrame(0);

    winConfetti.dotLottie.play();
  } else {
    winConfetti.setAttribute("autoplay", "");
  }
}

// =============================
// NEW GAME / BACK TO START
// =============================

function startNewGame() {
  saveGameState(createGameState());

  window.location.href = "character_sets.html";
}

function goToStart() {
  clearGameState();

  window.location.href = "index.html";
}

// =============================
// UPDATE COUNTER
// =============================

function updateCounter() {
  const eliminatedCharacters = getEliminatedCharacters(gameState);

  const remaining =
    getSetCharacters(gameState).length - eliminatedCharacters.length;

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
} else if (getCharacterSet(gameState.characterSetId) === null) {
  // Es fehlt noch ein Charakter-Set
  window.location.replace("character_sets.html");
} else if (gameState.phase === "finished") {
  // Das Spiel ist entschieden – Board anzeigen und gratulieren
  newGameButton.addEventListener("click", startNewGame);

  homeButton.addEventListener("click", goToStart);

  startTurn();

  showWinDialog();
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

  newGameButton.addEventListener("click", startNewGame);

  homeButton.addEventListener("click", goToStart);

  startTurn();
}

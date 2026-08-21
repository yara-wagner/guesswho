// =============================
// GAME STATE
// =============================

// Der Spielstand muss die Seitenwechsel zwischen index.html,
// character_selection.html und game.html überleben und wird deshalb
// in der sessionStorage abgelegt.

const STORAGE_KEY = "guessWhoGameState";

function createGameState() {
  return {
    currentPlayer: 1,

    player1Secret: null,
    player2Secret: null,

    player1Eliminated: [],
    player2Eliminated: [],

    // "selection" | "pass" | "game" – bestimmt, welcher Screen
    // beim Laden einer Seite angezeigt wird
    phase: "selection",
  };
}

// Aktuell haben die Spieler keine eigenen Namen
function getPlayerName(playerNumber) {
  return `Player ${playerNumber}`;
}

function saveGameState(state) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadGameState() {
  const stored = sessionStorage.getItem(STORAGE_KEY);

  if (stored === null) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (error) {
    return null;
  }
}

// =============================
// ELIMINATED CHARACTERS
// =============================

function getEliminatedCharacters(state) {
  if (state.currentPlayer === 1) {
    return state.player1Eliminated;
  }

  return state.player2Eliminated;
}

function setEliminatedCharacters(state, eliminatedCharacters) {
  if (state.currentPlayer === 1) {
    state.player1Eliminated = eliminatedCharacters;
  } else {
    state.player2Eliminated = eliminatedCharacters;
  }
}

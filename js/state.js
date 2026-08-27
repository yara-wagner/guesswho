// =============================
// GAME STATE
// =============================

// Der Spielstand muss die Seitenwechsel zwischen start.html,
// character_sets.html, character_selection.html und game.html überleben
// und wird deshalb in der sessionStorage abgelegt.
//
// Die Spielseiten laufen in einem Rahmen innerhalb von index.html (siehe
// dort). Ein Rahmen derselben Herkunft teilt sich die sessionStorage mit
// der Seite darüber – für diese Datei ändert das nichts.

const STORAGE_KEY = "guessWhoGameState";

function createGameState() {
  return {
    currentPlayer: 1,

    gameMode: "multi-player",

    questionsLeft: 8,

    player1Name: "Player One",
    player2Name: "Player Two",

    characterSetId: null,

    customCharacters: [],

    // Die ausgewürfelten Charaktere des Mix-Sets (siehe characters.js)
    mixCharacters: [],

    player1Secret: null,
    player2Secret: null,

    player1Eliminated: [],
    player2Eliminated: [],

    phase: "set-selection",

    winner: null,

    // Warum der Single Player verloren hat: "no-questions" oder "wrong-guess"
    lossReason: null,

    // Der Charakter, auf den der Single Player beim Final Guess getippt hat
    finalGuess: null,
  };
}

function getPlayerName(playerNumber) {
  const state = loadGameState();

  if (state === null) {
    return `Player ${playerNumber}`;
  }

  if (playerNumber === 1) {
    return state.player1Name || "Player One";
  }

  return state.player2Name || "Player Two";
}

function saveGameState(state) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function clearGameState() {
  sessionStorage.removeItem(STORAGE_KEY);
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
// SECRET CHARACTERS
// =============================

// Der geheime Charakter des Gegenspielers – also der Charakter,
// den der aktuelle Spieler erraten muss
function getOpponentSecret(state) {
  if (state.currentPlayer === 1) {
    return state.player2Secret;
  }

  return state.player1Secret;
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

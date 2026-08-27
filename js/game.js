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

const finalGuessButton = document.getElementById("final-guess-button");

let finalGuessMode = false;

// Die zuletzt angeklickte Karte. Nur sie animiert ihr Kreuz ein – das
// Board wird bei jedem Klick komplett neu gezeichnet, sonst würden alle
// bereits ausgeschlossenen Karten jedes Mal mitwackeln.
let lastToggledId = null;

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
    const card = createCharacterCard(character, function () {
      const eliminatedCharacters = getEliminatedCharacters(gameState);

      if (finalGuessMode === true) {
        if (eliminatedCharacters.includes(character.id)) {
          return;
        }

        makeFinalGuess(character);

        return;
      }

      toggleCharacter(character.id);
    });

    if (eliminatedCharacters.includes(character.id)) {
      card.classList.add("eliminated");

      if (character.id === lastToggledId) {
        card.classList.add("just-eliminated");
      }
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

  lastToggledId = characterId;

  saveGameState(gameState);

  renderCharacters();
}

function showWinDialog() {
  // Geraten hat immer der aktuelle Spieler – der Final Guess wechselt ihn
  // nicht, darum stimmt das auch noch nach einem Neuladen der Seite.
  //
  // Nicht vom Gewinner ausgehen: bei einem falschen Tipp gewinnt der
  // Gegenspieler, aufgedeckt gehört aber trotzdem der Charakter, auf den
  // geraten wurde.
  const guesser = gameState.currentPlayer;

  const guessedPlayer = guesser === 1 ? 2 : 1;

  const secret = getOpponentSecret(gameState);

  winTitle.textContent = `${getPlayerName(gameState.winner)} wins!`;

  if (gameState.winner === guesser) {
    winText.textContent = `Congratulations! You found the character of ${getPlayerName(guessedPlayer)}: ${secret.name}`;
  } else {
    winText.textContent = `${getPlayerName(guesser)} guessed wrong. The character of ${getPlayerName(guessedPlayer)} was: ${secret.name}`;
  }

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
  const newGameState = createGameState();

  // Der Modus und die eingegebenen Namen sollen die neue Runde überleben
  newGameState.gameMode = gameState.gameMode;

  newGameState.player1Name = getPlayerName(1);
  newGameState.player2Name = getPlayerName(2);

  saveGameState(newGameState);

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

  const text = `Remaining: ${remaining}`;

  // Beim ersten Zeichnen steht die Zahl einfach da, danach hüpft sie bei
  // jeder Änderung kurz – so sieht man, dass sich etwas getan hat
  if (remainingCounter.textContent !== text) {
    remainingCounter.textContent = text;

    popCounter(remainingCounter);
  }
}

// Startet die Hüpf-Animation neu. Die Klasse muss zuerst weg und ein
// Layout-Schritt dazwischen liegen, sonst spielt der Browser dieselbe
// Animation beim zweiten Mal nicht noch einmal ab.
function popCounter(element) {
  element.classList.remove("counter-pop");

  void element.offsetWidth;

  element.classList.add("counter-pop");
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
} else if (gameState.gameMode === "single-player") {
  // Der Single-Player hat sein eigenes Board
  window.location.replace("single_player.html");
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

function makeFinalGuess(character) {
  const opponentSecret = getOpponentSecret(gameState);

  if (opponentSecret === null) {
    return;
  }

  const guessedCorrectly = character.id === opponentSecret.id;

  if (guessedCorrectly === true) {
    gameState.winner = gameState.currentPlayer;
  } else {
    gameState.winner = gameState.currentPlayer === 1 ? 2 : 1;
  }

  gameState.phase = "finished";

  saveGameState(gameState);

  finalGuessMode = false;

  showWinDialog();
}

// Nur die Beschriftung wechseln, nicht den ganzen Button-Inhalt – daneben
// steht das Icon (siehe game.html)
//
// Die Farbe bleibt dabei Petrol: Coral ist schon die Farbe der anderen
// Buttons, ein Wechsel dorthin würde den Final Guess nicht mehr von
// "End turn" unterscheiden. Im Rate-Modus wird der Button nur dunkler
// (siehe .accent-2.is-active in css/style.css).
const finalGuessLabel = finalGuessButton.querySelector(".button-label");

finalGuessButton.addEventListener("click", function () {
  finalGuessMode = !finalGuessMode;

  if (finalGuessMode === true) {
    finalGuessLabel.textContent = "Cancel guess";
  } else {
    finalGuessLabel.textContent = "Final Guess";
  }

  finalGuessButton.classList.toggle("is-active", finalGuessMode);
});

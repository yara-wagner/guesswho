// =============================
// SINGLE PLAYER RESULT
// =============================

const resultIcon =
  document.getElementById(
    "result-icon"
  );

const resultTitle =
  document.getElementById(
    "result-title"
  );

const resultMessage =
  document.getElementById(
    "result-message"
  );

const resultFooter =
  document.getElementById(
    "result-footer"
  );

const resultCharacterImage =
  document.getElementById(
    "result-character-image"
  );

const resultCharacterName =
  document.getElementById(
    "result-character-name"
  );

const playAgainButton =
  document.getElementById(
    "play-again-button"
  );

const gameState = loadGameState();


// =============================
// RESULT TEXTS
// =============================

// Verloren wird auf zwei Wegen: Die Fragen sind aufgebraucht oder der
// Final Guess war falsch. Beides landet auf dieser Seite.
function showWrongGuessTexts(state) {
  resultIcon.textContent = "🙊";

  resultTitle.textContent =
    "Not quite!";

  if (
    state.finalGuess === null ||
    state.finalGuess === undefined
  ) {
    resultMessage.textContent =
      "Your final guess was wrong.";
  } else {
    resultMessage.textContent =
      `Your final guess was ${state.finalGuess.name} – that was not the right character.`;
  }

  resultFooter.textContent =
    "Better luck next time!";
}

function showOutOfQuestionsTexts() {
  resultIcon.textContent = "🙈";

  resultTitle.textContent = "Oh no!";

  resultMessage.textContent =
    "You ran out of questions.";

  resultFooter.textContent =
    "Better luck next time!";
}

function showResultTexts(state) {
  if (
    state.lossReason === "wrong-guess"
  ) {
    showWrongGuessTexts(state);
  } else {
    showOutOfQuestionsTexts();
  }
}


// =============================
// SHOW SECRET CHARACTER
// =============================

if (
  gameState === null ||
  gameState.gameMode !== "single-player" ||
  gameState.player2Secret === null
) {
  window.location.replace("index.html");
} else {
  showResultTexts(gameState);

  const secretCharacter =
    gameState.player2Secret;

  resultCharacterImage.src =
    secretCharacter.image;

  resultCharacterImage.alt =
    secretCharacter.name;

  resultCharacterName.textContent =
    secretCharacter.name;
}


// =============================
// PLAY AGAIN
// =============================

// Der alte Spielstand muss weg, sonst schicken die Weiterleitungen auf
// character_sets.html die Seite direkt weiter ins schon gespielte Spiel
playAgainButton.addEventListener(
  "click",
  function () {
    const newGameState =
      createGameState();

    newGameState.gameMode =
      "single-player";

    newGameState.player1Name =
      getPlayerName(1);

    saveGameState(newGameState);

    window.location.href =
      "character_sets.html";
  }
);
// =============================
// SINGLE PLAYER RESULT
// =============================

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
// SHOW SECRET CHARACTER
// =============================

if (
  gameState === null ||
  gameState.gameMode !== "single-player" ||
  gameState.player2Secret === null
) {
  window.location.replace("index.html");
} else {
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

playAgainButton.addEventListener(
  "click",
  function () {
    window.location.href =
      "character_sets.html";
  }
);
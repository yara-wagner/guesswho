// =============================
// SINGLE PLAYER WIN
// =============================

const winCharacterImage =
  document.getElementById(
    "win-character-image"
  );

const winCharacterName =
  document.getElementById(
    "win-character-name"
  );

const playAgainButton =
  document.getElementById(
    "play-again-button"
  );

const gameState = loadGameState();


// =============================
// SHOW CHARACTER
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

  winCharacterImage.src =
    secretCharacter.image;

  winCharacterImage.alt =
    secretCharacter.name;

  winCharacterName.textContent =
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
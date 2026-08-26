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
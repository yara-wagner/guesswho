// =============================
// CANCEL GAME
// =============================

// Der Button steckt im Header jeder Spielseite und bringt die
// Spieler zurück zur Modus-Auswahl (index.html).

const cancelGameButton = document.getElementById("cancel-game-button");

function cancelGame() {
  const confirmed = window.confirm(
    "Cancel the game? The current progress will be lost.",
  );

  if (confirmed === false) {
    return;
  }

  clearGameState();

  window.location.href = "index.html";
}

cancelGameButton.addEventListener("click", cancelGame);

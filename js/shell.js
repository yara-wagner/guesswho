// =============================
// SHELL
// =============================

// Läuft nur in der Hülle (siehe index.html), nicht in den Spielseiten.

const gameFrame = document.getElementById("game-frame");

// =============================
// STARTSEITE IM RAHMEN
// =============================

// Welche Seite zum Spielstand passt. Die Hülle lädt beim Öffnen und beim
// Neuladen genau diese – sonst stünde man mitten im Spiel plötzlich wieder
// bei der Modus-Auswahl.
//
// Die Zuordnung muss nicht perfekt sein: Jede Spielseite prüft beim Laden
// selber, ob sie dran ist, und leitet sonst weiter (siehe die
// PAGE-SETUP-Blöcke). Was hier falsch läge, würde die Seite korrigieren.

function getStartPage() {
  const state = loadGameState();

  // Kein Spiel angefangen: Modus wählen
  if (state === null) {
    return "start.html";
  }

  // Im Single-Player gibt es kein Übergeben und kein Aussuchen – dort
  // läuft alles auf einem Board
  const board =
    state.gameMode === "single-player"
      ? "single_player.html"
      : "game.html";

  if (state.phase === "custom-set") {
    return "custom_set.html";
  }

  if (state.phase === "selection") {
    return "character_selection.html";
  }

  if (state.phase === "pass") {
    return "pass.html";
  }

  if (state.phase === "game" || state.phase === "finished") {
    return board;
  }

  // "set-selection" und alles Unbekannte: Ein Spielstand heisst, der
  // Modus ist schon gewählt – es fehlt also noch das Charakter-Set
  return "character_sets.html";
}

gameFrame.src = getStartPage();

// =============================
// VERSEHENTLICH EINGEBETTET
// =============================

// Die Hülle gehört nach ganz oben. Steckt sie selber in einem Rahmen,
// wäre das eine Hülle in der Hülle – dann lieber gleich das Spiel zeigen.
if (window.parent !== window) {
  window.location.replace("start.html");
}

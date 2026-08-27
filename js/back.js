// =============================
// BACK BUTTON
// =============================
//
// Der "← Back"-Button im Header (siehe js/header.js) benutzt bewusst nicht
// window.history.back(). Jede Spielseite prüft beim Laden, ob sie zum
// aktuellen Spielstand passt, und leitet sonst weiter. Ein Schritt zurück in
// der History landet darum meistens auf einer Seite, die sofort wieder nach
// vorne weiterleitet – der Button sieht dann aus, als würde er nichts tun.
//
// Stattdessen geht der Button einen Schritt im Spielablauf zurück: Er nimmt
// den letzten Schritt im Spielstand zurück und öffnet die Seite, die dann
// wieder dran ist. So ist "zurück" immer eindeutig – egal, wie die Spieler
// auf der Seite gelandet sind (Klick, Reload, Lesezeichen).
//
// Während einer laufenden Runde (Pass-Screen, Board) gibt es keinen
// sinnvollen Schritt zurück. Diese Seiten haben deshalb keinen
// Back-Button, sondern nur den "Back to start"-Button (siehe js/leave.js).

function getCurrentPageName() {
  const path = window.location.pathname;

  return path.slice(path.lastIndexOf("/") + 1);
}

// =============================
// EINZELNE SCHRITTE ZURÜCK
// =============================

// Zurück zur Modus-Auswahl. Der halb fertige Spielstand wird weggeräumt –
// auf index.html fängt sowieso ein neues Spiel an.
function goBackToStart() {
  clearGameState();

  window.location.href = "index.html";
}

// Zurück zur Set-Auswahl. Das gewählte Set muss aus dem Spielstand raus,
// sonst schickt character_sets.html die Spieler sofort wieder nach vorne.
function goBackToSetSelection(state) {
  // Beim selbst gebauten Set geht es zurück in den Editor, sonst zur
  // Übersicht mit den Sets
  const wasCustomSet = state.characterSetId === CUSTOM_SET_ID;

  state.characterSetId = null;

  state.customCharacters = [];

  // Beim nächsten Mix wird neu gewürfelt
  state.mixCharacters = [];

  state.phase = wasCustomSet ? "custom-set" : "set-selection";

  saveGameState(state);

  if (wasCustomSet) {
    window.location.href = "custom_set.html";
  } else {
    window.location.href = "character_sets.html";
  }
}

// Auf der Charakter-Wahl des zweiten Spielers heisst "zurück": Die Wahl des
// ersten Spielers wird verworfen und er wählt noch einmal. Sein Charakter
// wird dabei nur gelöscht, nie angezeigt.
function goBackToFirstSelection(state) {
  state.player1Secret = null;

  state.currentPlayer = 1;

  state.phase = "selection";

  saveGameState(state);

  window.location.reload();
}

// =============================
// BACK BUTTON
// =============================

function goBack() {
  const state = loadGameState();

  if (state === null) {
    goBackToStart();

    return;
  }

  const page = getCurrentPageName();

  if (page === "custom_set.html") {
    goBackToSetSelection(state);

    return;
  }

  if (page === "character_selection.html") {
    if (state.player1Secret === null) {
      goBackToSetSelection(state);
    } else {
      goBackToFirstSelection(state);
    }

    return;
  }

  // character_sets.html: Von hier führt der einzige Schritt zurück zur
  // Modus-Auswahl
  goBackToStart();
}
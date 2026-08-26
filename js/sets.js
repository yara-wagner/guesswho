// =============================
// DOM ELEMENTS
// =============================

const setGrid = document.getElementById("set-grid");

// =============================
// GAME STATE
// =============================

const gameState = loadGameState();

// =============================
// CHARACTER SET SELECTION
// =============================

function createSetTile(characterSet) {
  const tile = document.createElement("button");

  tile.classList.add("tile", "set-tile");

  tile.type = "button";

  tile.dataset.setId = characterSet.id;

  const icon = document.createElement("span");

  icon.classList.add("tile-icon");
  icon.textContent = characterSet.icon;

  const name = document.createElement("span");

  name.classList.add("tile-name");
  name.textContent = characterSet.name;

  tile.appendChild(icon);
  tile.appendChild(name);

  

if (characterSet.available === false) {
  tile.disabled = true;

  const badge = document.createElement("span");

  badge.classList.add("tile-badge");
  badge.textContent = "Coming soon";

  tile.appendChild(badge);

} else if (
  (characterSet.custom === true || characterSet.mixed === true) &&
  gameState.gameMode === "single-player"
) {
  tile.disabled = true;

  const badge = document.createElement("span");

  badge.classList.add("tile-badge");
  badge.textContent = "Multi-Player only";

  tile.appendChild(badge);

} else if (characterSet.mixed === true) {
  const meta = document.createElement("span");

  meta.classList.add("set-tile-meta");

  const count = document.createElement("span");

  count.classList.add("set-tile-count");

  count.textContent =
    `${getMixCharacterCount()} characters`;

  const note = document.createElement("span");

  note.classList.add("set-tile-count");
  note.textContent = "Random from all sets";

  meta.appendChild(count);
  meta.appendChild(note);

  tile.appendChild(meta);

  tile.addEventListener("click", function () {
    selectMixSet(characterSet);
  });

} else if (characterSet.custom === true) {
  const badge = document.createElement("span");

  badge.classList.add("set-tile-count");
  badge.textContent = "Create your own set";

  tile.appendChild(badge);

  tile.addEventListener("click", function () {
    createCustomSet();
  });

} else {
  const meta = document.createElement("span");

  meta.classList.add("set-tile-meta");

  const count = document.createElement("span");

  count.classList.add("set-tile-count");

  count.textContent =
    `${characterSet.characters.length} characters`;

  meta.appendChild(count);

  // Im Single-Player spielt man gegen den Computer – dort hilft es zu
  // wissen, wie schwer das Set zu erraten ist
  if (gameState.gameMode === "single-player") {
    const difficultyLabel =
      getDifficultyLabel(characterSet.difficulty);

    if (difficultyLabel !== null) {
      const difficulty = document.createElement("span");

      difficulty.classList.add("set-tile-difficulty");

      difficulty.dataset.difficulty = characterSet.difficulty;

      difficulty.textContent = difficultyLabel;

      meta.appendChild(difficulty);
    }
  }

  tile.appendChild(meta);

  tile.addEventListener("click", function () {
    selectCharacterSet(characterSet);
  });
}

  return tile;
}

function renderCharacterSets() {
  setGrid.innerHTML = "";

  characterSets.forEach((characterSet) => {
    setGrid.appendChild(createSetTile(characterSet));
  });
}

function selectCharacterSet(characterSet) {
  gameState.characterSetId = characterSet.id;

  if (gameState.gameMode === "single-player") {
    const characters = characterSet.characters;

    if (characters.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * characters.length);

    gameState.player2Secret = characters[randomIndex];

    gameState.questionsLeft = 8;

    gameState.phase = "game";

    saveGameState(gameState);

    window.location.href = "single_player.html";

    return;
  }

  // Multi-Player
  gameState.phase = "selection";

  saveGameState(gameState);

  window.location.href = "character_selection.html";
}

// Das Mix-Set hat keine feste Charakter-Liste: Die Charaktere werden hier
// aus den anderen Sets zusammengewürfelt und in den Spielstand geschrieben.
// Für jede Runde wird neu gewürfelt.
function selectMixSet(characterSet) {
  const characters = createMixedCharacters();

  if (characters.length === 0) {
    return;
  }

  gameState.characterSetId = characterSet.id;

  gameState.mixCharacters = characters;

  gameState.phase = "selection";

  saveGameState(gameState);

  window.location.href = "character_selection.html";
}

// Beim Custom-Set fehlen die Charaktere noch – das Set wird erst auf
// custom_set.html zusammengestellt und dort gesetzt
function createCustomSet() {
  gameState.phase = "custom-set";

  saveGameState(gameState);

  window.location.href = "custom_set.html";
}

// =============================
// PAGE SETUP
// =============================

if (gameState === null) {
  // Ohne laufendes Spiel zurück zur Modus-Auswahl
  window.location.replace("index.html");
} else if (gameState.gameMode === "single-player") {
  // Im Single-Player läuft alles auf single_player.html – dort ist auch das
  // Set schon gewählt
  if (getCharacterSet(gameState.characterSetId) !== null) {
    window.location.replace("single_player.html");
  } else {
    renderCharacterSets();
  }
} else if (getCharacterSet(gameState.characterSetId) !== null) {
  // Das Set ist bereits gewählt (das Spiel läuft schon)
  window.location.replace("character_selection.html");
} else {
  renderCharacterSets();
}

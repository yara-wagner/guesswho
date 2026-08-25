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

  if (
  gameState.gameMode === "single-player" &&
  characterSet.id === "mario"
) {
  tile.disabled = true;

  const badge = document.createElement("span");

  badge.classList.add("tile-badge");
  badge.textContent = "Coming soon";

  tile.appendChild(badge);

  return tile;
}

  if (characterSet.available === false) {
    tile.disabled = true;

    const badge = document.createElement("span");

    badge.classList.add("tile-badge");
    badge.textContent = "Coming soon";

    tile.appendChild(badge);
  } else if (
  characterSet.custom === true &&
  gameState.gameMode === "single-player"
) {
  tile.disabled = true;

  const badge = document.createElement("span");

  badge.classList.add("tile-badge");
  badge.textContent = "Multi-Player only";

  tile.appendChild(badge);
} else if (characterSet.custom === true) {
  } else {
    const count = document.createElement("span");

    count.classList.add("set-tile-count");
    count.textContent = `${characterSet.characters.length} characters`;

    tile.appendChild(count);

    tile.addEventListener("click", () => {
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
} else if (getCharacterSet(gameState.characterSetId) !== null) {
  // Das Set ist bereits gewählt (das Spiel läuft schon)
  window.location.replace("character_selection.html");
} else {
  renderCharacterSets();
}

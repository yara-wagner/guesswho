// =============================
// CHARACTER DATA
// =============================

const characters = [
  {
    id: 1,
    name: "Alex",
    image: "https://i.pravatar.cc/300?img=11",
  },

  {
    id: 2,
    name: "Anna",
    image: "https://i.pravatar.cc/300?img=32",
  },

  {
    id: 3,
    name: "Ben",
    image: "https://i.pravatar.cc/300?img=12",
  },

  {
    id: 4,
    name: "Clara",
    image: "https://i.pravatar.cc/300?img=47",
  },

  {
    id: 5,
    name: "David",
    image: "https://i.pravatar.cc/300?img=13",
  },

  {
    id: 6,
    name: "Emma",
    image: "https://i.pravatar.cc/300?img=45",
  },

  {
    id: 7,
    name: "Felix",
    image: "https://i.pravatar.cc/300?img=15",
  },

  {
    id: 8,
    name: "Grace",
    image: "https://i.pravatar.cc/300?img=44",
  },

  {
    id: 9,
    name: "Henry",
    image: "https://i.pravatar.cc/300?img=14",
  },

  {
    id: 10,
    name: "Isabella",
    image: "https://i.pravatar.cc/300?img=49",
  },

  {
    id: 11,
    name: "Jack",
    image: "https://i.pravatar.cc/300?img=16",
  },

  {
    id: 12,
    name: "Julia",
    image: "https://i.pravatar.cc/300?img=48",
  },
];

// =============================
// GAME STATE
// =============================

const gameState = {
  currentPlayer: 1,

  player1Secret: null,
  player2Secret: null,

  player1Eliminated: [],
  player2Eliminated: [],
};

// =============================
// DOM ELEMENTS
// =============================

const characterGrid = document.getElementById("character-grid");

const resetButton = document.getElementById("reset-button");

const remainingCounter = document.getElementById("remaining-counter");

const startScreen = document.getElementById("start-screen");

const selectionScreen = document.getElementById("selection-screen");

const passScreen = document.getElementById("pass-screen");

const gameScreen = document.getElementById("game-screen");

const startGameButton = document.getElementById("start-game-button");

const continueButton = document.getElementById("continue-button");

const endTurnButton = document.getElementById("end-turn-button");

const selectionGrid = document.getElementById("selection-grid");

const selectionTitle = document.getElementById("selection-title");

const passTitle = document.getElementById("pass-title");

const currentPlayerTitle = document.getElementById("current-player-title");

// =============================
// SCREEN MANAGEMENT
// =============================

function showScreen(screen) {
  startScreen.classList.add("hidden");
  selectionScreen.classList.add("hidden");
  passScreen.classList.add("hidden");
  gameScreen.classList.add("hidden");

  screen.classList.remove("hidden");
}

// =============================
// START GAME
// =============================

function startGame() {
  gameState.currentPlayer = 1;

  gameState.player1Secret = null;
  gameState.player2Secret = null;

  gameState.player1Eliminated = [];
  gameState.player2Eliminated = [];

  selectionTitle.textContent = "Player 1: Choose your character";

  renderSelectionCharacters();

  showScreen(selectionScreen);
}

// =============================
// SECRET CHARACTER SELECTION
// =============================

function renderSelectionCharacters() {
  selectionGrid.innerHTML = "";

  characters.forEach((character) => {
    const card = document.createElement("div");

    card.classList.add("character-card");

    const image = document.createElement("img");

    image.src = character.image;
    image.alt = character.name;

    const name = document.createElement("div");

    name.classList.add("character-name");
    name.textContent = character.name;

    card.appendChild(image);
    card.appendChild(name);

    card.addEventListener("click", () => {
      selectSecretCharacter(character);
    });

    selectionGrid.appendChild(card);
  });
}

function selectSecretCharacter(character) {
  if (gameState.currentPlayer === 1) {
    gameState.player1Secret = character;

    passTitle.textContent = "Pass the device to Player 2";

    gameState.currentPlayer = 2;

    showScreen(passScreen);
  } else {
    gameState.player2Secret = character;

    passTitle.textContent = "Both players are ready";

    gameState.currentPlayer = 1;

    showScreen(passScreen);
  }
}
// =============================
// CREATE CHARACTER CARDS
// =============================

function renderCharacters() {
  characterGrid.innerHTML = "";

  let eliminatedCharacters;

  if (gameState.currentPlayer === 1) {
    eliminatedCharacters = gameState.player1Eliminated;
  } else {
    eliminatedCharacters = gameState.player2Eliminated;
  }

  characters.forEach((character) => {
    const card = document.createElement("div");

    card.classList.add("character-card");

    card.dataset.id = character.id;

    if (eliminatedCharacters.includes(character.id)) {
      card.classList.add("eliminated");
    }

    const image = document.createElement("img");

    image.src = character.image;
    image.alt = character.name;

    const name = document.createElement("div");

    name.classList.add("character-name");

    name.textContent = character.name;

    card.appendChild(image);
    card.appendChild(name);

    card.addEventListener("click", () => {
      toggleCharacter(character.id);
    });

    characterGrid.appendChild(card);
  });

  updateCounter();
}

// =============================
// ELIMINATE / RESTORE CHARACTER
// =============================

function toggleCharacter(characterId) {
  let eliminatedCharacters;

  if (gameState.currentPlayer === 1) {
    eliminatedCharacters = gameState.player1Eliminated;
  } else {
    eliminatedCharacters = gameState.player2Eliminated;
  }

  const index = eliminatedCharacters.indexOf(characterId);

  if (index === -1) {
    eliminatedCharacters.push(characterId);
  } else {
    eliminatedCharacters.splice(index, 1);
  }

  renderCharacters();
}
// =============================
// UPDATE COUNTER
// =============================

function updateCounter() {
  let eliminatedCharacters;

  if (gameState.currentPlayer === 1) {
    eliminatedCharacters = gameState.player1Eliminated;
  } else {
    eliminatedCharacters = gameState.player2Eliminated;
  }

  const remaining = characters.length - eliminatedCharacters.length;

  remainingCounter.textContent = `Remaining: ${remaining}`;
}
// =============================
// RESET BOARD
// =============================

function resetGame() {
  if (gameState.currentPlayer === 1) {
    gameState.player1Eliminated = [];
  } else {
    gameState.player2Eliminated = [];
  }

  renderCharacters();
}

// =============================
// START TURN
// =============================

function startTurn() {
  currentPlayerTitle.textContent = `Player ${gameState.currentPlayer}`;

  renderCharacters();

  showScreen(gameScreen);
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

  passTitle.textContent = `Pass the device to Player ${gameState.currentPlayer}`;

  showScreen(passScreen);
}

// =============================
// EVENT LISTENERS
// =============================

resetButton.addEventListener("click", resetGame);

startGameButton.addEventListener("click", startGame);

continueButton.addEventListener("click", () => {
  if (gameState.player2Secret === null) {
    selectionTitle.textContent = "Player 2: Choose your character";

    renderSelectionCharacters();

    showScreen(selectionScreen);
  } else {
    startTurn();
  }
});

endTurnButton.addEventListener("click", endTurn);

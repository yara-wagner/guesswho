// =============================
// SINGLE PLAYER
// =============================

const singlePlayerGrid = document.getElementById(
  "single-player-grid"
);

const questionCounter = document.getElementById(
  "question-counter"
);

const singleResetButton = document.getElementById(
  "single-reset-button"
);

const gameState = loadGameState();


// =============================
// RENDER CHARACTERS
// =============================

function renderSinglePlayerCharacters() {
  singlePlayerGrid.innerHTML = "";

  const characters = getSetCharacters(gameState);

  characters.forEach(function (character) {
    const card = createCharacterCard(
      character,
      function () {
        toggleSinglePlayerCharacter(character.id);
      }
    );

    if (
      gameState.player1Eliminated.includes(character.id)
    ) {
      card.classList.add("eliminated");
    }

    singlePlayerGrid.appendChild(card);
  });

  updateQuestionCounter();
}


// =============================
// ELIMINATE CHARACTER
// =============================

function toggleSinglePlayerCharacter(characterId) {
  const eliminated = gameState.player1Eliminated;

  const index = eliminated.indexOf(characterId);

  if (index === -1) {
    eliminated.push(characterId);
  } else {
    eliminated.splice(index, 1);
  }

  saveGameState(gameState);

  renderSinglePlayerCharacters();
}


// =============================
// QUESTION COUNTER
// =============================

function updateQuestionCounter() {
  questionCounter.textContent =
    `Questions left: ${gameState.questionsLeft}`;
}


// =============================
// RESET BOARD
// =============================

function resetBoard() {
  gameState.player1Eliminated = [];

  saveGameState(gameState);

  renderSinglePlayerCharacters();
}


// =============================
// PAGE SETUP
// =============================

if (
  gameState === null ||
  gameState.gameMode !== "single-player"
) {
  window.location.replace("index.html");
} else {
  singleResetButton.addEventListener(
    "click",
    resetBoard
  );

  renderSinglePlayerCharacters();
}
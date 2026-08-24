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

const questionButtons = document.querySelectorAll(
  ".question-button"
);

const computerAnswer = document.getElementById(
  "computer-answer"
);

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
// ASK QUESTION
// =============================

function askQuestion(property) {
  const secretCharacter = gameState.player2Secret;

  if (secretCharacter === null) {
    return;
  }

  const answer = secretCharacter[property];

  if (answer === true) {
    computerAnswer.textContent = "YES";

    // Bei YES wird keine Frage abgezogen
  } else {
    computerAnswer.textContent = "NO";

    // Bei NO wird eine Frage abgezogen
    gameState.questionsLeft -= 1;

    saveGameState(gameState);

    updateQuestionCounter();
  }
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

  questionButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const property = button.dataset.property;

      askQuestion(property);
    });
  });

  renderSinglePlayerCharacters();
}

questionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const property = button.dataset.property;

    askQuestion(property);
  });
});
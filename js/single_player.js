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

const questionSelect = document.getElementById(
  "question-select"
);

const askQuestionButton = document.getElementById(
  "ask-question-button"
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
  const characters = getSetCharacters(gameState);

  const secretCharacter = characters.find(function (character) {
    return character.id === gameState.player2Secret.id;
  });

  if (secretCharacter === undefined) {
    return;
  }

  // Keine weiteren Fragen möglich
  if (gameState.questionsLeft <= 0) {
    computerAnswer.textContent = "No questions left.";
    return;
  }

  const answer = secretCharacter[property];

  if (answer === true) {
    computerAnswer.textContent = "YES";
  } else {
    computerAnswer.textContent = "NO";

    gameState.questionsLeft = Math.max(
      0,
      gameState.questionsLeft - 1
    );

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

  askQuestionButton.addEventListener(
    "click",
    function () {
      const property = questionSelect.value;

      if (property === "") {
        computerAnswer.textContent =
          "Select a question first.";

        return;
      }

      askQuestion(property);
    }
  );

  renderSinglePlayerCharacters();
}
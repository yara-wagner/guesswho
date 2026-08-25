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

const questionSelect = document.getElementById(
  "question-select"
);

const askQuestionButton = document.getElementById(
  "ask-question-button"
);

const computerAnswer = document.getElementById(
  "computer-answer"
);

const singlePlayerSetTitle = document.getElementById(
  "single-player-set-title"
);

const gameState = loadGameState();


// =============================
// SET TITLE
// =============================

function updateSetTitle() {
  if (singlePlayerSetTitle === null) {
    return;
  }

  const characterSet = getCharacterSet(
    gameState.characterSetId
  );

  if (characterSet === null) {
    return;
  }

  singlePlayerSetTitle.textContent =
    characterSet.name;
}


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
// QUESTION SELECTION
// =============================

const questionsBySet = {
  disney: [
    {
      property: "human",
      text: "Is your character human?",
    },
    {
      property: "humanLike",
      text: "Does your character look human?",
    },
    {
      property: "female",
      text: "Is your character female?",
    },
    {
      property: "male",
      text: "Is your character male?",
    },
    {
      property: "animal",
      text: "Is your character an animal?",
    },
    {
      property: "hasHair",
      text: "Does your character have hair?",
    },
    {
      property: "canFly",
      text: "Can your character fly?",
    },
    {
      property: "hasWings",
      text: "Does your character have wings?",
    },
    {
      property: "hasFur",
      text: "Does your character have fur?",
    },
    {
      property: "wearsHat",
      text: "Does your character wear a hat?",
    },
    {
      property: "royal",
      text: "Is your character royal?",
    },
    {
      property: "pixar",
      text: "Is your character from a Pixar movie?",
    },
    {
      property: "waterRelated",
      text: "Is your character strongly connected to water?",
    },
    {
      property: "magicalCreature",
      text: "Is your character a magical or fantasy creature?",
    },
  ],

  animals: [
    {
      property: "mammal",
      text: "Is your animal a mammal?",
    },
    {
      property: "bird",
      text: "Is your animal a bird?",
    },
    {
      property: "reptile",
      text: "Is your animal a reptile?",
    },
    {
      property: "fish",
      text: "Is your animal a fish?",
    },
    {
      property: "hasFur",
      text: "Does your animal have fur?",
    },
    {
      property: "hasWings",
      text: "Does your animal have wings?",
    },
    {
      property: "canFly",
      text: "Can your animal fly?",
    },
    {
      property: "livesInWater",
      text: "Does your animal live in water?",
    },
    {
      property: "fourLegs",
      text: "Does your animal have four legs?",
    },
    {
      property: "hasTail",
      text: "Does your animal have a tail?",
    },
    {
      property: "hasHorns",
      text: "Does your animal have horns?",
    },
    {
      property: "dangerous",
      text: "Is your animal dangerous?",
    },
    {
      property: "domestic",
      text: "Is your animal commonly kept by humans?",
    },
  ],
};


function loadQuestions() {
  const questions =
    questionsBySet[gameState.characterSetId];

  if (questions === undefined) {
    return;
  }

  questionSelect.innerHTML = "";

  const defaultOption =
    document.createElement("option");

  defaultOption.value = "";
  defaultOption.textContent =
    "Select a question...";

  questionSelect.appendChild(defaultOption);

  questions.forEach(function (question) {
    const option =
      document.createElement("option");

    option.value = question.property;
    option.textContent = question.text;

    questionSelect.appendChild(option);
  });
}


// =============================
// ASK QUESTION
// =============================

function askQuestion(property) {
  const characters = getSetCharacters(gameState);

  const secretCharacter =
    characters.find(function (character) {
      return (
        character.id ===
        gameState.player2Secret.id
      );
    });

  if (secretCharacter === undefined) {
    return;
  }

  if (gameState.questionsLeft <= 0) {
    computerAnswer.textContent =
      "No questions left.";

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
  const eliminated =
    gameState.player1Eliminated;

  const index =
    eliminated.indexOf(characterId);

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

  questionSelect.addEventListener("change", function () {
    computerAnswer.textContent = "";
  });

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

  loadQuestions();

  updateSetTitle();

  renderSinglePlayerCharacters();
}
  
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

const finalGuessButton = document.getElementById(
  "final-guess-button"
);

const finalGuessLabel =
  finalGuessButton.querySelector(".button-label");

let finalGuessMode = false;

let lastToggledId = null;


// =============================
// RESULT POP-UP
// =============================

const resultOverlay =
  document.getElementById(
    "result-overlay"
  );

const resultConfetti =
  document.getElementById(
    "result-confetti"
  );

const resultIcon =
  document.getElementById(
    "result-icon"
  );

const resultTitle =
  document.getElementById(
    "result-title"
  );

const resultMessage =
  document.getElementById(
    "result-message"
  );

const resultReveal =
  document.getElementById(
    "result-reveal"
  );

const resultCharacterImage =
  document.getElementById(
    "result-character-image"
  );

const resultCharacterName =
  document.getElementById(
    "result-character-name"
  );

const resultFooter =
  document.getElementById(
    "result-footer"
  );

const playAgainButton =
  document.getElementById(
    "play-again-button"
  );

const resultHomeButton =
  document.getElementById(
    "result-home-button"
  );


// =============================
// COMPUTER ANSWER
// =============================

function showAnswer(text, tone) {
  computerAnswer.textContent = text;

  computerAnswer.classList.remove(
    "answer-yes",
    "answer-no"
  );

  if (tone === undefined) {
    return;
  }

  void computerAnswer.offsetWidth;

  computerAnswer.classList.add(tone);
}


// =============================
// SET TITLE
// =============================

function updateSetTitle() {
  if (singlePlayerSetTitle === null) {
    return;
  }

  if (gameState === null) {
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
// RESULT TEXTS
// =============================

// Gewonnen wird auf einem Weg (richtiger Final Guess), verloren auf zwei:
// Die Fragen sind aufgebraucht oder der Final Guess war falsch. Alle drei
// Fälle zeigen denselben Dialog, nur mit anderen Texten.

function showWinTexts() {
  resultIcon.textContent = "🎉";

  resultTitle.textContent =
    "You got it!";

  resultMessage.textContent =
    "You guessed the correct character.";

  resultFooter.textContent =
    "Nice work!";

  resultReveal.classList.add(
    "hidden"
  );
}

function showWrongGuessTexts() {
  resultIcon.textContent = "🙊";

  resultTitle.textContent =
    "Not quite!";

  if (
    gameState.finalGuess === null ||
    gameState.finalGuess === undefined
  ) {
    resultMessage.textContent =
      "Your final guess was wrong.";
  } else {
    resultMessage.textContent =
      `Your final guess was ${gameState.finalGuess.name} – that was not the right character.`;
  }

  resultFooter.textContent =
    "Better luck next time!";

  resultReveal.classList.remove(
    "hidden"
  );
}

function showOutOfQuestionsTexts() {
  resultIcon.textContent = "🙈";

  resultTitle.textContent = "Oh no!";

  resultMessage.textContent =
    "You ran out of questions.";

  resultFooter.textContent =
    "Better luck next time!";

  resultReveal.classList.remove(
    "hidden"
  );
}


// =============================
// SHOW RESULT
// =============================

function showResultOverlay() {
  if (gameState.winner === 1) {
    showWinTexts();
  } else if (
    gameState.lossReason === "wrong-guess"
  ) {
    showWrongGuessTexts();
  } else {
    showOutOfQuestionsTexts();
  }

  const secretCharacter =
    gameState.player2Secret;

  resultCharacterImage.src =
    secretCharacter.image;

  resultCharacterImage.alt =
    secretCharacter.name;

  resultCharacterName.textContent =
    secretCharacter.name;

  resultOverlay.classList.remove(
    "hidden"
  );

  // Anders als im Multi-Player gibt es hier auch Runden ohne Gewinner –
  // gefeiert wird nur, wenn der Spieler den Charakter gefunden hat
  if (gameState.winner === 1) {
    playConfetti(resultConfetti);
  }
}


// =============================
// PLAY AGAIN / BACK TO START
// =============================

// Der alte Spielstand muss weg, sonst schicken die Weiterleitungen auf
// character_sets.html die Seite direkt weiter ins schon gespielte Spiel
function startNewSinglePlayerGame() {
  const newGameState =
    createGameState();

  newGameState.gameMode =
    "single-player";

  newGameState.player1Name =
    getPlayerName(1);

  saveGameState(newGameState);

  window.location.href =
    "character_sets.html";
}

function goToStartScreen() {
  clearGameState();

  window.location.href = "index.html";
}

function setupResultButtons() {
  playAgainButton.addEventListener(
    "click",
    startNewSinglePlayerGame
  );

  resultHomeButton.addEventListener(
    "click",
    goToStartScreen
  );
}


// =============================
// FINAL GUESS
// =============================

function makeFinalGuess(character) {
  if (gameState.phase === "finished") {
    return;
  }

  if (gameState.player2Secret === null) {
    return;
  }

  const isCorrect =
    character.id === gameState.player2Secret.id;

  gameState.winner = isCorrect ? 1 : 2;

  gameState.phase = "finished";

  if (isCorrect === false) {
    gameState.lossReason = "wrong-guess";

    gameState.finalGuess = character;
  }

  saveGameState(gameState);

  finalGuessMode = false;

  showResultOverlay();
}


// =============================
// RENDER CHARACTERS
// =============================

function renderSinglePlayerCharacters() {
  singlePlayerGrid.innerHTML = "";

  const characters = getSetCharacters(
    gameState
  );

  characters.forEach(function (character) {
    const card = createCharacterCard(
      character,
      function () {
        if (finalGuessMode === true) {
          makeFinalGuess(character);

          return;
        }

        toggleSinglePlayerCharacter(
          character.id
        );
      }
    );

    if (
      gameState.player1Eliminated.includes(
        character.id
      )
    ) {
      card.classList.add("eliminated");

      if (character.id === lastToggledId) {
        card.classList.add(
          "just-eliminated"
        );
      }
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
      property: "blackHair",
      text: "Does your character have black hair?",
    },

    {
      property: "brownHair",
      text: "Does your character have brown hair?",
    },

    {
      property: "blondeHair",
      text: "Does your character have blonde hair?",
    },

    {
      property: "redHair",
      text: "Does your character have red hair?",
    },

    {
      property: "wearsRed",
      text: "Is your character mainly wearing red?",
    },

    {
      property: "wearsBlue",
      text: "Is your character mainly wearing blue?",
    },

    {
      property: "wearsGreen",
      text: "Is your character mainly wearing green?",
    },

    {
      property: "wearsDress",
      text: "Is your character wearing a dress?",
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
      text:
        "Is your character strongly connected to water?",
    },

    {
      property: "magicalCreature",
      text:
        "Is your character a magical or fantasy creature?",
    },

    {
      property: "backgroundBlue",
      text:
        "Does your character have a blue background?",
    },

    {
      property: "backgroundRed",
      text:
        "Does your character have a red background?",
    },

    {
      property: "backgroundGreen",
      text:
        "Does your character have a green background?",
    },

    {
      property: "backgroundOrange",
      text:
        "Does your character have an orange background?",
    },

    {
      property: "backgroundYellow",
      text:
        "Does your character have a yellow background?",
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
      text:
        "Is your animal commonly kept by humans?",
    },

    {
      property: "largeAnimal",
      text: "Is your animal large?",
    },

    {
      property: "hasStripes",
      text: "Does your animal have stripes?",
    },

    {
      property: "hasSpots",
      text: "Does your animal have spots?",
    },

    {
      property: "hasLongEars",
      text: "Does your animal have long ears?",
    },

    {
      property: "hasLongNeck",
      text: "Does your animal have a long neck?",
    },
  ],

  mario: [
  // =============================
  // BASIC
  // =============================

  {
    property: "human",
    text: "Is your character human?",
  },

  {
    property: "male",
    text: "Is your character male?",
  },

  {
    property: "female",
    text: "Is your character female?",
  },

  {
    property: "royal",
    text: "Is your character royal?",
  },

  {
    property: "villain",
    text: "Is your character a villain?",
  },


  // =============================
  // CLOTHING
  // =============================

  {
    property: "wearsHat",
    text: "Does your character wear a hat?",
  },

  {
    property: "wearsCrown",
    text: "Does your character wear a crown?",
  },

  {
    property: "wearsDress",
    text: "Does your character wear a dress?",
  },


  // =============================
  // FACE / HAIR
  // =============================

  {
    property: "hasMoustache",
    text: "Does your character have a moustache?",
  },

  {
    property: "hasHair",
    text: "Does your character have visible hair?",
  },

  {
    property: "blondeHair",
    text: "Does your character have blonde hair?",
  },

  {
    property: "brownHair",
    text: "Does your character have brown hair?",
  },

  {
    property: "redHair",
    text: "Does your character have red hair?",
  },

  {
    property: "hasMask",
    text: "Does your character wear a mask?",
  },


  // =============================
  // COLOURS
  // =============================

  {
    property: "hasRed",
    text: "Does your character have a lot of red?",
  },

  {
    property: "hasGreen",
    text: "Does your character have a lot of green?",
  },

  {
    property: "hasBlue",
    text: "Does your character have a lot of blue?",
  },

  {
    property: "hasPink",
    text: "Does your character have a lot of pink?",
  },

  {
    property: "hasYellow",
    text: "Does your character have a lot of yellow?",
  },

  {
    property: "hasPurple",
    text: "Does your character have a lot of purple?",
  },


  // =============================
  // BODY / SPECIES
  // =============================

  {
    property: "animalLike",
    text: "Does your character look like an animal?",
  },

  {
    property: "hasShell",
    text: "Does your character have a shell?",
  },

  {
    property: "hasHorns",
    text: "Does your character have horns?",
  },

  {
    property: "hasTail",
    text: "Does your character have a tail?",
  },

  {
    property: "ghost",
    text: "Is your character a ghost?",
  },


  // =============================
  // SPECIAL MARIO FEATURES
  // =============================

  {
    property: "mushroomLike",
    text: "Does your character have a mushroom head?",
  },

  {
    property: "isKong",
    text: "Is your character a Kong?",
  },
],
};


// =============================
// LOAD QUESTIONS
// =============================

function loadQuestions() {
  const questions =
    questionsBySet[
      gameState.characterSetId
    ];

  if (questions === undefined) {
    return;
  }

  questionSelect.innerHTML = "";

  const defaultOption =
    document.createElement("option");

  defaultOption.value = "";

  defaultOption.textContent =
    "Select a question...";

  questionSelect.appendChild(
    defaultOption
  );

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
  if (gameState.phase === "finished") {
    // Das Spiel ist vorbei, es wird nicht mehr gefragt
    return;
  }

  const characters = getSetCharacters(
    gameState
  );

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
    showAnswer("No questions left.");

    return;
  }

  const answer =
    secretCharacter[property];

  if (answer === undefined) {
    console.error(
      `Missing property "${property}" for ${secretCharacter.name}`
    );

    showAnswer(
      "Question data is missing."
    );

    return;
  }

  if (answer === true) {
    showAnswer(
      "YES",
      "answer-yes"
    );
  } else {
    showAnswer(
      "NO",
      "answer-no"
    );

    gameState.questionsLeft =
      Math.max(
        0,
        gameState.questionsLeft - 1
      );

    if (
      gameState.questionsLeft === 0
    ) {
      gameState.winner = 2;

      gameState.phase = "finished";

      gameState.lossReason = "no-questions";
    }

    saveGameState(gameState);

    updateQuestionCounter();

    if (
      gameState.questionsLeft === 0
    ) {
      // Kurz warten, damit das "NO" noch gelesen werden kann, bevor
      // der Dialog darüber geht
      setTimeout(
        showResultOverlay,
        700
      );
    }
  }
}


// =============================
// ELIMINATE CHARACTER
// =============================

function toggleSinglePlayerCharacter(
  characterId
) {
  if (gameState.phase === "finished") {
    // Das Spiel ist vorbei, das Board ist nur noch Anzeige
    return;
  }

  const eliminated =
    gameState.player1Eliminated;

  const index =
    eliminated.indexOf(characterId);

  if (index === -1) {
    eliminated.push(characterId);
  } else {
    eliminated.splice(index, 1);
  }

  lastToggledId = characterId;

  saveGameState(gameState);

  renderSinglePlayerCharacters();
}


// =============================
// QUESTION COUNTER
// =============================

function updateQuestionCounter() {
  const text =
    `Questions left: ${gameState.questionsLeft}`;

  if (
    questionCounter.textContent === text
  ) {
    return;
  }

  questionCounter.textContent = text;

  questionCounter.classList.remove(
    "counter-pop"
  );

  void questionCounter.offsetWidth;

  questionCounter.classList.add(
    "counter-pop"
  );
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
  window.location.replace(
    "index.html"
  );
} else if (
  getCharacterSet(
    gameState.characterSetId
  ) === null
) {
  window.location.replace(
    "character_sets.html"
  );
} else if (
  gameState.phase === "finished"
) {
  // Das Spiel ist entschieden – das Board bleibt als Anzeige stehen und
  // das Ergebnis liegt darüber. Nach einem Neuladen landen die Spieler
  // wieder genau hier.
  setupResultButtons();

  loadQuestions();

  updateSetTitle();

  renderSinglePlayerCharacters();

  showResultOverlay();
} else {
  setupResultButtons();

  singleResetButton.addEventListener(
    "click",
    resetBoard
  );

  finalGuessButton.addEventListener(
    "click",
    function () {
      finalGuessMode =
        !finalGuessMode;

      if (finalGuessMode === true) {
        finalGuessLabel.textContent =
          "Cancel guess";

        finalGuessButton.classList.remove(
          "accent-2"
        );

        showAnswer(
          "Click the character you want to guess."
        );
      } else {
        finalGuessLabel.textContent =
          "Final Guess";

        finalGuessButton.classList.add(
          "accent-2"
        );

        showAnswer("");
      }
    }
  );

  questionSelect.addEventListener(
    "change",
    function () {
      showAnswer("");
    }
  );

  askQuestionButton.addEventListener(
    "click",
    function () {
      const property =
        questionSelect.value;

      if (property === "") {
        showAnswer(
          "Select a question first."
        );

        return;
      }

      askQuestion(property);
    }
  );

  loadQuestions();

  updateSetTitle();

  renderSinglePlayerCharacters();
}
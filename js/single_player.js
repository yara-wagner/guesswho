// =============================
// SINGLE PLAYER
// =============================

const singlePlayerGrid = document.getElementById("single-player-grid");

const questionCounter = document.getElementById("question-counter");

const singleResetButton = document.getElementById("single-reset-button");

const questionSelect = document.getElementById("question-select");

const askQuestionButton = document.getElementById("ask-question-button");

const computerAnswer = document.getElementById("computer-answer");

const singlePlayerSetTitle = document.getElementById("single-player-set-title");

const gameState = loadGameState();

const finalGuessButton = document.getElementById("final-guess-button");

// Nur die Beschriftung wechselt, nicht der ganze Button-Inhalt – daneben
// steht das Icon (siehe single_player.html)
const finalGuessLabel = finalGuessButton.querySelector(".button-label");

let finalGuessMode = false;

// Die zuletzt angeklickte Karte. Nur sie animiert ihr Kreuz ein – das
// Board wird bei jedem Klick komplett neu gezeichnet, sonst würden alle
// bereits ausgeschlossenen Karten jedes Mal mitwackeln.
let lastToggledId = null;

// =============================
// COMPUTER ANSWER
// =============================

// Setzt die Antwort des Computers. YES und NO stehen in der normalen
// Textfarbe und werden nur kurz hervorgehoben (siehe css/style.css),
// Hinweistexte ("Select a question first.") bleiben ganz ruhig.
function showAnswer(text, tone) {
  computerAnswer.textContent = text;

  computerAnswer.classList.remove("answer-yes", "answer-no");

  if (tone === undefined) {
    return;
  }

  // Erzwingt einen Layout-Schritt, damit die Animation auch bei zwei
  // gleichen Antworten hintereinander neu startet
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

  const characterSet = getCharacterSet(gameState.characterSetId);

  if (characterSet === null) {
    return;
  }

  singlePlayerSetTitle.textContent = characterSet.name;
}

// =============================
// FINAL GUESS
// =============================

function makeFinalGuess(character) {
  if (gameState.player2Secret === null) {
    return;
  }

  const isCorrect = character.id === gameState.player2Secret.id;

  gameState.winner = isCorrect ? 1 : 2;

  gameState.phase = "finished";

  saveGameState(gameState);

  if (isCorrect) {
    window.location.href = "single_player_win.html";
  } else {
    window.location.href = "single_player_result.html";
  }
}

// =============================
// RENDER CHARACTERS
// =============================

function renderSinglePlayerCharacters() {
  singlePlayerGrid.innerHTML = "";

  const characters = getSetCharacters(gameState);

  characters.forEach(function (character) {
    const card = createCharacterCard(character, function () {
      if (finalGuessMode === true) {
        makeFinalGuess(character);

        return;
      }

      toggleSinglePlayerCharacter(character.id);
    });

    if (gameState.player1Eliminated.includes(character.id)) {
      card.classList.add("eliminated");

      if (character.id === lastToggledId) {
        card.classList.add("just-eliminated");
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
  const questions = questionsBySet[gameState.characterSetId];

  if (questions === undefined) {
    return;
  }

  questionSelect.innerHTML = "";

  const defaultOption = document.createElement("option");

  defaultOption.value = "";
  defaultOption.textContent = "Select a question...";

  questionSelect.appendChild(defaultOption);

  questions.forEach(function (question) {
    const option = document.createElement("option");

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

  const secretCharacter = characters.find(function (character) {
    return character.id === gameState.player2Secret.id;
  });

  if (secretCharacter === undefined) {
    return;
  }

  if (gameState.questionsLeft <= 0) {
    showAnswer("No questions left.");

    return;
  }

  const answer = secretCharacter[property];

  if (answer === true) {
    showAnswer("YES", "answer-yes");
  } else {
    showAnswer("NO", "answer-no");

    gameState.questionsLeft = Math.max(0, gameState.questionsLeft - 1);

    if (gameState.questionsLeft === 0) {
      // Die Fragen sind aufgebraucht, das Spiel ist verloren
      gameState.winner = 2;

      gameState.phase = "finished";
    }

    saveGameState(gameState);

    updateQuestionCounter();

    if (gameState.questionsLeft === 0) {
      setTimeout(function () {
        window.location.href = "single_player_result.html";
      }, 700);
    }
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

  lastToggledId = characterId;

  saveGameState(gameState);

  renderSinglePlayerCharacters();
}

// =============================
// QUESTION COUNTER
// =============================

function updateQuestionCounter() {
  const text = `Questions left: ${gameState.questionsLeft}`;

  if (questionCounter.textContent === text) {
    return;
  }

  questionCounter.textContent = text;

  // Der Zähler hüpft kurz, wenn eine Frage verbraucht ist. Die Klasse muss
  // zuerst weg und ein Layout-Schritt dazwischen liegen, sonst spielt der
  // Browser dieselbe Animation beim zweiten Mal nicht noch einmal ab.
  questionCounter.classList.remove("counter-pop");

  void questionCounter.offsetWidth;

  questionCounter.classList.add("counter-pop");
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

if (gameState === null || gameState.gameMode !== "single-player") {
  window.location.replace("index.html");
} else if (getCharacterSet(gameState.characterSetId) === null) {
  // Es fehlt noch ein Charakter-Set
  window.location.replace("character_sets.html");
} else {
  singleResetButton.addEventListener("click", resetBoard);

  finalGuessButton.addEventListener(
  "click",
  function () {
    finalGuessMode = !finalGuessMode;

    if (finalGuessMode === true) {
      finalGuessLabel.textContent =
        "Cancel guess";

      // Im Rate-Modus wird der Button zur Hauptaktion und wechselt
      // dafür von Petrol auf Coral
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

  questionSelect.addEventListener("change", function () {
    showAnswer("");
  });

  askQuestionButton.addEventListener("click", function () {
    const property = questionSelect.value;

    if (property === "") {
      showAnswer("Select a question first.");

      return;
    }

    askQuestion(property);
  });

  loadQuestions();

  updateSetTitle();

  renderSinglePlayerCharacters();
}

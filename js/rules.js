// =============================
// RULES
// =============================

const infoButtons =
  document.querySelectorAll(
    "[data-rules]"
  );

const rulesModal = document.getElementById("rules-modal");

const closeRulesButton = document.getElementById("close-rules-button");

const rulesTitle = document.getElementById("rules-title");

const rulesText = document.getElementById("rules-text");

// =============================
// RULE TEXTS
// =============================

const rules = {
  "single-player": {
    title: "Single-Player Rules",

    text: `
      <ol>
        <li>
          The computer secretly chooses one character.
        </li>

        <li>
          You have a limited number of questions to find the correct character.
        </li>

        <li>
          Ask yes-or-no questions to narrow down the possible characters.
        </li>

        <li>
          If the answer is <strong>YES</strong>, you may ask another question
          without losing one of your remaining questions.
        </li>

        <li>
          If the answer is <strong>NO</strong>, your remaining question counter
          decreases by one.
        </li>

        <li>
          Try to identify the computer's secret character before you run out
          of questions.
        </li>
      </ol>
    `,
  },

  "multi-player": {
    title: "Multi-Player Rules",

    text: `
      <ol>
        <li>
          Two players play against each other on the same device.
        </li>

        <li>
          Each player secretly chooses a character.
        </li>

        <li>
          Player 1 gets the device and asks a yes-or-no question about
          Player 2's secret character.
        </li>

        <li>
          After Player 1's turn, pass the device to Player 2.
        </li>

        <li>
          Player 2 asks a yes-or-no question about Player 1's secret character.
        </li>

        <li>
          Continue passing the device back and forth after every turn.
        </li>

        <li>
          Use the answers to eliminate characters that do not match.
        </li>

        <li>
          The first player to correctly guess the other player's secret
          character wins.
        </li>
      </ol>
    `,
  },
};

// =============================
// OPEN RULES
// =============================

infoButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const gameMode = button.dataset.rules;

    rulesTitle.textContent = rules[gameMode].title;

    rulesText.innerHTML = rules[gameMode].text;

    rulesModal.classList.remove("hidden");
  });
});

// =============================
// CLOSE RULES
// =============================

function closeRules() {
  rulesModal.classList.add("hidden");
}

closeRulesButton.addEventListener("click", closeRules);

rulesModal.addEventListener("click", function (event) {
  if (event.target === rulesModal) {
    closeRules();
  }
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeRules();
  }
});

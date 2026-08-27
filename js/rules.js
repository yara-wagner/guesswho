// =============================
// RULES
// =============================

// Das Regeln-Popup steht nicht im HTML der einzelnen Seiten, sondern wird
// hier beim ersten Klick einmalig eingehängt – genau wie das
// Verlassen-Popup (siehe js/leave.js). So bekommt jede Seite, die diese
// Datei lädt, das Popup automatisch und das Markup steht nur an einer
// Stelle.

let rulesModal = null;

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
// POPUP AUFBAUEN
// =============================

function createRulesModal() {
  const modal = document.createElement("div");

  modal.className = "rules-modal hidden";

  modal.innerHTML = `
    <div class="rules-content">
      <button
        class="close-rules-button icon-button"
        type="button"
        aria-label="Close rules"
      >
        <span data-icon="close"></span>
      </button>

      <h2 class="rules-title"></h2>

      <div class="rules-text"></div>
    </div>
  `;

  document.body.appendChild(modal);

  // Platzhalter durch die SVGs ersetzen (js/icons.js)
  renderIcons(modal);

  const closeButton = modal.querySelector(".close-rules-button");

  closeButton.addEventListener("click", closeRules);

  // Klick auf die abgedunkelte Fläche neben der Box schliesst das Popup

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeRules();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeRules();
    }
  });

  return modal;
}

// =============================
// POPUP ÖFFNEN UND SCHLIESSEN
// =============================

function openRules(gameMode) {
  const rulesForMode = rules[gameMode];

  if (rulesForMode === undefined) {
    return;
  }

  if (rulesModal === null) {
    rulesModal = createRulesModal();
  }

  rulesModal.querySelector(".rules-title").textContent = rulesForMode.title;

  rulesModal.querySelector(".rules-text").innerHTML = rulesForMode.text;

  rulesModal.classList.remove("hidden");
}

function closeRules() {
  if (rulesModal === null) {
    return;
  }

  rulesModal.classList.add("hidden");
}

// =============================
// INFO-BUTTONS
// =============================

// Ein Listener auf dem ganzen Dokument statt einer pro Button: Der
// Info-Button im Header entsteht erst, wenn das <game-header>-Element
// aufgebaut wird (siehe js/header.js). Wer die Buttons hier einmalig
// einsammelt, muss auf diese Reihenfolge achten – die Delegation nicht.

document.addEventListener("click", function (event) {
  const infoButton = event.target.closest("[data-rules]");

  if (infoButton === null) {
    return;
  }

  openRules(infoButton.dataset.rules);
});
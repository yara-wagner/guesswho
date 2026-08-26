// =============================
// LEAVE GAME
// =============================

// Der Button steckt im Header jeder Spielseite (siehe js/header.js) und
// bringt die Spieler zurück zur Modus-Auswahl (index.html).
//
// Gefragt wird in einem eigenen Popup im Stil der übrigen Popups
// (Regeln, Spielernamen). Das Popup steht nicht im HTML der einzelnen
// Seiten, sondern wird hier beim ersten Klick einmalig eingehängt – so
// bekommt jede Seite, die diese Datei lädt, das Popup automatisch.

let leaveModal = null;

// =============================
// POPUP AUFBAUEN
// =============================

function createLeaveModal() {
  const modal = document.createElement("div");

  modal.id = "leave-modal";

  modal.className = "leave-modal hidden";

  modal.innerHTML = `
    <div class="leave-content">
      <button
        class="close-leave-button icon-button"
        type="button"
        aria-label="Keep playing"
      >
        <span data-icon="close"></span>
      </button>

      <h2>Leave the game?</h2>

      <p class="leave-text">The current progress will be lost.</p>

      <div class="leave-buttons">
        <button class="keep-playing-button" type="button">Keep playing</button>

        <button class="confirm-leave-button secondary" type="button">
          <span data-icon="home"></span>
          Leave game
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Platzhalter durch die SVGs ersetzen (js/icons.js)
  renderIcons(modal);

  const closeButton = modal.querySelector(".close-leave-button");

  const keepPlayingButton = modal.querySelector(".keep-playing-button");

  const confirmButton = modal.querySelector(".confirm-leave-button");

  closeButton.addEventListener("click", closeLeaveModal);

  keepPlayingButton.addEventListener("click", closeLeaveModal);

  confirmButton.addEventListener("click", confirmLeaveGame);

  // Klick auf die abgedunkelte Fläche neben der Box schliesst das Popup

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeLeaveModal();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeLeaveModal();
    }
  });

  return modal;
}

// =============================
// POPUP ÖFFNEN UND SCHLIESSEN
// =============================

function leaveGame() {
  if (leaveModal === null) {
    leaveModal = createLeaveModal();
  }

  leaveModal.classList.remove("hidden");
}

function closeLeaveModal() {
  if (leaveModal === null) {
    return;
  }

  leaveModal.classList.add("hidden");
}

// =============================
// SPIEL WIRKLICH VERLASSEN
// =============================

function confirmLeaveGame() {
  clearGameState();

  window.location.href = "index.html";
}

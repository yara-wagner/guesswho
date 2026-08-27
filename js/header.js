// =============================
// HEADER
// =============================

// "leave" zeigt den "Back to start"-Button.
// "back" zeigt zusätzlich einen Zurück-Button.
// "rules" zeigt einen Info-Button für die Spielregeln.
// Mögliche Werte:
// rules="single-player"
// rules="multi-player"
// rules="auto"            -> der Modus kommt aus dem Spielstand
//
// Seiten, die es in beiden Modi gibt (z. B. character_sets.html), wissen
// erst aus dem Spielstand, welche Regeln gerade gelten. Damit das schon
// beim Aufbau des Headers klar ist, muss js/state.js auf diesen Seiten vor
// js/header.js geladen werden. Ohne Spielstand zeigen wir die
// Multi-Player-Regeln – das ist der Standardmodus (siehe js/state.js).

function getRulesTypeFromGameState() {
  if (typeof loadGameState !== "function") {
    return "multi-player";
  }

  const state = loadGameState();

  if (state === null) {
    return "multi-player";
  }

  return state.gameMode;
}

class GameHeader extends HTMLElement {
  connectedCallback() {
    const showLeaveButton =
      this.hasAttribute("leave");

    const showBackButton =
      this.hasAttribute("back");

    const rulesAttribute =
      this.getAttribute("rules");

    const showRulesButton =
      rulesAttribute !== null;

    const rulesType =
      rulesAttribute === "auto"
        ? getRulesTypeFromGameState()
        : rulesAttribute;


    // =============================
    // LOGO
    // =============================

    const logoImage = `
      <img
        src="src/guesswho_logo_black.svg"
        alt="Guess Who?"
      />
    `;


    // =============================
    // BACK BUTTON
    // =============================

    const backButtonMarkup =
      showBackButton
        ? `
          <button
            class="back-button secondary"
            type="button"
            aria-label="Back"
          >
            <span data-icon="arrow-left"></span>
            <span class="back-button-text">Back</span>
          </button>
        `
        : "";


    // =============================
    // LEAVE BUTTON
    // =============================

    const leaveButtonMarkup =
      showLeaveButton
        ? `
          <button
            class="leave-game-button secondary"
            type="button"
            aria-label="Back to start"
          >
            <span data-icon="home"></span>
            <span class="leave-game-button-text">Back to start</span>
          </button>
        `
        : "";


    // =============================
    // RULES BUTTON
    // =============================

    const infoButtonMarkup =
      showRulesButton
        ? `
          <button
            class="header-icon-button header-info-button"
            type="button"
            data-rules="${rulesType}"
            aria-label="Show rules"
            title="Rules"
          >
            <span data-icon="question"></span>
          </button>
        `
        : "";


    // =============================
    // MUSIC BUTTON
    // =============================

    const musicButtonMarkup = `
      <button
        class="header-icon-button header-music-button"
        type="button"
        aria-label="Unmute music"
        title="Unmute music"
      >
        <span
          class="music-icon"
          data-icon="volume-off"
        ></span>
      </button>
    `;


    // =============================
    // HEADER HTML
    // =============================

    this.innerHTML = `
      <header class="game-header">

        <h1 class="game-logo">
          ${
            showLeaveButton
              ? `
                <button
                  class="logo-button"
                  type="button"
                  aria-label="Back to start"
                >
                  ${logoImage}
                </button>
              `
              : logoImage
          }
        </h1>

        <div class="header-buttons">
          ${backButtonMarkup}
          ${infoButtonMarkup}
          ${musicButtonMarkup}
          ${leaveButtonMarkup}
        </div>

      </header>
    `;


    // =============================
    // ICONS
    // =============================

    renderIcons(this);


    // =============================
    // BACK
    // =============================

    const backButton =
      this.querySelector(".back-button");

    if (backButton !== null) {
      backButton.addEventListener(
        "click",
        function () {
          goBack();
        }
      );
    }


    // =============================
    // MUSIC
    // =============================

    // Die Musik selber liegt in der Hülle, nicht auf dieser Seite (siehe
    // index.html). setupMusicButton steht deshalb in js/frame.js.

    const musicButton =
      this.querySelector(
        ".header-music-button"
      );

    if (musicButton !== null) {
      setupMusicButton(musicButton);
    }


    // =============================
    // LEAVE
    // =============================

    if (showLeaveButton === false) {
      return;
    }

    const leaveButton =
      this.querySelector(
        ".leave-game-button"
      );

    const logoButton =
      this.querySelector(
        ".logo-button"
      );

    if (leaveButton !== null) {
      leaveButton.addEventListener(
        "click",
        function () {
          leaveGame();
        }
      );
    }

    if (logoButton !== null) {
      logoButton.addEventListener(
        "click",
        function () {
          leaveGame();
        }
      );
    }
  }
}


// =============================
// DEFINE HEADER
// =============================

customElements.define(
  "game-header",
  GameHeader
);
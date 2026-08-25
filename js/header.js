// =============================
// HEADER
// =============================
//
// Das Attribut "leave" setzt voraus, dass js/leave.js geladen ist.
// Auf diesen Seiten ist auch das Logo anklickbar und führt – genau wie der
// Button – zurück zur Startseite. Auf der Startseite selbst ist das Logo
// nur ein Bild, dort gibt es nichts abzubrechen.
//
// Neben dem Logo steht auf allen Seiten ausser der Startseite ein
// "← Back"-Button, der einen Schritt zurück in der History geht.

class GameHeader extends HTMLElement {
  connectedCallback() {
    const showLeaveButton = this.hasAttribute("leave");

    const isStartPage =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname.endsWith("/");

    const logoImage = `
      <img
        src="src/guesswho_logo_black.svg"
        alt="Guess Who?"
      />
    `;

    this.innerHTML = `
      <header class="game-header">

        <div class="header-left">

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

          ${
            isStartPage
              ? ""
              : `
                <button
                  class="back-button secondary"
                  type="button"
                  aria-label="Back"
                >
                  <span data-icon="arrow-left"></span>
                  <span class="back-button-text">Back</span>
                </button>
              `
          }

        </div>

        ${
          showLeaveButton
            ? `
              <button
                class="leave-game-button secondary"
                type="button"
              >
                <span data-icon="home"></span>
                Back to start
              </button>
            `
            : ""
        }

      </header>
    `;

    // Die Platzhalter im Markup oben durch ihre SVGs ersetzen (js/icons.js).
    // Der Header steht schon, bevor DOMContentLoaded feuert, deshalb macht
    // er das hier selber.
    renderIcons(this);

    const backButton = this.querySelector(".back-button");

    if (backButton !== null) {
      backButton.addEventListener("click", function () {
        window.history.back();
      });
    }

    if (showLeaveButton === false) {
      return;
    }

    const leaveButton = this.querySelector(".leave-game-button");
    const logoButton = this.querySelector(".logo-button");

    // leaveGame() steht in js/leave.js und ist hier noch nicht geladen.
    // Der Aufruf im Callback wird erst beim Klick aufgelöst, dann ist es da.
    leaveButton.addEventListener("click", function () {
      leaveGame();
    });

    logoButton.addEventListener("click", function () {
      leaveGame();
    });
  }
}

customElements.define("game-header", GameHeader);

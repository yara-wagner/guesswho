// =============================
// HEADER
// =============================

// Der Header ist auf allen Seiten gleich und steht deshalb nur hier.
// Der Titel wird als kleines Logo oben links angezeigt (siehe .game-logo
// im CSS), damit für den restlichen Inhalt mehr Platz bleibt.
//
// Verwendung in der Seite:
//
//   <game-header></game-header>          nur Logo (Startseite)
//   <game-header cancel></game-header>   mit "Back to start" (Spielseiten)
//
// Das Attribut "cancel" setzt voraus, dass js/cancel.js geladen ist.
// Auf diesen Seiten ist auch das Logo anklickbar und führt – genau wie der
// Button – zurück zur Startseite. Auf der Startseite selbst ist das Logo
// nur ein Bild, dort gibt es nichts abzubrechen.
//
// Neben dem Logo steht auf allen Seiten ausser der Startseite ein
// "← Back"-Button, der einen Schritt zurück in der History geht.

class GameHeader extends HTMLElement {
  connectedCallback() {
    const showCancelButton = this.hasAttribute("cancel");

    const isStartPage =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname.endsWith("/");

    const logoImage = `
      <img
        src="src/guesswho_logo.png"
        alt="Guess Who?"
      />
    `;

    this.innerHTML = `
      <header class="game-header">

        <div class="header-left">

          <h1 class="game-logo">
            ${
              showCancelButton
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
                  class="back-button"
                  type="button"
                >
                  ← Back
                </button>
              `
          }

        </div>

        ${
          showCancelButton
            ? `
              <button
                class="cancel-game-button"
                type="button"
              >
                Back to start
              </button>
            `
            : ""
        }

      </header>
    `;

    const backButton = this.querySelector(".back-button");

    if (backButton !== null) {
      backButton.addEventListener("click", function () {
        window.history.back();
      });
    }

    if (showCancelButton === false) {
      return;
    }

    const cancelButton = this.querySelector(".cancel-game-button");
    const logoButton = this.querySelector(".logo-button");

    // cancelGame() steht in js/cancel.js und ist hier noch nicht geladen.
    // Der Aufruf im Callback wird erst beim Klick aufgelöst, dann ist es da.
    cancelButton.addEventListener("click", function () {
      cancelGame();
    });

    logoButton.addEventListener("click", function () {
      cancelGame();
    });
  }
}

customElements.define("game-header", GameHeader);

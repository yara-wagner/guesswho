// =============================
// HEADER
// =============================

// Der Header ist auf allen Seiten gleich und steht deshalb nur hier.
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

class GameHeader extends HTMLElement {
  connectedCallback() {
    const showCancelButton = this.hasAttribute("cancel");

    const logoImage = '<img src="src/guesswho_logo.png" alt="Guess Who?" />';

    this.innerHTML = `
      <header class="game-header">
        <h1 class="game-logo">
          ${
            showCancelButton
              ? `<button class="logo-button" type="button" aria-label="Back to start">${logoImage}</button>`
              : logoImage
          }
        </h1>
        ${
          showCancelButton
            ? '<button class="cancel-game-button" type="button">Back to start</button>'
            : ""
        }
      </header>
    `;

    if (showCancelButton === false) {
      return;
    }

    const cancelButton = this.querySelector(".cancel-game-button");
    const logoButton = this.querySelector(".logo-button");

    // cancelGame() steht in js/cancel.js und ist hier noch nicht geladen.
    // Der Aufruf im Callback wird erst beim Klick aufgelöst, dann ist es da.
    cancelButton.addEventListener("click", () => cancelGame());
    logoButton.addEventListener("click", () => cancelGame());
  }
}

customElements.define("game-header", GameHeader);

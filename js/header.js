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

class GameHeader extends HTMLElement {
  connectedCallback() {
    const showCancelButton = this.hasAttribute("cancel");

    this.innerHTML = `
      <header class="game-header">
        <h1 class="game-logo">Guess Who?</h1>
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

    // cancelGame() steht in js/cancel.js und ist hier noch nicht geladen.
    // Der Aufruf im Callback wird erst beim Klick aufgelöst, dann ist es da.
    cancelButton.addEventListener("click", () => cancelGame());
  }
}

customElements.define("game-header", GameHeader);

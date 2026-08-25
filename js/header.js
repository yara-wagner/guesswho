// =============================
// HEADER
// =============================

class GameHeader extends HTMLElement {
  connectedCallback() {
    const showCancelButton = this.hasAttribute("cancel");

    const isStartPage =
      window.location.pathname.endsWith("index.html") ||
      window.location.pathname.endsWith("/");

    this.innerHTML = `
      <header class="game-header">

        <div class="header-left">

  <h1 class="game-logo">
    <img
      src="src/guesswho_logo.png"
      alt="Guess Who?"
    />
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

    cancelButton.addEventListener("click", function () {
      cancelGame();
    });
  }
}

customElements.define("game-header", GameHeader);

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
          >
            <span data-icon="home"></span>
            Back to start
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
            <span data-icon="info"></span>
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
        aria-label="Mute music"
        title="Mute music"
      >
        <span
          class="music-icon"
          data-icon="volume"
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
          saveMusicPosition();
          leaveGame();
        }
      );
    }

    if (logoButton !== null) {
      logoButton.addEventListener(
        "click",
        function () {
          saveMusicPosition();
          leaveGame();
        }
      );
    }
  }
}


// =============================
// BACKGROUND MUSIC
// =============================

const MUSIC_MUTED_KEY =
  "guessWhoMusicMuted";

const MUSIC_TIME_KEY =
  "guessWhoMusicTime";

let backgroundMusic = null;

let musicStarted = false;

let fadeInterval = null;


// =============================
// CREATE MUSIC
// =============================

function getBackgroundMusic() {
  if (backgroundMusic !== null) {
    return backgroundMusic;
  }

  backgroundMusic =
    new Audio(
      "src/sound/happy.mp3"
    );

  backgroundMusic.loop = true;

  // Zuerst leise starten.
  backgroundMusic.volume = 0;

  backgroundMusic.muted =
    isMusicMuted();


  // =============================
  // POSITION RESTORE
  // =============================

  backgroundMusic.addEventListener(
    "loadedmetadata",
    function () {
      const savedTime =
        Number(
          sessionStorage.getItem(
            MUSIC_TIME_KEY
          )
        );

      if (
        Number.isNaN(savedTime) === false &&
        savedTime > 0 &&
        savedTime < backgroundMusic.duration
      ) {
        backgroundMusic.currentTime =
          savedTime;
      }
    }
  );


  // =============================
  // POSITION SAVE
  // =============================

  backgroundMusic.addEventListener(
    "timeupdate",
    function () {
      saveMusicPosition();
    }
  );

  return backgroundMusic;
}


// =============================
// SAVE POSITION
// =============================

function saveMusicPosition() {
  if (backgroundMusic === null) {
    return;
  }

  sessionStorage.setItem(
    MUSIC_TIME_KEY,
    String(
      backgroundMusic.currentTime
    )
  );
}


// Auch bei normalem Seitenwechsel speichern.
window.addEventListener(
  "pagehide",
  function () {
    saveMusicPosition();
  }
);


// =============================
// MUTED STATE
// =============================

function isMusicMuted() {
  return (
    sessionStorage.getItem(
      MUSIC_MUTED_KEY
    ) === "true"
  );
}


function setMusicMuted(muted) {
  sessionStorage.setItem(
    MUSIC_MUTED_KEY,
    String(muted)
  );

  const music =
    getBackgroundMusic();

  music.muted = muted;
}


// =============================
// BUTTON UPDATE
// =============================

function updateMusicButton(
  musicButton
) {
  const muted =
    isMusicMuted();

  const icon =
    musicButton.querySelector(
      ".music-icon"
    );

  if (icon === null) {
    return;
  }

  if (muted === true) {
    musicButton.setAttribute(
      "aria-label",
      "Unmute music"
    );

    musicButton.title =
      "Unmute music";

    icon.dataset.icon =
      "volume-off";
  } else {
    musicButton.setAttribute(
      "aria-label",
      "Mute music"
    );

    musicButton.title =
      "Mute music";

    icon.dataset.icon =
      "volume";
  }

  renderIcons(musicButton);
}


// =============================
// FADE IN
// =============================

function fadeMusicIn() {
  const music =
    getBackgroundMusic();

  clearInterval(fadeInterval);

  music.volume = 0;

  const targetVolume = 0.35;

  fadeInterval =
    setInterval(
      function () {
        if (
          music.volume >=
          targetVolume - 0.02
        ) {
          music.volume =
            targetVolume;

          clearInterval(
            fadeInterval
          );

          return;
        }

        music.volume =
          Math.min(
            targetVolume,
            music.volume + 0.03
          );
      },
      40
    );
}


// =============================
// START MUSIC
// =============================

function startBackgroundMusic() {
  if (musicStarted === true) {
    return;
  }

  const music =
    getBackgroundMusic();

  music.muted =
    isMusicMuted();

  music
    .play()
    .then(function () {
      musicStarted = true;

      if (
        music.muted === false
      ) {
        fadeMusicIn();
      }
    })
    .catch(function () {
      // Autoplay wurde blockiert.
    });
}


// =============================
// MUSIC BUTTON
// =============================

function setupMusicButton(
  musicButton
) {
  updateMusicButton(
    musicButton
  );

  musicButton.addEventListener(
    "click",
    function () {
      const muted =
        !isMusicMuted();

      setMusicMuted(muted);

      updateMusicButton(
        musicButton
      );

      if (muted === false) {
        startBackgroundMusic();

        fadeMusicIn();
      }
    }
  );
}


// =============================
// FIRST INTERACTION
// =============================

function startMusicAfterInteraction() {
  startBackgroundMusic();

  document.removeEventListener(
    "pointerdown",
    startMusicAfterInteraction
  );

  document.removeEventListener(
    "keydown",
    startMusicAfterInteraction
  );
}


document.addEventListener(
  "pointerdown",
  startMusicAfterInteraction
);

document.addEventListener(
  "keydown",
  startMusicAfterInteraction
);


// =============================
// DEFINE HEADER
// =============================

customElements.define(
  "game-header",
  GameHeader
);
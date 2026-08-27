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

// Jede Seite ist ein eigenes HTML-Dokument. Beim Seitenwechsel wird das
// alte Dokument samt Audio-Objekt weggeworfen – die Musik kann also nicht
// wirklich "durchlaufen". Damit sie sich trotzdem so anhört, merkt sich
// jede Seite in der sessionStorage zwei Dinge:
//
// 1. an welcher Stelle das Stück steht (MUSIC_TIME_KEY)
// 2. wann diese Stelle notiert wurde   (MUSIC_SAVED_AT_KEY)
//
// Die nächste Seite spult genau dorthin vor – plus die Ladezeit, damit
// kein Stück doppelt gespielt wird – und spielt von da weiter.
//
// Musik ist der Normalfall: Wer die Startseite öffnet, bekommt sie zu
// hören. Nur wer den Ton ausschaltet, behält Ruhe – diese Entscheidung
// merken wir uns dauerhaft (localStorage), nicht nur für den Tab.

const MUSIC_MUTED_KEY =
  "guessWhoMusicMuted";

const MUSIC_TIME_KEY =
  "guessWhoMusicTime";

const MUSIC_SAVED_AT_KEY =
  "guessWhoMusicSavedAt";

const MUSIC_VOLUME = 0.35;

// Länger als so viele Sekunden dauert kein Seitenwechsel. Ist mehr Zeit
// vergangen, war die Musik zwischendurch aus und wir spulen nicht vor.
const MAX_GAP_SECONDS = 10;

// So lange warten wir höchstens darauf, dass der Browser die Datei
// kennt. Danach fangen wir lieber von vorne an als gar nicht.
const METADATA_TIMEOUT = 2000;

// So oft versuchen wir das Vorspulen, falls der Browser es verwirft.
const MAX_SEEK_ATTEMPTS = 3;

let backgroundMusic = null;

let musicStartRequested = false;

let fadeInterval = null;

// Stelle, an der es weitergehen soll. 0 heisst: von vorne.
let musicTargetTime =
  readSavedMusicTime();

// Solange das Vorspulen nicht geklappt hat, darf die aktuelle Position
// nicht gespeichert werden – sonst überschreibt eine 0 die gemerkte
// Stelle und das Stück fängt ab dann jedes Mal von vorne an.
let musicPositionApplied =
  musicTargetTime <= 0;

let musicSeekAttempts = 0;

// Fortsetzung von der vorherigen Seite? Dann nicht einblenden, sondern
// direkt in voller Lautstärke weiterspielen.
let musicIsResuming =
  musicTargetTime > 0;


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

  backgroundMusic.preload = "auto";

  // Zuerst leise starten.
  backgroundMusic.volume = 0;

  backgroundMusic.muted =
    isMusicMuted();

  backgroundMusic.addEventListener(
    "timeupdate",
    handleMusicTimeUpdate
  );

  return backgroundMusic;
}


// =============================
// SAVED POSITION
// =============================

function readSavedMusicTime() {
  const savedTime =
    Number(
      sessionStorage.getItem(
        MUSIC_TIME_KEY
      )
    );

  if (
    Number.isFinite(savedTime) === false ||
    savedTime <= 0
  ) {
    return 0;
  }

  // Die Ladezeit der neuen Seite mitzählen, damit das Stück weiterläuft,
  // statt die letzten Sekunden zu wiederholen.
  const savedAt =
    Number(
      sessionStorage.getItem(
        MUSIC_SAVED_AT_KEY
      )
    );

  let gap = 0;

  if (
    Number.isFinite(savedAt) === true &&
    savedAt > 0
  ) {
    gap =
      (Date.now() - savedAt) / 1000;
  }

  if (
    gap < 0 ||
    gap > MAX_GAP_SECONDS
  ) {
    gap = 0;
  }

  return savedTime + gap;
}


// =============================
// SEEK TO POSITION
// =============================

// Achtung: happy.mp3 hat keinen Xing-Header, deshalb kennt der Browser
// die Länge des Stücks nicht – music.duration ist Infinity. Das ist kein
// Fehler und kein Grund, das Vorspulen zu überspringen: gesprungen wird
// trotzdem, nur der Schleifen-Übertrag (hinten raus, vorne rein) geht
// dann nicht und wird weggelassen.

function getSeekTarget() {
  const duration =
    getBackgroundMusic().duration;

  if (
    Number.isFinite(duration) === true &&
    duration > 0
  ) {
    // Das Stück läuft in einer Schleife: hinten raus heisst vorne rein.
    return musicTargetTime % duration;
  }

  return musicTargetTime;
}


function seekToSavedPosition() {
  const music =
    getBackgroundMusic();

  musicSeekAttempts =
    musicSeekAttempts + 1;

  musicTargetTime = getSeekTarget();

  music.currentTime =
    musicTargetTime;
}


// Ruft callback auf, sobald der Browser die Datei so weit kennt, dass er
// springen kann – spätestens aber nach METADATA_TIMEOUT, damit die Musik
// nicht ewig stumm bleibt.
function whenMusicReady(callback) {
  const music =
    getBackgroundMusic();

  let done = false;

  let timer = null;

  function finish() {
    if (done === true) {
      return;
    }

    done = true;

    clearTimeout(timer);

    music.removeEventListener(
      "loadedmetadata",
      finish
    );

    callback();
  }

  // Nichts vorzuspulen: sofort loslegen.
  if (
    musicPositionApplied === true ||
    music.readyState >= 1
  ) {
    callback();

    return;
  }

  timer =
    setTimeout(
      finish,
      METADATA_TIMEOUT
    );

  music.addEventListener(
    "loadedmetadata",
    finish
  );
}


// =============================
// SAVE POSITION
// =============================

function handleMusicTimeUpdate() {
  if (musicPositionApplied === false) {
    // Hat der Browser den Sprung verworfen, steht die Wiedergabe noch
    // am Anfang – dann versuchen wir es mit mehr Puffer nochmal.
    if (
      backgroundMusic.currentTime + 2 <
        musicTargetTime &&
      musicSeekAttempts < MAX_SEEK_ATTEMPTS
    ) {
      seekToSavedPosition();

      return;
    }

    musicPositionApplied = true;
  }

  saveMusicPosition();
}


function saveMusicPosition() {
  if (backgroundMusic === null) {
    return;
  }

  // Die gemerkte Stelle nicht mit einer 0 überschreiben, solange das
  // Vorspulen noch aussteht.
  if (musicPositionApplied === false) {
    return;
  }

  sessionStorage.setItem(
    MUSIC_TIME_KEY,
    String(
      backgroundMusic.currentTime
    )
  );

  sessionStorage.setItem(
    MUSIC_SAVED_AT_KEY,
    String(Date.now())
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

// Der Ton-Aus-Wunsch gilt über die Sitzung hinaus: Wer einmal
// ausgeschaltet hat, soll die Musik nicht beim nächsten Öffnen wieder
// um die Ohren bekommen.

function isMusicMuted() {
  return (
    localStorage.getItem(
      MUSIC_MUTED_KEY
    ) === "true"
  );
}


function setMusicMuted(muted) {
  localStorage.setItem(
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

  const targetVolume = MUSIC_VOLUME;

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
  if (musicStartRequested === true) {
    return;
  }

  musicStartRequested = true;

  const music =
    getBackgroundMusic();

  music.muted =
    isMusicMuted();

  // Erst an die gemerkte Stelle, dann abspielen. Andersherum hört man
  // kurz den Anfang des Stücks.
  whenMusicReady(
    function () {
      if (
        musicPositionApplied === false
      ) {
        seekToSavedPosition();
      }

      playBackgroundMusic();
    }
  );
}


function playBackgroundMusic() {
  const music =
    getBackgroundMusic();

  music
    .play()
    .then(function () {
      stopWaitingForInteraction();

      if (music.muted === true) {
        return;
      }

      if (musicIsResuming === true) {
        // Fortsetzung von der vorherigen Seite: sofort in voller
        // Lautstärke weiter, sonst hört man jeden Seitenwechsel.
        clearInterval(fadeInterval);

        music.volume = MUSIC_VOLUME;

        return;
      }

      fadeMusicIn();
    })
    .catch(function () {
      // Autoplay wurde blockiert – dann startet die Musik beim ersten
      // Klick oder Tastendruck (siehe unten).
      musicStartRequested = false;
    });
}


// =============================
// START ON PAGE LOAD
// =============================

// Musik ist der Normalfall, also fängt jede Seite von sich aus an: die
// Startseite von vorne, jede Folgeseite an der gemerkten Stelle.
startBackgroundMusic();


// Kommt die Seite aus dem Zurück-Cache des Browsers, ist das Audio-Objekt
// noch da, wurde aber pausiert.
window.addEventListener(
  "pageshow",
  function () {
    if (
      backgroundMusic !== null &&
      backgroundMusic.paused === false
    ) {
      return;
    }

    musicStartRequested = false;

    startBackgroundMusic();
  }
);


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
        // Bewusstes Einschalten: hier soll eingeblendet werden.
        musicIsResuming = false;

        startBackgroundMusic();

        fadeMusicIn();
      }
    }
  );
}


// =============================
// FIRST INTERACTION
// =============================

// Browser blockieren Ton, bis jemand die Seite angefasst hat. Klappt der
// Start beim Laden nicht, holt der erste Klick oder Tastendruck ihn nach.
// Die Listener bleiben so lange liegen, bis wirklich Musik läuft.

function startMusicAfterInteraction() {
  startBackgroundMusic();
}


function stopWaitingForInteraction() {
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
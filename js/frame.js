// =============================
// FRAME
// =============================

// Die Spielseiten laufen in einem Rahmen; darüber liegt die Hülle mit der
// Hintergrundmusik (siehe index.html). Diese Datei ist die einzige
// Verbindung dorthin. Sie macht drei Dinge:
//
// 1. Seiten, die ohne Hülle geöffnet wurden, zur Hülle schicken
// 2. die erste Berührung melden, damit der Browser den Ton freigibt
// 3. den Ton-Aus-Knopf im Header bedienen (siehe js/header.js)
//
// Muss im <head> geladen werden, und zwar nach js/icons.js und vor
// js/header.js: Der Header ruft setupMusicButton, sobald sein Element im
// Body auftaucht.

// =============================
// OHNE HÜLLE GEÖFFNET
// =============================

// Ohne Hülle gibt es keine Musik. Wer eine Spielseite direkt öffnet – per
// Lesezeichen, Adressleiste oder Rechtsklick im Editor –, wird deshalb zur
// Hülle geschickt. Die lädt dann anhand des Spielstands wieder genau diese
// Seite (siehe js/shell.js), es geht also nichts verloren.
//
// replace und nicht href: Der Browser-Zurück soll nicht zwischen Seite und
// Hülle hin und her springen.

const isInsideShell = window.parent !== window;

if (isInsideShell === false) {
  window.location.replace("index.html");
}

// =============================
// ZUGRIFF AUF DIE HÜLLE
// =============================

// Gleiche Herkunft, der Zugriff ist also erlaubt. Der try schützt nur vor
// dem Fall, dass die Seite doch irgendwo fremd eingebettet wurde – dann
// wirft der Zugriff, und das Spiel läuft einfach ohne Musik weiter.

function getShell() {
  if (isInsideShell === false) {
    return null;
  }

  try {
    if (typeof window.parent.notifyInteraction !== "function") {
      return null;
    }

    return window.parent;
  } catch (error) {
    return null;
  }
}

// =============================
// ERSTE BERÜHRUNG MELDEN
// =============================

// Muss synchron im Event-Handler passieren: Nur dann zählt die Berührung
// auch für die Hülle und der Browser gibt dort den Ton frei.
//
// Die Listener bleiben liegen, statt sich nach dem ersten Mal abzumelden –
// die Hülle merkt selber, dass die Musik schon läuft (siehe js/music.js),
// und ein Funktionsaufruf pro Klick kostet nichts.

function notifyShellInteraction() {
  const shell = getShell();

  if (shell === null) {
    return;
  }

  shell.notifyInteraction();
}

document.addEventListener("pointerdown", notifyShellInteraction);

document.addEventListener("keydown", notifyShellInteraction);

// =============================
// BUTTON UPDATE
// =============================

function updateMusicButton(musicButton) {
  const shell = getShell();

  if (shell === null) {
    return;
  }

  const muted = shell.isMusicMuted();

  const icon = musicButton.querySelector(".music-icon");

  if (icon === null) {
    return;
  }

  if (muted === true) {
    musicButton.setAttribute("aria-label", "Unmute music");

    musicButton.title = "Unmute music";

    icon.dataset.icon = "volume-off";
  } else {
    musicButton.setAttribute("aria-label", "Mute music");

    musicButton.title = "Mute music";

    icon.dataset.icon = "volume";
  }

  renderIcons(musicButton);
}

// =============================
// MUSIC BUTTON
// =============================

function setupMusicButton(musicButton) {
  const shell = getShell();

  // Ohne Hülle gibt es keine Musik – dann auch keinen Knopf dafür
  if (shell === null) {
    musicButton.remove();

    return;
  }

  updateMusicButton(musicButton);

  musicButton.addEventListener("click", function () {
    shell.toggleMusicMuted();

    updateMusicButton(musicButton);
  });
}

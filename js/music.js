// =============================
// BACKGROUND MUSIC
// =============================

// Läuft nur in der Hülle (siehe index.html), nicht in den Spielseiten.
//
// Die Hülle wechselt nie, das <audio> hier wird also nie weggeworfen: Die
// Musik läuft von sich aus durch, über alle Seitenwechsel im Rahmen
// hinweg. Es braucht darum kein Merken der Stelle und kein Vorspulen.
//
// Ruhe ist der Normalfall: Wer das Spiel öffnet, hört erst einmal nichts.
// Nur wer den Ton einschaltet, bekommt Musik – diese Entscheidung merken
// wir uns dauerhaft (localStorage), nicht nur für den Tab.

const MUSIC_MUTED_KEY = "guessWhoMusicMuted";

const MUSIC_VOLUME = 0.35;

const music = document.getElementById("background-music");

// Läuft die Musik schon? Solange der Browser den Ton blockiert, bleibt das
// false und der nächste Klick im Spiel versucht es erneut.
let musicStarted = false;

let fadeInterval = null;

// Erst leise, dann eingeblendet (siehe fadeMusicIn)
music.volume = 0;

// =============================
// MUTED STATE
// =============================

// Ohne gemerkte Entscheidung ist der Ton aus – nur ein ausdrückliches
// "false" im Speicher schaltet ihn ein.
function isMusicMuted() {
  return localStorage.getItem(MUSIC_MUTED_KEY) !== "false";
}

function setMusicMuted(muted) {
  localStorage.setItem(MUSIC_MUTED_KEY, String(muted));

  music.muted = muted;
}

// Wird aus dem Rahmen gerufen (siehe js/frame.js) und gibt den neuen
// Zustand zurück, damit die Seite ihren Knopf beschriften kann.
function toggleMusicMuted() {
  const muted = !isMusicMuted();

  setMusicMuted(muted);

  if (muted === false) {
    // Bewusstes Einschalten: hier soll eingeblendet werden
    startMusic();

    fadeMusicIn();
  }

  return muted;
}

// =============================
// FADE IN
// =============================

function fadeMusicIn() {
  clearInterval(fadeInterval);

  music.volume = 0;

  fadeInterval = setInterval(function () {
    if (music.volume >= MUSIC_VOLUME - 0.02) {
      music.volume = MUSIC_VOLUME;

      clearInterval(fadeInterval);

      return;
    }

    music.volume = Math.min(MUSIC_VOLUME, music.volume + 0.03);
  }, 40);
}

// =============================
// START MUSIC
// =============================

function startMusic() {
  if (musicStarted === true) {
    return;
  }

  // Bei ausgeschaltetem Ton läuft gar nichts los. So beginnt das Stück beim
  // Einschalten von vorne, statt still mitzulaufen.
  if (isMusicMuted() === true) {
    return;
  }

  musicStarted = true;

  music.muted = false;

  music
    .play()
    .then(function () {
      fadeMusicIn();
    })
    .catch(function () {
      // Autoplay wurde blockiert – dann startet die Musik bei der ersten
      // Berührung, die der Rahmen hierher meldet (siehe unten)
      musicStarted = false;
    });
}

// =============================
// ERSTE BERÜHRUNG
// =============================

// Browser blockieren Ton, bis jemand die Seite angefasst hat. Angefasst
// wird aber der Rahmen, nicht diese Seite – dessen Klicks kommen hier
// nicht von selber an. js/frame.js ruft deshalb diese Funktion.
//
// Sie muss synchron im Klick-Handler des Rahmens laufen: Nur dann gilt die
// Berührung auch für diese Seite und der Browser gibt den Ton frei.

function notifyInteraction() {
  startMusic();
}

// Zusätzlich für den Fall, dass doch einmal direkt hier geklickt wird
document.addEventListener("pointerdown", notifyInteraction);

document.addEventListener("keydown", notifyInteraction);

// =============================
// START BEIM LADEN
// =============================

startMusic();

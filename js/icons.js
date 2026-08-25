// =============================
// ICONS
// =============================

// Die funktionalen Bedienelemente (Zurück, Schliessen, Würfel, Reset …)
// benutzen Inline-SVGs statt Buchstaben oder Emojis. Vorher standen dort
// ein getipptes "X", ein "i" und ein "+" – die sahen je nach Schriftart
// anders aus und wirkten unfertig.
//
// Die Emojis auf den Kacheln (🏰 🐾 🍄 👤 👥) bleiben Emojis: die gehören
// zum Inhalt und bringen genau die Farbe mit, die das Spiel dort braucht.
//
// Verwendung im HTML:
//
//   <span data-icon="dice"></span>
//
// Beim Laden der Seite ersetzt renderIcons() jedes solche Element durch
// das passende SVG. Für Elemente, die erst im JavaScript entstehen, kann
// renderIcons(element) auch von Hand aufgerufen werden.
//
// Die Pfade sind im 24x24-Raster gezeichnet und benutzen currentColor –
// so färbt sich ein Icon automatisch mit, wenn sein Button beim Hover die
// Textfarbe wechselt.

// Punkte (Würfelaugen, i-Punkt, Zentrum der Zielscheibe) sind gefüllte
// Kreise. Als Strich der Länge null mit runder Kappe wären sie nur so
// dick wie die Linienstärke und damit kaum zu sehen.
const dot = (x, y, r) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="currentColor" stroke="none"/>`;

const iconPaths = {
  "arrow-left": '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',

  close: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',

  info: '<circle cx="12" cy="12" r="9"/><path d="M12 16.5v-5"/>' + dot(12, 8, 1.15),

  dice:
    '<rect x="3" y="3" width="18" height="18" rx="5"/>' +
    dot(8.5, 8.5, 1.5) +
    dot(15.5, 8.5, 1.5) +
    dot(8.5, 15.5, 1.5) +
    dot(15.5, 15.5, 1.5),

  refresh:
    '<path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/><path d="M21 3.5V8h-4.5"/>' +
    '<path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/><path d="M3 20.5V16h4.5"/>',

  home: '<path d="M3 10.4 12 3l9 7.4"/><path d="M5.5 9.2V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V9.2"/>',

  check: '<path d="M20 6.5 9.5 17 4 11.5"/>',

  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',

  // Zielscheibe für den Final Guess
  target:
    '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/>' +
    dot(12, 12, 1.6),

  // Sprechblase mit Fragezeichen für "Ask".
  ask:
    '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>' +
    '<path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/>' +
    dot(12, 16.8, 1.15),

  // Pfeil nach rechts für "Continue"
  "arrow-right": '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',

  // Pfeil nach unten für das Fragen-Dropdown
  "chevron-down": '<path d="m6 9.5 6 6 6-6"/>',
};

// =============================
// SVG BAUEN
// =============================

function iconMarkup(name) {
  const paths = iconPaths[name];

  if (paths === undefined) {
    return "";
  }

  return `
    <svg
      class="icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >${paths}</svg>
  `;
}

// =============================
// ICONS EINSETZEN
// =============================

// Ersetzt alle <span data-icon="..."> innerhalb von root durch ihr SVG.
// Bereits gefüllte Platzhalter werden übersprungen, damit ein zweiter
// Aufruf (z. B. nach dem Nachladen von Karten) nichts doppelt macht.
function renderIcons(root) {
  const scope = root === undefined ? document : root;

  scope.querySelectorAll("[data-icon]").forEach((element) => {
    if (element.dataset.iconDone === "true") {
      return;
    }

    element.innerHTML = iconMarkup(element.dataset.icon);

    element.dataset.iconDone = "true";
  });
}

// Die Seiten laden diese Datei im <head>, das Markup ist also noch nicht
// da – deshalb warten wir auf das fertige Dokument. Der Header (siehe
// js/header.js) baut seine Icons selber ein, weil er schon vorher steht.
document.addEventListener("DOMContentLoaded", function () {
  renderIcons();
});

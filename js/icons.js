// =============================
// ICONS
// =============================

// Die funktionalen Bedienelemente benutzen Inline-SVGs.
//
// Verwendung im HTML:
//
//   <span data-icon="dice"></span>
//
// renderIcons() ersetzt die Platzhalter durch das passende SVG.
//
// Icons können später auch gewechselt werden, zum Beispiel:
//
//   element.dataset.icon = "volume-off";
//   renderIcons(element);
//
// Das ist für den Musikbutton wichtig.


// =============================
// HELPER
// =============================

// Gefüllter Punkt für Würfelaugen, Info-Icon usw.
const dot = (x, y, r) =>
  `<circle
    cx="${x}"
    cy="${y}"
    r="${r}"
    fill="currentColor"
    stroke="none"
  />`;


// =============================
// ICON PATHS
// =============================

const iconPaths = {
  // Pfeil nach links
  "arrow-left":
    '<path d="M19 12H5"/>' +
    '<path d="m12 19-7-7 7-7"/>',

  // Schliessen
  close:
    '<path d="M18 6 6 18"/>' +
    '<path d="m6 6 12 12"/>',

  // Info
  info:
    '<circle cx="12" cy="12" r="9"/>' +
    '<path d="M12 16.5v-5"/>' +
    dot(12, 8, 1.15),

  // Würfel
  dice:
    '<rect x="3" y="3" width="18" height="18" rx="5"/>' +
    dot(8.5, 8.5, 1.5) +
    dot(15.5, 8.5, 1.5) +
    dot(8.5, 15.5, 1.5) +
    dot(15.5, 15.5, 1.5),

  // Reset
  refresh:
    '<path d="M3 12a9 9 0 0 1 15.3-6.4L21 8"/>' +
    '<path d="M21 3.5V8h-4.5"/>' +
    '<path d="M21 12a9 9 0 0 1-15.3 6.4L3 16"/>' +
    '<path d="M3 20.5V16h4.5"/>',

  // Home
  home:
    '<path d="M3 10.4 12 3l9 7.4"/>' +
    '<path d="M5.5 9.2V19a1.5 1.5 0 0 0 1.5 1.5h10a1.5 1.5 0 0 0 1.5-1.5V9.2"/>',

  // Haken
  check:
    '<path d="M20 6.5 9.5 17 4 11.5"/>',

  // Plus
  plus:
    '<path d="M12 5v14"/>' +
    '<path d="M5 12h14"/>',

  // Zielscheibe für Final Guess
  target:
    '<circle cx="12" cy="12" r="9"/>' +
    '<circle cx="12" cy="12" r="4.5"/>' +
    dot(12, 12, 1.6),

  // Frage
  ask:
    '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>' +
    '<path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3"/>' +
    dot(12, 16.8, 1.15),

  // Pfeil nach rechts
  "arrow-right":
    '<path d="M5 12h14"/>' +
    '<path d="m12 5 7 7-7 7"/>',

  // Dropdown-Pfeil
  "chevron-down":
    '<path d="m6 9.5 6 6 6-6"/>',


  // =============================
  // MUSIC
  // =============================

  // Lautsprecher mit Ton
  volume:
    '<path d="M11 5 6 9H3v6h3l5 4Z"/>' +
    '<path d="M15.5 8.5a5 5 0 0 1 0 7"/>' +
    '<path d="M18.5 5.5a9 9 0 0 1 0 13"/>',

  // Lautsprecher stumm
  "volume-off":
    '<path d="M11 5 6 9H3v6h3l5 4Z"/>' +
    '<path d="m16 9 5 5"/>' +
    '<path d="m21 9-5 5"/>',
};


// =============================
// SVG BAUEN
// =============================

function iconMarkup(name) {
  const paths =
    iconPaths[name];

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
    >
      ${paths}
    </svg>
  `;
}


// =============================
// ICONS EINSETZEN
// =============================

// Ersetzt alle Elemente mit data-icon.
//
// Anders als vorher merkt sich die Funktion,
// WELCHES Icon zuletzt gerendert wurde.
//
// Dadurch kann beispielsweise:
//
// volume
//
// später zu:
//
// volume-off
//
// geändert werden.

function renderIcons(root) {
  const scope =
    root === undefined
      ? document
      : root;

  scope
    .querySelectorAll("[data-icon]")
    .forEach(function (element) {
      const iconName =
        element.dataset.icon;

      const renderedIcon =
        element.dataset.renderedIcon;

      // Nur überspringen, wenn genau dasselbe
      // Icon bereits gerendert wurde.
      if (
        renderedIcon === iconName
      ) {
        return;
      }

      element.innerHTML =
        iconMarkup(iconName);

      element.dataset.renderedIcon =
        iconName;
    });
}


// =============================
// INITIAL RENDER
// =============================

// icons.js wird im <head> geladen.
// Deshalb warten wir, bis das HTML vorhanden ist.
//
// Der Header ruft renderIcons(this)
// zusätzlich selbst auf.

document.addEventListener(
  "DOMContentLoaded",
  function () {
    renderIcons();
  }
);
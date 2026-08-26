// =============================
// CHARACTER SETS
// =============================

// Die Charaktere sind in Sets gruppiert. Pro Spiel wird genau ein Set
// gespielt, die Auswahl passiert auf character_sets.html.
// Die Charakter-Listen selber stehen in character_data.js.

// available: false -> die Kachel wird ausgegraut und ist nicht anklickbar
// custom: true     -> die Spieler stellen das Set selber zusammen
//                     (custom_set.html)
// mixed: true      -> die Charaktere werden aus den anderen Sets
//                     zusammengewürfelt (siehe createMixedCharacters)
// difficulty       -> wie schwer das Set im Single-Player zu erraten ist.
//                     Wird nur dort angezeigt (siehe sets.js), weil man im
//                     Multi-Player gegeneinander und nicht gegen den
//                     Computer spielt und somit keine vorgefertigten Fragen hat.

// Diese beiden Sets haben keine feste Charakter-Liste
const CUSTOM_SET_ID = "custom";
const MIX_SET_ID = "mix";

// Die möglichen Werte für difficulty und ihre Beschriftung auf der Kachel
const DIFFICULTY_LABELS = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

const characterSets = [
  {
    id: CUSTOM_SET_ID,
    name: "Custom",
    icon: "📷",
    available: true,
    custom: true,

    // Die Charaktere werden erst im Spiel erstellt und stehen dann im
    // Spielstand (siehe state.js)
    characters: [],
  },

  {
    id: "disney",
    name: "Disney",
    icon: "🏰",
    available: true,
    difficulty: "easy",
    characters: disneyCharacters,
  },

  {
    id: "animals",
    name: "Animals",
    icon: "🐾",
    available: true,
    difficulty: "medium",
    characters: animalsCharacters,
  },

  {
    id: "mario",
    name: "Super Mario",
    icon: "🍄",
    available: true,
    difficulty: "hard",
    characters: marioCharacters,
  },

  {
    id: MIX_SET_ID,
    name: "Mix",
    icon: "🎲",
    available: true,
    mixed: true,

    // Die Charaktere werden bei der Set-Wahl ausgewürfelt und stehen dann im
    // Spielstand (siehe state.js)
    characters: [],
  },

  {
    id: "coming-soon-3",
    name: "Friends",
    icon: "🔒",
    available: false,
    characters: [],
  },
];

function getCharacterSet(setId) {
  const set = characterSets.find((entry) => entry.id === setId);

  if (set === undefined) {
    return null;
  }

  return set;
}

// Die Beschriftung für die Schwierigkeit (null, wenn das Set keine hat)
function getDifficultyLabel(difficulty) {
  const label = DIFFICULTY_LABELS[difficulty];

  if (label === undefined) {
    return null;
  }

  return label;
}

// Die Charaktere des gewählten Sets (leer, wenn das Set unbekannt ist).
// Beim Custom- und beim Mix-Set kommen sie aus dem Spielstand, sonst aus
// der Liste oben.
function getSetCharacters(state) {
  if (state.characterSetId === CUSTOM_SET_ID) {
    return state.customCharacters;
  }

  if (state.characterSetId === MIX_SET_ID) {
    return state.mixCharacters;
  }

  const set = getCharacterSet(state.characterSetId);

  if (set === null) {
    return [];
  }

  return set.characters;
}

// =============================
// MIXED CHARACTER SET
// =============================

// So viele Charaktere kommen aus jedem Set in die Mischung. Gleich viele
// pro Set, damit jedes Set sicher vertreten ist und die Mischung nicht
// zufällig von einem Set dominiert wird.
const MIX_CHARACTERS_PER_SET = 6;

// Die Sets, aus denen gemischt wird: alles mit einer festen Charakter-Liste
function getMixableSets() {
  return characterSets.filter(
    (set) =>
      set.available !== false &&
      set.custom !== true &&
      set.mixed !== true,
  );
}

// Zieht "count" verschiedene Charaktere aus der Liste. Gemischt wird eine
// Kopie, damit die Sets oben unverändert bleiben.
function pickRandomCharacters(characters, count) {
  const pool = characters.slice();

  const picked = [];

  while (picked.length < count && pool.length > 0) {
    const randomIndex = Math.floor(Math.random() * pool.length);

    picked.push(pool[randomIndex]);

    pool.splice(randomIndex, 1);
  }

  return picked;
}

// Wie viele Charaktere im Mix landen. Ein Set mit weniger Charakteren als
// MIX_CHARACTERS_PER_SET steuert einfach alle bei, die es hat.
function getMixCharacterCount() {
  let count = 0;

  getMixableSets().forEach((set) => {
    count += Math.min(set.characters.length, MIX_CHARACTERS_PER_SET);
  });

  return count;
}

// Würfelt das Mix-Set zusammen: aus jedem Set gleich viele Charaktere,
// danach wird die ganze Mischung durchgeschüttelt, damit die Sets auf dem
// Board nicht blockweise nebeneinander stehen.
//
// Wichtig: Die Charaktere werden neu durchnummeriert. Die id läuft in jedem
// Set von 1 an, es gibt also jede id mehrfach – und das Board erkennt die
// Karten nur an ihrer id (siehe game.js). Ohne neue Nummern würde ein Klick
// gleich mehrere Karten ausschliessen.
function createMixedCharacters() {
  const mixed = [];

  getMixableSets().forEach((set) => {
    pickRandomCharacters(set.characters, MIX_CHARACTERS_PER_SET).forEach(
      (character) => {
        mixed.push(character);
      },
    );
  });

  return pickRandomCharacters(mixed, mixed.length).map(
    (character, index) => ({
      ...character,
      id: index + 1,
    }),
  );
}

// =============================
// CREATE CHARACTER CARD
// =============================

function createCharacterCard(character, onClick) {
  const card = document.createElement("div");

  card.classList.add("character-card");

  card.dataset.id = character.id;

  const image = document.createElement("img");

  image.src = character.image;
  image.alt = character.name;

  const name = document.createElement("div");

  name.classList.add("character-name");
  name.textContent = character.name;

  card.appendChild(image);
  card.appendChild(name);

  card.addEventListener("click", () => {
    onClick(character);
  });

  return card;
}

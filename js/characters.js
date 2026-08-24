// =============================
// CHARACTER SETS
// =============================

// Die Charaktere sind in Sets gruppiert. Pro Spiel wird genau ein Set
// gespielt, die Auswahl passiert auf character_sets.html.
// Die Charakter-Listen selber stehen in character_data.js.

// available: false -> die Kachel wird ausgegraut und ist nicht anklickbar
// custom: true     -> die Spieler stellen das Set selber zusammen
//                     (custom_set.html)

// Das Custom-Set hat keine feste Charakter-Liste
const CUSTOM_SET_ID = "custom";

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
    characters: disneyCharacters,
  },

  {
    id: "animals",
    name: "Animals",
    icon: "🐾",
    available: true,
    characters: animalsCharacters,
  },

  {
    id: "mario",
    name: "Mario",
    icon: "🍄",
    available: true,
    characters: marioCharacters,
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

// Die Charaktere des gewählten Sets (leer, wenn das Set unbekannt ist).
// Beim Custom-Set kommen sie aus dem Spielstand, sonst aus der Liste oben.
function getSetCharacters(state) {
  if (state.characterSetId === CUSTOM_SET_ID) {
    return state.customCharacters;
  }

  const set = getCharacterSet(state.characterSetId);

  if (set === null) {
    return [];
  }

  return set.characters;
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

// =============================
// CHARACTER SETS
// =============================

// Die Charaktere sind in Sets gruppiert. Pro Spiel wird genau ein Set
// gespielt, die Auswahl passiert auf character_sets.html.
// Die Charakter-Listen selber stehen in character_data.js.

// available: false -> die Kachel wird ausgegraut und ist nicht anklickbar

const characterSets = [
  {
    id: "disney",
    name: "Disney",
    icon: "🏰",
    available: true,
    characters: disneyCharacters,
  },

  {
    id: "coming-soon-1",
    name: "Animals",
    icon: "🐾",
    available: true,
    characters: animalsCharacters,
  },

  {
    id: "coming-soon-2",
    name: "Marvel",
    icon: "🔒",
    available: false,
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

// Die Charaktere des gewählten Sets (leer, wenn das Set unbekannt ist)
function getSetCharacters(setId) {
  const set = getCharacterSet(setId);

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

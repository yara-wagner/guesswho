// =============================
// CHARACTER DATA
// =============================

// Die Charaktere sind in Sets gruppiert. Pro Spiel wird genau ein Set
// gespielt, die Auswahl passiert auf character_sets.html.

const disneyCharacters = [
  {
    id: 1,
    name: "Aladdin",
    image: "src/disney/aladdin.avif",
  },

  {
    id: 2,
    name: "Ariel",
    image: "src/disney/ariel.avif",
  },

  {
    id: 3,
    name: "Bambi",
    image: "src/disney/bambi.avif",
  },

  {
    id: 4,
    name: "Cinderella",
    image: "src/disney/cinderella.avif",
  },

  {
    id: 5,
    name: "Donald Duck",
    image: "src/disney/donald_duck.avif",
  },

  {
    id: 6,
    name: "Dumbo",
    image: "src/disney/dumbo.avif",
  },

  {
    id: 7,
    name: "Goofy",
    image: "src/disney/goofy.avif",
  },

  {
    id: 8,
    name: "Hercules",
    image: "src/disney/hercules.avif",
  },

  {
    id: 9,
    name: "Lightning McQueen",
    image: "src/disney/lightning_mcqueen.avif",
  },

  {
    id: 10,
    name: "Merida",
    image: "src/disney/merida.avif",
  },

  {
    id: 11,
    name: "Mickey Mouse",
    image: "src/disney/mickey_mouse.avif",
  },

  {
    id: 12,
    name: "Mike",
    image: "src/disney/mike.avif",
  },

  {
    id: 13,
    name: "Moana",
    image: "src/disney/moana.avif",
  },

  {
    id: 14,
    name: "Olaf",
    image: "src/disney/olaf.avif",
  },

  {
    id: 15,
    name: "Pinocchio",
    image: "src/disney/pinocchio.avif",
  },

  {
    id: 16,
    name: "Stitch",
    image: "src/disney/stitch.avif",
  },

  {
    id: 17,
    name: "Tinker Bell",
    image: "src/disney/tinker_bell.avif",
  },

  {
    id: 18,
    name: "Winnie The Pooh",
    image: "src/disney/winnie_the_pooh.avif",
  },
];

// =============================
// CHARACTER SETS
// =============================

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
    icon: "🔒",
    available: false,
    characters: [],
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

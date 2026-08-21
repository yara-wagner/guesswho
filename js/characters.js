// =============================
// CHARACTER DATA
// =============================

const characters = [
  {
    id: 1,
    name: "Aladdin",
    image: "src/aladdin.avif",
  },

  {
    id: 2,
    name: "Ariel",
    image: "src/ariel.avif",
  },

  {
    id: 3,
    name: "Bambi",
    image: "src/bambi.avif",
  },

  {
    id: 4,
    name: "Cinderella",
    image: "src/cinderella.avif",
  },

  {
    id: 5,
    name: "Donald Duck",
    image: "src/donald_duck.avif",
  },

  {
    id: 6,
    name: "Dumbo",
    image: "src/dumbo.avif",
  },

  {
    id: 7,
    name: "Goofy",
    image: "src/goofy.avif",
  },

    {
    id: 8,
    name: "Hercules",
    image: "src/hercules.avif",
  },

  {
    id: 9,
    name: "Lightning McQueen",
    image: "src/lightning_mcqueen.avif",
  },

  {
    id: 10,
    name: "Merida",
    image: "src/merida.avif",
  },
  
  {
    id: 11,
    name: "Mickey Mouse",
    image: "src/mickey_mouse.avif",
  },

  {
    id: 12,
    name: "Mike",
    image: "src/mike.avif",
  },

  {
    id: 13,
    name: "Moana",
    image: "src/moana.avif",
  },

  {
    id: 14,
    name: "Olaf",
    image: "src/olaf.avif",
  },

  {
    id: 15,
    name: "Pinocchio",
    image: "src/pinocchio.avif",
  },

  {
    id: 16,
    name: "Stitch",
    image: "src/stitch.avif",
  },

  {
    id: 17,
    name: "Tinker Bell",
    image: "src/tinker_bell.avif",
  },

  {
    id: 18,
    name: "Winnie The Pooh",
    image: "src/winnie_the_pooh.avif",
  },
];

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

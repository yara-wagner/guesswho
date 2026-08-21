// =============================
// CHARACTER DATA
// =============================

const characters = [
  {
    id: 1,
    name: "Alex",
    image: "https://i.pravatar.cc/300?img=11",
  },

  {
    id: 2,
    name: "Anna",
    image: "https://i.pravatar.cc/300?img=32",
  },

  {
    id: 3,
    name: "Ben",
    image: "https://i.pravatar.cc/300?img=12",
  },

  {
    id: 4,
    name: "Clara",
    image: "https://i.pravatar.cc/300?img=47",
  },

  {
    id: 5,
    name: "David",
    image: "https://i.pravatar.cc/300?img=13",
  },

  {
    id: 6,
    name: "Emma",
    image: "https://i.pravatar.cc/300?img=45",
  },

  {
    id: 7,
    name: "Felix",
    image: "https://i.pravatar.cc/300?img=15",
  },

  {
    id: 8,
    name: "Grace",
    image: "https://i.pravatar.cc/300?img=44",
  },

  {
    id: 9,
    name: "Henry",
    image: "https://i.pravatar.cc/300?img=14",
  },

  {
    id: 10,
    name: "Isabella",
    image: "https://i.pravatar.cc/300?img=49",
  },

  {
    id: 11,
    name: "Jack",
    image: "https://i.pravatar.cc/300?img=16",
  },

  {
    id: 12,
    name: "Julia",
    image: "https://i.pravatar.cc/300?img=48",
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

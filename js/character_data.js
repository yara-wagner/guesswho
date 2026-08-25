// =============================
// CHARACTER DATA
// =============================

// Reine Datenlisten pro Set. Die Logik dazu steht in characters.js.

const disneyCharacters = [
  {
    id: 1,
    name: "Aladdin",
    image: "src/disney/aladdin.avif",

    human: true,
    female: false,
    animal: false,
    hasHair: true,
    canFly: false,
  },

  {
    id: 2,
    name: "Ariel",
    image: "src/disney/ariel.avif",

    human: true,
    female: true,
    animal: false,
    hasHair: true,
    canFly: false,
  },

  {
    id: 3,
    name: "Bambi",
    image: "src/disney/bambi.avif",

    human: false,
    female: false,
    animal: true,
    hasHair: false,
    canFly: false,
  },

  {
    id: 4,
    name: "Cinderella",
    image: "src/disney/cinderella.avif",

    human: true,
    female: true,
    animal: false,
    hasHair: true,
    canFly: false,
  },

  {
    id: 5,
    name: "Donald Duck",
    image: "src/disney/donald_duck.avif",

    human: false,
    female: false,
    animal: true,
    hasHair: false,
    canFly: true,
  },

  {
    id: 6,
    name: "Dumbo",
    image: "src/disney/dumbo.avif",

    human: false,
    female: false,
    animal: true,
    hasHair: false,
    canFly: true,
  },

  {
    id: 7,
    name: "Goofy",
    image: "src/disney/goofy.avif",

    human: false,
    female: false,
    animal: true,
    hasHair: false,
    canFly: false,
  },

  {
    id: 8,
    name: "Hercules",
    image: "src/disney/hercules.avif",

    human: true,
    female: false,
    animal: false,
    hasHair: true,
    canFly: false,
  },

  {
    id: 9,
    name: "Lightning McQueen",
    image: "src/disney/lightning_mcqueen.avif",

    human: false,
    female: false,
    animal: false,
    hasHair: false,
    canFly: false,
  },

  {
    id: 10,
    name: "Merida",
    image: "src/disney/merida.avif",

    human: true,
    female: true,
    animal: false,
    hasHair: true,
    canFly: false,
  },

  {
    id: 11,
    name: "Mickey Mouse",
    image: "src/disney/mickey_mouse.avif",

    human: false,
    female: false,
    animal: true,
    hasHair: false,
    canFly: false,
  },

  {
    id: 12,
    name: "Mike",
    image: "src/disney/mike.avif",

    human: false,
    female: false,
    animal: false,
    hasHair: false,
    canFly: false,
  },

  {
    id: 13,
    name: "Moana",
    image: "src/disney/moana.avif",

    human: true,
    female: true,
    animal: false,
    hasHair: true,
    canFly: false,
  },

  {
    id: 14,
    name: "Olaf",
    image: "src/disney/olaf.avif",

    human: false,
    female: false,
    animal: false,
    hasHair: false,
    canFly: false,
  },

  {
    id: 15,
    name: "Pinocchio",
    image: "src/disney/pinocchio.avif",

    human: false,
    female: false,
    animal: false,
    hasHair: true,
    canFly: false,
  },

  {
    id: 16,
    name: "Stitch",
    image: "src/disney/stitch.avif",

    human: false,
    female: false,
    animal: false,
    hasHair: false,
    canFly: false,
  },

  {
    id: 17,
    name: "Tinker Bell",
    image: "src/disney/tinker_bell.avif",

    human: true,
    female: true,
    animal: false,
    hasHair: true,
    canFly: true,
  },

  {
    id: 18,
    name: "Winnie The Pooh",
    image: "src/disney/winnie_the_pooh.avif",

    human: false,
    female: false,
    animal: true,
    hasHair: false,
    canFly: false,
  },
];

const animalsCharacters = [
  {
    id: 1,
    name: "Giraffe",
    image: "src/animals/giraffe.jpg",
  },

  {
    id: 2,
    name: "Racoon",
    image: "src/animals/racoon.jpg",
  },

  {
    id: 3,
    name: "Tiger",
    image: "src/animals/tiger.jpg",
  },

  {
    id: 4,
    name: "Fox",
    image: "src/animals/fox.jpg",
  },

  {
    id: 5,
    name: "Rabbit",
    image: "src/animals/rabbit.jpg",
  },

  {
    id: 6,
    name: "Wolf",
    image: "src/animals/wolf.jpg",
  },

  {
    id: 7,
    name: "Cow",
    image: "src/animals/cow.jpg",
  },

  {
    id: 8,
    name: "Cat",
    image: "src/animals/cat.jpg",
  },

  {
    id: 9,
    name: "Dog",
    image: "src/animals/dog.jpg",
  },

  {
    id: 10,
    name: "Elephant",
    image: "src/animals/elephant.jpg",
  },

  {
    id: 11,
    name: "Fish",
    image: "src/animals/fish.jpg",
  },

  {
    id: 12,
    name: "Crocodile",
    image: "src/animals/crocodile.jpg",
  },

  {
    id: 13,
    name: "Pig",
    image: "src/animals/pig.jpg",
  },

  {
    id: 14,
    name: "Snake",
    image: "src/animals/snake.jpg",
  },

  {
    id: 15,
    name: "Sheep",
    image: "src/animals/sheep.jpg",
  },

  {
    id: 16,
    name: "Lion",
    image: "src/animals/lion.jpg",
  },

  {
    id: 17,
    name: "Penguin",
    image: "src/animals/penguin.jpg",
  },

  {
    id: 18,
    name: "Seal",
    image: "src/animals/seal.jpg",
  },
];

const marioCharacters = [
  {
    id: 1,
    name: "Mario",
    image: "src/mario/mario.png",
  },
  {
    id: 2,
    name: "Bowser",
    image: "src/mario/bowser.png",
  },
  {
    id: 3,
    name: "Daisy",
    image: "src/mario/daisy.png",
  },
  {
    id: 4,
    name: "Diddy Kong",
    image: "src/mario/diddy_kong.png",
  },
  {
    id: 5,
    name: "Rosalina",
    image: "src/mario/rosalina.png",
  },
  {
    id: 6,
    name: "Bowser Junior",
    image: "src/mario/bowser_junior.png",
  },
  {
    id: 7,
    name: "Donkey Kong",
    image: "src/mario/donkey_kong.png",
  },
  {
    id: 8,
    name: "Luigi",
    image: "src/mario/luigi.png",
  },
  {
    id: 9,
    name: "Princess Peach",
    image: "src/mario/princess_peach.png",
  },
  {
    id: 10,
    name: "Wario",
    image: "src/mario/wario.png",
  },
  {
    id: 11,
    name: "Yoshi",
    image: "src/mario/yoshi.png",
  },
  {
    id: 12,
    name: "Toad",
    image: "src/mario/Toad.png",
  },
  {
    id: 13,
    name: "Waluigi",
    image: "src/mario/waluigi.png",
  },
  {
    id: 14,
    name: "Birdo",
    image: "src/mario/birdo.png",
  },
  {
    id: 15,
    name: "Boo",
    image: "src/mario/boo.png",
  },
  {
    id: 16,
    name: "Koopa Troopa",
    image: "src/mario/koopa_troopa.png",
  },
  {
    id: 17,
    name: "Shy Guy",
    image: "src/mario/shy_guy.png",
  },
  {
    id: 18,
    name: "Goomba",
    image: "src/mario/goomba.png",
  },
];

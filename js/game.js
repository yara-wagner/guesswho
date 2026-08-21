// =============================
// CHARACTER DATA
// =============================

const characters = [
    {
        id: 1,
        name: "Alex",
        image: "https://i.pravatar.cc/300?img=11"
    },

    {
        id: 2,
        name: "Anna",
        image: "https://i.pravatar.cc/300?img=32"
    },

    {
        id: 3,
        name: "Ben",
        image: "https://i.pravatar.cc/300?img=12"
    },

    {
        id: 4,
        name: "Clara",
        image: "https://i.pravatar.cc/300?img=47"
    },

    {
        id: 5,
        name: "David",
        image: "https://i.pravatar.cc/300?img=13"
    },

    {
        id: 6,
        name: "Emma",
        image: "https://i.pravatar.cc/300?img=45"
    },

    {
        id: 7,
        name: "Felix",
        image: "https://i.pravatar.cc/300?img=15"
    },

    {
        id: 8,
        name: "Grace",
        image: "https://i.pravatar.cc/300?img=44"
    },

    {
        id: 9,
        name: "Henry",
        image: "https://i.pravatar.cc/300?img=14"
    },

    {
        id: 10,
        name: "Isabella",
        image: "https://i.pravatar.cc/300?img=49"
    },

    {
        id: 11,
        name: "Jack",
        image: "https://i.pravatar.cc/300?img=16"
    },

    {
        id: 12,
        name: "Julia",
        image: "https://i.pravatar.cc/300?img=48"
    }
];


// =============================
// GAME STATE
// =============================

let eliminatedCharacters = [];


// =============================
// DOM ELEMENTS
// =============================

const characterGrid =
    document.getElementById("character-grid");

const resetButton =
    document.getElementById("reset-button");

const remainingCounter =
    document.getElementById("remaining-counter");


// =============================
// CREATE CHARACTER CARDS
// =============================

function renderCharacters() {

    characterGrid.innerHTML = "";

    characters.forEach(character => {

        const card =
            document.createElement("div");

        card.classList.add("character-card");


        // Character ID speichern

        card.dataset.id = character.id;


        // Bild erstellen

        const image =
            document.createElement("img");

        image.src = character.image;
        image.alt = character.name;


        // Name erstellen

        const name =
            document.createElement("div");

        name.classList.add("character-name");

        name.textContent = character.name;


        // Elemente zur Karte hinzufügen

        card.appendChild(image);
        card.appendChild(name);


        // Klick Event

        card.addEventListener("click", () => {
            toggleCharacter(character.id, card);
        });


        // Karte ins Grid einfügen

        characterGrid.appendChild(card);
    });


    updateCounter();
}


// =============================
// ELIMINATE / RESTORE CHARACTER
// =============================

function toggleCharacter(characterId, card) {

    const alreadyEliminated =
        eliminatedCharacters.includes(characterId);


    if (alreadyEliminated) {

        // Charakter wieder aktivieren

        eliminatedCharacters =
            eliminatedCharacters.filter(
                id => id !== characterId
            );

        card.classList.remove("eliminated");

    } else {

        // Charakter eliminieren

        eliminatedCharacters.push(characterId);

        card.classList.add("eliminated");
    }


    updateCounter();
}


// =============================
// UPDATE COUNTER
// =============================

function updateCounter() {

    const remaining =
        characters.length -
        eliminatedCharacters.length;


    remainingCounter.textContent =
        `Remaining: ${remaining}`;
}


// =============================
// RESET BOARD
// =============================

function resetGame() {

    eliminatedCharacters = [];

    renderCharacters();
}


// =============================
// EVENT LISTENERS
// =============================

resetButton.addEventListener(
    "click",
    resetGame
);


// =============================
// START GAME
// =============================

renderCharacters();
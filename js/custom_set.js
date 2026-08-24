// =============================
// DOM ELEMENTS
// =============================

const customGrid = document.getElementById("custom-grid");

const addCardButton = document.getElementById("add-card-button");

const customSetHint = document.getElementById("custom-set-hint");

const startCustomGameButton = document.getElementById(
  "start-custom-game-button",
);

// =============================
// GAME STATE
// =============================

const gameState = loadGameState();

// =============================
// CUSTOM CHARACTER SET
// =============================

// Mit weniger Charakteren wäre das Spiel zu schnell vorbei
const MINIMUM_CHARACTERS = 6;

// Mehr Karten passen nicht mehr sinnvoll auf das Board (und die Bilder
// müssen alle in die sessionStorage passen)
const MAXIMUM_CHARACTERS = 18;

// Kantenlänge, auf die die hochgeladenen Bilder verkleinert werden
const IMAGE_SIZE = 360;

// Die Karten in der Reihenfolge des Grids: { name, image }
// image ist eine Data-URL oder null, solange kein Bild gewählt wurde
const cards = [];

// =============================
// IMAGE UPLOAD
// =============================

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error("read failed")));

    reader.readAsDataURL(file);
  });
}

function loadImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("decode failed")));

    image.src = dataUrl;
  });
}

// Quadratischer Ausschnitt aus der Mitte des Bildes, verkleinert auf
// IMAGE_SIZE. Die Karten sind quadratisch und die Bilder landen als
// Data-URL in der sessionStorage – ein Originalfoto wäre viel zu gross.
function cropToSquare(image) {
  const side = Math.min(image.naturalWidth, image.naturalHeight);

  const canvas = document.createElement("canvas");

  canvas.width = IMAGE_SIZE;
  canvas.height = IMAGE_SIZE;

  canvas
    .getContext("2d")
    .drawImage(
      image,
      (image.naturalWidth - side) / 2,
      (image.naturalHeight - side) / 2,
      side,
      side,
      0,
      0,
      IMAGE_SIZE,
      IMAGE_SIZE,
    );

  return canvas.toDataURL("image/jpeg", 0.8);
}

async function chooseImage(file) {
  const dataUrl = await readImageFile(file);

  const image = await loadImage(dataUrl);

  return cropToSquare(image);
}

// =============================
// CREATE EDITOR CARD
// =============================

function createEditorCard(card) {
  const element = document.createElement("div");

  element.classList.add("custom-card");

  // Die Dateiauswahl wird über die Bildfläche geöffnet
  const fileInput = document.createElement("input");

  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.classList.add("hidden");

  const imageButton = document.createElement("button");

  imageButton.type = "button";
  imageButton.classList.add("custom-card-image", "card-button");

  const placeholder = document.createElement("span");

  placeholder.classList.add("custom-card-placeholder");
  placeholder.textContent = "+ Add photo";

  const preview = document.createElement("img");

  preview.classList.add("custom-card-preview", "hidden");
  preview.alt = "";

  imageButton.appendChild(placeholder);
  imageButton.appendChild(preview);

  const nameInput = document.createElement("input");

  nameInput.type = "text";
  nameInput.classList.add("custom-card-name");
  nameInput.placeholder = "Name";
  nameInput.maxLength = 20;

  const removeButton = document.createElement("button");

  removeButton.type = "button";
  removeButton.classList.add("custom-card-remove", "card-button");
  removeButton.title = "Remove character";
  removeButton.textContent = "✕";

  element.appendChild(imageButton);
  element.appendChild(fileInput);
  element.appendChild(nameInput);
  element.appendChild(removeButton);

  imageButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async () => {
    const file = fileInput.files[0];

    // Die Dateiauswahl wurde abgebrochen
    if (file === undefined) {
      return;
    }

    try {
      card.image = await chooseImage(file);
    } catch (error) {
      window.alert("This image could not be loaded. Please try another one.");

      return;
    } finally {
      // Damit dasselbe Bild danach wieder gewählt werden kann
      fileInput.value = "";
    }

    preview.src = card.image;

    preview.classList.remove("hidden");
    placeholder.classList.add("hidden");

    updateStartButton();
  });

  nameInput.addEventListener("input", () => {
    card.name = nameInput.value.trim();

    updateStartButton();
  });

  removeButton.addEventListener("click", () => {
    removeCard(card, element);
  });

  return element;
}

// =============================
// ADD / REMOVE CARD
// =============================

function addCard() {
  if (cards.length >= MAXIMUM_CHARACTERS) {
    return;
  }

  const card = {
    name: "",
    image: null,
  };

  cards.push(card);

  customGrid.insertBefore(createEditorCard(card), addCardButton);

  updateAddCardButton();

  updateStartButton();
}

function removeCard(card, element) {
  const index = cards.indexOf(card);

  if (index === -1) {
    return;
  }

  cards.splice(index, 1);

  element.remove();

  fillUpCards();

  updateAddCardButton();

  updateStartButton();
}

// Es stehen immer so viele leere Karten offen, wie das Spiel mindestens
// braucht – die Plus-Kachel ist nur für zusätzliche Charaktere da
function fillUpCards() {
  while (cards.length < MINIMUM_CHARACTERS) {
    addCard();
  }
}

// Die Plus-Kachel verschwindet, wenn das Board voll ist
function updateAddCardButton() {
  if (cards.length >= MAXIMUM_CHARACTERS) {
    addCardButton.classList.add("hidden");
  } else {
    addCardButton.classList.remove("hidden");
  }
}

// =============================
// START GAME
// =============================

// Eine Karte zählt erst, wenn Bild und Name da sind
function isCardComplete(card) {
  return card.image !== null && card.name !== "";
}

function countCompleteCards() {
  return cards.filter(isCardComplete).length;
}

function updateStartButton() {
  const complete = countCompleteCards();

  if (complete < MINIMUM_CHARACTERS) {
    customSetHint.textContent = `Add at least ${MINIMUM_CHARACTERS} characters with a photo and a name.`;
  } else if (complete !== cards.length) {
    customSetHint.textContent = "Every card needs a photo and a name.";
  } else {
    customSetHint.textContent = `${complete} characters ready.`;
  }

  startCustomGameButton.disabled =
    complete < MINIMUM_CHARACTERS || complete !== cards.length;
}

function startCustomGame() {
  const characters = cards.map((card, index) => ({
    id: index + 1,
    name: card.name,
    image: card.image,
  }));

  gameState.characterSetId = CUSTOM_SET_ID;

  gameState.customCharacters = characters;

  gameState.phase = "selection";

  try {
    saveGameState(gameState);
  } catch (error) {
    // Die sessionStorage ist voll (zu viele oder zu grosse Bilder)
    gameState.characterSetId = null;

    gameState.customCharacters = [];

    gameState.phase = "custom-set";

    window.alert(
      "There is not enough space for all these photos. Please remove a few characters.",
    );

    return;
  }

  window.location.href = "character_selection.html";
}

// =============================
// PAGE SETUP
// =============================

if (gameState === null) {
  // Ohne laufendes Spiel zurück zur Modus-Auswahl
  window.location.replace("index.html");
} else if (getCharacterSet(gameState.characterSetId) !== null) {
  // Das Set ist bereits gewählt (das Spiel läuft schon)
  window.location.replace("character_selection.html");
} else {
  addCardButton.addEventListener("click", addCard);

  startCustomGameButton.addEventListener("click", startCustomGame);

  // Zum Start stehen die nötigen leeren Karten neben der Plus-Kachel
  fillUpCards();
}

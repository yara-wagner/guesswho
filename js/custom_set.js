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

// Längere Namen passen nicht mehr unter die Karte
const NAME_LENGTH = 20;

// Die Karten in der Reihenfolge des Grids: { name, image }
// image ist eine Data-URL oder null, solange kein Bild gewählt wurde
const cards = [];

// Zu jeder Karte die Funktion, die Bild und Name im Grid nachführt. Beim
// Mehrfach-Upload werden auch Karten befüllt, die gar nicht angeklickt
// wurden – die müssen ihre Anzeige ebenfalls aktualisieren.
const refreshers = new Map();

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
// NAME FROM FILE NAME
// =============================

// Wörter, die in Dateinamen von Kameras, Chats und Downloads stecken und
// nichts über die abgebildete Person aussagen
const FILE_NAME_NOISE = [
  "img",
  "image",
  "images",
  "photo",
  "foto",
  "picture",
  "pic",
  "bild",
  "dsc",
  "dscn",
  "dscf",
  "pxl",
  "mvimg",
  "screenshot",
  "screen",
  "shot",
  "whatsapp",
  "signal",
  "telegram",
  "scan",
  "scanned",
  "capture",
  "copy",
  "kopie",
  "final",
  "edit",
  "edited",
  "original",
  "portrait",
  "selfie",
  "at",
  "am",
  "von",
  "of",
  "und",
  "and",
];

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// Aus "anna-müller.jpg" wird "Anna Müller", aus "IMG_4213.jpg" nichts:
// ein falsch geratener Name wäre lästiger als gar keiner
function nameFromFileName(fileName) {
  const withoutExtension = fileName.replace(/\.[^.]+$/, "");

  const words = withoutExtension
    .split(/[\s_.\-–()[\]]+/)
    // Durchnummerierte Bilder heissen "anna2" – die Nummer gehört nicht zum Namen
    .map((word) => word.replace(/\d+$/, ""))
    // Übrig gebliebene Zahlen (Datum, Uhrzeit, Zähler) fliegen raus
    .filter((word) => word !== "" && !/\d/.test(word))
    // Genauso die Kürzel der Kameras und Chat-Apps
    .filter((word) => !FILE_NAME_NOISE.includes(word.toLowerCase()));

  if (words.length === 0) {
    return "";
  }

  const name = words.map(capitalize).join(" ");

  // Lange Dateinamen sind meist keine Namen, sondern Beschreibungen
  if (name.length > NAME_LENGTH) {
    return "";
  }

  return name;
}

// =============================
// DISTRIBUTE IMAGES
// =============================

// Die Karten, auf die die gewählten Bilder verteilt werden: zuerst die
// angeklickte Karte, dann die folgenden Karten ohne Bild und zum Schluss
// neue Karten – bereits gesetzte Bilder werden nicht überschrieben
function collectTargetCards(startCard, count) {
  const targets = [startCard];

  const start = cards.indexOf(startCard);

  for (let index = start + 1; index < cards.length; index++) {
    if (targets.length === count) {
      return targets;
    }

    if (cards[index].image === null) {
      targets.push(cards[index]);
    }
  }

  while (targets.length < count && cards.length < MAXIMUM_CHARACTERS) {
    addCard();

    targets.push(cards[cards.length - 1]);
  }

  return targets;
}

function refreshCard(card) {
  const refresh = refreshers.get(card);

  if (refresh !== undefined) {
    refresh();
  }
}

// Verteilt die gewählten Bilder ab der angeklickten Karte über das Grid
async function chooseImages(startCard, files) {
  const targets = collectTargetCards(startCard, files.length);

  let failed = 0;

  for (let index = 0; index < targets.length; index++) {
    const card = targets[index];

    try {
      card.image = await chooseImage(files[index]);
    } catch (error) {
      failed++;

      continue;
    }

    // Ein selbst getippter Name ist stärker als alles, was im Dateinamen steht
    if (card.name === "") {
      card.name = nameFromFileName(files[index].name);
    }

    refreshCard(card);
  }

  updateStartButton();

  if (failed > 0) {
    window.alert(
      failed === 1
        ? "One image could not be loaded. Please try another one."
        : `${failed} images could not be loaded. Please try other ones.`,
    );
  }

  // Es gibt weniger Karten als gewählte Bilder – das Board ist voll
  if (targets.length < files.length) {
    window.alert(
      `There is room for ${MAXIMUM_CHARACTERS} characters, so only the first ${targets.length} photos were used.`,
    );
  }
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
  // Es dürfen mehrere Bilder auf einmal gewählt werden
  fileInput.multiple = true;
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
  nameInput.maxLength = NAME_LENGTH;

  const removeButton = document.createElement("button");

  removeButton.type = "button";
  removeButton.classList.add("custom-card-remove", "card-button");
  removeButton.title = "Remove character";
  removeButton.setAttribute("aria-label", "Remove character");
  removeButton.innerHTML = `<span data-icon="close"></span>`;

  // Platzhalter durch das SVG ersetzen (js/icons.js)
  renderIcons(removeButton);

  element.appendChild(imageButton);
  element.appendChild(fileInput);
  element.appendChild(nameInput);
  element.appendChild(removeButton);

  refreshers.set(card, () => {
    if (card.image !== null) {
      preview.src = card.image;

      preview.classList.remove("hidden");
      placeholder.classList.add("hidden");
    }

    nameInput.value = card.name;
  });

  imageButton.addEventListener("click", () => {
    fileInput.click();
  });

  fileInput.addEventListener("change", async () => {
    const files = Array.from(fileInput.files);

    // Damit dieselben Bilder danach wieder gewählt werden können
    fileInput.value = "";

    // Die Dateiauswahl wurde abgebrochen
    if (files.length === 0) {
      return;
    }

    await chooseImages(card, files);
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

  refreshers.delete(card);

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
  window.location.replace("start.html");
} else if (getCharacterSet(gameState.characterSetId) !== null) {
  // Das Set ist bereits gewählt (das Spiel läuft schon)
  window.location.replace("character_selection.html");
} else {
  addCardButton.addEventListener("click", addCard);

  startCustomGameButton.addEventListener("click", startCustomGame);

  // Zum Start stehen die nötigen leeren Karten neben der Plus-Kachel
  fillUpCards();
}

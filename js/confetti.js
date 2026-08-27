// =============================
// KONFETTI
// =============================

// Die Animation steckt in einer Web-Component von Lottie (<dotlottie-wc>,
// siehe game.html und single_player.html). Beide Boards benutzen dieselbe
// Funktion, damit das Konfetti nur an einer Stelle beschrieben ist.

// =============================
// KOMPONENTE NACHLADEN
// =============================

// Die Web-Component wird erst geholt, wenn wirklich jemand gewinnt.
//
// Vorher stand das <script type="module"> in den beiden Boards und lud auf
// jedem Board-Load das Modul, den WASM-Renderer und die Animationsdatei –
// gut ein Megabyte für etwas, das die meisten Runden nie zu sehen bekommen.
// Ein altes Gerät war damit beim ersten Laden für lange Zeit beschäftigt und
// reagierte auf keinen Knopf mehr.
//
// Solange das Modul fehlt, ist <dotlottie-wc> ein unbekanntes Element: Der
// Browser lässt es einfach stehen und lädt nichts nach.

const CONFETTI_COMPONENT_URL =
  "https://unpkg.com/@lottiefiles/dotlottie-wc@0.9.27/dist/index.js";

let confettiComponentRequested = false;

function loadConfettiComponent() {
  if (confettiComponentRequested === true) {
    return;
  }

  confettiComponentRequested = true;

  const script = document.createElement("script");

  script.type = "module";
  script.src = CONFETTI_COMPONENT_URL;

  document.head.appendChild(script);
}

// =============================
// ABSPIELEN
// =============================

function playConfetti(element) {
  if (element === null) {
    return;
  }

  // Wer im Betriebssystem weniger Bewegung eingestellt hat, bekommt kein
  // Konfetti. Die Animation läuft in einem Canvas und wird vom
  // @media (prefers-reduced-motion)-Block in css/style.css nicht erfasst,
  // darum muss sie hier von Hand ausgeschaltet werden.
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion === true) {
    return;
  }

  // Beim ersten Sieg ist die Komponente noch nicht da – dann setzen wir
  // autoplay und holen sie. Sie startet die Animation von selber, sobald
  // sie das Element übernimmt.
  if (element.dotLottie) {
    element.dotLottie.setFrame(0);

    element.dotLottie.play();
  } else {
    element.setAttribute("autoplay", "");

    loadConfettiComponent();
  }
}
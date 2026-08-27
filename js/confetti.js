// =============================
// KONFETTI
// =============================

// Die Animation steckt in einer Web-Component von Lottie (<dotlottie-wc>,
// siehe game.html und single_player.html). Beide Boards benutzen dieselbe
// Funktion, damit das Konfetti nur an einer Stelle beschrieben ist.

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

  // Die Web-Component wird als Modul geladen und ist eventuell noch nicht
  // bereit – dann startet sie über das autoplay-Attribut, sobald sie da ist
  if (element.dotLottie) {
    element.dotLottie.setFrame(0);

    element.dotLottie.play();
  } else {
    element.setAttribute("autoplay", "");
  }
}
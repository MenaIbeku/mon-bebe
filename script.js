/* =========================================
   SCREEN TRANSITIONS
========================================= */

const screens = document.querySelectorAll(".screen");

const screenOrder = [
  "cover",
  "question1",
  "question2",
  "question3",
  "contract",
  "reveal",
  "letter",
  "memories",
  "ending"
];

function nextScreen(screenId) {

  const currentScreen = document.querySelector(".screen.active");
  const next = document.getElementById(screenId);

  if (!next) return;

  // Fade out current screen
  if (currentScreen) {
    currentScreen.classList.remove("active");
  }

  // Small delay makes the transition feel smoother
  setTimeout(() => {

    next.classList.add("active");

    // Scroll screens should always start at the top
    if (next.classList.contains("scroll-screen")) {
      next.scrollTop = 0;
    }

    updateProgress(screenId);

  }, 350);
}


/* =========================================
   PROGRESS INDICATOR
========================================= */

function updateProgress(screenId) {

  const dots = document.querySelectorAll(".progress-dot");

  /*
    We're grouping the screens into roughly
    five stages of the experience.
  */

  let stage = 0;

  if (screenId === "cover") {
    stage = 0;
  }

  else if (
    screenId === "question1" ||
    screenId === "question2"
  ) {
    stage = 1;
  }

  else if (
    screenId === "question3" ||
    screenId === "contract"
  ) {
    stage = 2;
  }

  else if (
    screenId === "reveal" ||
    screenId === "letter"
  ) {
    stage = 3;
  }

  else if (
    screenId === "memories" ||
    screenId === "ending"
  ) {
    stage = 4;
  }


  dots.forEach((dot, index) => {

    if (index < stage) {
      dot.textContent = "♡";
      dot.classList.add("active-dot");
    }

    else if (index === stage) {
      dot.textContent = "♡";
      dot.classList.add("active-dot");
    }

    else {
      dot.textContent = "○";
      dot.classList.remove("active-dot");
    }

  });

}


/* =========================================
   RUNAWAY "NO" BUTTONS
========================================= */

const runawayButtons =
  document.querySelectorAll(".runaway");


runawayButtons.forEach(button => {

  /*
    Desktop:
    Detect when the mouse gets near the button.
  */

  button.addEventListener(
    "mouseenter",
    () => moveNoButton(button)
  );


  /*
    Mobile:
    If she tries touching the button,
    move it before the click can happen.
  */

  button.addEventListener(
    "touchstart",
    event => {

      event.preventDefault();

      moveNoButton(button);

    },
    { passive: false }
  );


  /*
    Just in case she somehow manages
    to click it.
  */

  button.addEventListener(
    "click",
    event => {

      event.preventDefault();

      moveNoButton(button);

    }
  );

});


function moveNoButton(button) {

  /*
    Once the button starts running,
    position it relative to the viewport.
  */

  button.style.position = "fixed";

  button.style.zIndex = "50";


  const buttonRect =
    button.getBoundingClientRect();


  /*
    Keep some space between the button
    and the edges of the screen.
  */

  const padding = 20;


  const maxX =
    window.innerWidth -
    buttonRect.width -
    padding;


  const maxY =
    window.innerHeight -
    buttonRect.height -
    padding;


  const randomX =
    Math.max(
      padding,
      Math.random() * maxX
    );


  const randomY =
    Math.max(
      padding,
      Math.random() * maxY
    );


  button.style.left =
    `${randomX}px`;

  button.style.top =
    `${randomY}px`;


  /*
    Change the text on the special
    No button from Question 3.
  */

  if (
    button.classList.contains("changing-no")
  ) {

    changeNoMessage(button);

  }

}


/* =========================================
   CHANGING "NO" MESSAGES
========================================= */

const noMessages = [

  "Are you sure? 🤨",

  "Think again",

  "Girl 😭",

  "Be serious",

  "Wrong answer",

  "Give it up",

  "Just click yes",

  "Please 😭",

  "Why are you chasing me?",

  "YES is literally right there →"

];


let noMessageIndex = 0;


function changeNoMessage(button) {

  button.textContent =
    noMessages[
      noMessageIndex %
      noMessages.length
    ];


  noMessageIndex++;

}


/* =========================================
   EXTRA RUNAWAY EFFECT

   Makes the button move when the cursor
   gets CLOSE instead of requiring the
   cursor to actually touch it.
========================================= */

document.addEventListener(
  "mousemove",
  event => {

    const activeScreen =
      document.querySelector(".screen.active");


    if (!activeScreen) return;


    const activeNoButton =
      activeScreen.querySelector(
        ".runaway"
      );


    if (!activeNoButton) return;


    const rect =
      activeNoButton.getBoundingClientRect();


    const buttonCenterX =
      rect.left + rect.width / 2;


    const buttonCenterY =
      rect.top + rect.height / 2;


    const distanceX =
      event.clientX - buttonCenterX;


    const distanceY =
      event.clientY - buttonCenterY;


    const distance =
      Math.sqrt(
        distanceX * distanceX +
        distanceY * distanceY
      );


    /*
      If cursor gets within 90px,
      RUN.
    */

    if (distance < 90) {

      moveNoButton(activeNoButton);

    }

  }
);


/* =========================================
   RESET RUNAWAY BUTTONS

   When changing pages, reset the buttons
   so they don't stay floating somewhere
   weird.
========================================= */

function resetNoButtons() {

  runawayButtons.forEach(button => {

    button.style.position = "";

    button.style.left = "";

    button.style.top = "";

  });

}


/*
  Watch which screen becomes active
  and reset buttons from previous screens.
*/

const screenObserver =
  new MutationObserver(() => {

    resetHiddenNoButtons();

  });


screens.forEach(screen => {

  screenObserver.observe(
    screen,
    {
      attributes: true,
      attributeFilter: ["class"]
    }
  );

});


function resetHiddenNoButtons() {

  runawayButtons.forEach(button => {

    const parentScreen =
      button.closest(".screen");


    if (
      parentScreen &&
      !parentScreen.classList.contains("active")
    ) {

      button.style.position = "";

      button.style.left = "";

      button.style.top = "";

    }

  });

}


/* =========================================
   ENVELOPE OPENING
========================================= */

const envelope =
  document.getElementById("envelope");


const letterPaper =
  document.getElementById("letterPaper");


const continueToPhotos =
  document.getElementById("continueToPhotos");


if (envelope) {

  envelope.addEventListener(
    "click",
    openEnvelope
  );

}


function openEnvelope() {

  /*
    Don't allow repeated opening.
  */

  if (
    envelope.classList.contains("open")
  ) {
    return;
  }


  envelope.classList.add("open");


  /*
    Wait for the envelope animation
    before revealing the letter.
  */

  setTimeout(() => {

    letterPaper.classList.add("visible");


    /*
      Reveal the continue button.
    */

    continueToPhotos.classList.add(
      "visible"
    );


    /*
      Smoothly move down toward the letter.
    */

    setTimeout(() => {

      letterPaper.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });

    }, 250);


  }, 900);

}


/* =========================================
   FUTURE PHOTO
========================================= */

function revealFuturePhoto(card) {

  if (
    card.classList.contains("revealed")
  ) {
    return;
  }


  card.classList.add("revealed");


  const mystery =
    card.querySelector(".mystery-photo");


  if (mystery) {

    /*
      Replace the question mark
      with a heart.
    */

    mystery.textContent = "♡";

  }

}


/* =========================================
   FINAL SURPRISE
========================================= */

function finalSurprise() {

  const finalButton =
    document.getElementById("finalButton");


  const finalMessage =
    document.getElementById("finalMessage");


  /*
    Hide the button.
  */

  finalButton.style.opacity = "0";

  finalButton.style.transform =
    "scale(0.8)";


  setTimeout(() => {

    finalButton.style.display = "none";

    finalMessage.classList.add(
      "visible"
    );

    createHeartBurst();

  }, 500);

}


/* =========================================
   HEART BURST
========================================= */

function createHeartBurst() {

  const symbols = [
    "♡",
    "♥",
    "✦",
    "♡",
    "✧"
  ];


  /*
    Create multiple floating particles.
  */

  for (
    let i = 0;
    i < 35;
    i++
  ) {

    const heart =
      document.createElement("span");


    heart.classList.add(
      "celebration-heart"
    );


    heart.textContent =
      symbols[
        Math.floor(
          Math.random() *
          symbols.length
        )
      ];


    /*
      Start around the center
      of the screen.
    */

    heart.style.left =
      "50vw";

    heart.style.top =
      "50vh";


    /*
      Random destination.
    */

    const x =
      (Math.random() - 0.5) *
      window.innerWidth *
      0.9;


    const y =
      (Math.random() - 0.5) *
      window.innerHeight *
      0.9;


    const rotation =
      Math.random() * 360;


    const size =
      12 +
      Math.random() * 24;


    heart.style.fontSize =
      `${size}px`;


    heart.style.setProperty(
      "--x",
      `${x}px`
    );


    heart.style.setProperty(
      "--y",
      `${y}px`
    );


    heart.style.setProperty(
      "--rotation",
      `${rotation}deg`
    );


    document.body.appendChild(
      heart
    );


    /*
      Remove it afterward so the DOM
      doesn't fill up with hearts.
    */

    setTimeout(() => {

      heart.remove();

    }, 2200);

  }

}


/* =========================================
   POLAROID MOBILE INTERACTION
========================================= */

const polaroids =
  document.querySelectorAll(
    ".polaroid:not(.future-photo)"
  );


polaroids.forEach(polaroid => {

  polaroid.addEventListener(
    "click",
    () => {

      /*
        Remove active state from
        other photos.
      */

      polaroids.forEach(other => {

        if (other !== polaroid) {
          other.classList.remove(
            "photo-active"
          );
        }

      });


      /*
        Toggle this photo.
      */

      polaroid.classList.toggle(
        "photo-active"
      );

    }
  );

});


/* =========================================
   INITIALIZE WEBSITE
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateProgress("cover");

  }
);
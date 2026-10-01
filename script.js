/* =========================================
   SCREEN ORDER
========================================= */

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


/* =========================================
   SCREEN TRANSITIONS
========================================= */

function nextScreen(screenId) {

  showScreen(screenId);

  history.pushState(
    {
      screen: screenId
    },
    "",
    `#${screenId}`
  );
}


function showScreen(screenId) {

  const currentScreen =
    document.querySelector(
      ".screen.active"
    );

  const next =
    document.getElementById(
      screenId
    );


  if (!next) {
    return;
  }


  if (
    currentScreen &&
    currentScreen.id === screenId
  ) {
    return;
  }


  /*
    Mute memory videos whenever
    we leave the memories screen.
  */

  if (
    currentScreen &&
    currentScreen.id === "memories" &&
    screenId !== "memories"
  ) {

    muteAllMemoryVideos();

  }


  if (currentScreen) {

    currentScreen.classList.remove(
      "active"
    );

  }


  setTimeout(() => {

    next.classList.add(
      "active"
    );


    /*
      Reset scroll position.
    */

    if (
      next.classList.contains(
        "scroll-screen"
      )
    ) {

      next.scrollTop = 0;

    }


    updateProgress(
      screenId
    );


    resetHiddenNoButtons();


    /*
      Start memory videos muted
      when entering the memories page.
    */

    if (
      screenId === "memories"
    ) {

      startMemoryVideos();

    }

  }, 350);
}


/* =========================================
   BACK NAVIGATION
========================================= */

function previousScreen() {

  const currentScreen =
    document.querySelector(
      ".screen.active"
    );


  if (!currentScreen) {
    return;
  }


  const currentIndex =
    screenOrder.indexOf(
      currentScreen.id
    );


  if (currentIndex <= 0) {
    return;
  }


  history.back();
}


/* =========================================
   BROWSER BACK / FORWARD
========================================= */

window.addEventListener(
  "popstate",
  event => {

    if (
      event.state &&
      event.state.screen
    ) {

      showScreen(
        event.state.screen
      );

    }

    else {

      showScreen(
        "cover"
      );

    }

  }
);


/* =========================================
   PROGRESS INDICATOR
========================================= */

function updateProgress(screenId) {

  const dots =
    document.querySelectorAll(
      ".progress-dot"
    );


  let stage = 0;


  if (
    screenId === "cover"
  ) {

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

  else {

    stage = 4;

  }


  dots.forEach(
    (dot, index) => {

      if (
        index <= stage
      ) {

        dot.textContent =
          "♡";

        dot.classList.add(
          "active-dot"
        );

      }

      else {

        dot.textContent =
          "○";

        dot.classList.remove(
          "active-dot"
        );

      }

    }
  );
}


/* =========================================
   RUNAWAY NO BUTTONS
========================================= */

const runawayButtons =
  document.querySelectorAll(
    ".runaway"
  );


runawayButtons.forEach(
  button => {

    /*
      Desktop
    */

    button.addEventListener(
      "mouseenter",
      () => {

        moveNoButton(
          button
        );

      }
    );


    /*
      Mobile
    */

    button.addEventListener(
      "touchstart",
      event => {

        event.preventDefault();

        moveNoButton(
          button
        );

      },
      {
        passive: false
      }
    );


    /*
      Just in case she somehow
      manages to click it.
    */

    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        moveNoButton(
          button
        );

      }
    );

  }
);


/* =========================================
   MOVE NO BUTTON
========================================= */

function moveNoButton(button) {

  button.style.position =
    "fixed";

  button.style.zIndex =
    "150";


  const rect =
    button.getBoundingClientRect();


  const padding =
    25;


  const maxX =
    Math.max(
      padding,
      window.innerWidth -
      rect.width -
      padding
    );


  const maxY =
    Math.max(
      padding,
      window.innerHeight -
      rect.height -
      padding
    );


  let randomX =
    padding +
    Math.random() *
    Math.max(
      0,
      maxX - padding
    );


  let randomY =
    padding +
    Math.random() *
    Math.max(
      0,
      maxY - padding
    );


  /*
    Keep the button away
    from the center.
  */

  const centerX =
    window.innerWidth / 2;


  const centerY =
    window.innerHeight / 2;


  if (
    Math.abs(
      randomX - centerX
    ) < 120
  ) {

    randomX =
      randomX < centerX
        ? padding
        : maxX;

  }


  if (
    Math.abs(
      randomY - centerY
    ) < 80
  ) {

    randomY =
      randomY < centerY
        ? Math.min(
            padding + 60,
            maxY
          )
        : maxY;

  }


  button.style.left =
    `${randomX}px`;


  button.style.top =
    `${randomY}px`;


  /*
    Question 3 changing
    No-button text.
  */

  if (
    button.classList.contains(
      "changing-no"
    )
  ) {

    changeNoMessage(
      button
    );

  }
}


/* =========================================
   QUESTION 3 NO MESSAGES
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


let noMessageIndex =
  0;


function changeNoMessage(button) {

  button.textContent =
    noMessages[
      noMessageIndex %
      noMessages.length
    ];


  noMessageIndex++;
}


/* =========================================
   RUN IF CURSOR GETS CLOSE
========================================= */

document.addEventListener(
  "mousemove",
  event => {

    const activeScreen =
      document.querySelector(
        ".screen.active"
      );


    if (!activeScreen) {
      return;
    }


    const activeNoButton =
      activeScreen.querySelector(
        ".runaway"
      );


    if (!activeNoButton) {
      return;
    }


    const rect =
      activeNoButton
        .getBoundingClientRect();


    const centerX =
      rect.left +
      rect.width / 2;


    const centerY =
      rect.top +
      rect.height / 2;


    const distanceX =
      event.clientX -
      centerX;


    const distanceY =
      event.clientY -
      centerY;


    const distance =
      Math.sqrt(
        distanceX * distanceX +
        distanceY * distanceY
      );


    if (
      distance < 90
    ) {

      moveNoButton(
        activeNoButton
      );

    }

  }
);


/* =========================================
   RESET NO BUTTONS
========================================= */

function resetHiddenNoButtons() {

  runawayButtons.forEach(
    button => {

      const parentScreen =
        button.closest(
          ".screen"
        );


      if (
        parentScreen &&
        !parentScreen
          .classList
          .contains(
            "active"
          )
      ) {

        button.style.position =
          "";

        button.style.left =
          "";

        button.style.top =
          "";

        button.style.zIndex =
          "";

      }

    }
  );
}


/* =========================================
   ENVELOPE / LETTER
========================================= */

const envelope =
  document.getElementById(
    "envelope"
  );


const letterPaper =
  document.getElementById(
    "letterPaper"
  );


const continueToPhotos =
  document.getElementById(
    "continueToPhotos"
  );


if (envelope) {

  envelope.addEventListener(
    "click",
    openEnvelope
  );

}


function openEnvelope() {

  /*
    Don't reopen the envelope.
  */

  if (
    envelope.classList.contains(
      "open"
    )
  ) {

    return;

  }


  envelope.classList.add(
    "open"
  );


  /*
    Wait for the envelope
    animation to finish.
  */

  setTimeout(() => {

    /*
      Reveal letter.
    */

    if (letterPaper) {

      letterPaper.classList.add(
        "visible"
      );

    }


    /*
      Reveal the button that takes
      her to the memories.
    */

    if (continueToPhotos) {

      continueToPhotos.style.display =
        "inline-block";

    }


    /*
      Smoothly move down to
      the letter.
    */

    setTimeout(() => {

      if (letterPaper) {

        letterPaper.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }, 300);

  }, 800);
}


/* =========================================
   POLAROID CAPTIONS
========================================= */

/*
  Desktop uses CSS :hover.

  Phones don't have real hover,
  so tapping a Polaroid toggles
  photo-active instead.
*/

const polaroids =
  document.querySelectorAll(
    ".polaroid"
  );


const touchDevice =
  window.matchMedia(
    "(hover: none)"
  );


polaroids.forEach(
  polaroid => {

    polaroid.addEventListener(
      "click",
      event => {

        /*
          On a computer, CSS hover
          handles the caption.
        */

        if (
          !touchDevice.matches
        ) {

          return;

        }


        /*
          Don't toggle the caption
          when the user is trying
          to use the video controls.
        */

        if (
          event.target.closest(
            ".sound-button"
          ) ||
          event.target.closest(
            "video"
          )
        ) {

          return;

        }


        polaroid.classList.toggle(
          "photo-active"
        );

      }
    );

  }
);


/* =========================================
   START MEMORY VIDEOS
========================================= */

function startMemoryVideos() {

  const videos =
    document.querySelectorAll(
      ".memory-video"
    );


  videos.forEach(
    video => {

      /*
        Autoplay requires muted
        video on most browsers.
      */

      video.muted =
        true;


      const playPromise =
        video.play();


      if (
        playPromise !== undefined
      ) {

        playPromise.catch(
          () => {

            /*
              If autoplay is blocked,
              the browser can start
              playback after interaction.
            */

          }
        );

      }

    }
  );


  resetSoundButtons();
}


/* =========================================
   VIDEO SOUND
========================================= */

function toggleVideoSound(
  event,
  button
) {

  /*
    Prevent Polaroid tap behavior.
  */

  event.stopPropagation();


  const container =
    button.closest(
      ".video-container"
    );


  if (!container) {
    return;
  }


  const video =
    container.querySelector(
      ".memory-video"
    );


  if (!video) {
    return;
  }


  /*
    SOUND OFF -> SOUND ON
  */

  if (video.muted) {

    /*
      Mute every other video.
    */

    document
      .querySelectorAll(
        ".memory-video"
      )
      .forEach(
        otherVideo => {

          if (
            otherVideo !== video
          ) {

            otherVideo.muted =
              true;


            const otherContainer =
              otherVideo.closest(
                ".video-container"
              );


            if (
              otherContainer
            ) {

              const otherButton =
                otherContainer
                  .querySelector(
                    ".sound-button"
                  );


              if (
                otherButton
              ) {

                otherButton.textContent =
                  "🔇 Tap for sound";


                otherButton
                  .classList
                  .remove(
                    "sound-on"
                  );


                otherButton.setAttribute(
                  "aria-label",
                  "Turn video sound on"
                );

              }

            }

          }

        }
      );


    /*
      Turn this video's
      sound on.
    */

    video.muted =
      false;


    button.textContent =
      "🔊 Sound on";


    button.classList.add(
      "sound-on"
    );


    button.setAttribute(
      "aria-label",
      "Turn video sound off"
    );


    video
      .play()
      .catch(
        () => {}
      );

  }


  /*
    SOUND ON -> SOUND OFF
  */

  else {

    video.muted =
      true;


    button.textContent =
      "🔇 Tap for sound";


    button.classList.remove(
      "sound-on"
    );


    button.setAttribute(
      "aria-label",
      "Turn video sound on"
    );

  }
}


/* =========================================
   MUTE ALL VIDEOS
========================================= */

function muteAllMemoryVideos() {

  document
    .querySelectorAll(
      ".memory-video"
    )
    .forEach(
      video => {

        video.muted =
          true;

      }
    );


  resetSoundButtons();
}


/* =========================================
   RESET VIDEO SOUND BUTTONS
========================================= */

function resetSoundButtons() {

  document
    .querySelectorAll(
      ".sound-button"
    )
    .forEach(
      button => {

        button.textContent =
          "🔇 Tap for sound";


        button.classList.remove(
          "sound-on"
        );


        button.setAttribute(
          "aria-label",
          "Turn video sound on"
        );

      }
    );
}


/* =========================================
   FINAL SURPRISE
========================================= */

function finalSurprise() {

  const finalButton =
    document.getElementById(
      "finalButton"
    );


  const finalMessage =
    document.getElementById(
      "finalMessage"
    );


  const endingBackButton =
    document.getElementById(
      "endingBackButton"
    );


  /*
    Hide the Back button.
  */

  if (
    endingBackButton
  ) {

    endingBackButton.style.opacity =
      "0";


    endingBackButton
      .style
      .pointerEvents =
      "none";

  }


  /*
    Fade final button.
  */

  if (
    finalButton
  ) {

    finalButton.style.opacity =
      "0";


    finalButton.style.transform =
      "scale(0.8)";


    finalButton
      .style
      .pointerEvents =
      "none";

  }


  setTimeout(() => {

    if (
      finalButton
    ) {

      finalButton.style.display =
        "none";

    }


    /*
      Reveal final message.
    */

    if (
      finalMessage
    ) {

      finalMessage.style.display =
        "block";


      requestAnimationFrame(
        () => {

          requestAnimationFrame(
            () => {

              finalMessage
                .classList
                .add(
                  "visible"
                );

            }
          );

        }
      );

    }


    /*
      Heart explosion.
    */

    createHeartBurst();

  }, 500);
}


/* =========================================
   HEART / SPARKLE BURST
========================================= */

function createHeartBurst() {

  const symbols = [
    "♡",
    "♥",
    "✦",
    "♡",
    "✧"
  ];


  for (
    let i = 0;
    i < 35;
    i++
  ) {

    const heart =
      document.createElement(
        "span"
      );


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


    heart.style.left =
      "50vw";


    heart.style.top =
      "50vh";


    const x =
      (Math.random() - 0.5) *
      window.innerWidth *
      0.9;


    const y =
      (Math.random() - 0.5) *
      window.innerHeight *
      0.9;


    const rotation =
      Math.random() *
      360;


    const size =
      12 +
      Math.random() *
      24;


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


    setTimeout(
      () => {

        heart.remove();

      },
      2200
    );

  }
}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    /*
      Initial progress.
    */

    updateProgress(
      "cover"
    );


    /*
      Initial browser history.
    */

    history.replaceState(
      {
        screen: "cover"
      },
      "",
      "#cover"
    );


    /*
      Ensure videos begin muted.
    */

    document
      .querySelectorAll(
        ".memory-video"
      )
      .forEach(
        video => {

          video.muted =
            true;

        }
      );


    resetSoundButtons();

  }
);
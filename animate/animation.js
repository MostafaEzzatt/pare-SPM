import {
  animate,
  // createDraggable,
  // createSpring,
  utils,
} from "https://cdn.jsdelivr.net/npm/animejs/+esm";

const [$btns] = utils.$(".btns");
const [$tareaContiner] = utils.$(".tareaContainer");
const [$cleanBTN] = utils.$("#clean");
const [$rightSide] = utils.$(".right-side");
$rightSide.style.overflow = "hidden";
$rightSide.style.maxHeight = "100vh";

let animationStart = false;

$btns.style.opacity = 0;

function animateBTN() {
  if (animationStart) return;
  const targetHeight = window.innerHeight - 200;

  const parentPaddingTop = parseFloat(
    window.getComputedStyle($rightSide).paddingTop
  );
  const parentHeight = $rightSide.scrollHeight / 2;
  const calc = parentHeight - parentPaddingTop;

  animate([$tareaContiner], {
    height: `${targetHeight}px`,
    transform: {
      to: "translateY(-50%)",
      duration: 600,
      delay: 450,
    },
    marginTop: {
      to: `${calc}px`,
      duration: 600,
      delay: 450,
    },
    duration: 500,

    onComplete: () => {
      const btnMarginTop = targetHeight / 2;
      $btns.style.marginTop = `-${btnMarginTop - 12}px`;
      animate([$btns], {
        opacity: [0, 1],
        easing: "easeInOutQuad",
        delay: 150,
      });

      $rightSide.style.maxHeight = "none";

      animationStart = true;
    },
  });
}

$tareaContiner.addEventListener("click", () => {
  animateBTN();
});

$cleanBTN.addEventListener("click", () => {
  animate([$btns], {
    opacity: [1, 0],
    easing: "easeInOutQuad",
    delay: 150,

    onComplete: () => {
      $btns.style.marginTop = "0px";
      animate($tareaContiner, {
        opacity: {
          from: 1,
          to: 0,
          duration: 150,
        },
        transform: "translateY(-80%)",
        duration: 500,
        easing: "easeInOutQuad",
        onComplete: () => {
          $tareaContiner.style.display = "none";
          $tareaContiner.remove();
          startProcess();
        },
      });
    },
  });
});

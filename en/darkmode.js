// Dark Mode
const darkModeSwitches = document.querySelectorAll(".dark-mode-switch");

if (darkModeSwitches) {
  darkModeSwitches.forEach((item) => {
    item.addEventListener("click", () => {
      darkModeSwitches.forEach((item) => item.classList.add("animated"));
      toggleDarkMode();
    });
  });
}

function toggleDarkMode() {
  let darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    document.documentElement.setAttribute("data-mode", "light");
    localStorage.setItem("darkMode", false);
    darkModeSwitches.forEach((item) => item.classList.add("light"));
    darkModeSwitches.forEach((item) => item.classList.remove("dark"));
  } else {
    document.documentElement.setAttribute("data-mode", "dark");
    localStorage.setItem("darkMode", true);
    darkModeSwitches.forEach((item) => item.classList.add("dark"));
    darkModeSwitches.forEach((item) => item.classList.remove("light"));
  }
}

function initDarkMode() {
  let darkMode = localStorage.getItem("darkMode");
  if (darkMode === "true") {
    darkModeSwitches.forEach((item) => item.classList.add("dark"));
    return;
  }
  if (darkMode === "false") {
    darkModeSwitches.forEach((item) => item.classList.add("light"));
    return;
  }
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-mode", "dark");
    darkModeSwitches.forEach((item) => item.classList.add("dark"));
  }
}

initDarkMode();

// Code Window
// This assumes that you're using Rouge; if not, update the selector
const codeBlocks = document.querySelectorAll('.highlight');
const copyCodeButtons = document.querySelectorAll('.window-copy-icon');

copyCodeButtons.forEach((copyCodeButton, index) => {
  const code = codeBlocks[index].innerText;

  copyCodeButton.addEventListener('click', () => {
    // Copy the code to the user's clipboard
    window.navigator.clipboard.writeText(code);

    // Update the button text visually
    ////const { innerHTML: originalText } = copyCodeButton;
    ////copyCodeButton.innerText = 'Copied!';

    // (Optional) Toggle a class for styling the button
    copyCodeButton.classList.add('copied');

    // After 2 seconds, reset the button to its initial UI
    setTimeout(() => {
      ////copyCodeButton.innerHTML = originalText;
      copyCodeButton.classList.remove('copied');
    }, 1000);
  });
});

// Back to the Top with a Rocket
function rocket(delay) {
    document.addEventListener("DOMContentLoaded", function() {
        const element = document.querySelector(".rocket");

        if (element && element.offsetHeight === 0) {
            element.classList.remove("show", "launch");
            element.style.visibility = "hidden";
        }

        window.addEventListener("scroll", function() {
            if (window.scrollY > 100) { // Si l'utilisateur a scrollé de plus de 100px
                element.classList.add("show"); // Ajoute la classe "show"
            } else {
                element.classList.remove("show"); // Supprime la classe "show" si on est revenu en haut
            }
        });
    });

    // Action lorsque l'utilisateur clique sur le bouton "rocket"
    const button = document.querySelector(".rocket");
    if (button) {
        button.addEventListener("click", function() {
            // Ajoute la classe "launch" pour déclencher l'animation de lancement
            button.classList.add("launch");
            scrollToTop();

            // Simule un autre élément avec un délai après le clic
            const anotherElement = document.querySelector(".another-target");
            if (anotherElement) {
                anotherElement.style.transition = "visibility 0.3s ease";
                anotherElement.style.visibility = "hidden"; // Masquer un autre élément après un délai
                setTimeout(function() {
                    anotherElement.style.visibility = "visible"; // Rendre visible après le délai
                }, delay);
            }

            // Optionnel : enlever la classe "launch" après l'animation (ajustez selon vos besoins)
            setTimeout(function() {
                button.classList.remove("launch"); // Réinitialise l'état après le délai si nécessaire
            }, 1500); // Par exemple, après 1.5 secondes
        });
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth' // défilement en douceur
    });
}

rocket(1000);

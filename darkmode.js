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

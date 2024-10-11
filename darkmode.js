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

// GitHub Card
document.addEventListener('DOMContentLoaded', async () => {
  const repoName = document.querySelector('.github-card .name a').textContent.trim();

  // Function to format large numbers (e.g., 92869 -> 92.9k)
  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  // Fetch the informations repo
  async function fetchRepoData(repo) {
    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn(`Failed to fetch data for ${repo}: ${error.message}`);
      return null;
    }
  }

  // Complete the existing HTML
  async function completeGitHubCard() {
    const repo = await fetchRepoData(repoName);

    if (repo) {
      const {
        full_name: fullName,
        description,
        stargazers_count: stars,
        forks_count: forks,
        pushed_at: pushedAt,
        language,
        license,
        topics = []
      } = repo;

      // Date formatter
      const formattedDate = new Date(pushedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      // Inject new data into the card
      const card = document.querySelector('.github-card .panel-body');

      // Inject description
      const descriptionHtml = document.createElement('div');
      descriptionHtml.className = 'description';
      descriptionHtml.textContent = description;
      card.appendChild(descriptionHtml);

      // Injects topics
      if (topics.length > 0) {
        const topicsHtml = document.createElement('div');
        topicsHtml.className = 'badge-group';
        topicsHtml.innerHTML = topics.map(topic => `<span class='badge'>${topic}</span>`).join(' ');
        card.appendChild(topicsHtml);
      }

      // Inject statistics (language, stars, forks, license, last push as last update)
      const statsHtml = document.createElement('div');
      statsHtml.className = 'stats';
      statsHtml.innerHTML = `
        <span>${languageIcon()} ${language || 'Unknown Language'}</span>
        <span>${starIcon()} ${formatNumber(stars)}</span>
        <span>${forkIcon()} ${formatNumber(forks)}</span>
        <span>${licenseIcon()} ${license?.name || 'No License'}</span>
        <span>Updated on ${formattedDate}</span>
      `;
      card.appendChild(statsHtml);
    }
  }

  // Run the function to complete the card
  completeGitHubCard();
});

// Icons come from official https://primer.style/foundations/icons

// https://primer.style/foundations/icons/file-binary-16
function languageIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0 1 14.25 15h-9a.75.75 0 0 1 0-1.5h9a.25.25 0 0 0 .25-.25V6h-2.75A1.75 1.75 0 0 1 10 4.25V1.5H5.75a.25.25 0 0 0-.25.25v2a.75.75 0 0 1-1.5 0Zm-4 6C0 6.784.784 6 1.75 6h1.5C4.216 6 5 6.784 5 7.75v2.5A1.75 1.75 0 0 1 3.25 12h-1.5A1.75 1.75 0 0 1 0 10.25ZM6.75 6h1.5a.75.75 0 0 1 .75.75v3.75h.75a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1 0-1.5h.75v-3h-.75a.75.75 0 0 1 0-1.5Zm-5 1.5a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h1.5a.25.25 0 0 0 .25-.25v-2.5a.25.25 0 0 0-.25-.25Zm9.75-5.938V4.25c0 .138.112.25.25.25h2.688l-.011-.013-2.914-2.914-.013-.011Z"></path></svg>`;
}

// https://primer.style/foundations/icons/star-16
function starIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Zm0 2.445L6.615 5.5a.75.75 0 0 1-.564.41l-3.097.45 2.24 2.184a.75.75 0 0 1 .216.664l-.528 3.084 2.769-1.456a.75.75 0 0 1 .698 0l2.77 1.456-.53-3.084a.75.75 0 0 1 .216-.664l2.24-2.183-3.096-.45a.75.75 0 0 1-.564-.41L8 2.694Z"></path></svg>`;
}

// https://primer.style/foundations/icons/repo-forked-16
function forkIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path></svg>`;
}

// https://primer.style/foundations/icons/law-16
function licenseIcon() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.006.005-.01.01-.045.04c-.21.176-.441.327-.686.45C14.556 10.78 13.88 11 13 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L12.178 4.5h-.162c-.305 0-.604-.079-.868-.231l-1.29-.736a.245.245 0 0 0-.124-.033H8.75V13h2.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.5V3.5h-.984a.245.245 0 0 0-.124.033l-1.289.737c-.265.15-.564.23-.869.23h-.162l2.112 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.016.015-.045.04c-.21.176-.441.327-.686.45C4.556 10.78 3.88 11 3 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L2.178 4.5H1.75a.75.75 0 0 1 0-1.5h2.234a.249.249 0 0 0 .125-.033l1.288-.737c.265-.15.564-.23.869-.23h.984V.75a.75.75 0 0 1 1.5 0Zm2.945 8.477c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L13 6.327Zm-10 0c.285.135.718.273 1.305.273s1.02-.138 1.305-.273L3 6.327Z"></path></svg>`;
}

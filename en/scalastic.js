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
  // Sélection de l'élément repoName de manière sécurisée
  const repoNameElement = document.querySelector('.github-card .name a');
  const repoName = repoNameElement ? repoNameElement.textContent.trim() : "";

  // Function to format large numbers (e.g., 92869 -> 92.9k)
  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }

  // Fetch the repository data
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
    if (!repoName) {
      console.warn("No repository name found. Aborting.");
      return;
    }

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
      const formattedDate = pushedAt
        ? new Date(pushedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : 'Unknown Date';

      // Inject new data into the card
      const card = document.querySelector('.github-card .panel-body');
      if (!card) {
        console.warn("GitHub card panel body not found. Aborting.");
        return;
      }

      // Inject description
      if (description) {
        const descriptionHtml = document.createElement('div');
        descriptionHtml.className = 'description';
        descriptionHtml.textContent = description;
        card.appendChild(descriptionHtml);
      }

      // Inject topics
      if (Array.isArray(topics) && topics.length > 0) {
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
        <span>${starIcon()} ${formatNumber(stars || 0)}</span>
        <span>${forkIcon()} ${formatNumber(forks || 0)}</span>
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

// Tocbot
(()=>{"use strict";var e={d:(t,n)=>{for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};function n(e){const t=[].forEach,n=[].some,o="undefined"!=typeof window&&document.body,l=" ";let s,r=!0;function i(n,o){const s=o.appendChild(function(n){const o=document.createElement("li"),s=document.createElement("a");return e.listItemClass&&o.setAttribute("class",e.listItemClass),e.onClick&&(s.onclick=e.onClick),e.includeTitleTags&&s.setAttribute("title",n.textContent),e.includeHtml&&n.childNodes.length?t.call(n.childNodes,(e=>{s.appendChild(e.cloneNode(!0))})):s.textContent=n.textContent,s.setAttribute("href",`${e.basePath}#${n.id}`),s.setAttribute("class",`${e.linkClass+l}node-name--${n.nodeName} ${e.extraLinkClasses}`),o.appendChild(s),o}(n));if(n.children.length){const e=c(n.isCollapsed);n.children.forEach((t=>{i(t,e)})),s.appendChild(e)}}function c(t){const n=e.orderedList?"ol":"ul",o=document.createElement(n);let s=e.listClass+l+e.extraListClasses;return t&&(s=s+l+e.collapsibleClass,s=s+l+e.isCollapsedClass),o.setAttribute("class",s),o}function a(t){let n=0;return null!==t&&(n=t.offsetTop,e.hasInnerContainers&&(n+=a(t.offsetParent))),n}function d(e,t){return e&&e.className!==t&&(e.className=t),e}function u(t){return t&&-1!==t.className.indexOf(e.collapsibleClass)&&-1!==t.className.indexOf(e.isCollapsedClass)?(d(t,t.className.replace(l+e.isCollapsedClass,"")),u(t.parentNode.parentNode)):t}function f(){let t;return t=e.scrollContainer&&document.querySelector(e.scrollContainer)?document.querySelector(e.scrollContainer).scrollTop:document.documentElement.scrollTop||o.scrollTop,t}function m(t,o=f()){let l;return n.call(t,((n,s)=>a(n)>o+e.headingsOffset+10?(l=t[0===s?s:s-1],!0):s===t.length-1?(l=t[t.length-1],!0):void 0)),l}return{enableTocAnimation:function(){r=!0},disableTocAnimation:function(t){const n=t.target||t.srcElement;"string"==typeof n.className&&-1!==n.className.indexOf(e.linkClass)&&(r=!1)},render:function(e,t){const n=c(!1);if(t.forEach((e=>{i(e,n)})),s=e||s,null!==s)return s.firstChild&&s.removeChild(s.firstChild),0===t.length?s:s.appendChild(n)},updateToc:function(n){e.positionFixedSelector&&function(){const t=f(),n=document.querySelector(e.positionFixedSelector);"auto"===e.fixedSidebarOffset&&(e.fixedSidebarOffset=s.offsetTop),t>e.fixedSidebarOffset?-1===n.className.indexOf(e.positionFixedClass)&&(n.className+=l+e.positionFixedClass):n.className=n.className.replace(l+e.positionFixedClass,"")}();const o=n;if(r&&s&&o.length>0){const n=m(o),r=s.querySelector(`.${e.activeLinkClass}`),i=s.querySelector(`.${e.linkClass}.node-name--${n.nodeName}[href="${e.basePath}#${n.id.replace(/([ #;&,.+*~':"!^$[\]()=>|/\\@])/g,"\\$1")}"]`);if(r===i)return;const c=s.querySelectorAll(`.${e.linkClass}`);t.call(c,(t=>{d(t,t.className.replace(l+e.activeLinkClass,""))}));const a=s.querySelectorAll(`.${e.listItemClass}`);t.call(a,(t=>{d(t,t.className.replace(l+e.activeListItemClass,""))})),i&&-1===i.className.indexOf(e.activeLinkClass)&&(i.className+=l+e.activeLinkClass);const f=i?.parentNode;f&&-1===f.className.indexOf(e.activeListItemClass)&&(f.className+=l+e.activeListItemClass);const h=s.querySelectorAll(`.${e.listClass}.${e.collapsibleClass}`);t.call(h,(t=>{-1===t.className.indexOf(e.isCollapsedClass)&&(t.className+=l+e.isCollapsedClass)})),i?.nextSibling&&-1!==i.nextSibling.className.indexOf(e.isCollapsedClass)&&d(i.nextSibling,i.nextSibling.className.replace(l+e.isCollapsedClass,"")),u(i?.parentNode.parentNode)}},getCurrentlyHighlighting:function(){return r},getTopHeader:m,getScrollTop:f,updateUrlHashForHeader:function(e){const t=f(),n=m(e,t);if(!n||t<5)"#"!==window.location.hash&&""!==window.location.hash&&window.history.pushState(null,null,"#");else if(n){const e=`#${n.id}`;window.location.hash!==e&&window.history.pushState(null,null,e)}}}}e.r(t),e.d(t,{_buildHtml:()=>s,_headingsArray:()=>i,_options:()=>d,_parseContent:()=>r,_scrollListener:()=>c,default:()=>g,destroy:()=>f,init:()=>u,refresh:()=>m});const o={tocSelector:".js-toc",tocElement:null,contentSelector:".js-toc-content",contentElement:null,headingSelector:"h1, h2, h3",ignoreSelector:".js-toc-ignore",hasInnerContainers:!1,linkClass:"toc-link",extraLinkClasses:"",activeLinkClass:"is-active-link",listClass:"toc-list",extraListClasses:"",isCollapsedClass:"is-collapsed",collapsibleClass:"is-collapsible",listItemClass:"toc-list-item",activeListItemClass:"is-active-li",collapseDepth:0,scrollSmooth:!0,scrollSmoothDuration:420,scrollSmoothOffset:0,scrollEndCallback:function(e){},headingsOffset:1,throttleTimeout:50,positionFixedSelector:null,positionFixedClass:"is-position-fixed",fixedSidebarOffset:"auto",includeHtml:!1,includeTitleTags:!1,onClick:function(e){},orderedList:!0,scrollContainer:null,skipRendering:!1,headingLabelCallback:!1,ignoreHiddenElements:!1,headingObjectCallback:null,basePath:"",disableTocScrollSync:!1,tocScrollingWrapper:null,tocScrollOffset:30,enableUrlHashUpdateOnScroll:!1};function l(e){var t=e.duration,n=e.offset;if("undefined"!=typeof window&&"undefined"!=typeof location){var o=location.hash?l(location.href):location.href;document.body.addEventListener("click",(function(s){var r;"a"!==(r=s.target).tagName.toLowerCase()||!(r.hash.length>0||"#"===r.href.charAt(r.href.length-1))||l(r.href)!==o&&l(r.href)+"#"!==o||s.target.className.indexOf("no-smooth-scroll")>-1||"#"===s.target.href.charAt(s.target.href.length-2)&&"!"===s.target.href.charAt(s.target.href.length-1)||-1===s.target.className.indexOf(e.linkClass)||function(e,t){var n,o,l=window.pageYOffset,s={duration:t.duration,offset:t.offset||0,callback:t.callback,easing:t.easing||function(e,t,n,o){return(e/=o/2)<1?n/2*e*e+t:-n/2*(--e*(e-2)-1)+t}},r=document.querySelector('[id="'+decodeURI(e).split("#").join("")+'"]')||document.querySelector('[id="'+e.split("#").join("")+'"]'),i="string"==typeof e?s.offset+(e?r&&r.getBoundingClientRect().top||0:-(document.documentElement.scrollTop||document.body.scrollTop)):e,c="function"==typeof s.duration?s.duration(i):s.duration;function a(e){o=e-n,window.scrollTo(0,s.easing(o,l,i,c)),o<c?requestAnimationFrame(a):(window.scrollTo(0,l+i),"function"==typeof s.callback&&s.callback())}requestAnimationFrame((function(e){n=e,a(e)}))}(s.target.hash,{duration:t,offset:n,callback:function(){var e,t;e=s.target.hash,(t=document.getElementById(e.substring(1)))&&(/^(?:a|select|input|button|textarea)$/i.test(t.tagName)||(t.tabIndex=-1),t.focus())}})}),!1)}function l(e){return e.slice(0,e.lastIndexOf("#"))}}let s,r,i,c,a,d={};function u(e){d=function(...e){const t={};for(let n=0;n<e.length;n++){const o=e[n];for(const e in o)h.call(o,e)&&(t[e]=o[e])}return t}(o,e||{}),d.scrollSmooth&&(d.duration=d.scrollSmoothDuration,d.offset=d.scrollSmoothOffset,l(d)),s=n(d),r=function(e){const t=[].reduce;function n(e){return e[e.length-1]}function o(e){return+e.nodeName.toUpperCase().replace("H","")}function l(t){if(!function(e){try{return e instanceof window.HTMLElement||e instanceof window.parent.HTMLElement}catch(t){return e instanceof window.HTMLElement}}(t))return t;if(e.ignoreHiddenElements&&(!t.offsetHeight||!t.offsetParent))return null;const n=t.getAttribute("data-heading-label")||(e.headingLabelCallback?String(e.headingLabelCallback(t.innerText)):(t.innerText||t.textContent).trim()),l={id:t.id,children:[],nodeName:t.nodeName,headingLevel:o(t),textContent:n};return e.includeHtml&&(l.childNodes=t.childNodes),e.headingObjectCallback?e.headingObjectCallback(l,t):l}return{nestHeadingsArray:function(o){return t.call(o,(function(t,o){const s=l(o);return s&&function(t,o){const s=l(t),r=s.headingLevel;let i=o,c=n(i),a=r-(c?c.headingLevel:0);for(;a>0&&(c=n(i),!c||r!==c.headingLevel);)c&&void 0!==c.children&&(i=c.children),a--;r>=e.collapseDepth&&(s.isCollapsed=!0),i.push(s)}(s,t.nest),t}),{nest:[]})},selectHeadings:function(t,n){let o=n;e.ignoreSelector&&(o=n.split(",").map((function(t){return`${t.trim()}:not(${e.ignoreSelector})`})));try{return t.querySelectorAll(o)}catch(e){return console.warn(`Headers not found with selector: ${o}`),null}}}}(d),f();const t=function(e){try{return e.contentElement||document.querySelector(e.contentSelector)}catch(t){return console.warn(`Contents element not found: ${e.contentSelector}`),null}}(d);if(null===t)return;const u=C(d);if(null===u)return;if(i=r.selectHeadings(t,d.headingSelector),null===i)return;const m=r.nestHeadingsArray(i).nest;if(d.skipRendering)return this;s.render(u,m);let g=!1;c=p((e=>{s.updateToc(i),!d.disableTocScrollSync&&!g&&function(e){const t=e.tocScrollingWrapper||e.tocElement||document.querySelector(e.tocSelector);if(t&&t.scrollHeight>t.clientHeight){const n=t.querySelector(`.${e.activeListItemClass}`);if(n){const o=n.offsetTop-e.tocScrollOffset;t.scrollTop=o>0?o:0}}}(d),d.enableUrlHashUpdateOnScroll&&s.getCurrentlyHighlighting()&&s.updateUrlHashForHeader(i);const t=e?.target?.scrollingElement&&0===e.target.scrollingElement.scrollTop;(e&&(0===e.eventPhase||null===e.currentTarget)||t)&&(s.updateToc(i),d.scrollEndCallback&&d.scrollEndCallback(e))}),d.throttleTimeout),c(),d.scrollContainer&&document.querySelector(d.scrollContainer)?(document.querySelector(d.scrollContainer).addEventListener("scroll",c,!1),document.querySelector(d.scrollContainer).addEventListener("resize",c,!1)):(document.addEventListener("scroll",c,!1),document.addEventListener("resize",c,!1));let S=null;a=p((e=>{g=!0,d.scrollSmooth&&s.disableTocAnimation(e),s.updateToc(i),S&&clearTimeout(S),S=setTimeout((()=>{s.enableTocAnimation()}),d.scrollSmoothDuration),setTimeout((()=>{g=!1}),d.scrollSmoothDuration+100)}),d.throttleTimeout),d.scrollContainer&&document.querySelector(d.scrollContainer)?document.querySelector(d.scrollContainer).addEventListener("click",a,!1):document.addEventListener("click",a,!1)}function f(){const e=C(d);null!==e&&(d.skipRendering||e&&(e.innerHTML=""),d.scrollContainer&&document.querySelector(d.scrollContainer)?(document.querySelector(d.scrollContainer).removeEventListener("scroll",c,!1),document.querySelector(d.scrollContainer).removeEventListener("resize",c,!1),s&&document.querySelector(d.scrollContainer).removeEventListener("click",a,!1)):(document.removeEventListener("scroll",c,!1),document.removeEventListener("resize",c,!1),s&&document.removeEventListener("click",a,!1)))}function m(e){f(),u(e||d)}const h=Object.prototype.hasOwnProperty;function p(e,t,n){let o,l;return t||(t=250),function(...s){const r=n||this,i=+new Date;o&&i<o+t?(clearTimeout(l),l=setTimeout((()=>{o=i,e.apply(r,s)}),t)):(o=i,e.apply(r,s))}}function C(e){try{return e.tocElement||document.querySelector(e.tocSelector)}catch(t){return console.warn(`TOC element not found: ${e.tocSelector}`),null}}const g={_options:d,_buildHtml:s,_parseContent:r,init:u,destroy:f,refresh:m};var S,b;S="undefined"!=typeof global?global:window||global,b=function(e){const n=!!(e&&e.document&&e.document.querySelector&&e.addEventListener);if("undefined"!=typeof window||n)return e.tocbot=t,t},"function"==typeof define&&define.amd?define([],b(S)):"object"==typeof exports?module.exports=b(S):S.tocbot=b(S)})();
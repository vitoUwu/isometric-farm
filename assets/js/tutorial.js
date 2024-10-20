export function showTutorial() {
  const tutorial = document.createElement("div");
  tutorial.className = "tutorial-container";
  tutorial.id = "tutorial-container";
  tutorial.innerHTML = `
          <button class="close" onclick="window.closeTutorial()">X</button>
          <p>👋 Welcome to the Isometric Pixel Farming Game!</p>
          <p>Harvest crops by pressing the left mouse button and dragging over them.</p>
          <p>Plant crops by pressing the left mouse button and clicking on the dirt tile.</p>
          <p>Sell crops by clicking on the "Inventory" button.</p>
          <p>You can buy upgrades by clicking on the "Shop" button.</p>
          <p>To increase your field level, click on the darker tiles.</p>
  `;
  document.body.appendChild(tutorial);
}

export function closeTutorial() {
  const tutorialContainer = document.getElementById("tutorial-container");
  if (!tutorialContainer) {
    return console.error("Tutorial container not found");
  }
  tutorialContainer.remove();
  localStorage.setItem("tutorial-seen", true);
}

const tutorialSeen = localStorage.getItem("tutorial-seen") === "true";
if (!tutorialSeen) {
  showTutorial();
}

window.closeTutorial = closeTutorial;
window.showTutorial = showTutorial;

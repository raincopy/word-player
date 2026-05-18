let data = null;
let currentWordKey = null;
let currentCardIndex = 0;

const $ = (id) => document.getElementById(id);
const els = {
  categoryButtons: $("categoryButtons"),
  wordListPanel: $("wordListPanel"),
  wordButtons: $("wordButtons"),
  playerPanel: $("playerPanel"),
  currentWordTitle: $("currentWordTitle"),
  cardCounter: $("cardCounter"),
  cardImage: $("cardImage"),
  backHomeBtn: $("backHomeBtn"),
  prevCardBtn: $("prevCardBtn"),
  nextCardBtn: $("nextCardBtn")
};

async function loadData() {
  const response = await fetch("./words.json?v=" + Date.now());
  data = await response.json();
  renderCategories();
}

function renderCategories() {
  els.categoryButtons.innerHTML = "";
  Object.entries(data.categories).forEach(([key, category]) => {
    const btn = document.createElement("button");
    btn.textContent = category.label;
    btn.onclick = () => {
      renderWordList(category.words);
      els.wordListPanel.style.display = "block"; // 강제 노출
      els.wordListPanel.classList.remove("hidden");
      els.playerPanel.style.display = "none";
    };
    els.categoryButtons.appendChild(btn);
  });
}

function renderWordList(wordKeys) {
  els.wordButtons.innerHTML = "";
  wordKeys.forEach(key => {
    if (!data.words[key]) return;
    const btn = document.createElement("button");
    btn.textContent = data.words[key].title || key;
    btn.onclick = () => {
      currentWordKey = key;
      currentCardIndex = 0;
      els.wordListPanel.style.display = "none";
      els.playerPanel.style.display = "block"; // 플레이어 강제 노출
      els.playerPanel.classList.remove("hidden");
      updateCard();
      window.scrollTo(0, 0);
    };
    els.wordButtons.appendChild(btn);
  });
}

function updateCard() {
  const word = data.words[currentWordKey];
  els.currentWordTitle.textContent = word.title || currentWordKey;
  els.cardCounter.textContent = `${currentCardIndex + 1} / ${word.cards.length}`;
  // 경로 자동 수정: hub200 -> hub
  els.cardImage.src = word.cards[currentCardIndex].replace("hub200", "hub");
}

els.backHomeBtn.onclick = () => {
  els.playerPanel.style.display = "none";
  els.wordListPanel.style.display = "block";
};
els.nextCardBtn.onclick = () => {
  if (currentCardIndex < data.words[currentWordKey].cards.length - 1) {
    currentCardIndex++;
    updateCard();
  }
};
els.prevCardBtn.onclick = () => {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    updateCard();
  }
};

loadData();
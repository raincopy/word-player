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
  const response = await fetch("./words.json");
  data = await response.json();
  renderCategories();
}

function renderCategories() {
  els.categoryButtons.innerHTML = "";
  Object.entries(data.categories).forEach(([key, category]) => {
    const btn = document.createElement("button");
    btn.textContent = category.label;
    btn.onclick = () => {
      // 카테고리 클릭 시 리스트 표시
      renderWordList(category.words);
      els.wordListPanel.classList.remove("hidden");
      els.playerPanel.classList.add("hidden");
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
    btn.onclick = () => showPlayer(key);
    els.wordButtons.appendChild(btn);
  });
}

function showPlayer(wordKey) {
  currentWordKey = wordKey;
  currentCardIndex = 0;
  els.wordListPanel.classList.add("hidden");
  els.playerPanel.classList.remove("hidden");
  updateCard();
}

function updateCard() {
  const word = data.words[currentWordKey];
  els.currentWordTitle.textContent = word.title || currentWordKey;
  els.cardCounter.textContent = `${currentCardIndex + 1} / ${word.cards.length}`;
  els.cardImage.src = word.cards[currentCardIndex];
}

// 이벤트 연결
els.backHomeBtn.onclick = () => {
  els.playerPanel.classList.add("hidden");
  els.wordListPanel.classList.remove("hidden");
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
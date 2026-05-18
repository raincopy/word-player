let data = null;

let currentCategoryKey = null;
let currentCategoryWords = [];
let currentWordKey = null;
let currentCardIndex = 0;

const $ = (id) => document.getElementById(id);

const els = {
  searchInput: $("searchInput"),
  searchBtn: $("searchBtn"),
  searchMessage: $("searchMessage"),
  categoryButtons: $("categoryButtons"),
  wordListPanel: $("wordListPanel"),
  activeCategoryTitle: $("activeCategoryTitle"),
  closeListBtn: $("closeListBtn"),
  wordButtons: $("wordButtons"),
  playerPanel: $("playerPanel"),
  backHomeBtn: $("backHomeBtn"),
  currentWordTitle: $("currentWordTitle"),
  cardCounter: $("cardCounter"),
  cardStage: $("cardStage"),
  cardImage: $("cardImage"),
  missingImage: $("missingImage"),
  prevCardBtn: $("prevCardBtn"),
  nextCardBtn: $("nextCardBtn"),
  prevWordBtn: $("prevWordBtn"),
  nextWordBtn: $("nextWordBtn")
};

async function loadData() {
  const response = await fetch("./words.json", { cache: "no-store" });
  if (!response.ok) throw new Error("words.json을 불러오지 못했습니다.");
  data = await response.json();
  renderCategories();
}

function renderCategories() {
  els.categoryButtons.innerHTML = "";

  Object.entries(data.categories).forEach(([key, category]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = category.label;
    btn.addEventListener("click", () => openCategory(key));
    els.categoryButtons.appendChild(btn);
  });
}

function openCategory(categoryKey) {
  const category = data.categories[categoryKey];
  if (!category) return;

  currentCategoryKey = categoryKey;
  currentCategoryWords = category.words.filter((wordKey) => data.words[wordKey]);

  els.activeCategoryTitle.textContent = category.label;
  els.wordButtons.innerHTML = "";

  currentCategoryWords.forEach((wordKey) => {
    const word = data.words[wordKey];
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = word.title || wordKey;
    btn.addEventListener("click", () => openWord(wordKey, categoryKey));
    els.wordButtons.appendChild(btn);
  });

  els.wordListPanel.classList.remove("hidden");
  els.playerPanel.classList.add("hidden");
  window.scrollTo({ top: els.wordListPanel.offsetTop - 10, behavior: "smooth" });
}

function openWord(wordKey, categoryKey = currentCategoryKey) {
  if (!data.words[wordKey]) {
    showSearchMessage("준비 중인 단어입니다.");
    return;
  }

  currentWordKey = wordKey;
  currentCardIndex = 0;

  if (categoryKey && data.categories[categoryKey]) {
    currentCategoryKey = categoryKey;
    currentCategoryWords = data.categories[categoryKey].words.filter((key) => data.words[key]);
  } else if (!currentCategoryWords.includes(wordKey)) {
    currentCategoryWords = Object.keys(data.words);
    currentCategoryKey = null;
  }

  els.playerPanel.classList.remove("hidden");
  els.wordListPanel.classList.add("hidden");
  updateCard();
  window.scrollTo({ top: els.playerPanel.offsetTop - 10, behavior: "smooth" });
}

function updateCard() {
  const word = data.words[currentWordKey];
  if (!word) return;

  const total = word.cards.length;
  const src = word.cards[currentCardIndex];

  els.currentWordTitle.textContent = word.title || currentWordKey;
  els.cardCounter.textContent = `${currentCardIndex + 1} / ${total}`;
  els.missingImage.classList.add("hidden");

  els.cardImage.src = src;
  els.cardImage.alt = `${word.title || currentWordKey} ${currentCardIndex + 1}장`;
}

function nextCard() {
  const word = data.words[currentWordKey];
  if (!word) return;

  if (currentCardIndex < word.cards.length - 1) {
    currentCardIndex += 1;
    updateCard();
  }
}

function prevCard() {
  if (currentCardIndex > 0) {
    currentCardIndex -= 1;
    updateCard();
  }
}

function shiftWord(delta) {
  if (!currentWordKey || currentCategoryWords.length === 0) return;

  const currentIndex = currentCategoryWords.indexOf(currentWordKey);
  if (currentIndex === -1) return;

  const nextIndex = currentIndex + delta;
  if (nextIndex < 0 || nextIndex >= currentCategoryWords.length) return;

  openWord(currentCategoryWords[nextIndex], currentCategoryKey);
}

function searchWord() {
  const raw = els.searchInput.value.trim();
  const query = normalize(raw);
  if (!query) return;

  const wordKey = findWordKey(query);
  if (!wordKey) {
    showSearchMessage(`"${raw}"는 아직 준비 중입니다.`);
    return;
  }

  showSearchMessage("");
  openWord(wordKey, data.words[wordKey].category || null);
}

function normalize(value) {
  return value.toLowerCase().replace(/\s+/g, "-");
}

function findWordKey(query) {
  if (data.words[query]) return query;

  return Object.entries(data.words).find(([, word]) => {
    return normalize(word.title || "") === query;
  })?.[0];
}

function showSearchMessage(message) {
  els.searchMessage.textContent = message;
}

function bindEvents() {
  els.searchBtn.addEventListener("click", searchWord);
  els.searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") searchWord();
  });

  els.closeListBtn.addEventListener("click", () => {
    els.wordListPanel.classList.add("hidden");
  });

  els.backHomeBtn.addEventListener("click", () => {
    els.playerPanel.classList.add("hidden");
    if (currentCategoryKey) {
      openCategory(currentCategoryKey);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  els.nextCardBtn.addEventListener("click", nextCard);
  els.prevCardBtn.addEventListener("click", prevCard);
  els.nextWordBtn.addEventListener("click", () => shiftWord(1));
  els.prevWordBtn.addEventListener("click", () => shiftWord(-1));

  els.cardStage.addEventListener("click", nextCard);
  els.cardStage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") nextCard();
    if (event.key === "ArrowRight") nextCard();
    if (event.key === "ArrowLeft") prevCard();
  });

  els.cardImage.addEventListener("error", () => {
    els.missingImage.classList.remove("hidden");
  });

  els.cardImage.addEventListener("load", () => {
    els.missingImage.classList.add("hidden");
  });
}

bindEvents();
loadData().catch((error) => {
  showSearchMessage(error.message);
});
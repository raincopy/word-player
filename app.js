// 전체 코드를 DOM 로드 후에 실행되도록 안전하게 감쌉니다.
window.onload = function() {
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
    try {
      const response = await fetch("./words.json?v=" + Date.now());
      data = await response.json();
      renderCategories();
    } catch (e) { console.error("데이터 로드 실패:", e); }
  }

  function renderCategories() {
    if (!els.categoryButtons) return;
    els.categoryButtons.innerHTML = "";
    Object.entries(data.categories).forEach(([key, category]) => {
      const btn = document.createElement("button");
      btn.textContent = category.label;
      btn.onclick = () => {
        renderWordList(category.words);
        els.wordListPanel.style.display = "block";
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
        els.playerPanel.style.display = "block";
        els.playerPanel.classList.remove("hidden");
        updateCard();
        window.scrollTo(0, 0);
      };
      els.wordButtons.appendChild(btn);
    });
  }

  function updateCard() {
    const word = data.words[currentWordKey];
    if (!word || !word.cards[currentCardIndex]) return;
    
    els.currentWordTitle.textContent = word.title || currentWordKey;
    els.cardCounter.textContent = `${currentCardIndex + 1} / ${word.cards.length}`;
    // hub200 -> hub 경로 자동 보정
    els.cardImage.src = word.cards[currentCardIndex].replace("hub200", "hub");
  }

  // 버튼 기능 연결 (이 부분이 빠져있었습니다)
  if (els.backHomeBtn) els.backHomeBtn.onclick = () => {
    els.playerPanel.style.display = "none";
    els.wordListPanel.style.display = "block";
  };

  if (els.nextCardBtn) els.nextCardBtn.onclick = () => {
    const word = data.words[currentWordKey];
    if (word && currentCardIndex < word.cards.length - 1) {
      currentCardIndex++;
      updateCard();
    }
  };

  if (els.prevCardBtn) els.prevCardBtn.onclick = () => {
    if (currentCardIndex > 0) {
      currentCardIndex--;
      updateCard();
    }
  };

  loadData();
};
// 실행 시점 문제를 해결하기 위해 전체를 DOMContentLoaded로 감쌉니다.
document.addEventListener("DOMContentLoaded", () => {
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
    } catch (e) { console.error("데이터 로딩 실패:", e); }
  }

  function renderCategories() {
    els.categoryButtons.innerHTML = "";
    Object.entries(data.categories).forEach(([key, category]) => {
      const btn = document.createElement("button");
      btn.textContent = category.label;
      btn.onclick = () => {
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
      btn.onclick = () => {
        currentWordKey = key;
        currentCardIndex = 0;
        els.wordListPanel.classList.add("hidden");
        els.playerPanel.classList.remove("hidden");
        updateCard();
      };
      els.wordButtons.appendChild(btn);
    });
  }

  function updateCard() {
    const word = data.words[currentWordKey];
    if (!word) return;
    els.currentWordTitle.textContent = word.title || currentWordKey;
    els.cardCounter.textContent = `${currentCardIndex + 1} / ${word.cards.length}`;
    // hub200 -> hub 경로 보정 기능 포함
    els.cardImage.src = word.cards[currentCardIndex].replace("hub200", "hub");
  }

  // 버튼 이벤트 연결 (재검증 완)
  els.backHomeBtn.onclick = () => {
    els.playerPanel.classList.add("hidden");
    els.wordListPanel.classList.remove("hidden");
  };

  els.nextCardBtn.onclick = () => {
    const word = data.words[currentWordKey];
    if (word && currentCardIndex < word.cards.length - 1) {
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
});
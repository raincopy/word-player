function updateCard() {
  const word = data.words[currentWordKey];
  if (!word) return;
  
  els.currentWordTitle.textContent = word.title || currentWordKey;
  els.cardCounter.textContent = `${currentCardIndex + 1} / ${word.cards.length}`;
  
  // 핵심: JSON에 hub200이라 적혀있어도 실제 경로인 hub로 바꿔서 로드
  let rawPath = word.cards[currentCardIndex];
  let fixedPath = rawPath.replace('hub200', 'hub'); 
  
  els.cardImage.src = fixedPath;
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
      // 모바일에서 가장 확실한 화면 전환 방법
      els.wordListPanel.style.display = "none";
      els.playerPanel.style.display = "block";
      els.playerPanel.classList.remove("hidden");
      updateCard();
      window.scrollTo(0, 0);
    };
    els.wordButtons.appendChild(btn);
  });
}
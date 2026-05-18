function renderWordList(wordKeys) {
  els.wordButtons.innerHTML = "";
  wordKeys.forEach(key => {
    if (!data.words[key]) return;
    const btn = document.createElement("button");
    btn.type = "button"; // 모바일 클릭 오작동 방지
    btn.textContent = data.words[key].title || key;
    
    btn.onclick = () => {
      // 1. 데이터 설정
      currentWordKey = key;
      currentCardIndex = 0;
      
      // 2. 화면 전환 (핵심)
      els.wordListPanel.classList.add("hidden");   // 목록 숨기기
      els.playerPanel.classList.remove("hidden"); // 플레이어 보이기
      
      // 3. 카드 로드
      updateCard();
      
      // 4. 스크롤 상단 이동 (모바일 배려)
      window.scrollTo(0, 0);
    };
    els.wordButtons.appendChild(btn);
  });
}
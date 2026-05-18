// 전체 코드를 DOM 로드 후 실행
window.onload = function () {
  let data = null;

  let currentCategoryKey = null;
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
    nextCardBtn: $("nextCardBtn"),
  };

  // JSON 로드
  async function loadData() {
    try {
      const response = await fetch("./words.json?v=" + Date.now());

      data = await response.json();

      console.log("JSON 로드 완료", data);

      renderCategories();
    } catch (e) {
      console.error("데이터 로드 실패:", e);
    }
  }

  // 카테고리 버튼 생성
  function renderCategories() {
    els.categoryButtons.innerHTML = "";

    Object.entries(data.categories).forEach(
      ([categoryKey, category]) => {
        const btn = document.createElement("button");

        btn.textContent = category.label;

        btn.onclick = () => {
          renderWordList(
            categoryKey,
            category.words
          );

          els.wordListPanel.style.display =
            "block";

          els.wordListPanel.classList.remove(
            "hidden"
          );

          els.playerPanel.style.display = "none";
        };

        els.categoryButtons.appendChild(btn);
      }
    );
  }

  // 단어 버튼 생성
  function renderWordList(
    categoryKey,
    wordKeys
  ) {
    els.wordButtons.innerHTML = "";

    wordKeys.forEach((key) => {
      // category 내부 접근
      if (
        !data.words[categoryKey] ||
        !data.words[categoryKey][key]
      ) {
        console.warn(
          "단어 없음:",
          categoryKey,
          key
        );
        return;
      }

      const word =
        data.words[categoryKey][key];

      const btn = document.createElement(
        "button"
      );

      btn.textContent = word.title || key;

      btn.onclick = () => {
        currentCategoryKey = categoryKey;
        currentWordKey = key;
        currentCardIndex = 0;

        els.wordListPanel.style.display =
          "none";

        els.playerPanel.style.display =
          "block";

        els.playerPanel.classList.remove(
          "hidden"
        );

        updateCard();

        window.scrollTo(0, 0);
      };

      els.wordButtons.appendChild(btn);
    });
  }

  // 카드 갱신
  function updateCard() {
    if (
      !data.words[currentCategoryKey] ||
      !data.words[currentCategoryKey][
        currentWordKey
      ]
    )
      return;

    const word =
      data.words[currentCategoryKey][
        currentWordKey
      ];

    if (
      !word.cards ||
      !word.cards[currentCardIndex]
    )
      return;

    els.currentWordTitle.textContent =
      word.title || currentWordKey;

    els.cardCounter.textContent = `${
      currentCardIndex + 1
    } / ${word.cards.length}`;

    els.cardImage.src =
      word.cards[currentCardIndex];

    console.log(
      "이미지 로드:",
      els.cardImage.src
    );
  }

  // 목록 버튼
  els.backHomeBtn.onclick = () => {
    els.playerPanel.style.display = "none";

    els.wordListPanel.style.display =
      "block";
  };

  // 다음 카드
  els.nextCardBtn.onclick = () => {
    const word =
      data.words[currentCategoryKey][
        currentWordKey
      ];

    if (
      currentCardIndex <
      word.cards.length - 1
    ) {
      currentCardIndex++;

      updateCard();
    }
  };

  // 이전 카드
  els.prevCardBtn.onclick = () => {
    if (currentCardIndex > 0) {
      currentCardIndex--;

      updateCard();
    }
  };

  loadData();
};
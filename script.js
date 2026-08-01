document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const btnResetAll = document.getElementById('btn-reset');
  const tabsNav = document.querySelector('.tabs-nav');
  const infoTexts = document.querySelectorAll('.tab-info');
  const resetSectionBtns = document.querySelectorAll('.btn-reset-section');

  function filterCards(category) {
    cards.forEach(card => {
      if (card.dataset.category === category) {
        card.classList.remove('hide');
      } else {
        card.classList.add('hide');
      }
    });

    infoTexts.forEach(info => {
      if (info.id === `info-${category}`) {
        info.classList.remove('hide');
      } else {
        info.classList.add('hide');
      }
    });
  }

  function updateProgress() {
    let totalMax = 0;
    let totalDone = 0;

    cards.forEach(card => {
      const max = parseInt(card.dataset.max) || 0;
      const current = parseInt(card.querySelector('.count').textContent) || 0;
      
      totalMax += max;
      totalDone += (max - current);

      if (current === 0) {
        card.classList.add('completed');
        card.querySelector('.btn-count').disabled = true;
      } else {
        card.classList.remove('completed');
        card.querySelector('.btn-count').disabled = false;
      }
    });

    let percentage = 0;
    if (totalMax > 0) {
      percentage = Math.round((totalDone / totalMax) * 100);
      percentage = Math.max(0, Math.min(100, percentage));
    }

    if (progressFill && progressText) {
      progressFill.style.width = `${percentage}%`;
      progressText.textContent = `${percentage}%`;
    }

    saveData();
  }

  cards.forEach((card) => {
    const btn = card.querySelector('.btn-count');
    const countDisplay = card.querySelector('.count');

    btn.addEventListener('click', () => {
      let current = parseInt(countDisplay.textContent);
      if (current > 0) {
        current--;
        countDisplay.textContent = current;
        updateProgress();
      }
    });
  });

  // إعادة ضبط ذكر فردي عند الضغط على زر الإعادة الخاص به
  cards.forEach((card) => {
    const resetCardBtn = card.querySelector('.btn-reset-card');
    if (resetCardBtn) {
      resetCardBtn.addEventListener('click', () => {
        const countDisplay = card.querySelector('.count');
        const max = card.dataset.max;
        countDisplay.textContent = max;
        updateProgress();
      });
    }
  });

  if (tabsNav) {
    tabsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;

      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.tab;
      filterCards(filter);
    });
  }

  resetSectionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const categoryToReset = btn.dataset.resetCategory;

      cards.forEach(card => {
        if (card.dataset.category === categoryToReset) {
          card.querySelector('.count').textContent = card.dataset.max;
        }
      });

      updateProgress();
    });
  });

  function saveData() {
    const state = [];
    cards.forEach(card => {
      state.push(card.querySelector('.count').textContent);
    });
    localStorage.setItem('athkar_progress', JSON.stringify(state));
  }

  function loadData() {
    const savedState = JSON.parse(localStorage.getItem('athkar_progress'));
    if (savedState) {
      cards.forEach((card, index) => {
        if (savedState[index] !== undefined) {
          card.querySelector('.count').textContent = savedState[index];
        }
      });
    }
    updateProgress();
  }

  filterCards('morning');
  loadData();

  if (btnResetAll) {
    btnResetAll.addEventListener('click', () => {
      cards.forEach(card => {
        card.querySelector('.count').textContent = card.dataset.max;
      });
      updateProgress();
    });
  }
});
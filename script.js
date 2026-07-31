document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const btnReset = document.getElementById('btn-reset');
  const tabBtns = document.querySelectorAll('.tab-btn');

  function filterCards(category) {
    cards.forEach(card => {
      if (card.dataset.category === category) {
        card.classList.remove('hide');
      } else {
        card.classList.add('hide');
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

    progressFill.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;

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

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.tab;
      filterCards(filter);
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

  btnReset.addEventListener('click', () => {
    cards.forEach(card => {
      card.querySelector('.count').textContent = card.dataset.max;
    });
    updateProgress();
  });
});
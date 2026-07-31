document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  const btnResetAll = document.getElementById('btn-reset');
  const tabsNav = document.querySelector('.tabs-nav');
  const infoTexts = document.querySelectorAll('.tab-info');
  const resetSectionBtns = document.querySelectorAll('.btn-reset-section');

  // فلترة الكروت والتوضيحات حسب القسم المختار
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

  // تحديث شريط الإنجاز وحفظ الحالة
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

  // تقليل العداد عند الضغط على زر (تم)
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

  // التنقل بين الأقسام (أذكار الصباح والمساء)
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

  // إعادة ضبط قسم معين (صباح أو مساء)
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

  // حفظ واسترجاع البيانات من الذاكرة المحلية (LocalStorage)
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

  // إظهار أذكار الصباح أول ما الصفحة تفتح
  filterCards('morning');
  loadData();

  // زر إعادة الضبط الشامل لكل الأذكار
  if (btnResetAll) {
    btnResetAll.addEventListener('click', () => {
      cards.forEach(card => {
        card.querySelector('.count').textContent = card.dataset.max;
      });
      updateProgress();
    });
  }
});
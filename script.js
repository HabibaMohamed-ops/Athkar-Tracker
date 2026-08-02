document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.card');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabInfos = document.querySelectorAll('.tab-info');
  const progressText = document.getElementById('progress-text');
  const progressFill = document.getElementById('progress-fill');
  const resetAllBtn = document.getElementById('btn-reset');
  const resetSectionBtns = document.querySelectorAll('.btn-reset-section');

  // تحميل البيانات المخزنة مسبقاً أو إنشاء كائن جديد
  let savedData = JSON.parse(localStorage.getItem('athkarProgress')) || {};

  // تهيئة الحالة الأولية للبطاقات بناءً على الـ localStorage
  cards.forEach(card => {
    const cardId = card.getAttribute('data-id');
    const maxCount = parseInt(card.getAttribute('data-max'));
    const countEl = card.querySelector('.count');

    // إذا كان هناك عداد مخزّن لهذا الـ id مسبقاً
    if (savedData[cardId] !== undefined) {
      countEl.textContent = savedData[cardId];
      if (savedData[cardId] === 0) {
        card.classList.add('completed');
      }
    } else {
      // لو مش مخزّن، نبدأ بالقيمة القصوى (الافتراضية)
      savedData[cardId] = maxCount;
      countEl.textContent = maxCount;
    }
  });

  updateTotalProgress();

  // تفعيل أزرار التبويبات (Tabs)
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');

      tabInfos.forEach(info => {
        info.classList.add('hide');
      });
      document.getElementById(`info-${targetTab}`).classList.remove('hide');

      cards.forEach(card => {
        if (card.getAttribute('data-category') === targetTab) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // عرض تبويب الصباح افتراضياً وإخفاء الباقي
  tabBtns[0].click();

  // زر "تم" لإنقاص العداد
  cards.forEach(card => {
    const btnCount = card.querySelector('.btn-count');
    const btnResetCard = card.querySelector('.btn-reset-card');
    const countEl = card.querySelector('.count');
    const cardId = card.getAttribute('data-id');
    const maxCount = parseInt(card.getAttribute('data-max'));

    btnCount.addEventListener('click', () => {
      let currentCount = parseInt(countEl.textContent);
      if (currentCount > 0) {
        currentCount--;
        countEl.textContent = currentCount;
        savedData[cardId] = currentCount;

        if (currentCount === 0) {
          card.classList.add('completed');
        }

        saveAndRefresh();
      }
    });

    // زر إعادة تعيين بطاقة واحدة
    btnResetCard.addEventListener('click', () => {
      currentCount = maxCount;
      countEl.textContent = maxCount;
      savedData[cardId] = maxCount;
      card.classList.remove('completed');
      saveAndRefresh();
    });
  });

  // إعادة ضبط قسم كامل (أذكار الصباح مثلاً)
  resetSectionBtns.forEach(resetBtn => {
    resetBtn.addEventListener('click', () => {
      const category = resetBtn.getAttribute('data-reset-category');
      cards.forEach(card => {
        if (card.getAttribute('data-category') === category) {
          const cardId = card.getAttribute('data-id');
          const maxCount = parseInt(card.getAttribute('data-max'));
          const countEl = card.querySelector('.count');

          countEl.textContent = maxCount;
          savedData[cardId] = maxCount;
          card.classList.remove('completed');
        }
      });
      saveAndRefresh();
    });
  });

  // زر إعادة ضبط كل الأذكار
  resetAllBtn.addEventListener('click', () => {
    if (confirm('هل أنت متأكد من إعادة ضبط جميع الأذكار؟')) {
      cards.forEach(card => {
        const cardId = card.getAttribute('data-id');
        const maxCount = parseInt(card.getAttribute('data-max'));
        const countEl = card.querySelector('.count');

        countEl.textContent = maxCount;
        savedData[cardId] = maxCount;
        card.classList.remove('completed');
      });
      saveAndRefresh();
    }
  });

  // حفظ البيانات في الـ LocalStorage وتحديث نسبة الإنجاز
  function saveAndRefresh() {
    localStorage.setItem('athkarProgress', JSON.stringify(savedData));
    updateTotalProgress();
  }

  // حساب وتحديث نسبة الإنجاز الكلية
  function updateTotalProgress() {
    let totalCards = cards.length;
    let completedCards = 0;

    cards.forEach(card => {
      const cardId = card.getAttribute('data-id');
      const maxCount = parseInt(card.getAttribute('data-max'));
      // إذا وصل العداد إلى 0 يعني تمت قراءة الذكر بالكامل
      if (savedData[cardId] === 0) {
        completedCards++;
      }
    });

    let percentage = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;
    progressText.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;
  }
});
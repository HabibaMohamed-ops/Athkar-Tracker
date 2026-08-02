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

  // تهيئة الحالة الأولية للبطاقات بناءً على الـ localStorage والـ data-max
  cards.forEach(card => {
    const cardId = card.getAttribute('data-id');
    const maxCount = parseInt(card.getAttribute('data-max'), 10);
    const countEl = card.querySelector('.count');

    // إذا لم يتم تخزين هذا الكارت من قبل، أو القيمة المخزنة غير متوافقة
    if (savedData[cardId] === undefined) {
      savedData[cardId] = maxCount;
    }

    // تحديث النص في الصفحة بالقيمة المخزنة
    countEl.textContent = savedData[cardId];

    // إذا كانت القيمة تساوي صفر، اجعل الكارت مكتمل
    if (savedData[cardId] === 0) {
      card.classList.add('completed');
    } else {
      card.classList.remove('completed');
    }
  });

  // حفظ الحالة الأولية المحدثة وتحديث شريط التقدم
  saveAndRefresh();

  // تفعيل أزرار التبويبات (Tabs)
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.getAttribute('data-tab');

      tabInfos.forEach(info => {
        info.classList.add('hide');
      });
      
      const targetInfo = document.getElementById(`info-${targetTab}`);
      if (targetInfo) {
        targetInfo.classList.remove('hide');
      }

      cards.forEach(card => {
        if (card.getAttribute('data-category') === targetTab) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // عرض أول تبويب افتراضياً إذا كانت الأزرار موجودة
  if (tabBtns.length > 0) {
    tabBtns[0].click();
  }

  // زر "تم" لإنقاص العداد وزر إعادة تعيين بطاقة واحدة
  cards.forEach(card => {
    const btnCount = card.querySelector('.btn-count');
    const btnResetCard = card.querySelector('.btn-reset-card');
    const countEl = card.querySelector('.count');
    const cardId = card.getAttribute('data-id');
    const maxCount = parseInt(card.getAttribute('data-max'), 10);

    if (btnCount) {
      btnCount.addEventListener('click', () => {
        let currentCount = parseInt(countEl.textContent, 10);
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
    }

    if (btnResetCard) {
      btnResetCard.addEventListener('click', () => {
        countEl.textContent = maxCount;
        savedData[cardId] = maxCount;
        card.classList.remove('completed');
        saveAndRefresh();
      });
    }
  });

  // إعادة ضبط قسم كامل
  resetSectionBtns.forEach(resetBtn => {
    resetBtn.addEventListener('click', () => {
      const category = resetBtn.getAttribute('data-reset-category');
      cards.forEach(card => {
        if (card.getAttribute('data-category') === category) {
          const cardId = card.getAttribute('data-id');
          const maxCount = parseInt(card.getAttribute('data-max'), 10);
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
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', () => {
      if (confirm('هل أنت متأكد من إعادة ضبط جميع الأذكار؟')) {
        cards.forEach(card => {
          const cardId = card.getAttribute('data-id');
          const maxCount = parseInt(card.getAttribute('data-max'), 10);
          const countEl = card.querySelector('.count');

          countEl.textContent = maxCount;
          savedData[cardId] = maxCount;
          card.classList.remove('completed');
        });
        saveAndRefresh();
      }
    });
  }

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
      if (savedData[cardId] === 0) {
        completedCards++;
      }
    });

    let percentage = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;
    if (progressText) progressText.textContent = `${percentage}%`;
    if (progressFill) progressFill.style.width = `${percentage}%`;
  }
});
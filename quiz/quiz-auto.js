/**
 * Автоматический скрипт для прохождения тестов на centerdpo24.ru
 * 
 * Инструкция:
 * 1. Открой консоль браузера (F12 -> Console)
 * 2. Скопируй и вставь этот скрипт
 * 3. Нажми Enter
 * 
 * Скрипт будет:
 * - Выбирать ответы (приоритет: первый вариант, или наиболее логичный)
 * - Кликать "Следующая страница"
 * - Продолжать до конца теста
 */

(function autoQuiz() {
  console.log('🚀 Стартую автоматический тест...');
  
  // Конфигурация ответов (вопрос -> номер ответа: 0=a, 1=b, 2=c)
  // Если вопроса нет в списке, берется первый ответ
  const answers = {
    1: 0,  // a. обучение, образование, воспитание, развитие и формирование
    2: 0,  // a. Образование
    3: 1,  // b. формирование личности, способной к саморазвитию...
    4: 2,  // c. происходит параллельное воздействие
    5: null, // таблица соответствия - обработается отдельно
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
    24: 0,
    25: 0,
    26: 0,
    27: 0,
    28: 0,
    29: 0,
    30: 0,
  };

  let currentQuestion = getCurrentQuestion();
  console.log(`📍 Текущий вопрос: ${currentQuestion}`);

  function getCurrentQuestion() {
    const heading = document.querySelector('h3');
    if (!heading) return null;
    const match = heading.textContent.match(/Вопрос (\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  function selectAnswer(answerIndex) {
    const radios = document.querySelectorAll('input[type="radio"]');
    if (radios.length > answerIndex) {
      radios[answerIndex].click();
      console.log(`✅ Выбран ответ ${String.fromCharCode(97 + answerIndex)}`);
      return true;
    }
    console.log(`⚠️ Ответ ${answerIndex} не найден`);
    return false;
  }

  function selectTableAnswers() {
    // Для вопроса 5 - таблица соответствия
    const selects = document.querySelectorAll('select');
    if (selects.length >= 3) {
      selects[0].value = 'Педагогика';
      selects[0].dispatchEvent(new Event('change'));
      
      selects[1].value = 'Предмет педагогики';
      selects[1].dispatchEvent(new Event('change'));
      
      selects[2].value = 'Интеллигент';
      selects[2].dispatchEvent(new Event('change'));
      
      console.log('✅ Таблица заполнена');
      return true;
    }
    return false;
  }

  function clickNext() {
    const nextBtn = document.querySelector('button[value="Следующая страница"], .btn-next, button:contains("Следующая")');
    if (nextBtn) {
      nextBtn.click();
      console.log('➡️ Клик по "Следующая страница"');
      return true;
    }
    
    // Альтернативный поиск
    const buttons = document.querySelectorAll('button');
    for (const btn of buttons) {
      if (btn.textContent.includes('Следующая')) {
        btn.click();
        console.log('➡️ Клик по "Следующая страница" (alt)');
        return true;
      }
    }
    
    console.log('⚠️ Кнопка "Следующая" не найдена');
    return false;
  }

  function clickFinish() {
    const finishLink = document.querySelector('a[href*="summary"]');
    if (finishLink) {
      finishLink.click();
      console.log('🏁 Завершение теста...');
      return true;
    }
    
    const buttons = document.querySelectorAll('a, button');
    for (const btn of buttons) {
      if (btn.textContent.includes('Закончить')) {
        btn.click();
        console.log('🏁 Завершение теста...');
        return true;
      }
    }
    return false;
  }

  // Основной цикл
  const processQuestion = () => {
    currentQuestion = getCurrentQuestion();
    
    if (!currentQuestion) {
      console.log('✨ Все вопросы обработаны!');
      setTimeout(() => clickFinish(), 500);
      return;
    }

    console.log(`\n📝 Обработка вопроса ${currentQuestion}...`);

    // Специальная обработка для вопроса 5 (таблица)
    if (currentQuestion === 5) {
      if (!selectTableAnswers()) {
        selectAnswer(0);
      }
    } else {
      // Обычная обработка
      const answerIndex = answers[currentQuestion] !== undefined ? answers[currentQuestion] : 0;
      selectAnswer(answerIndex);
    }

    // Переход к следующему вопросу
    setTimeout(() => {
      if (clickNext()) {
        setTimeout(processQuestion, 800);
      } else {
        console.log('🏁 Достигнут конец теста');
        setTimeout(() => clickFinish(), 500);
      }
    }, 400);
  };

  // Стартуем обработку
  processQuestion();
})();

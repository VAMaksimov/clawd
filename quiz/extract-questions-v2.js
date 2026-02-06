/**
 * Скрипт для извлечения всех вопросов с сайта centerdpo24.ru
 * Версия 2 - использует localStorage для сохранения прогресса между загрузками страниц
 * 
 * Инструкция:
 * 1. Откройте тест на первой странице вопроса (page=0)
 * 2. Откройте консоль браузера (F12 -> Console)
 * 3. Скопируйте и вставьте этот скрипт
 * 4. Нажмите Enter
 * 5. Скрипт будет автоматически переходить на следующие страницы и собирать вопросы
 * 6. Когда все вопросы собраны, результат выведется в консоль
 */

(function extractAllQuestionsWithStorage() {
  console.log('🚀 Начинаю извлечение вопросов (версия 2 - с localStorage)...');
  
  // Инициализируем хранилище
  const storageKey = 'quiz_extraction_progress';
  let progress = JSON.parse(localStorage.getItem(storageKey)) || {
    questions: [],
    currentPage: 0,
    totalPages: 30,
    status: 'running'
  };
  
  console.log(`📍 Продолжаю с вопроса ${progress.questions.length + 1} из ${progress.totalPages}`);
  
  function getCurrentQuestionNumber() {
    const headings = document.querySelectorAll('h3');
    let heading = null;
    
    for (const h of headings) {
      if (h.textContent.includes('Вопрос')) {
        heading = h;
        break;
      }
    }
    
    if (!heading) {
      console.warn('⚠️ Не найден h3 заголовок с текстом "Вопрос"');
      return null;
    }
    
    const match = heading.textContent.match(/Вопрос (\d+)/);
    return match ? parseInt(match[1]) : null;
  }
  
  function extractCurrentQuestion() {
    const questionNumber = getCurrentQuestionNumber();
    if (!questionNumber) {
      console.warn('⚠️ Не удалось определить номер вопроса');
      return null;
    }
    
    // Находим текст вопроса
    const questionTextElement = document.querySelector('.qtext');
    if (!questionTextElement) {
      console.warn(`⚠️ Не найден текст вопроса ${questionNumber}`);
      return null;
    }
    
    // Извлекаем текст вопроса (убираем лишние элементы)
    const questionTextParagraph = questionTextElement.querySelector('p');
    const questionText = questionTextParagraph ? 
      questionTextParagraph.textContent.trim() : 
      questionTextElement.textContent.trim();
    
    // Находим все варианты ответов
    const answerElements = document.querySelectorAll('.answer .r0, .answer .r1');
    const answers = [];
    
    answerElements.forEach((answerEl) => {
      // Находим метку (a., b., c., d.)
      const labelElement = answerEl.querySelector('.answernumber');
      const label = labelElement ? labelElement.textContent.trim() : '';
      
      // Находим текст ответа
      const textElement = answerEl.querySelector('p');
      const text = textElement ? textElement.textContent.trim() : '';
      
      if (label && text) {
        answers.push({ label, text });
      }
    });
    
    if (answers.length === 0) {
      console.warn(`⚠️ Не найдены ответы для вопроса ${questionNumber}. Найдено элементов .answer .r0, .answer .r1: ${answerElements.length}`);
      return null;
    }
    
    return {
      number: questionNumber,
      question: questionText,
      answers: answers
    };
  }
  
  // Извлекаем текущий вопрос
  const currentQuestion = extractCurrentQuestion();
  
  if (currentQuestion) {
    progress.questions.push(currentQuestion);
    console.log(`✅ Извлечен вопрос ${currentQuestion.number} (${progress.questions.length}/${progress.totalPages})`);
    
    // Сохраняем прогресс
    localStorage.setItem(storageKey, JSON.stringify(progress));
    
    // Переходим к следующему вопросу если не последний
    if (progress.questions.length < progress.totalPages) {
      const nextPageNum = progress.questions.length;
      const nextPageUrl = `https://centerdpo24.ru/mod/quiz/attempt.php?attempt=28480&cmid=5915&page=${nextPageNum}`;
      
      console.log(`➡️ Переход на вопрос ${currentQuestion.number + 1}...`);
      setTimeout(() => {
        window.location.href = nextPageUrl;
      }, 500);
    } else {
      // Все вопросы собраны!
      console.log('\n✨ === ВСЕ ВОПРОСЫ СОБРАНЫ === ✨\n');
      
      function formatQuestion(q) {
        let result = `${q.number}) ${q.question}\n\n`;
        q.answers.forEach((answer) => {
          result += `${answer.label}\n${answer.text}\n`;
        });
        return result;
      }
      
      const formattedOutput = progress.questions.map(q => formatQuestion(q)).join('\n');
      console.log('📋 ===== ИЗВЛЕЧЕННЫЕ ВОПРОСЫ =====\n');
      console.log(formattedOutput);
      console.log('\n✨ Готово! Скопируйте текст выше в файл quiz/extracted-questions.txt');
      
      // Очищаем хранилище
      localStorage.removeItem(storageKey);
    }
  } else {
    console.error('❌ Ошибка при извлечении вопроса');
    console.log('Хранилище очищено. Попробуйте снова.');
    localStorage.removeItem(storageKey);
  }
})();

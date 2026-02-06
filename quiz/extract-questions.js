/**
 * Скрипт для извлечения всех вопросов с сайта centerdpo24.ru
 * 
 * Инструкция:
 * 1. Откройте тест на первой странице
 * 2. Откройте консоль браузера (F12 -> Console)
 * 3. Скопируйте и вставьте этот скрипт
 * 4. Нажмите Enter
 * 
 * Скрипт:
 * - Пройдет по всем вопросам
 * - Соберет текст вопроса и варианты ответов
 * - Выведет результат в формате, аналогичном questions.txt
 */

(async function extractAllQuestions() {
  console.log('🚀 Начинаю извлечение вопросов...');
  
  const questions = [];
  let currentPage = 0;
  const totalQuestions = 30; // Общее количество вопросов в тесте
  
  function getCurrentQuestionNumber() {
    // Ищем h3 заголовок, который содержит "Вопрос"
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
  
  function formatQuestion(q) {
    if (!q) return '';
    
    let result = `${q.number}) ${q.question}\n\n`;
    
    q.answers.forEach((answer) => {
      result += `${answer.label}\n${answer.text}\n`;
    });
    
    return result;
  }
  
  function clickNext() {
    return new Promise((resolve) => {
      // Ищем input submit с value "Следующая страница"
      const submitInput = document.querySelector('input[type="submit"][value="Следующая страница"]');
      if (submitInput) {
        console.log('✅ Найдена кнопка "Следующая страница", кликаю...');
        submitInput.click();
        console.log('➡️ Переход к следующему вопросу...');
        // Увеличиваем задержку для загрузки страницы
        setTimeout(() => {
          console.log('✅ Страница загружена, продолжаю...');
          resolve();
        }, 2000);
        return;
      }
      
      // Fallback: ищем кнопки на случай если будут использованы button элементы
      const buttons = document.querySelectorAll('button');
      for (const btn of buttons) {
        if (btn.textContent.includes('Следующая')) {
          btn.click();
          console.log('➡️ Переход к следующему вопросу (button)...');
          setTimeout(() => {
            console.log('✅ Страница загружена, продолжаю...');
            resolve();
          }, 2000);
          return;
        }
      }
      
      console.warn('⚠️ Кнопка "Следующая страница" не найдена');
      resolve();
    });
  }
  
  // Основной цикл извлечения
  for (let i = 0; i < totalQuestions; i++) {
    const questionData = extractCurrentQuestion();
    
    if (questionData) {
      questions.push(questionData);
      console.log(`✅ Извлечен вопрос ${questionData.number}`);
    } else {
      console.warn(`⚠️ Пропущен вопрос на странице ${i + 1}`);
    }
    
    // Переход к следующему вопросу (если не последний)
    if (i < totalQuestions - 1) {
      await clickNext();
    }
  }
  
  // Форматируем и выводим результаты
  console.log('\n📋 ===== ИЗВЛЕЧЕННЫЕ ВОПРОСЫ =====\n');
  
  const formattedOutput = questions.map(q => formatQuestion(q)).join('\n');
  console.log(formattedOutput);
  
  console.log('\n✨ Готово! Скопируйте текст выше в файл quiz/extracted-questions.txt');
  
  // Также возвращаем данные для программного использования
  return questions;
})();

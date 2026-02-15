/**
 * Скрипт для извлечения всех вопросов с сайта centerdpo24.ru
 * Версия 2 - использует localStorage для сохранения прогресса между загрузками страниц
 *
 * ═════════════════════════════════════════════════════════════════════════════
 * О localStorage:
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * localStorage - это встроенное хранилище браузера для сохранения данных на
 * клиентской стороне. Основные характеристики:
 *
 * • Постоянное хранилище: данные сохраняются между сеансами браузера (даже
 *   после закрытия и переоткрытия браузера)
 * • Объём: обычно ~5-10 МБ на один домен (зависит от браузера)
 * • Область видимости: каждый домен имеет свой отдельный localStorage
 * • Формат: хранит только строки (мы используем JSON для структурированных данных)
 * • Синхронный: работает блокирующим способом (не асинхронный, как IndexedDB)
 *
 * Как работает в этом скрипте:
 * 1. localStorage.getItem(key) - читает значение по ключу (возвращает строку или null)
 * 2. localStorage.setItem(key, value) - сохраняет значение (автоматически строка)
 * 3. localStorage.removeItem(key) - удаляет значение по ключу
 * 4. localStorage.clear() - удаляет ВСЕ данные в localStorage для этого домена
 *
 * ═════════════════════════════════════════════════════════════════════════════
 * Как ВРУЧНУЮ очистить localStorage:
 * ═════════════════════════════════════════════════════════════════════════════
 *
 * СПОСОБ 1: Полная очистка через DevTools (все данные на домене)
 * • Откройте DevTools: F12 или Ctrl+Shift+I
 * • Перейдите на вкладку "Application" (Chrome/Edge) или "Storage" (Firefox)
 * • В левом меню: Local Storage → выберите домен (centerdpo24.ru)
 * • Нажмите на любую запись и нажмите Delete, или нажмите на значок урны (удалить всё)
 * Альтернатива: Ctrl+Shift+Delete в браузере → Выберите "Очистить кэш"
 *
 * СПОСОБ 2: Очистка конкретного ключа через консоль
 * • F12 → Console → выполните:
 *   localStorage.removeItem("quiz_extraction_progress");
 * • Команда удалит только прогресс этого скрипта, остальное останется
 *
 * СПОСОБ 3: Полная очистка через консоль
 * • F12 → Console → выполните:
 *   localStorage.clear();
 * • Внимание: удалит ВСЕ данные localStorage для всех сайтов в этом домене!
 *
 * СПОСОБ 4: Очистка при выходе из браузера
 * • Некоторые браузеры могут очищать localStorage при выходе (зависит от настроек)
 *
 * Когда нужно очищать localStorage:
 * ✓ Если скрипт "зависнет" или произойдёт ошибка - очистите прогресс
 * ✓ Если нужно начать заново с первого вопроса
 * ✓ Если данные повредились и скрипт не может продолжить
 * ✓ Для конфиденциальности после работы
 *
 * Инструкция:
 * 1. Откройте тест на первой странице вопроса (page=0)
 * 2. Откройте консоль браузера (F12 -> Console)
 * 3. Скопируйте и вставьте этот скрипт
 * 4. Нажмите Enter
 * 5. Скрипт будет автоматически переходить на следующие страницы и собирать вопросы
 * 6. Когда все вопросы собраны, результат выведется в консоль
 * 7. После завершения очистите localStorage вручную (см. способ 2 выше)
 */

(function extractAllQuestionsWithStorage() {
  console.log("🚀 Начинаю извлечение вопросов (в localStorage)...");

  // Инициализируем хранилище
  const storageKey = "quiz_extraction_progress";
  let progress = JSON.parse(localStorage.getItem(storageKey)) || {
    questions: [],
    currentPage: 0,
    totalPages: 30,
    status: "running",
  };

  console.log(
    `📍 Продолжаю с вопроса ${progress.questions.length + 1} из ${progress.totalPages}`,
  );

  function getCurrentQuestionNumber() {
    const headings = document.querySelectorAll("h3");
    let heading = null;

    for (const h of headings) {
      if (h.textContent.includes("Вопрос")) {
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
      console.warn("⚠️ Не удалось определить номер вопроса");
      return null;
    }

    // Находим текст вопроса
    const questionTextElement = document.querySelector(".qtext");
    if (!questionTextElement) {
      console.warn(`⚠️ Не найден текст вопроса ${questionNumber}`);
      return null;
    }

    // Извлекаем текст вопроса (убираем лишние элементы)
    const questionTextParagraph = questionTextElement.querySelector("p");
    const questionText = questionTextParagraph
      ? questionTextParagraph.textContent.trim()
      : questionTextElement.textContent.trim();

    // Проверяем тип вопроса: SELECT (dropdown matching) или обычный выбор ответа
    const selectElements = document.querySelectorAll(
      "select.custom-select, select.select",
    );

    if (selectElements.length > 0) {
      // Это вопрос типа SELECT MATCHING (таблица с выпадающими списками)
      return extractSelectQuestion(
        questionNumber,
        questionText,
        selectElements,
      );
    }

    // Иначе извлекаем как обычный вопрос с вариантами ответов
    const answerElements = document.querySelectorAll(
      ".answer .r0, .answer .r1",
    );
    const answers = [];

    answerElements.forEach((answerEl) => {
      // Находим метку (a., b., c., d.)
      const labelElement = answerEl.querySelector(".answernumber");
      const label = labelElement ? labelElement.textContent.trim() : "";

      // Находим текст ответа
      const textElement = answerEl.querySelector("p");
      const text = textElement ? textElement.textContent.trim() : "";

      if (label && text) {
        answers.push({ label, text });
      }
    });

    if (answers.length === 0) {
      console.warn(
        `⚠️ Не найдены ответы для вопроса ${questionNumber}. Найдено элементов .answer .r0, .answer .r1: ${answerElements.length}`,
      );
      return null;
    }

    return {
      number: questionNumber,
      question: questionText,
      type: "multiple-choice",
      answers: answers,
    };
  }

  function extractSelectQuestion(questionNumber, questionText, selectElements) {
    // Находим таблицу с соответствиями
    const table = document.querySelector("table");
    if (!table) {
      console.warn(
        `⚠️ Не найдена таблица для SELECT вопроса ${questionNumber}`,
      );
      return null;
    }

    const rows = table.querySelectorAll("tbody tr");
    const matches = [];
    const options = [];

    rows.forEach((row, index) => {
      const cells = row.querySelectorAll("td");
      if (cells.length >= 2) {
        // Левая колонка - предпосылка/утверждение
        const premiseText = cells[0].textContent.trim();

        // Правая колонка - может быть select или текст
        const select = cells[1].querySelector("select");
        if (select) {
          // Извлекаем все опции из select
          const selectOptions = [];
          select.querySelectorAll("option").forEach((opt) => {
            selectOptions.push(opt.textContent.trim());
          });

          // Если это первый select, сохраняем все опции (они одинаковые для всех)
          if (options.length === 0) {
            options.push(...selectOptions);
          }

          matches.push({
            premise: premiseText,
            options: selectOptions,
            selectId: select.id || `select_${index}`,
          });
        } else {
          // Это может быть предварительно заполненный ответ (текст вместо select)
          const answerText = cells[1].textContent.trim();
          if (answerText) {
            matches.push({
              premise: premiseText,
              answer: answerText,
            });
          }
        }
      }
    });

    if (matches.length === 0) {
      console.warn(
        `⚠️ Не найдены соответствия для SELECT вопроса ${questionNumber}`,
      );
      return null;
    }

    return {
      number: questionNumber,
      question: questionText,
      type: "select-matching",
      matches: matches,
      allOptions: options.length > 0 ? options : undefined,
    };
  }

  // Извлекаем текущий вопрос
  const currentQuestion = extractCurrentQuestion();

  if (currentQuestion) {
    progress.questions.push(currentQuestion);
    console.log(
      `✅ Извлечен вопрос ${currentQuestion.number} (${progress.questions.length}/${progress.totalPages})`,
    );

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
      console.log("\n✨ === ВСЕ ВОПРОСЫ СОБРАНЫ === ✨\n");

      function formatQuestion(q) {
        let result = `${q.number}) ${q.question}\n`;

        if (q.type === "select-matching") {
          // Форматирование SELECT MATCHING вопроса
          result += `[Тип: Выбрать соответствие из выпадающего списка]\n\n`;

          q.matches.forEach((match, index) => {
            result += `${index + 1}. ${match.premise}\n`;
            if (match.options && match.options.length > 0) {
              result += `   Варианты: ${match.options.join(" / ")}\n`;
            } else if (match.answer) {
              result += `   Ответ: ${match.answer}\n`;
            }
          });

          if (q.allOptions && q.allOptions.length > 0) {
            result += `\nОбщие варианты: ${q.allOptions.join(" / ")}\n`;
          }
        } else {
          // Форматирование обычного вопроса с вариантами
          result += "\n";
          q.answers.forEach((answer) => {
            result += `${answer.label}\n${answer.text}\n`;
          });
        }

        return result;
      }

      const formattedOutput = progress.questions
        .map((q) => formatQuestion(q))
        .join("\n");
      console.log("📋 ===== ИЗВЛЕЧЕННЫЕ ВОПРОСЫ =====\n");
      console.log(formattedOutput);
      console.log(
        "\n✨ Готово! Скопируйте текст выше в файл quiz/extracted-questions.txt",
      );

      // Очищаем хранилище
      localStorage.removeItem(storageKey);
    }
  } else {
    console.error("❌ Ошибка при извлечении вопроса");
    console.log("Хранилище очищено. Попробуйте снова.");
    localStorage.removeItem(storageKey);
  }
})();

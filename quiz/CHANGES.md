# Code Changes Summary

## Main Changes in extract-questions-v2.js

### 1. Updated `extractCurrentQuestion()` function

**OLD:** Only extracted multiple-choice questions
```javascript
const answerElements = document.querySelectorAll(".answer .r0, .answer .r1");
const answers = [];
// ... extract answers
return { number, question: questionText, answers };
```

**NEW:** Detects question type and routes accordingly
```javascript
const selectElements = document.querySelectorAll("select.custom-select, select.select");

if (selectElements.length > 0) {
  // This is a SELECT MATCHING question
  return extractSelectQuestion(questionNumber, questionText, selectElements);
}

// Otherwise extract as multiple-choice
// ... existing code
return { number, question: questionText, type: "multiple-choice", answers };
```

### 2. New `extractSelectQuestion()` function

Handles extraction of premise-dropdown matching questions:

```javascript
function extractSelectQuestion(questionNumber, questionText, selectElements) {
  const table = document.querySelector("table");
  const rows = table.querySelectorAll("tbody tr");
  const matches = [];
  const options = [];

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll("td");
    const premiseText = cells[0].textContent.trim();
    const select = cells[1].querySelector("select");
    
    if (select) {
      const selectOptions = [];
      select.querySelectorAll("option").forEach((opt) => {
        selectOptions.push(opt.textContent.trim());
      });
      
      if (options.length === 0) {
        options.push(...selectOptions);
      }
      
      matches.push({
        premise: premiseText,
        options: selectOptions,
        selectId: select.id || `select_${index}`
      });
    }
  });

  return {
    number: questionNumber,
    question: questionText,
    type: "select-matching",
    matches: matches,
    allOptions: options.length > 0 ? options : undefined
  };
}
```

### 3. Updated `formatQuestion()` function

**OLD:** Assumed all questions have `.answers` array
```javascript
function formatQuestion(q) {
  let result = `${q.number}) ${q.question}\n\n`;
  q.answers.forEach((answer) => {
    result += `${answer.label}\n${answer.text}\n`;
  });
  return result;
}
```

**NEW:** Handles both question types
```javascript
function formatQuestion(q) {
  let result = `${q.number}) ${q.question}\n`;

  if (q.type === "select-matching") {
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
    // Original multiple-choice formatting
    result += "\n";
    q.answers.forEach((answer) => {
      result += `${answer.label}\n${answer.text}\n`;
    });
  }

  return result;
}
```

## HTML Selector Improvements

### Detection Selectors
```javascript
// Finds select dropdowns with these classes:
document.querySelectorAll("select.custom-select, select.select");

// Examples from the page:
// <select class="select custom-select custom-select ml-1" id="menuq28596:5_sub1">
// <select class="custom-select" id="q_xyz">
```

## Data Structure Changes

### Old Format (Multiple Choice)
```javascript
{
  number: 1,
  question: "Question text?",
  answers: [
    { label: "a.", text: "First option" },
    { label: "b.", text: "Second option" }
  ]
}
```

### New Format (Select-Matching)
```javascript
{
  number: 19,
  question: "Приведите соответствие",
  type: "select-matching",
  matches: [
    {
      premise: "Ян Амосс Каменский",
      options: ["Выберите...", "Option 1", "Option 2"],
      selectId: "menuq28596:5_sub1"
    }
  ],
  allOptions: ["Выберите...", "Option 1", "Option 2"]
}
```

## Backward Compatibility

✅ **Fully compatible** with existing code:
- Multiple-choice questions still have `.answers` array
- Added `type` field but optional (existing code can ignore it)
- localStorage format unchanged
- Navigation/pagination unchanged
- Same success/error logging

## Files Modified

- `extract-questions-v2.js` - 250+ lines added/modified
- New documentation: `SELECT_SUPPORT.md`

## Tested Against

- Page: https://centerdpo24.ru/mod/quiz/attempt.php?attempt=28480&cmid=5915&page=18
- Question 19: Select-matching type with 3 premises and dropdown options
- Element: `<select class="select custom-select custom-select ml-1" id="menuq28596:5_sub1">`

# SELECT Dropdown Question Support

## What Changed

The `extract-questions-v2.js` script now supports extracting **select-dropdown matching questions** in addition to traditional multiple-choice questions.

## Question Types Supported

### 1. **Multiple Choice** (Original)
```
Question text
a) Option A
b) Option B
c) Option C
```

### 2. **Select-Matching** (NEW)
```
Question text
[Table with 2 columns]
- Left: Premise/Statement
- Right: <select> dropdown with options
```

Example from the page:
```html
<select class="select custom-select custom-select ml-1" id="menuq28596:5_sub1">
  <option selected="selected" value="0">Выберите...</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

## How It Works

### Detection
The script checks for `<select class="custom-select">` or `<select class="select">` elements on the page.

### Extraction
For select-type questions:
1. Finds the table containing the matching pairs
2. For each row:
   - **Left cell**: Extracts the premise/statement
   - **Right cell**: Extracts all `<option>` values from the dropdown
3. Collects all unique options across all dropdowns

### Storage Format
```javascript
{
  type: "select-matching",
  question: "Приведите соответствие",
  matches: [
    {
      premise: "Ян Амосс Каменский",
      options: ["Выберите...", "Option 1", "Option 2", "Option 3"],
      selectId: "menuq28596:5_sub1"
    },
    {
      premise: "Сократ",
      options: ["Выберите...", "Option 1", "Option 2", "Option 3"],
      selectId: "menuq28596:5_sub2"
    }
  ],
  allOptions: ["Выберите...", "Option 1", "Option 2", "Option 3"]
}
```

### Output Formatting
```
19) Приведите соответствие
[Тип: Выбрать соответствие из выпадающего списка]

1. Ян Амосс Каменский
   Варианты: Выберите... / Разработал систему образования / Ввел классно-урочную систему
2. Сократ
   Варианты: Выберите... / Разработал систему образования / Ввел классно-урочную систему

Общие варианты: Выберите... / Разработал систему образования / Ввел классно-урочную систему...
```

## Function Changes

### New Function: `extractSelectQuestion()`
```javascript
function extractSelectQuestion(questionNumber, questionText, selectElements) {
  // - Finds the table with matching pairs
  // - Extracts premises from left column
  // - Extracts options from select dropdowns in right column
  // - Returns structured data with all options
}
```

### Modified: `extractCurrentQuestion()`
- Now checks for select elements first
- Routes to appropriate extraction function based on question type
- Adds `type` field to returned object

### Modified: `formatQuestion()`
- Checks `q.type` to determine formatting
- Formats `select-matching` type with structured output
- Maintains backward compatibility with multiple-choice format

## Usage

No changes to usage! The script works exactly the same:

1. Open browser console (F12 → Console)
2. Copy and paste `extract-questions-v2.js`
3. Press Enter
4. Script will auto-navigate and extract all questions (both types)

The localStorage-based pagination still works identically.

## Testing

The script was tested against the actual page:
- URL: `https://centerdpo24.ru/mod/quiz/attempt.php?attempt=28480&cmid=5915&page=18`
- Question 19: "Приведите соответствие" (Select-matching type)
- Successfully detected and would extract 3 premise-dropdown pairs

## Fallback Handling

If a select question:
- Has no table → logs warning, tries next question
- Has no matching pairs → logs warning, skips
- Maintains localStorage progress → can resume later

Backward compatible: if no select elements found, falls back to multiple-choice extraction.

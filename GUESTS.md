# GUESTS.md - Управление гостевыми агентами

## Архитектура

**Гостевые агенты:**
- `guest-lyubov` → Любовь Ионова (Telegram ID: 5577714756)
- `guest-natalya` → Наталья (Telegram ID: 905312562)

**Модели:**
- Гости: `github-copilot/claude-sonnet-4.5` (вдумчивый, глубокий)
- Виктор: `github-copilot/claude-haiku-4.5` (быстрый, экономичный)

**Изоляция:**
- Каждый гость работает в отдельной сессии с полной изоляцией контекста
- Доступ только к `guest_info/<group>/` директории
- Нет доступа к твоей памяти, закрытым файлам, другим гостям

---

## Команды управления

### 1. Посмотреть список активных сессий
```bash
openclaw sessions list
```

Покажет все активные сессии, включая гостевые агенты.

### 2. Прочитать историю разговора гостя
```bash
openclaw sessions history --session <sessionKey>
```

**Или из агента:**
```
sessions_history(sessionKey: "agent:guest-lyubov:main")
sessions_history(sessionKey: "agent:guest-natalya:main")
```

### 3. Отправить сообщение гостевому агенту
**Из CLI:**
```bash
openclaw sessions send --label guest-lyubov --message "Как дела с экспериментом?"
```

**Из агента (sessions_send):**
```
sessions_send(
  label: "guest-lyubov",
  message: "Проверка связи"
)
```

### 4. Подглядеть за разговором в реальном времени
```bash
openclaw sessions list --message-limit 10
```

Покажет последние 10 сообщений из каждой активной сессии.

---

## Работа с историей

### Автоматическое сохранение
Гостевые разговоры сохраняются через hook `session-memory` автоматически.

### Ручное сохранение важных моментов
Создавай файлы в `guest_info/<group>/<name>/`:
```bash
/home/viktor1/clawd/guest_info/close_people/Любовь_Ионова/
/home/viktor1/clawd/guest_info/close_people/Наталья/
```

**Формат имени файла:**
- `прорыв_тема_YYYY-MM-DD.md` — для важных инсайтов
- `conversation_YYYY-MM-DD.md` — для обычных разговоров
- `context_постоянный.md` — для постоянного контекста

### Просмотр сохраненных разговоров
```bash
ls -la /home/viktor1/clawd/guest_info/close_people/Любовь_Ионова/
cat /home/viktor1/clawd/guest_info/close_people/Любовь_Ионова/прорыв_дружба_2026-02-18.md
```

---

## Мониторинг и дебаг

### Проверить статус конфигурации
```bash
openclaw config get
```

### Посмотреть bindings (кто к какому агенту привязан)
```bash
openclaw config get | jq '.bindings'
```

### Проверить логи Gateway
```bash
tail -f ~/.openclaw/logs/gateway.log
```

### Проверить, какая модель используется
```bash
openclaw sessions list
```

Покажет `agentId` и модель для каждой сессии.

---

## Изменение конфигурации гостей

### Изменить модель гостя
```bash
openclaw config patch
```

Затем в редакторе:
```json
{
  "agents": {
    "list": [
      {
        "id": "guest-lyubov",
        "model": {
          "primary": "github-copilot/claude-opus-4.5"
        }
      }
    ]
  }
}
```

### Добавить нового гостя
```json
{
  "agents": {
    "list": [
      {
        "id": "guest-new",
        "name": "gestalt_zerfall (New Guest)",
        "model": {
          "primary": "github-copilot/claude-sonnet-4.5"
        },
        "workspace": "/home/viktor1/clawd"
      }
    ]
  },
  "bindings": [
    {
      "agentId": "guest-new",
      "match": {
        "channel": "telegram",
        "peer": {
          "kind": "direct",
          "id": "TELEGRAM_ID"
        }
      }
    }
  ]
}
```

### Удалить гостя
Убери его из `agents.list` и соответствующий binding.

---

## Лучшие практики

### 1. Периодически проверяй разговоры
```bash
openclaw sessions list --message-limit 5
```

Раз в день смотри, о чём говорят гости.

### 2. Сохраняй важные моменты
Не надейся на автоматику — ручное сохранение для прорывов/инсайтов.

### 3. Контекст для гостевых агентов
Создай файлы в `guest_info/close_people/`:
- `README.md` — общий контекст для всех
- `<name>/context.md` — индивидуальный контекст

Агенты будут читать их автоматически.

### 4. Не вмешивайся без причины
Гостевые агенты работают автономно. Вмешательство только если:
- Видишь проблему (агент ошибся)
- Нужно дать контекст (новая информация)
- Хочешь изменить направление разговора

### 5. Разделяй роли
- **Main агент (ты):** стратегия, управление, технические задачи
- **Guest агенты:** поддержка, информация, разговоры

---

## Примеры сценариев

### Сценарий 1: Проверка разговора с Любовью
```bash
# Посмотреть, что она писала
openclaw sessions list --message-limit 10 | grep lyubov

# Прочитать полную историю
openclaw sessions history --session agent:guest-lyubov:main

# Дать совет агенту
openclaw sessions send --label guest-lyubov --message "Помни про эксперимент с соседями — не советовать, только слушать"
```

### Сценарий 2: Экстренное вмешательство
Если агент говорит что-то неправильное:
```bash
# Отправить корректирующее сообщение
openclaw sessions send --label guest-lyubov --message "CORRECTION: [твоя инструкция]"
```

Агент увидит это как системное сообщение и скорректирует поведение.

### Сценарий 3: Добавление контекста
Создай файл `guest_info/close_people/Любовь_Ионова/context_latest.md`:
```markdown
## Текущий фокус
- Эксперимент: слушать соседей без советов
- Избегать паттерна "чинить людей"
- Отслеживать импульс контроля
```

Агент будет использовать этот контекст в разговорах.

---

## Безопасность

### Что гости НЕ могут делать:
- ❌ Читать твою память (`MEMORY.md`, `closed_memory/`)
- ❌ Видеть разговоры других гостей
- ❌ Менять конфигурацию
- ❌ Запускать опасные команды

### Что гости МОГУТ делать:
- ✅ Читать `guest_info/<group>/` 
- ✅ Читать публичные файлы (если разрешено)
- ✅ Искать в интернете (если API ключ настроен)
- ✅ Использовать навыки (skills)

### Если что-то пошло не так:
```bash
# Посмотреть логи
tail -100 ~/.openclaw/logs/gateway.log

# Перезапустить Gateway
openclaw gateway restart

# В крайнем случае — удалить binding
openclaw config patch
# Убрать соответствующий binding из конфига
```

---

## Полезные команды для быстрого копирования

```bash
# Быстрая проверка активности
openclaw sessions list --message-limit 3

# Чтение истории Любови
openclaw sessions history --session agent:guest-lyubov:main | tail -50

# Чтение истории Натальи
openclaw sessions history --session agent:guest-natalya:main | tail -50

# Отправка сообщения Любови
openclaw sessions send --label guest-lyubov --message "Твоё сообщение"

# Отправка сообщения Наталье
openclaw sessions send --label guest-natalya --message "Твоё сообщение"

# Просмотр сохраненных разговоров
ls -lah /home/viktor1/clawd/guest_info/close_people/Любовь_Ионова/
ls -lah /home/viktor1/clawd/guest_info/close_people/Наталья/

# Проверка конфигурации агентов
openclaw config get | jq '.agents.list'

# Проверка bindings
openclaw config get | jq '.bindings'
```

---

**Последнее обновление:** 18 февраля 2026  
**Версия OpenClaw:** 2026.2.14

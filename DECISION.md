# Decision Log — VitAssist

This document fixes architecture, current data models and temporary decisions.

---

## 1. Aplication Models

### 1.1. Product

**purpose:** describes product and its form, dosage, status (active archive).

**key fields:**
- `id: string` — unique identifier.
- `name: string` — product name, displayed in UI.
- `dosage: number` — dosage of a product (units depend on `unitType`).
- `form: ProductForm` — form (pill, capsule, liquid etc.).
- `unitType: UnitType` — unit types (mg, ml, drops etc.).
- `archived: boolean` — shows if product is archived or not (product is not deleted but archived).
- `createdAt: number` — timestamp of create.
- `updatedAt: number` — timestamp of last update.

**features:**
- Products are not deleted, but **archived**  — it is important for history.
- History uses actual products, not snapchots now.

---

### 1.2. Schedule

**purpose:** describes course of product intake.

**key fields:**
- `id: string`
- `productId: string` — Product reference.
- `startDate: number`
- `endDate: number | null`
- `times: string[]` — list of times for intakes during a day.
- `repeatType: ...` — repeat scheme (daily, evere x days, on certain days ets.).

**features:**
- History is build on schedules (temporary. later - cloud database).
- There will be cloud database with history snapshot of schedule.

---

### 1.3. Intake

**purpose:** It is the fact of planned/fixed intake.

**key fields:**
- `id: string`
- `scheduleId: string`
- `plannedFor: number` — timestamp of planned intake time.
- `status: "planned" | "taken" | "skipped" | "delayed"` etc.

**features:**
- History uses schedules → intakes now.
- There will be snapshot of a product/schedule on a moment of intake in cloud database.

---

## 2. Screens and purposes

### 2.1. HistoryScreen

**purpose:** displays history of products intakes.

**key logic:**
- History uses schedules (Schedule), but not intakes Intake.
- History uses `ScheduleCard` to display product intake course.

**Screen components:**
- `ScheduleCard`
- `AppText`, `AppCard`, `AppButton` etc.

**Future updates:**
- snapshot‑usage:
  - store snapshot of shcedule and product to build history matrix and display course details;
  - Histore will become undependent on schedule deliting.

---

### 2.2. Экран настройки напоминаний / формы расписания

**Назначение:** создание/редактирование расписания и параметров напоминаний.

**Ключевые компоненты:**
- `RepeatReminderSelector` — управление повторными напоминаниями.
- Поля: интервал, максимальное количество повторов, включение/выключение.

---

## 3. RepeatReminderSelector — логика и решения

**Назначение:** управляет логикой повторных напоминаний в рамках одного дня.

**Параметры:**
- `enable: boolean` — включены ли повторные напоминания.
- `interval: number | null` — интервал в минутах.
- `maxCount: number | null` — максимальное количество повторов.

**Решения:**

- Если `enable = false` → повторные напоминания не создаются.
- Если `interval = null`:
  - (исторически) использовался дефолт 120 минут;
  - сейчас явно задаётся через UI.
- Если `maxCount = null` → **«бесконечно» до конца текущего дня**:
  - повторять столько раз, сколько интервал помещается до 00:00.

**UI‑решения:**

- Интервал:
  - preset‑значения: 1, 2, 4 часа;
  - пункт «Своё значение» → показывает input;
  - при выборе preset → input скрывается.
- Количество повторов:
  - preset: 1, 2, 3;
  - «Бесконечно» → `maxCount = null`;
  - «Своё значение» → input для числа.

---

## 4. Notification API and Notification Service/Repository

### 4.1. Notification API (foreign layer)

**purpose:** high-layer around system notifications (iOS/Android).

**ability:**
- Request permissions.
- Plan local notifications.
- Cancel notifications.
- Update notifications when schedule is edited.

---

### 4.2. Notification Service

**purpose:** busines-logic around planning notifications based on Schedule/Intake.

**abuluty:**
- Decide to when send notifications:
  - primary reminder;
  - repeat reminder on interval;
  - stop reminder when `maxCount` or when 00:00am.
- Convert the model (Schedule/Intake) into a set of system notifications.
- Delegate the actual creation/cancellation of notifications to the Notification API.

**where uses:**
- On create/update schedule.
- On update repeat reminders.
- On delete schedules.

---

### 4.3. Notification Repository

**purpose:** stores connections between entitiesand system notifications ids.

**ability:**
- Save which notifications relate to which schedule/intake.
- Allow Notification Service to cancel/update them by scheduleId/intakeId.

---

## 5. Intake Service/Repository

### 5.1. Intake Repository

**purpose:** low-layer access to the store of intake‑records.

**ability:**
- CRUD for Intake.
- Get all intakes by scheduleId.
- Get history of intakes (если используется).

---

### 5.2. Intake Service

**purpose:** busines-logic around Intake.

**ability:**
- Mark intake as `taken`, `skipped`, `delayed`.
- Update refered notifications.
- Provide data for HistoryScreen / other screens.

---

## 6. Updates in future

- Make history snapshot‑based:
  - store snapshot of a Product and Schedule of course.
- Unlink HistoryScreen from actual state in Redux.
- Add history export (CSV/JSON/PDF).
- Add analytics and graphs.

---

## 7. временные решения

- История пока зависит от актуальных Schedule/Product.
- Нет snapshot‑модели для истории.
- NotificationService работает только в рамках локального устройства.
- Поведение при смене часового пояса пока не описано.

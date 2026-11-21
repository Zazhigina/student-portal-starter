const express = require('express')
const cors = require('cors')
const fs = require('fs')

const app = express()

app.use(cors())          // разрешаем запросы из React-приложения (другой адрес)
app.use(express.json())  // понимаем JSON, который прислал клиент

// Если клиент не прислал тело запроса, считаем его пустым объектом
app.use((req, res, next) => {
  if (!req.body) req.body = {}
  next()
})


//  База данных - файл db.json
const DB_FILE = __dirname + '/db.json'

// Чтение БД
function readDb() {
  const text = fs.readFileSync(DB_FILE, 'utf-8')
  return JSON.parse(text)
}

// Запись в БД
function writeDb(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2))
}

/** Чтение маршрутов
 *  app.get('/адрес', (req, res) => { ... })
 *  req — запрос от клиента (req.body, req.params, req.query)
 *  res — ответ клиенту   (res.json(...), res.status(...))
 */
app.get('/', (req, res) => {
  res.send('Сервер работает')
})

//  Логин
//  POST /login   тело запроса: { "login": "demo", "password": "demo123" }
app.post('/login', (req, res) => {
  const login = req.body.login
  const password = req.body.password

  if (!login || !password) {
    res.status(400).json({ message: 'Введите логин и пароль' })
    return
  }

  const db = readDb()
  const user = db.users.find((u) => u.login === login && u.password === password)

  if (!user) {
    res.status(401).json({ message: 'Неверный логин или пароль' })
    return
  }

  // Пароль клиенту не отправляем
  res.json({
    user: { id: user.id, login: user.login, name: user.name },
  })
})

//  ЗАДАЧИ
// GET /tasks               — все задачи
// GET /tasks?status=todo   — только с нужным статусом
app.get('/tasks', (req, res) => {
  const db = readDb()
  let tasks = db.tasks

  if (req.query.status) {
    tasks = tasks.filter((t) => t.status === req.query.status)
  }

  res.json(tasks)
})

// GET /tasks/1             — одна задача по id
app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id)
  const db = readDb()
  const task = db.tasks.find((t) => t.id === id)

  if (!task) {
    res.status(404).json({ message: 'Задача не найдена' })
    return
  }

  res.json(task)
})

// POST /tasks              — создать задачу (данные в теле запроса)
app.post('/tasks', (req, res) => {
  if (!req.body.title) {
    res.status(400).json({ message: 'Название задачи обязательно' })
    return
  }

  const db = readDb()

  // id новой задачи: на единицу больше, чем у последней
  const lastTask = db.tasks[db.tasks.length - 1]
  const newId = lastTask ? lastTask.id + 1 : 1

  const task = {
    id: newId,
    title: req.body.title,
    description: req.body.description || '',
    status: req.body.status || 'todo',
    priority: req.body.priority || 'medium',
    dueDate: req.body.dueDate || null,
    userId: req.body.userId || null,
  }

  db.tasks.push(task)
  writeDb(db)

  res.status(201).json(task)
})

// PATCH /tasks/1           — изменить поля, например { "status": "done" }
app.patch('/tasks/:id', (req, res) => {
  const id = Number(req.params.id)
  const db = readDb()
  const task = db.tasks.find((t) => t.id === id)

  if (!task) {
    res.status(404).json({ message: 'Задача не найдена' })
    return
  }

  Object.assign(task, req.body) // копируем присланные поля в задачу
  task.id = id                  // id менять нельзя
  writeDb(db)

  res.json(task)
})

// DELETE /tasks/1          — удалить задачу
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id)
  const db = readDb()
  const task = db.tasks.find((t) => t.id === id)

  if (!task) {
    res.status(404).json({ message: 'Задача не найдена' })
    return
  }

  db.tasks = db.tasks.filter((t) => t.id !== id)
  writeDb(db)

  res.sendStatus(204)
})

app.listen(3001, () => {
  console.log('Сервер запущен: http://localhost:3001')
})

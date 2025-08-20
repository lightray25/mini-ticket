import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyParser from 'body-parser'
import path from 'path'
import { fileURLToPath } from "url"

const app = express()
const PORT = 3000

// __dirname definieren (weil ESModule)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(cors())
app.use(bodyParser.json())

// Static files (Vue Build)
app.use(express.static(path.join(__dirname, "../client/dist")))

// ✅ Fallback für Vue Router → immer index.html ausliefern
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
})

// MongoDB Verbindung
mongoose.connect("mongodb://localhost:27017/ticketdb", {
})
  .then(() => console.log("✅ MongoDB verbunden"))
  .catch(err => console.error("❌ MongoDB Fehler:", err.message))

// Task Schema & Model
const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: 'todo' },
  order: { type: Number, default: 0 }  // 👈 Neu
})

const Task = mongoose.model('Task', taskSchema)

// ROUTES

// Alle Tasks holen
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find()
    res.json(tasks)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Task erstellen
app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, status } = req.body
    const newTask = new Task({ title, description, status: status || 'todo' })
    await newTask.save()
    res.status(201).json(newTask)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Task updaten
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Task löschen
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Server starten
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf http://localhost:${PORT}`)
})

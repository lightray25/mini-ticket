<template>
  <main class="app-container">
    <h1>Mini Ticket System</h1>
    <TaskForm @add-task="addTask" />
    <div class="board">
    <Column
      v-for="status in statuses"
      :key="status"
      :title="statusLabels[status]"
      :status="status"
      :tasks="tasks[status]"
      @update-tasks="(updated) => updateTasks(status, updated)"
      @delete-task="deleteTask"
    />
    </div>

    <button v-if="useMock" class="reset-btn" @click="resetMock">
      🔁 Mockdaten zurücksetzen
    </button>
  </main>
</template>

<script>
import { ref, onMounted } from 'vue'
import TaskForm from './components/TaskForm.vue'
import Column from './components/Column.vue'
import mockTasksRaw from './assets/mockTasks.json'

export default {
  components: { TaskForm, Column },
  setup() {
    const useMock = ref(false)

    const statuses = ['todo', 'inProgress', 'done']
    const statusLabels = {
      todo: 'To Do',
      inProgress: 'In Progress',
      done: 'Done'
    }

    const tasks = ref({
      todo: [],
      inProgress: [],
      done: []
    })

    const groupTasks = (data) => ({
      todo: data.filter(t => t.status === 'todo').sort((a,b) => a.order - b.order),
      inProgress: data.filter(t => t.status === 'inProgress').sort((a,b) => a.order - b.order),
      done: data.filter(t => t.status === 'done').sort((a,b) => a.order - b.order)
    })


const fetchTasks = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/tasks')
    if (!res.ok) throw new Error('Fehlerhafte Antwort von der API')
    const data = await res.json()
    const normalized = data.map(t => ({ ...t, id: t.id || t._id }))
    tasks.value = groupTasks(normalized)
    localStorage.setItem('tasks', JSON.stringify(normalized))
    useMock.value = false // ✅ API erreichbar
  } catch (err) {
    console.warn('🌐 API nicht erreichbar, lade Mock-Daten:', err)
    useMock.value = true // ✅ Server ist down, also fallback aktiv

    const local = localStorage.getItem('mockTasks')
    let fallback

    if (local) {
      fallback = JSON.parse(local)
    } else {
      fallback = mockTasksRaw.map(t => ({ ...t, id: t.id || t._id }))
      localStorage.setItem('mockTasks', JSON.stringify(fallback))
    }

    tasks.value = groupTasks(fallback)
  }
}

    const addTask = async (task) => {
      task.status = 'todo'
      task.id = Date.now().toString()

      const allCurrent = [
        ...tasks.value.todo,
        ...tasks.value.inProgress,
        ...tasks.value.done
      ]

      const updated = [...allCurrent, task]

      if (useMock.value) {
        tasks.value = groupTasks(updated)
        saveTasksToLocalStorage(updated)
        return
      }

      try {
        const res = await fetch('http://localhost:3000/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(task)
        })

        const newTask = await res.json()

        const fullUpdated = [...updated, newTask] // oder du fügst nur newTask direkt rein
        tasks.value = groupTasks(fullUpdated)
        saveTasksToLocalStorage(fullUpdated)

      } catch (err) {
        console.error('Fehler beim Speichern auf dem Server:', err)
      }
    }

    const updateTasks = async (status, updatedList) => {
      // Update lokale Reihenfolge
      tasks.value[status] = [...updatedList]

      // Alle Tasks neu zusammensetzen
      const all = [
        ...tasks.value.todo,
        ...tasks.value.inProgress,
        ...tasks.value.done
      ]

      // Save to localStorage
      saveTasksToLocalStorage(all)

      if (!useMock.value) {
        // Reihenfolge mit abspeichern
        for (let i = 0; i < updatedList.length; i++) {
          const task = { ...updatedList[i], status, order: i }
          await fetch(`http://localhost:3000/api/tasks/${task._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
          })
        }
      }
    }




    const deleteTask = async (taskToDelete) => {
      const allTasks = [
        ...tasks.value.todo,
        ...tasks.value.inProgress,
        ...tasks.value.done
      ]
      const filtered = allTasks.filter(
        t => (t.id || t._id) !== (taskToDelete.id || taskToDelete._id)
      )

      tasks.value = groupTasks(filtered)
      saveTasksToLocalStorage(filtered)

      if (!useMock.value) {
        try {
          await fetch(`http://localhost:3000/api/tasks/${taskToDelete._id}`, {
            method: 'DELETE'
          })
        } catch (err) {
          console.error('Fehler beim Löschen auf dem Server:', err)
        }
      }
    }




    const saveTasksToLocalStorage = (allTasks) => {
      const key = useMock.value ? 'mockTasks' : 'tasks'
      localStorage.setItem(key, JSON.stringify(allTasks))
    }

    const loadTasksFromLocalStorage = () => {
      const key = useMock.value ? 'mockTasks' : 'tasks'
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : null
    }


    const resetMock = () => {
      const grouped = groupTasks(mockTasksRaw)
      tasks.value = grouped
      saveTasksToLocalStorage(mockTasksRaw)
    }

    onMounted(fetchTasks)

    return {
      tasks,
      addTask,
      updateTasks,
      useMock,
      resetMock,
      statuses,
      statusLabels,
      deleteTask
    }
  }
}
</script>

<style scoped>
.app-container {
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
  font-family: sans-serif;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

h1 {
  color: black;
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
}

.board {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  width: 100%;
  overflow-x: auto;
  margin-top: 20px;
}

.reset-btn {
  margin: 20px auto;
  display: block;
  padding: 10px 20px;
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.reset-btn:hover {
  background-color: #e68900;
}

@media (max-width: 767px) {
  .board {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>

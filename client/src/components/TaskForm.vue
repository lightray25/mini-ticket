<template>
  <form @submit.prevent="submitTask" class="task-form">
    <input v-model="title" type="text" placeholder="Titel" required />
    <textarea v-model="description" placeholder="Beschreibung" required></textarea>
    <button type="submit">Hinzufügen</button>
  </form>
</template>

<script setup>

import { ref } from 'vue'

const emit = defineEmits(['add-task'])

const title = ref('')
const description = ref('')

const submitTask = () => {
  if (!title.value.trim() || !description.value.trim()) return

  emit('add-task', {
    id: Date.now(),
    title: title.value,
    description: description.value,
    status: 'todo' // ← wichtig
  })

  title.value = ''
  description.value = ''
}
</script>



<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  box-sizing: border-box;
  min-width: 280px;
  max-width: 100%;
}

.task-form input,
.task-form textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.task-form button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  border-radius: 4px;
}

.task-form button:hover {
  background-color: #45a049;
}

.task-card {
  background: white;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  word-wrap: break-word;
}

/* Kleine Smartphones */
@media (max-width: 479px) {
  .column {
    flex-basis: 100%;
    min-width: 100%;
    padding: 8px;
  }
}

/* Smartphones und kleine Tablets */
@media (min-width: 480px) and (max-width: 767px) {
  .column {
    flex-basis: 45%;
    min-width: 45%;
  }
}

/* Tablets und kleine Laptops */
@media (min-width: 768px) and (max-width: 1023px) {
  .column {
    flex-basis: 30%;
    min-width: 280px;
  }
}

/* Standard Desktop */
@media (min-width: 1024px) and (max-width: 1439px) {
  .column {
    flex-basis: 25%;
    min-width: 300px;
    max-width: none;
  }
}

/* Große Desktops und 4K Monitore */
@media (min-width: 1440px) {
  .column {
    flex-basis: 20%;
    min-width: 350px;
    max-width: none;
  }
}
</style>

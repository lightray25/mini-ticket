<template>
  <div class="task-card">
    <button class="delete-btn" @click="$emit('delete-task', task)" title="Löschen">✕</button>

    <div class="handle" title="Ziehen">
    </div>

    <div class="task-content">
      <h3>{{ task.title }}</h3>
      <p>{{ task.description }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  emits: ['delete-task']
}
</script>

<style scoped>
.task-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  background-color: white;
  padding: 12px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  min-width: 280px;
  max-width: 100%;
  transition: transform 0.1s ease, box-shadow 0.2s ease;
}

/* Zieheffekt */
.task-card.sortable-chosen {
  transform: rotate(1deg) scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Platzhalter beim Ziehen */
.task-card.sortable-ghost {
  opacity: 0.4;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: #e53935;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.delete-btn:hover {
  color: #b71c1c;
}

.handle {
  cursor: grab;
  margin-right: 10px;
  user-select: none;
  padding-top: 4px;
}

.task-content {
  flex: 1;
}

.task-card h3 {
  color: black;
  margin: 0 0 6px;
  font-size: 16px;
}

.task-card p {
  margin: 0;
  font-size: 14px;
  color: #555;
}
</style>

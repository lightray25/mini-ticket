<template>
  <div class="column">
    <h2>{{ title }}</h2>
    <draggable
      v-model="internalTasks"
      group="tasks"
      item-key="id"
      class="task-list"
      @change=emitUpdate()
      >
      <template #item="{ element }">
      <TaskCard :task="element" @delete-task="$emit('delete-task', element)" />

      </template>
    </draggable>
  </div>
</template>

<script>
import TaskCard from './TaskCard.vue'
import draggable from 'vuedraggable'

export default {
  components: { TaskCard, draggable },
  props: {
    title: String,
    tasks: Array,
    status: String
  },
  emits: ['update-tasks', 'delete-task'],
  data() {
    return {
      internalTasks: [...this.tasks]
    }
  },
  watch: {
    tasks(newTasks) {
      this.internalTasks = [...newTasks]
    }
  },
methods: {
  emitUpdate() {
    const updated = this.internalTasks.map(task => ({
      ...task,
      status: this.status
    }))
    this.$emit('update-tasks', updated)
  }
},
  deleteTask(task) {
    this.internalTasks = this.internalTasks.filter(t => t.id !== task.id)
    console.log(task)
    this.emitUpdate()
  }
}

</script>

<style scoped>
.column {
  background-color: #e0e0e0;
  padding: 10px;
  border-radius: 6px;
  flex: 1 1 30%;
  min-width: 300px;
  box-sizing: border-box;
  overflow-y: auto;
  height: 80vh;
}

.column h2 {
  color: black;
  margin-bottom: 10px;
  font-size: 18px;
}

.task-list {
  min-height: 50px;
}
</style>

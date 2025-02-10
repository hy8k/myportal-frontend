<script setup lang="ts">
import { googleSdkLoaded } from "vue3-google-login"
import { ref } from "vue"

interface TaskList {
  title: string,
  id: string,
}

interface Task {
  title: string,
  id: string,
}

const taskListList = ref<Array<TaskList>>()
const taskList = ref<Array<Task>>()

const saveAccessToken = () => {
  googleSdkLoaded((google) => {
    google.accounts.oauth2.initTokenClient({
      client_id: '854659184060-j189ju1raarnfh0c49d76mc704qfr8ei.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/tasks',
      callback: (response) => {
        localStorage.setItem('accessToken', response.access_token)
      }
    }).requestAccessToken()
  })
}

const getTaskList = () => {
  var xhr = new XMLHttpRequest()
  xhr.open('GET',
    'https://tasks.googleapis.com/tasks/v1/users/@me/lists?' +
    'access_token=' + localStorage.getItem('accessToken')
  )
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log(xhr.response)
      let d = new Array<TaskList>
      for (const item of JSON.parse(xhr.response)['items']) {
        const t: TaskList = {
          title: item['title'],
          id: item['id']
        }
        d.push(t)
      }
      taskListList.value = d
      console.log(taskListList)
    }
  }
  xhr.send(null)
}

const getTask = (taskListId: string) => {
  var xhr = new XMLHttpRequest()
  xhr.open('GET',
    'https://tasks.googleapis.com/tasks/v1/lists/' + taskListId +
    '/tasks?access_token=' + localStorage.getItem('accessToken')
  )
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      let d = new Array<Task>
      for (const item of JSON.parse(xhr.response)['items']) {
        const t: Task = {
          title: item['title'],
          id: item['id']
        }
        d.push(t)
      }
      taskList.value = d
      console.log(taskList)
    }
  }
  xhr.send(null)
}

</script>

<template>
  <button @click="saveAccessToken">アクセストークンを取得する</button>
  <button @click="getTaskList">全タスクリストを取得する</button>
  <div class="todo-main">
    <div class="tasklist-list scroll-box">
      <ScrollBoxItem v-for="item in taskListList" :name="item.title" :id="item.id"
        @clickEvent="(id: string) => getTask(id)" />
    </div>
    <div class="task-list scroll-box">
      <ScrollBoxItem v-for="item in taskList" :name="item.title" :id="item.id" />
    </div>
    <div class="todo-detail">
    </div>
  </div>
</template>

<style scoped>
.todo-main {
  display: flex;
  flex-direction: row;
}

.scroll-box {
  flex: 1;
  overflow-y: scroll;

}

.todo-task-list {
  flex: 1;
}

.todo-detail {
  flex: 5;
}
</style>
<template>
  <h1>Todo Page</h1>
  <div v-if="loading">
    Loading. . .
  </div>
  <form
      v-else
      @submit.prevent="onSave"
  >
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Subject</label>
          <input
              v-model="todo.subject"
              type="text"
              class="form-control"
          >
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button
                type="button"
                class="btn"
                :class="todo.completed ? 'btn-success' : 'btn-danger'"
                @click="toggleTodoStatus"
            >
              {{ todo.completed ? 'Completed' : 'Incompleted' }}
            </button>
            <!--.@click.stop을 해도 submit이 알아서 일어남.. 흠-->
          </div>
        </div>
      </div>
    </div>
    <button
        type="submit"
        class="btn btn-primary"
        :disabled="!todoUpdated"
    >
      Save
    </button>
    <button
        class="btn btn-outline-dark ml-2"
        @click="moveToTodolistPage">
      Cancel
    </button>
  </form>
  <Toast
      v-if="showToast"
      :message= "toastMessage"
      :color= "toastColor"
  />
<!-- data 베이스에 요청을 해서 new todo에 대한 정보를 받아와야 함. -->

</template>
<script>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios'; /* axios를 통해 데이터를 받아올 것임. */
import { ref, computed } from 'vue';
import _ from 'lodash'; /* 통상적으로 lodash는 _를 써준다 한다. */
import Toast from '@/components/Toast.vue';

export default{
  components: {
    Toast
  },
  setup(){
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const originalTodo = ref(null);
    const loading = ref(true);
    const showToast = ref(false);
    const toastMessage = ref('');
    const toastColor = ref('');
    const todoId = route.params.id;

    const getTodo = async () => {
      try{
        const res = await axios.get(`http://localhost:3000/todolist/${todoId}`);

        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      } catch (error) {
        console.log(error);
        triggerToast('something went wrong !', 'alert-danger');
      }
    }

    const todoUpdated = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value)
    })

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    }

    const moveToTodolistPage = () => {
      router.push({
        name: 'todolist'
      })
    }

    getTodo();

    const triggerToast = (message, color) => {
      toastMessage.value = message;
      toastColor.value = color;
      showToast.value = true;
      setTimeout(() => {
        toastMessage.value = ''; // 이 부분 꼭 필요한걸까?
        toastColor.value = '';
        showToast.value = false;
      }, 3000);
    }

    const onSave = async () => {
      try{
        const res = await axios.put(`http://localhost:3000/todolist/${todoId}`, {
          subject: todo.value.subject,
          completed: todo.value.completed
        });

        originalTodo.value = { ...res.data };
        triggerToast('Successfully saved !', 'alert-success');
      } catch(error){
        console.log(error);
        triggerToast('Something went wrong !', 'alert-danger');
      }

    }

    return {
      todo,
      loading,
      toggleTodoStatus,
      moveToTodolistPage,
      onSave,
      todoUpdated,
      showToast,
      toastMessage,
      toastColor
    }
  }
}
</script>
<style>

</style>
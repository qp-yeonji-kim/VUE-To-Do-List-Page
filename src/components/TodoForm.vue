<template>
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
      <div v-if="editing" class="col-6">
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
      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea
              v-model="todo.body"
              class="form-control"
          >
          </textarea>
        </div>
      </div>
    </div>
    <button
        type="submit"
        class="btn btn-primary"
        :disabled="!todoUpdated"
    >
      {{ editing ? 'Update' : 'Create' }}
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
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios'; /* axios를 통해 데이터를 받아올 것임. */
import { ref, computed } from 'vue';
import _ from 'lodash'; /* 통상적으로 lodash는 _를 써준다 한다. */
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast';

export default{
  components: {
    Toast
  },
  props: {
    editing: {
      type: Boolean,
      default: false //기본적으론 creating form으로 사용
    }
  },
  setup(props){ // props를 쓰면 editing에 접근이 가능해짐
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: '',
      completed: false,
      body: '',
    });
    const originalTodo = ref(null);
    const loading = ref(false);
    const todoId = route.params.id;

    const {
      toastMessage,
      toastColor,
      showToast,
      triggerToast,
    } = useToast(); //함수를 실행시킴

    const getTodo = async () => {
      loading.value = true;
      try{
        const res = await axios.get(`http://localhost:3000/todolist/${todoId}`);

        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      } catch (error) {
        loading.value = false;
        triggerToast('something went wrong !', 'alert-danger');
        console.log(error);
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

    if (props.editing){
      getTodo();
    }

    const onSave = async () => {
      try{
        let res; //응답 변수를 밖에 만들어줌.
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body,
        }
        if (props.editing){
          res = await axios.put(`http://localhost:3000/todolist/${todoId}`, data);
          originalTodo.value = { ...res.data };
        } else{
          res = await axios.post(`http://localhost:3000/todolist`, data);
          todo.value.subject = '';
          todo.value.body = '';
        }

        const message = 'Successfully ' + (props.editing ? 'Updated' : 'Created') + '!'
        triggerToast(message, 'alert-success');
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
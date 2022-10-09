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
<!--        <div class="form-group">
          <label>Subject</label>
          <input
              v-model="todo.subject"
              type="text"
              class="form-control"
          >
          <div
              v-if="subjectError"
              class="text-red"
          >
            {{ subjectError }}
          </div>
        </div>-->
        <Input
          label="Subject"
          v-model:subject="todo.subject"
          :error="subjectError"
        />
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
        @click="moveToTodoListPage">
      Cancel
    </button>
  </form>
  <transition name="fade">
    <Toast
        v-if="showToast"
        :message= "toastMessage"
        :color= "toastColor"
    />
  </transition>
</template>

<script>
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios'; /* axios를 통해 데이터를 받아올 것임. */
import { ref, computed } from 'vue';
import _ from 'lodash'; /* 통상적으로 lodash는 _를 써준다 한다. */
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast';
import Input from '@/components/Input.vue'

export default{
  components: {
    Toast,
    Input,
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
    const subjectError = ref('');
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

    const moveToTodoListPage = () => {
      router.push({
        name: 'todolist'
      })
    }

    if (props.editing){
      getTodo();
    }

    const onSave = async () => {
      subjectError.value= '';
      if (!todo.value.subject) {
        subjectError.value = 'Subject is required';
        return;
      }
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
      moveToTodoListPage,
      onSave,
      todoUpdated,
      showToast,
      toastMessage,
      toastColor,
      subjectError,
    }
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active{
  transition: all 0.5s ease; /* 두가지 속성에 대한 transition은 all로 준다. */
}

.fade-enter-from,
.fade-leave-to{
  opacity: 0;
  transform: translateY(-30px);
}

.fade-enter-to,
.fade-leave-from{
  opacity: 1;
  transform: translateY(0);
}
</style>
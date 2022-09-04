<template>
  <div v-for="(todoname, index) in sendTodoList" :key="todoname.id" class="card mt-2">
    <div
        class="card-body p-2 d-flex align-items-center"
        @click="moveToPage(todoname.id)">
      <div class="form-check flex-grow-1">
        <input class="form-check-input"
               type="checkbox"
               :checked="todoname.completed"
               style="cursor: pointer"
               @change="sendCompleteTodo(index, $event)"
               @click.stop >
<!-- $event: 이벤트 객체를 확실하게 부모 요소로 올려주기 위해 받아오는 이벤트 객체 -->
        <label class="form-check-label" :class="{todoname: todoname.completed}">
          {{ todoname.subject }}
        </label>
      </div>
      <div>
        <button class="btn btn-danger btn-sm" @click.stop="sendDeleteTodo(index)">delete</button>
      </div>
    </div>
  </div>
</template>
<script>
  import { useRouter } from 'vue-router';
  export default{
    props: {
      sendTodoList: {
        type: Array,
        required: false,
      }
    },
    emits: ['receiveCompleteTodo', 'receiveDeleteTodo'],
    setup(props, { emit }){
      const router = useRouter();
      const sendCompleteTodo = (index, event) => {
        emit('receiveCompleteTodo', index, event.target.checked);
      };

      const sendDeleteTodo = (index) => {
        emit('receiveDeleteTodo', index);
      };

      const moveToPage = (todoId) => {
        console.log(todoId);
        // router.push('/todolist/' + todoId);
        router.push({
          name: 'Todo',
          params: {
            id: todoId,
          }
        })
      }

      return {
        sendCompleteTodo,
        sendDeleteTodo,
        moveToPage,
      }
    }
  }
</script>
<style>

</style>
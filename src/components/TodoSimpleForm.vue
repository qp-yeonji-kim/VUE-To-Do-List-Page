<template>
  <form @submit.prevent="onSubmit">
    <div class="d-flex">
      <div class="flex-grow-1 mr-2">
        <input class="form-control" type="text" v-model="todo" placeholder="Type now to-do">
      </div>
      <div>
        <button class="btn btn-primary" type="submit">Add</button>
      </div>
    </div>
    <div v-show="hasError" class="error-message">This field cannot be empty</div>
  </form>
</template>

<script>
import {ref, useContext} from "vue";

  export default {
    emits: ['sendTodo'],
    setup(){
      const { emit } = useContext();
      let todo = ref('');
      let hasError = ref(false);
      const onSubmit = () => {
        if(todo.value === ''){
          hasError.value = true;
        } else{
          emit('sendTodo', {
            id: Date.now(),
            subject: todo.value,
            completed: false,
          });
          hasError.value = false;
          todo.value = '';
        }
      }
      return{
        todo,
        hasError,
        onSubmit,
      }
    }
  }
</script>

<style>

</style>
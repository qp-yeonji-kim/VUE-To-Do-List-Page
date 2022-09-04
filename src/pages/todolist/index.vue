<template>
  <div>
    <h2>To-Do-List</h2>
    <input class="form-control"
           type="text"
           v-model="searchText"
           @keyup.enter="searchTodo"
           placeholder="Search">
    <hr />
    <TodoSimpleForm @sendTodo="addTodo" />
    <div>{{ error }}</div>
    <div v-if="!todoList.length">There is nothing to display</div> <!--filteredTodoList-->
    <TodoListCard :sendTodoList="todoList" @receiveCompleteTodo="completeTodo" @receiveDeleteTodo="deleteTodo"/>  <!--filteredTodoList-->
    <hr />
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <li class="page-item" @click="getTodoList(curPage - 1)" v-if="curPage !== 1"><a class="page-link" href="#">Previous</a></li>
        <li class="page-item" :class="curPage === page ? 'active' : ''" v-for="page in totalPage" :key="page">
          <a class="page-link" @click="getTodoList(page)" href="#">{{page}}</a>
        </li>
        <li class="page-item" @click="getTodoList(curPage + 1)" v-if="curPage !== totalPage"><a class="page-link" href="#">Next</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import {ref, computed, watch} from "vue";
import TodoSimpleForm from '@/components/TodoSimpleForm.vue';
import TodoListCard from '@/components/TodoListCard.vue';
import axios from 'axios';

export default{
  components: {
    TodoSimpleForm,
    TodoListCard,
  },
  setup(){
    const todoList = ref([]);
    const error = ref('');
    const numTodos = ref(0);
    const limit = 5;
    const curPage = ref(1);
    const totalPage = computed(() => {
      return Math.ceil(numTodos.value / limit);
    })
    const searchText = ref('');
    const getTodoList = async (page = curPage.value) => {
      try {
        const res = await axios.get(`http://localhost:3000/todoList?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`);
        numTodos.value = res.headers['x-total-count'];
        todoList.value = res.data;
        curPage.value = page;
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong';
      }
    }

    getTodoList();

    const addTodo = async (todo) => {
      error.value = '';
      try {
        await axios.post('http://localhost:3000/todoList', {
          subject: todo.subject,
          completed: todo.completed,
        });
        getTodoList(1);
        // todolist.value.push(res.data); 바로 getTodoList하니까 이 부분은 사라져도 새로 todo가 잘 추가되서 보이는 것!
      } catch (err) {
        console.log(err);
        error.value = 'Something went wrong';
      }
    };

    const deleteTodo = async (index) => {
      error.value = '';
      const id = todoList.value[index].id;
      try{
        await axios.delete('http://localhost:3000/todoList/' + id);
        getTodoList(1);
      } catch(err){
        console.log(err)
        error.value = 'Something went wrong';
      }
    };

    const completeTodo = async (index, checked) => {
      error.value = '';
      const id = todoList.value[index].id;
      try{
        await axios.patch('http://localhost:3000/todoList/' + id, {
          completed: checked
        });
        todoList.value[index].completed = checked
      } catch (err){
        console.log(err)
        error.value = 'Something went wrong';
      }
    };

    let timeout = null;
    const searchTodo = () =>{
      clearTimeout(timeout);
      getTodoList(1);
    }
    watch(searchText, () =>{
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodoList(1);
      }, 2000)
    });

    return {
      todoList,
      numTodos,
      curPage,
      totalPage,
      getTodoList,
      addTodo,
      deleteTodo,
      completeTodo,
      searchTodo,
      searchText,
      // filteredTodoList,
      error,
    };
  }
}
</script>

<style>
.error-message{
  color: #f00;
}
.todoname{
  color: gray;
  text-decoration: line-through;
}
</style>
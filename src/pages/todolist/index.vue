<template>
  <div>
    <div class="d-flex justify-content-between mb-3">
      <h2>To-Do-List</h2>
      <button
          class="btn btn-primary"
          @click="moveToCreatePage"
      >
        Create Todo
      </button>
    </div>
    <input class="form-control"
           type="text"
           v-model="searchText"
           @keyup.enter="searchTodo"
           placeholder="Search">
    <hr />
    <div>{{ error }}</div>
    <div v-if="!todoList.length">There is nothing to display</div> <!--filteredTodoList-->
    <TodoListCard
        :sendTodoList="todoList"
        @receiveCompleteTodo="completeTodo"
        @receiveDeleteTodo="deleteTodo"
    />  <!--filteredTodoList-->
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

  <Toast
    v-if="showToast"
    :message= "toastMessage"
    :color= "toastColor"
  />
</template>

<script>
import {ref, computed, watch} from "vue";
import TodoListCard from '@/components/TodoListCard.vue';
import axios from 'axios';
import Toast from '@/components/Toast.vue';
import { useToast } from '@/composables/toast';
import { useRouter } from 'vue-router';

export default{
  components: {
    TodoListCard,
    Toast,
  },
  setup(){
    const router = useRouter();
    const todoList = ref([]);
    const error = ref('');
    const numTodos = ref(0);
    const limit = 5;
    const curPage = ref(1);
    const totalPage = computed(() => {
      return Math.ceil(numTodos.value / limit);
    })
    const searchText = ref('');
    let timeout = null;

    const getTodoList = async (page = curPage.value) => {
      try {
        const res = await axios.get(`http://localhost:3000/todoList?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`);
        numTodos.value = res.headers['x-total-count'];
        todoList.value = res.data;
        curPage.value = page;
      } catch (err) {
        console.log(err);
        triggerToast('something went wrong !', 'alert-danger');
      }
    }

    getTodoList();

    const {
      toastMessage,
      toastColor,
      showToast,
      triggerToast,
    } = useToast(); //함수를 실행시킴

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
        triggerToast('something went wrong !', 'alert-danger');
      }
    };

    const deleteTodo = async (id) => {
      error.value = '';
      try{
        await axios.delete('http://localhost:3000/todoList/' + id);
        getTodoList(1);
      } catch(err){
        console.log(err)
        triggerToast('something went wrong !', 'alert-danger');
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
        triggerToast('something went wrong !', 'alert-danger');
      }
    };

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

    const moveToCreatePage = () => {
      router.push({
        name: 'TodoCreate',
      })
    };

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
      error,
      toastMessage,
      toastColor,
      showToast,
      triggerToast,
      moveToCreatePage,
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
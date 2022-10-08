<template>
<!--  <div-->
<!--      v-for="(todoname, index) in sendTodoList"-->
<!--      :key="todoname.id"-->
<!--      class="card mt-2">-->
  <List
      :items="sendTodoList"
  >
    <template #default="{ item, index }">
      <div
          class="card-body p-2 d-flex align-items-center"
          style="cursor: pointer"
          @click="moveToPage(item.id)">
        <div class="flex-grow-1">
          <input
              class="ml-2 mr-2"
              type="checkbox"
              :checked="item.completed"
              @change="sendCompleteTodo(index, $event)"
              @click.stop > <!-- $event: 이벤트 객체를 확실하게 부모 요소로 올려주기 위해 받아오는 이벤트 객체 -->
          <span
              :class="{todoname: item.completed}">
            {{ item.subject }}
          </span>
        </div>
        <div>
          <button
              class="btn btn-danger btn-sm"
              @click.stop="openModal(item.id)">
            delete
          </button>
        </div>
      </div>
    </template>
  </List>
<!--  </div>-->
  <Modal
    v-if="showModal"
    @close="closeModal"
    @delete="sendDeleteTodo"
  />
</template>
<script>
  import { useRouter } from 'vue-router';
  import Modal from '@/components/DeleteModal.vue'
  import { ref } from 'vue';
  import List from '@/components/List.vue'

  export default{
    components: {
      Modal,
      List,
    },
    props: {
      sendTodoList: {
        type: Array,
        required: false,
      }
    },
    emits: ['receiveCompleteTodo', 'receiveDeleteTodo'],
    setup(props, { emit }){
      const router = useRouter();
      const todoDeleteId = ref(null);
      const showModal = ref(false);
      const sendCompleteTodo = (index, event) => {
        emit('receiveCompleteTodo', index, event.target.checked);
      };

      const sendDeleteTodo = () => {
        emit('receiveDeleteTodo', todoDeleteId.value);

        showModal.value = false;
        todoDeleteId.value = null;
      };

      const openModal = (id) => {
        todoDeleteId.value = id;
        showModal.value = true;
      };

      const closeModal = () => {
        todoDeleteId.value = null;
        showModal.value = false;
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
        showModal,
        openModal,
        closeModal,
      }
    }
  }
</script>
<style>

</style>
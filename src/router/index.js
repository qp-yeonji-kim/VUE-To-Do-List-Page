import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/index.vue';
import TodoList from '../pages/todolist/index.vue';
import Todo from '../pages/todo/_id.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/', //url
            name: 'Home',
            component: Home
        },
        {
            path: '/todolist',
            name: 'Todolist',
            component: TodoList
        },
        {
            path: '/todolist/:id',
            name: 'Todo',
            component: Todo
        },
    ]
})

export default router;
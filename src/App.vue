<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{ name: 'Home' }">Todo List Navbar</router-link>

    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <router-link class="nav-link" :to="{ name: 'Todolist' }">
          Todo List
        </router-link>
      </li>
    </ul>
  </nav>

  <div class="container">
    <router-view />
  </div>
</template>

<script>
</script>

<style>
</style>
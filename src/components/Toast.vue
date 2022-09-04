<template>
  <div
      class="alert toast-box"
      :class="color"
      role="alert">
    {{ message }}
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    }
  }
}
</script>
<style>
  .toast-box{
    position: fixed;
    top: 10px;
    right: 10px;
  }
</style>
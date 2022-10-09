<template>
  <div class="form-group">
    <label>{{ label }}</label>
    <input
        :value="subject"
        type="text"
        class="form-control"
        @input="onInput"
    >
    <div
        v-if="error"
        class="text-red"
    >
      {{ error }}
    </div>
  </div>
</template>
<script>
//useContext를 이용한 emit불러오기가 되지 않아서 어쩔 수 없이 내버려둠.
  export default{
    props: {
      label: {
        type: String,
        required: true,
      },
      error: {
        type: String,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
    },
    setup(props, { emit }){
      const onInput = (e) => {
        emit('update:subject', e.target.value);
      }

      return {
        onInput
      }
    }
  }
</script>
<style scoped>
.text-red {
  color: #f00;
}
</style>
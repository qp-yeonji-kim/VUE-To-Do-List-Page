<template>
  <div class="modal-wrapper">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            Delete Todo
          </h1>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  @click="onClose">
          </button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete the todo?
        </div>
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-secondary"
              @click="onClose"
          >
            Close
          </button>
          <button
              type="button"
              class="btn btn-danger"
              @click="onDelete"
          >
            Delete
          </button> <!--delete 이벤트를 부모컴포넌트로 올려서 부모컴포넌트에 그려진 card를 지운다.-->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup(props, { emit }) {
    const onClose = () => {
      emit('close');
    }
    const onDelete = () => {
      emit('delete');
    }
    return {
      onClose,
      onDelete
    }
  }
}
</script>
<style scoped>
  .modal-wrapper{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    z-index: 100;
  }
</style>
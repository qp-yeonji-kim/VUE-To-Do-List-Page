<template>
  <div class="modal-wrapper">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5">
            <!--바뀌는 부분에 slot으르 넣어줌-->
            <slot name="title"></slot>
          </h1>
          <button type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  @click="onClose">
          </button>
        </div>
        <div class="modal-body">
          <slot name="body"></slot>
        </div>
        <div class="modal-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { useContext } from "vue";

export default {
  setup() {
    const { emit } = useContext();
    const onClose = () => {
      emit('close');
    }
    return {
      onClose,
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
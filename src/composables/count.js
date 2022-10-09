import { reactive, toRefs } from 'vue';
//state를 리턴하는 간단한 컴포지션 함수임.

export const useCount = () => { // 다른 곳에서 import해서 사용할 수 있음.
  const state = reactive({
    count: 0
  });

  return toRefs(state);
}
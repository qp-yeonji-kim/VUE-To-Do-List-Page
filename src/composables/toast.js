import { ref, onUnmounted } from "vue";

export const useToast = () => {
    const showToast = ref(false);
    const toastMessage = ref('');
    const toastColor = ref('');
    const timeout = ref(null);

    const triggerToast = (message, color) => {
        toastMessage.value = message;
        toastColor.value = color;
        showToast.value = true;
        timeout.value = setTimeout(() => {
            toastMessage.value = ''; // 이 부분 꼭 필요한걸까?
            toastColor.value = '';
            showToast.value = false;
        }, 3000);
    }

    onUnmounted(()=>{
        clearTimeout(timeout.value);
    })

    return {
        toastMessage,
        toastColor,
        showToast,
        triggerToast,
    }
}
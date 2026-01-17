<!-- 
  LvModal.vue - Naive UI Edition
  Modal/Dialog component
-->
<template>
  <n-modal
    v-model:show="showModal"
    :title="title"
    :preset="preset"
    :mask-closable="maskClosable"
    :close-on-esc="closeOnEsc"
    :style="modalStyle"
    :positive-text="positiveText"
    :negative-text="negativeText"
    :loading="loading"
    @positive-click="handlePositive"
    @negative-click="handleNegative"
    @close="handleClose"
    @after-leave="handleAfterLeave"
  >
    <template #header v-if="$slots.header">
      <slot name="header" />
    </template>

    <slot />

    <template #footer v-if="$slots.footer || showFooter">
      <slot name="footer">
        <div class="lv-modal-footer">
          <n-button v-if="showCancel" @click="handleNegative">
            {{ negativeText }}
          </n-button>
          <n-button 
            v-if="showConfirm"
            type="primary" 
            :loading="loading"
            @click="handlePositive"
          >
            {{ positiveText }}
          </n-button>
        </div>
      </slot>
    </template>
  </n-modal>
</template>

<script>
import { defineComponent, computed } from "vue";
import { NModal, NButton } from "naive-ui";

export default defineComponent({
  name: "LvModal",
  components: {
    NModal,
    NButton,
  },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    preset: {
      type: String,
      default: "card", // 'card', 'dialog'
    },
    size: {
      type: String,
      default: "medium", // 'small', 'medium', 'large', 'huge'
    },
    maskClosable: {
      type: Boolean,
      default: true,
    },
    closeOnEsc: {
      type: Boolean,
      default: true,
    },
    showFooter: {
      type: Boolean,
      default: true,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    showConfirm: {
      type: Boolean,
      default: true,
    },
    positiveText: {
      type: String,
      default: "Confirm",
    },
    negativeText: {
      type: String,
      default: "Cancel",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "confirm", "cancel", "close", "after-leave"],
  setup(props, { emit }) {
    const showModal = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const sizeMap = {
      small: "400px",
      medium: "520px",
      large: "720px",
      huge: "960px",
    };

    const modalStyle = computed(() => ({
      width: sizeMap[props.size] || props.size,
      maxWidth: "95vw",
    }));

    function handlePositive() {
      emit("confirm");
    }

    function handleNegative() {
      emit("cancel");
      showModal.value = false;
    }

    function handleClose() {
      emit("close");
    }

    function handleAfterLeave() {
      emit("after-leave");
    }

    return {
      showModal,
      modalStyle,
      handlePositive,
      handleNegative,
      handleClose,
      handleAfterLeave,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>

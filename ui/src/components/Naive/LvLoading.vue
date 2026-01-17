<!-- 
  LvLoading.vue - Naive UI Edition
  Loading spinner component
-->
<template>
  <div v-if="show" :class="['lv-loading', { 'lv-loading--fullscreen': fullscreen }]">
    <n-spin :size="size" :description="text">
      <template #icon v-if="$slots.icon">
        <slot name="icon" />
      </template>
    </n-spin>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { NSpin } from "naive-ui";

export default defineComponent({
  name: "LvLoading",
  components: {
    NSpin,
  },
  props: {
    show: {
      type: Boolean,
      default: true,
    },
    size: {
      type: String,
      default: "medium", // 'small', 'medium', 'large'
    },
    text: {
      type: String,
      default: "",
    },
    fullscreen: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.lv-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  
  &--fullscreen {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    padding: 0;
  }
}
</style>

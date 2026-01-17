<!-- 
  LvDivider.vue - Naive UI Edition
  Componente divisor/separador de conteúdo
-->
<template>
  <div class="lv-divider" :class="dividerClasses">
    <div v-if="$slots.default || title" class="lv-divider__content">
      <slot>{{ title }}</slot>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "LvDivider",
  
  props: {
    // Título/texto do divisor
    title: {
      type: String,
      default: "",
    },
    // Orientação: horizontal ou vertical
    direction: {
      type: String,
      default: "horizontal",
      validator: (v) => ["horizontal", "vertical"].includes(v),
    },
    // Posição do título
    titlePlacement: {
      type: String,
      default: "center",
      validator: (v) => ["left", "center", "right"].includes(v),
    },
    // Estilo da linha
    dashed: {
      type: Boolean,
      default: false,
    },
    // Margem vertical
    spacing: {
      type: [String, Number],
      default: 16,
    },
  },
  
  setup(props) {
    const dividerClasses = computed(() => ({
      [`lv-divider--${props.direction}`]: true,
      [`lv-divider--${props.titlePlacement}`]: true,
      "lv-divider--dashed": props.dashed,
      "lv-divider--with-text": !!props.title,
    }));
    
    return { dividerClasses };
  },
});
</script>

<style lang="scss" scoped>
.lv-divider {
  --divider-color: var(--n-border-color, #e0e0e6);
  --divider-text-color: var(--n-text-color-3, #999);
  
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--divider-text-color);
  
  &--horizontal {
    width: 100%;
    margin: 16px 0;
    
    &::before,
    &::after {
      content: "";
      flex: 1;
      height: 1px;
      background: var(--divider-color);
    }
    
    &.lv-divider--dashed::before,
    &.lv-divider--dashed::after {
      background: none;
      border-top: 1px dashed var(--divider-color);
    }
  }
  
  &--vertical {
    display: inline-flex;
    height: 1em;
    width: 1px;
    background: var(--divider-color);
    margin: 0 8px;
    vertical-align: middle;
    
    &.lv-divider--dashed {
      background: none;
      border-left: 1px dashed var(--divider-color);
    }
  }
  
  &--left::before {
    flex: 0 0 24px;
  }
  
  &--right::after {
    flex: 0 0 24px;
  }
  
  &__content {
    padding: 0 16px;
    white-space: nowrap;
    font-weight: 500;
  }
}
</style>

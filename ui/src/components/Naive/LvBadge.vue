<!-- 
  LvBadge.vue - Naive UI Edition
  Badge/contador para notificações e status
-->
<template>
  <div class="lv-badge" :class="badgeClasses">
    <slot />
    <sup v-if="showBadge" class="lv-badge__content" :style="badgeStyle">
      <slot name="value">{{ displayValue }}</slot>
    </sup>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "LvBadge",
  
  props: {
    // Valor numérico
    value: {
      type: [String, Number],
      default: null,
    },
    // Valor máximo antes de mostrar +
    max: {
      type: Number,
      default: 99,
    },
    // Mostra apenas ponto (dot)
    dot: {
      type: Boolean,
      default: false,
    },
    // Tipo/cor
    type: {
      type: String,
      default: "error",
      validator: (v) => ["default", "primary", "success", "warning", "error", "info"].includes(v),
    },
    // Esconder quando valor é 0
    hidden: {
      type: Boolean,
      default: false,
    },
    // Mostrar zero
    showZero: {
      type: Boolean,
      default: false,
    },
    // Processando (pulsando)
    processing: {
      type: Boolean,
      default: false,
    },
    // Offset position
    offset: {
      type: Array,
      default: () => [0, 0],
    },
    // Cor customizada
    color: {
      type: String,
      default: null,
    },
  },
  
  setup(props) {
    const displayValue = computed(() => {
      if (props.dot) return "";
      if (typeof props.value === "number" && props.value > props.max) {
        return `${props.max}+`;
      }
      return props.value;
    });
    
    const showBadge = computed(() => {
      if (props.hidden) return false;
      if (props.dot) return true;
      if (props.value === null || props.value === undefined) return false;
      if (props.value === 0 && !props.showZero) return false;
      return true;
    });
    
    const badgeClasses = computed(() => ({
      "lv-badge--dot": props.dot,
      "lv-badge--processing": props.processing,
      [`lv-badge--${props.type}`]: true,
    }));
    
    const badgeStyle = computed(() => {
      const style = {};
      if (props.offset[0] !== 0 || props.offset[1] !== 0) {
        style.transform = `translate(${props.offset[0]}px, ${props.offset[1]}px)`;
      }
      if (props.color) {
        style.background = props.color;
      }
      return style;
    });
    
    return {
      displayValue,
      showBadge,
      badgeClasses,
      badgeStyle,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-badge {
  position: relative;
  display: inline-flex;
  
  &__content {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    z-index: 1;
    
    display: flex;
    align-items: center;
    justify-content: center;
    
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
    
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  }
  
  // Tipos/cores
  &--default &__content {
    background: var(--n-text-color-disabled);
    color: white;
  }
  
  &--primary &__content {
    background: var(--n-primary-color, #18a058);
    color: white;
  }
  
  &--success &__content {
    background: var(--n-success-color, #18a058);
    color: white;
  }
  
  &--warning &__content {
    background: var(--n-warning-color, #f0a020);
    color: white;
  }
  
  &--error &__content {
    background: var(--n-error-color, #d03050);
    color: white;
  }
  
  &--info &__content {
    background: var(--n-info-color, #2080f0);
    color: white;
  }
  
  // Dot style
  &--dot &__content {
    min-width: 8px;
    width: 8px;
    height: 8px;
    padding: 0;
    border-radius: 50%;
  }
  
  // Pulsing animation
  &--processing &__content {
    animation: lv-badge-pulse 1.5s ease-in-out infinite;
  }
  
  @keyframes lv-badge-pulse {
    0%, 100% {
      transform: translate(50%, -50%) scale(1);
      opacity: 1;
    }
    50% {
      transform: translate(50%, -50%) scale(1.1);
      opacity: 0.8;
    }
  }
}
</style>

<!-- 
  LvProgress.vue - Naive UI Edition
  Barra de progresso com diferentes estilos
-->
<template>
  <div class="lv-progress" :class="progressClasses">
    <!-- Label superior -->
    <div v-if="showLabel && labelPlacement === 'top'" class="lv-progress__header">
      <span v-if="label" class="lv-progress__label">{{ label }}</span>
      <span v-if="showPercentage" class="lv-progress__percentage">{{ displayPercentage }}%</span>
    </div>
    
    <!-- Barra de progresso -->
    <div v-if="type === 'line'" class="lv-progress__track" :style="trackStyle">
      <div class="lv-progress__fill" :style="fillStyle">
        <span v-if="showPercentage && labelPlacement === 'inside'" class="lv-progress__inside-text">
          {{ displayPercentage }}%
        </span>
      </div>
    </div>
    
    <!-- Progresso circular -->
    <div v-else-if="type === 'circle'" class="lv-progress__circle" :style="circleContainerStyle">
      <svg :viewBox="circleViewBox">
        <!-- Track -->
        <circle
          class="lv-progress__circle-track"
          :cx="circleCenter"
          :cy="circleCenter"
          :r="circleRadius"
          :stroke-width="strokeWidth"
          fill="none"
        />
        <!-- Fill -->
        <circle
          class="lv-progress__circle-fill"
          :cx="circleCenter"
          :cy="circleCenter"
          :r="circleRadius"
          :stroke-width="strokeWidth"
          :stroke="fillColor"
          :stroke-dasharray="circleDashArray"
          :stroke-dashoffset="circleDashOffset"
          fill="none"
          stroke-linecap="round"
        />
      </svg>
      <div class="lv-progress__circle-content">
        <slot>
          <span v-if="showPercentage" class="lv-progress__circle-text">{{ displayPercentage }}%</span>
        </slot>
      </div>
    </div>
    
    <!-- Label lateral -->
    <span v-if="showPercentage && labelPlacement === 'outside'" class="lv-progress__outside-text">
      {{ displayPercentage }}%
    </span>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "LvProgress",
  
  props: {
    // Valor do progresso (0-100)
    percentage: {
      type: Number,
      default: 0,
      validator: (v) => v >= 0 && v <= 100,
    },
    // Tipo do progresso
    type: {
      type: String,
      default: "line",
      validator: (v) => ["line", "circle"].includes(v),
    },
    // Status/cor
    status: {
      type: String,
      default: "default",
      validator: (v) => ["default", "success", "warning", "error", "info"].includes(v),
    },
    // Cor customizada
    color: {
      type: String,
      default: null,
    },
    // Altura da barra (line)
    height: {
      type: [Number, String],
      default: 8,
    },
    // Tamanho do círculo
    circleWidth: {
      type: Number,
      default: 100,
    },
    // Espessura do traço (circle)
    strokeWidth: {
      type: Number,
      default: 6,
    },
    // Mostrar porcentagem
    showPercentage: {
      type: Boolean,
      default: true,
    },
    // Posição do label
    labelPlacement: {
      type: String,
      default: "outside",
      validator: (v) => ["top", "inside", "outside"].includes(v),
    },
    // Label customizado
    label: {
      type: String,
      default: null,
    },
    // Arredondar porcentagem
    rounded: {
      type: Boolean,
      default: true,
    },
    // Animação de indeterminado
    indeterminate: {
      type: Boolean,
      default: false,
    },
    // Listrado
    striped: {
      type: Boolean,
      default: false,
    },
    // Animação das listras
    stripedAnimated: {
      type: Boolean,
      default: false,
    },
  },
  
  setup(props) {
    // Cores por status
    const statusColors = {
      default: "#2080f0",
      success: "#18a058",
      warning: "#f0a020",
      error: "#d03050",
      info: "#2080f0",
    };
    
    const fillColor = computed(() => props.color || statusColors[props.status]);
    
    const displayPercentage = computed(() => {
      return props.rounded ? Math.round(props.percentage) : props.percentage.toFixed(1);
    });
    
    const showLabel = computed(() => props.label || props.showPercentage);
    
    // Classes
    const progressClasses = computed(() => ({
      [`lv-progress--${props.type}`]: true,
      "lv-progress--indeterminate": props.indeterminate,
      "lv-progress--striped": props.striped,
      "lv-progress--striped-animated": props.stripedAnimated,
    }));
    
    // Estilos da barra
    const trackStyle = computed(() => ({
      height: typeof props.height === "number" ? `${props.height}px` : props.height,
    }));
    
    const fillStyle = computed(() => ({
      width: `${props.percentage}%`,
      backgroundColor: fillColor.value,
    }));
    
    // Estilos do círculo
    const circleContainerStyle = computed(() => ({
      width: `${props.circleWidth}px`,
      height: `${props.circleWidth}px`,
    }));
    
    const circleCenter = computed(() => props.circleWidth / 2);
    const circleRadius = computed(() => (props.circleWidth - props.strokeWidth) / 2);
    const circleViewBox = computed(() => `0 0 ${props.circleWidth} ${props.circleWidth}`);
    
    const circleCircumference = computed(() => 2 * Math.PI * circleRadius.value);
    const circleDashArray = computed(() => circleCircumference.value);
    const circleDashOffset = computed(() => {
      const offset = circleCircumference.value - (props.percentage / 100) * circleCircumference.value;
      return offset;
    });
    
    return {
      fillColor,
      displayPercentage,
      showLabel,
      progressClasses,
      trackStyle,
      fillStyle,
      circleContainerStyle,
      circleCenter,
      circleRadius,
      circleViewBox,
      circleDashArray,
      circleDashOffset,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-progress {
  width: 100%;
  
  &--line {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  
  &--circle {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  
  &__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    font-size: 14px;
  }
  
  &__label {
    color: var(--n-text-color, #333);
  }
  
  &__percentage {
    color: var(--n-text-color-3, #666);
  }
  
  &__track {
    flex: 1;
    min-width: 100px;
    background-color: var(--n-border-color, #e0e0e0);
    border-radius: 100px;
    overflow: hidden;
  }
  
  &__fill {
    height: 100%;
    border-radius: 100px;
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__inside-text {
    color: #fff;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    padding: 0 8px;
  }
  
  &__outside-text {
    color: var(--n-text-color-3, #666);
    font-size: 14px;
    min-width: 40px;
    text-align: right;
  }
  
  // Círculo
  &__circle {
    position: relative;
    
    svg {
      transform: rotate(-90deg);
    }
  }
  
  &__circle-track {
    stroke: var(--n-border-color, #e0e0e0);
  }
  
  &__circle-fill {
    transition: stroke-dashoffset 0.3s ease;
  }
  
  &__circle-content {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &__circle-text {
    font-size: 16px;
    font-weight: 600;
    color: var(--n-text-color, #333);
  }
  
  // Indeterminado
  &--indeterminate &__fill {
    width: 30% !important;
    animation: indeterminate 1.5s ease-in-out infinite;
  }
  
  // Listrado
  &--striped &__fill {
    background-image: linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.15) 25%,
      transparent 25%,
      transparent 50%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.15) 75%,
      transparent 75%,
      transparent
    );
    background-size: 1rem 1rem;
  }
  
  &--striped-animated &__fill {
    animation: striped-animation 1s linear infinite;
  }
}

@keyframes indeterminate {
  0% {
    margin-left: 0%;
  }
  50% {
    margin-left: 70%;
  }
  100% {
    margin-left: 0%;
  }
}

@keyframes striped-animation {
  from {
    background-position: 1rem 0;
  }
  to {
    background-position: 0 0;
  }
}
</style>

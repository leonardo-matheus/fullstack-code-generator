<!-- 
  LvTooltip.vue - Naive UI Edition
  Tooltip wrapper com estilos customizados - 100% Responsivo
-->
<template>
  <n-tooltip
    v-bind="$attrs"
    :placement="responsivePlacement"
    :trigger="responsiveTrigger"
    :delay="delay"
    :duration="duration"
    :disabled="disabled"
    :show-arrow="showArrow"
    :arrow-style="arrowStyle"
    :style="tooltipStyle"
    :width="responsiveWidth"
  >
    <template #trigger>
      <slot />
    </template>
    
    <slot name="content">
      <div class="lv-tooltip__content" :class="contentClasses" :style="contentStyle">
        <!-- Ícone opcional -->
        <n-icon v-if="icon" class="lv-tooltip__icon" :size="iconSize">
          <component :is="iconComponent" />
        </n-icon>
        
        <!-- Conteúdo -->
        <span class="lv-tooltip__text">{{ content }}</span>
      </div>
    </slot>
  </n-tooltip>
</template>

<script>
import { defineComponent, computed, markRaw, ref, onMounted, onUnmounted } from "vue";
import { NTooltip, NIcon } from "naive-ui";
import { 
  InformationCircleOutline, 
  WarningOutline, 
  AlertCircleOutline,
  CheckmarkCircleOutline,
  HelpCircleOutline
} from "@vicons/ionicons5";

export default defineComponent({
  name: "LvTooltip",
  components: { NTooltip, NIcon },
  inheritAttrs: false,
  
  props: {
    // Texto do tooltip
    content: {
      type: String,
      default: "",
    },
    // Posição
    placement: {
      type: String,
      default: "top",
      validator: (v) => [
        "top", "top-start", "top-end",
        "bottom", "bottom-start", "bottom-end",
        "left", "left-start", "left-end",
        "right", "right-start", "right-end"
      ].includes(v),
    },
    // Gatilho
    trigger: {
      type: String,
      default: "hover",
      validator: (v) => ["hover", "click", "focus", "manual"].includes(v),
    },
    // Delay para mostrar (ms)
    delay: {
      type: Number,
      default: 100,
    },
    // Duração para esconder (ms)
    duration: {
      type: Number,
      default: 100,
    },
    // Desabilitar
    disabled: {
      type: Boolean,
      default: false,
    },
    // Mostrar seta
    showArrow: {
      type: Boolean,
      default: true,
    },
    // Tipo/tema do tooltip
    type: {
      type: String,
      default: "default",
      validator: (v) => ["default", "info", "success", "warning", "error", "help"].includes(v),
    },
    // Ícone (true usa ícone do tipo, string usa ícone customizado)
    icon: {
      type: [Boolean, String],
      default: false,
    },
    // Largura máxima
    maxWidth: {
      type: [String, Number],
      default: 300,
    },
    // Largura máxima em mobile
    mobileMaxWidth: {
      type: [String, Number],
      default: "90vw",
    },
    // Posição em mobile (auto ajusta para top/bottom)
    mobilePosition: {
      type: String,
      default: "bottom",
      validator: (v) => ["top", "bottom"].includes(v),
    },
    // Trigger em mobile (click é melhor para touch)
    mobileTrigger: {
      type: String,
      default: "click",
      validator: (v) => ["hover", "click", "focus"].includes(v),
    },
    // Breakpoint para considerar mobile (px)
    mobileBreakpoint: {
      type: Number,
      default: 768,
    },
  },
  
  setup(props) {
    // Detectar se é mobile
    const isMobile = ref(false);
    
    const checkMobile = () => {
      isMobile.value = window.innerWidth <= props.mobileBreakpoint;
    };
    
    onMounted(() => {
      checkMobile();
      window.addEventListener("resize", checkMobile);
    });
    
    onUnmounted(() => {
      window.removeEventListener("resize", checkMobile);
    });
    
    // Ícones por tipo
    const typeIcons = {
      default: markRaw(InformationCircleOutline),
      info: markRaw(InformationCircleOutline),
      success: markRaw(CheckmarkCircleOutline),
      warning: markRaw(WarningOutline),
      error: markRaw(AlertCircleOutline),
      help: markRaw(HelpCircleOutline),
    };
    
    const iconComponent = computed(() => {
      if (typeof props.icon === "string") {
        return props.icon;
      }
      return typeIcons[props.type] || typeIcons.default;
    });
    
    // Tamanho do ícone responsivo
    const iconSize = computed(() => isMobile.value ? 14 : 16);
    
    // Cores por tipo
    const typeColors = {
      default: null,
      info: "#2080f0",
      success: "#18a058",
      warning: "#f0a020",
      error: "#d03050",
      help: "#6366f1",
    };
    
    const tooltipStyle = computed(() => {
      const color = typeColors[props.type];
      if (!color) return {};
      
      return {
        "--n-color": color,
      };
    });
    
    const arrowStyle = computed(() => {
      const color = typeColors[props.type];
      if (!color) return {};
      
      return {
        backgroundColor: color,
      };
    });
    
    // Posição responsiva - em mobile, usar top/bottom para evitar cortes
    const responsivePlacement = computed(() => {
      if (!isMobile.value) return props.placement;
      
      // Em mobile, converte left/right para top/bottom
      if (props.placement.startsWith("left") || props.placement.startsWith("right")) {
        return props.mobilePosition;
      }
      
      // Mantém top/bottom mas remove variantes (start/end)
      if (props.placement.startsWith("top")) return "top";
      if (props.placement.startsWith("bottom")) return "bottom";
      
      return props.mobilePosition;
    });
    
    // Trigger responsivo - click funciona melhor em touch
    const responsiveTrigger = computed(() => {
      if (!isMobile.value) return props.trigger;
      return props.mobileTrigger;
    });
    
    // Largura responsiva
    const responsiveWidth = computed(() => {
      if (!isMobile.value) return undefined;
      return "trigger"; // Largura baseada no trigger em mobile
    });
    
    const contentStyle = computed(() => {
      const maxWidth = isMobile.value
        ? (typeof props.mobileMaxWidth === "number" ? `${props.mobileMaxWidth}px` : props.mobileMaxWidth)
        : (typeof props.maxWidth === "number" ? `${props.maxWidth}px` : props.maxWidth);
      
      return {
        maxWidth,
      };
    });
    
    const contentClasses = computed(() => ({
      "lv-tooltip__content--mobile": isMobile.value,
    }));
    
    return {
      isMobile,
      iconComponent,
      iconSize,
      tooltipStyle,
      arrowStyle,
      contentStyle,
      contentClasses,
      responsivePlacement,
      responsiveTrigger,
      responsiveWidth,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-tooltip {
  &__content {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    line-height: 1.5;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    
    &--mobile {
      gap: 8px;
      padding: 4px 0;
      font-size: 13px;
    }
  }
  
  &__icon {
    flex-shrink: 0;
    margin-top: 2px;
  }
  
  &__text {
    flex: 1;
    min-width: 0;
  }
}

// Estilos globais para tooltip responsivo
:deep(.n-tooltip) {
  // Em telas pequenas, garantir que não ultrapasse a viewport
  @media (max-width: 768px) {
    max-width: 90vw !important;
    
    .n-tooltip__content {
      padding: 10px 14px;
      font-size: 13px;
    }
  }
  
  // Em telas muito pequenas
  @media (max-width: 480px) {
    max-width: 85vw !important;
    
    .n-tooltip__content {
      padding: 8px 12px;
      font-size: 12px;
    }
  }
}
</style>

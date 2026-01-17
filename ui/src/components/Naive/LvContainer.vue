<!-- 
  LvContainer.vue - Naive UI Edition
  Container flexível para organização de layout
  
  Uso:
  <lv-container direction="row" gap="16" justify="between">
    <div>Item 1</div>
    <div>Item 2</div>
  </lv-container>
-->
<template>
  <component 
    :is="tag" 
    class="lv-container" 
    :class="containerClasses"
    :style="containerStyle"
  >
    <slot />
  </component>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "LvContainer",
  
  props: {
    // Tag HTML do container
    tag: {
      type: String,
      default: 'div'
    },
    
    // Direção do flex
    direction: {
      type: String,
      default: 'row',
      validator: (v) => ['row', 'column', 'row-reverse', 'column-reverse'].includes(v)
    },
    
    // Alinhamento no eixo principal (justify-content)
    justify: {
      type: String,
      default: 'start',
      validator: (v) => ['start', 'center', 'end', 'between', 'around', 'evenly'].includes(v)
    },
    
    // Alinhamento no eixo cruzado (align-items)
    align: {
      type: String,
      default: 'stretch',
      validator: (v) => ['start', 'center', 'end', 'stretch', 'baseline'].includes(v)
    },
    
    // Espaçamento entre itens
    gap: {
      type: [String, Number],
      default: 16
    },
    
    // Padding interno
    padding: {
      type: [String, Number],
      default: 0
    },
    
    // Permite quebra de linha
    wrap: {
      type: Boolean,
      default: false
    },
    
    // Ocupa toda largura disponível
    fluid: {
      type: Boolean,
      default: false
    },
    
    // Largura máxima
    maxWidth: {
      type: [String, Number],
      default: null
    },
    
    // Centraliza horizontalmente
    centered: {
      type: Boolean,
      default: false
    },
    
    // Inverte direção em telas pequenas
    responsive: {
      type: Boolean,
      default: false
    },
    
    // Inline flex
    inline: {
      type: Boolean,
      default: false
    }
  },
  
  setup(props) {
    // Mapeia valores simplificados para CSS válido
    const justifyMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      between: 'space-between',
      around: 'space-around',
      evenly: 'space-evenly'
    }
    
    const alignMap = {
      start: 'flex-start',
      center: 'center',
      end: 'flex-end',
      stretch: 'stretch',
      baseline: 'baseline'
    }
    
    const containerClasses = computed(() => ({
      'lv-container--wrap': props.wrap,
      'lv-container--fluid': props.fluid,
      'lv-container--centered': props.centered,
      'lv-container--responsive': props.responsive,
      'lv-container--inline': props.inline,
      [`lv-container--${props.direction}`]: true
    }))
    
    const containerStyle = computed(() => {
      const style = {
        flexDirection: props.direction,
        justifyContent: justifyMap[props.justify] || props.justify,
        alignItems: alignMap[props.align] || props.align,
        gap: typeof props.gap === 'number' ? `${props.gap}px` : props.gap
      }
      
      if (props.padding) {
        style.padding = typeof props.padding === 'number' ? `${props.padding}px` : props.padding
      }
      
      if (props.maxWidth) {
        style.maxWidth = typeof props.maxWidth === 'number' ? `${props.maxWidth}px` : props.maxWidth
      }
      
      return style
    })
    
    return {
      containerClasses,
      containerStyle
    }
  }
});
</script>

<style lang="scss" scoped>
.lv-container {
  display: flex;
  box-sizing: border-box;
}

.lv-container--inline {
  display: inline-flex;
}

.lv-container--wrap {
  flex-wrap: wrap;
}

.lv-container--fluid {
  width: 100%;
}

.lv-container--centered {
  margin-left: auto;
  margin-right: auto;
}

/* Responsivo: inverte direção em mobile */
@media (max-width: 768px) {
  .lv-container--responsive.lv-container--row {
    flex-direction: column;
  }
  
  .lv-container--responsive.lv-container--row-reverse {
    flex-direction: column-reverse;
  }
}
</style>

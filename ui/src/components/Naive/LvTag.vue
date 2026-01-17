<!-- 
  LvTag.vue - Naive UI Edition
  Tag/chip com diferentes estilos e funcionalidades
-->
<template>
  <n-tag
    v-bind="$attrs"
    :type="type"
    :size="size"
    :round="round"
    :bordered="bordered"
    :closable="closable"
    :disabled="disabled"
    :checkable="checkable"
    :checked="modelValue"
    :color="customColor"
    @close="handleClose"
    @update:checked="handleCheck"
  >
    <!-- Ícone à esquerda -->
    <template v-if="icon || $slots.icon" #icon>
      <slot name="icon">
        <n-icon v-if="icon" :size="iconSize">
          <component :is="icon" />
        </n-icon>
      </slot>
    </template>
    
    <!-- Avatar à esquerda -->
    <template v-if="$slots.avatar" #avatar>
      <slot name="avatar" />
    </template>
    
    <!-- Conteúdo -->
    <slot>{{ label }}</slot>
  </n-tag>
</template>

<script>
import { defineComponent, computed } from "vue";
import { NTag, NIcon } from "naive-ui";

export default defineComponent({
  name: "LvTag",
  components: { NTag, NIcon },
  inheritAttrs: false,
  
  props: {
    // Texto da tag
    label: {
      type: String,
      default: "",
    },
    // Tipo/cor
    type: {
      type: String,
      default: "default",
      validator: (v) => ["default", "primary", "info", "success", "warning", "error"].includes(v),
    },
    // Tamanho
    size: {
      type: String,
      default: "medium",
      validator: (v) => ["small", "medium", "large"].includes(v),
    },
    // Arredondado
    round: {
      type: Boolean,
      default: false,
    },
    // Com borda
    bordered: {
      type: Boolean,
      default: true,
    },
    // Pode fechar
    closable: {
      type: Boolean,
      default: false,
    },
    // Desabilitado
    disabled: {
      type: Boolean,
      default: false,
    },
    // Pode marcar (checkbox)
    checkable: {
      type: Boolean,
      default: false,
    },
    // v-model para checkable
    modelValue: {
      type: Boolean,
      default: false,
    },
    // Ícone (componente)
    icon: {
      type: Object,
      default: null,
    },
    // Cor customizada
    color: {
      type: String,
      default: null,
    },
    // Cor do texto customizada
    textColor: {
      type: String,
      default: null,
    },
    // Cor da borda customizada
    borderColor: {
      type: String,
      default: null,
    },
  },
  
  emits: ["update:modelValue", "close"],
  
  setup(props, { emit }) {
    const iconSize = computed(() => {
      const sizes = { small: 12, medium: 14, large: 16 };
      return sizes[props.size];
    });
    
    // Cor customizada se fornecida
    const customColor = computed(() => {
      if (!props.color && !props.textColor && !props.borderColor) {
        return undefined;
      }
      
      return {
        color: props.color,
        textColor: props.textColor,
        borderColor: props.borderColor,
      };
    });
    
    const handleClose = () => {
      emit("close");
    };
    
    const handleCheck = (checked) => {
      emit("update:modelValue", checked);
    };
    
    return {
      iconSize,
      customColor,
      handleClose,
      handleCheck,
    };
  },
});
</script>

<style lang="scss" scoped>
// Estilos customizados se necessário
</style>

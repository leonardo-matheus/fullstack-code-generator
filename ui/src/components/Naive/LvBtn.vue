<!-- 
  LvBtn.vue - Naive UI Edition
  Modern button component with consistent styling
-->
<template>
  <n-button
    :type="buttonType"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :round="round"
    :circle="circle"
    :ghost="ghost"
    :quaternary="quaternary"
    :tertiary="tertiary"
    :secondary="secondary"
    :dashed="dashed"
    :text="text"
    :block="block"
    :tag="tag"
    :href="href"
    :target="target"
    :class="['lv-btn', { 'lv-btn--soft': soft }]"
    @click="handleClick"
  >
    <template #icon v-if="icon || $slots.icon">
      <slot name="icon">
        <n-icon v-if="icon" :size="iconSize">
          <component :is="iconComponent" v-if="iconComponent" />
        </n-icon>
      </slot>
    </template>
    
    <span v-if="label || $slots.default" class="lv-btn-label">
      <slot>{{ label }}</slot>
    </span>

    <template #loading>
      <slot name="loading">
        <n-spin :size="16" />
      </slot>
    </template>
  </n-button>
</template>

<script>
import { defineComponent, computed, h } from "vue";
import { NButton, NIcon, NSpin } from "naive-ui";
import {
  AddOutline,
  TrashOutline,
  CreateOutline,
  SaveOutline,
  CloseOutline,
  CheckmarkOutline,
  RefreshOutline,
  SearchOutline,
  DownloadOutline,
  CloudUploadOutline,
  SettingsOutline,
  EyeOutline,
  CopyOutline,
  ArrowBackOutline,
  ArrowForwardOutline,
} from "@vicons/ionicons5";

// Icon mapping
const iconMap = {
  add: AddOutline,
  create: AddOutline,
  plus: AddOutline,
  delete: TrashOutline,
  trash: TrashOutline,
  remove: TrashOutline,
  edit: CreateOutline,
  pencil: CreateOutline,
  save: SaveOutline,
  close: CloseOutline,
  cancel: CloseOutline,
  check: CheckmarkOutline,
  confirm: CheckmarkOutline,
  refresh: RefreshOutline,
  sync: RefreshOutline,
  search: SearchOutline,
  download: DownloadOutline,
  upload: CloudUploadOutline,
  settings: SettingsOutline,
  view: EyeOutline,
  eye: EyeOutline,
  copy: CopyOutline,
  back: ArrowBackOutline,
  forward: ArrowForwardOutline,
  next: ArrowForwardOutline,
};

export default defineComponent({
  name: "LvBtn",
  components: {
    NButton,
    NIcon,
    NSpin,
  },
  props: {
    // Core props
    color: {
      type: String,
      default: "default", // 'default', 'primary', 'info', 'success', 'warning', 'error'
    },
    size: {
      type: String,
      default: "medium", // 'tiny', 'small', 'medium', 'large'
    },
    label: {
      type: String,
      default: null,
    },
    icon: {
      type: String,
      default: null,
    },
    iconSize: {
      type: Number,
      default: 18,
    },
    
    // State props
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    
    // Style variants
    soft: {
      type: Boolean,
      default: false,
    },
    ghost: {
      type: Boolean,
      default: false,
    },
    quaternary: {
      type: Boolean,
      default: false,
    },
    tertiary: {
      type: Boolean,
      default: false,
    },
    secondary: {
      type: Boolean,
      default: false,
    },
    dashed: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
    round: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
    
    // Link props
    href: {
      type: String,
      default: null,
    },
    target: {
      type: String,
      default: null,
    },
    tag: {
      type: String,
      default: "button",
    },
    to: {
      type: [String, Object],
      default: null,
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const buttonType = computed(() => {
      const colorMap = {
        default: "default",
        primary: "primary",
        info: "info",
        success: "success",
        warning: "warning",
        error: "error",
        danger: "error",
        negative: "error",
        positive: "success",
      };
      return colorMap[props.color] || "default";
    });

    const iconComponent = computed(() => {
      if (!props.icon) return null;
      return iconMap[props.icon.toLowerCase()] || null;
    });

    function handleClick(event) {
      if (!props.disabled && !props.loading) {
        emit("click", event);
      }
    }

    return {
      buttonType,
      iconComponent,
      handleClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-btn {
  font-weight: 500;
  transition: all 0.2s ease;
  
  &--soft {
    opacity: 0.85;
    
    &:hover {
      opacity: 1;
    }
  }
}

.lv-btn-label {
  display: inline-flex;
  align-items: center;
}
</style>

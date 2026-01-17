<!-- 
  LvAvatar.vue - Naive UI Edition
  Avatar de usuário com fallback de iniciais
-->
<template>
  <div class="lv-avatar" :class="avatarClasses" :style="avatarStyle">
    <!-- Imagem -->
    <img 
      v-if="src && !hasError" 
      :src="src" 
      :alt="alt || name"
      class="lv-avatar__image"
      @error="hasError = true"
    />
    
    <!-- Iniciais ou ícone fallback -->
    <span v-else class="lv-avatar__fallback">
      <slot>
        <n-icon v-if="!name" :size="iconSize"><PersonOutline /></n-icon>
        <template v-else>{{ initials }}</template>
      </slot>
    </span>
    
    <!-- Status indicator -->
    <span v-if="status" class="lv-avatar__status" :class="`lv-avatar__status--${status}`" />
  </div>
</template>

<script>
import { defineComponent, computed, ref } from "vue";
import { NIcon } from "naive-ui";
import { PersonOutline } from "@vicons/ionicons5";

export default defineComponent({
  name: "LvAvatar",
  components: { NIcon, PersonOutline },
  
  props: {
    // URL da imagem
    src: {
      type: String,
      default: null,
    },
    // Nome (para gerar iniciais)
    name: {
      type: String,
      default: "",
    },
    // Alt text
    alt: {
      type: String,
      default: "",
    },
    // Tamanho
    size: {
      type: [String, Number],
      default: "medium",
      validator: (v) => ["tiny", "small", "medium", "large", "xlarge"].includes(v) || typeof v === "number",
    },
    // Formato
    shape: {
      type: String,
      default: "circle",
      validator: (v) => ["circle", "square"].includes(v),
    },
    // Cor de fundo (quando sem imagem)
    color: {
      type: String,
      default: null,
    },
    // Status: online, offline, busy, away
    status: {
      type: String,
      default: null,
      validator: (v) => [null, "online", "offline", "busy", "away"].includes(v),
    },
    // Borda
    bordered: {
      type: Boolean,
      default: false,
    },
  },
  
  setup(props) {
    const hasError = ref(false);
    
    // Gera iniciais do nome
    const initials = computed(() => {
      if (!props.name) return "";
      const parts = props.name.trim().split(/\s+/);
      if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    });
    
    // Gera cor baseada no nome
    const generatedColor = computed(() => {
      if (!props.name) return "#8b8b8b";
      let hash = 0;
      for (let i = 0; i < props.name.length; i++) {
        hash = props.name.charCodeAt(i) + ((hash << 5) - hash);
      }
      const colors = [
        "#f56a00", "#7265e6", "#ffbf00", "#00a2ae",
        "#87d068", "#ff6f91", "#845ec2", "#0081cf",
        "#f9844a", "#4d908e", "#577590", "#c77dff"
      ];
      return colors[Math.abs(hash) % colors.length];
    });
    
    const sizeMap = {
      tiny: 24,
      small: 32,
      medium: 40,
      large: 48,
      xlarge: 64,
    };
    
    const avatarClasses = computed(() => ({
      [`lv-avatar--${props.shape}`]: true,
      "lv-avatar--bordered": props.bordered,
    }));
    
    const avatarStyle = computed(() => {
      const pixelSize = typeof props.size === "number" ? props.size : sizeMap[props.size] || 40;
      return {
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        fontSize: `${pixelSize * 0.4}px`,
        backgroundColor: props.src && !hasError.value ? "transparent" : (props.color || generatedColor.value),
      };
    });
    
    const iconSize = computed(() => {
      const pixelSize = typeof props.size === "number" ? props.size : sizeMap[props.size] || 40;
      return Math.round(pixelSize * 0.5);
    });
    
    return {
      hasError,
      initials,
      avatarClasses,
      avatarStyle,
      iconSize,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: white;
  font-weight: 600;
  flex-shrink: 0;
  
  &--circle {
    border-radius: 50%;
  }
  
  &--square {
    border-radius: 6px;
  }
  
  &--bordered {
    box-shadow: 0 0 0 2px white, 0 0 0 4px var(--n-border-color);
  }
  
  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &__fallback {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-transform: uppercase;
  }
  
  // Status indicator
  &__status {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 25%;
    height: 25%;
    min-width: 8px;
    min-height: 8px;
    border-radius: 50%;
    border: 2px solid white;
    
    &--online {
      background: var(--n-success-color, #18a058);
    }
    
    &--offline {
      background: #8b8b8b;
    }
    
    &--busy {
      background: var(--n-error-color, #d03050);
    }
    
    &--away {
      background: var(--n-warning-color, #f0a020);
    }
  }
}
</style>

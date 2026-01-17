<!-- 
  LvSkeleton.vue - Naive UI Edition
  Skeleton loading placeholder
-->
<template>
  <div class="lv-skeleton" :class="skeletonClasses" :style="skeletonStyle">
    <template v-if="!loading">
      <slot />
    </template>
    
    <template v-else>
      <!-- Preset: Text -->
      <template v-if="preset === 'text'">
        <div 
          v-for="n in rows" 
          :key="n" 
          class="lv-skeleton__item lv-skeleton__text"
          :style="getRowStyle(n)"
        />
      </template>
      
      <!-- Preset: Avatar -->
      <template v-else-if="preset === 'avatar'">
        <div 
          class="lv-skeleton__item lv-skeleton__avatar"
          :class="{ 'lv-skeleton__avatar--circle': circle }"
          :style="avatarStyle"
        />
      </template>
      
      <!-- Preset: Image -->
      <template v-else-if="preset === 'image'">
        <div class="lv-skeleton__item lv-skeleton__image" :style="imageStyle">
          <svg viewBox="0 0 24 24" fill="currentColor" class="lv-skeleton__image-icon">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      </template>
      
      <!-- Preset: Card -->
      <template v-else-if="preset === 'card'">
        <div class="lv-skeleton__card">
          <div class="lv-skeleton__item lv-skeleton__image" style="height: 150px; border-radius: 8px 8px 0 0;" />
          <div class="lv-skeleton__card-content">
            <div class="lv-skeleton__item lv-skeleton__text" style="width: 60%; height: 20px;" />
            <div class="lv-skeleton__item lv-skeleton__text" style="width: 100%; height: 14px; margin-top: 12px;" />
            <div class="lv-skeleton__item lv-skeleton__text" style="width: 80%; height: 14px; margin-top: 8px;" />
          </div>
        </div>
      </template>
      
      <!-- Preset: List -->
      <template v-else-if="preset === 'list'">
        <div v-for="n in rows" :key="n" class="lv-skeleton__list-item">
          <div class="lv-skeleton__item lv-skeleton__avatar" style="width: 40px; height: 40px; border-radius: 50%;" />
          <div class="lv-skeleton__list-content">
            <div class="lv-skeleton__item lv-skeleton__text" style="width: 30%; height: 16px;" />
            <div class="lv-skeleton__item lv-skeleton__text" style="width: 80%; height: 14px; margin-top: 8px;" />
          </div>
        </div>
      </template>
      
      <!-- Preset: Button -->
      <template v-else-if="preset === 'button'">
        <div class="lv-skeleton__item lv-skeleton__button" :style="buttonStyle" />
      </template>
      
      <!-- Default: Custom ou retangular -->
      <template v-else>
        <div class="lv-skeleton__item" :style="customStyle" />
      </template>
    </template>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "LvSkeleton",
  
  props: {
    // Mostrar skeleton (true) ou conteúdo (false)
    loading: {
      type: Boolean,
      default: true,
    },
    // Preset de skeleton
    preset: {
      type: String,
      default: null,
      validator: (v) => [null, "text", "avatar", "image", "card", "list", "button"].includes(v),
    },
    // Número de linhas (text/list)
    rows: {
      type: Number,
      default: 3,
    },
    // Largura customizada
    width: {
      type: [String, Number],
      default: "100%",
    },
    // Altura customizada
    height: {
      type: [String, Number],
      default: null,
    },
    // Circular (avatar)
    circle: {
      type: Boolean,
      default: true,
    },
    // Tamanho do avatar
    avatarSize: {
      type: [String, Number],
      default: 48,
    },
    // Tamanho da imagem
    imageHeight: {
      type: [String, Number],
      default: 200,
    },
    // Animação
    animated: {
      type: Boolean,
      default: true,
    },
    // Arredondamento
    rounded: {
      type: Boolean,
      default: true,
    },
  },
  
  setup(props) {
    const formatSize = (size) => {
      if (typeof size === "number") return `${size}px`;
      return size;
    };
    
    const skeletonClasses = computed(() => ({
      "lv-skeleton--animated": props.animated,
      "lv-skeleton--rounded": props.rounded,
    }));
    
    const skeletonStyle = computed(() => ({
      width: formatSize(props.width),
    }));
    
    // Estilo para cada linha de texto
    const getRowStyle = (index) => {
      // Última linha mais curta para parecer mais natural
      const isLast = index === props.rows;
      return {
        width: isLast ? "60%" : "100%",
      };
    };
    
    const avatarStyle = computed(() => ({
      width: formatSize(props.avatarSize),
      height: formatSize(props.avatarSize),
    }));
    
    const imageStyle = computed(() => ({
      height: formatSize(props.imageHeight),
    }));
    
    const buttonStyle = computed(() => ({
      width: formatSize(props.width),
      height: formatSize(props.height || 36),
    }));
    
    const customStyle = computed(() => ({
      width: formatSize(props.width),
      height: formatSize(props.height || 20),
    }));
    
    return {
      skeletonClasses,
      skeletonStyle,
      getRowStyle,
      avatarStyle,
      imageStyle,
      buttonStyle,
      customStyle,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-skeleton {
  &__item {
    background: linear-gradient(90deg, 
      var(--n-border-color, #e5e5e5) 25%, 
      var(--n-divider-color, #f0f0f0) 50%, 
      var(--n-border-color, #e5e5e5) 75%
    );
    background-size: 200% 100%;
  }
  
  &--animated &__item {
    animation: skeleton-loading 1.5s ease-in-out infinite;
  }
  
  // Text skeleton
  &__text {
    height: 16px;
    border-radius: 4px;
    
    & + & {
      margin-top: 12px;
    }
  }
  
  // Avatar skeleton
  &__avatar {
    flex-shrink: 0;
    
    &--circle {
      border-radius: 50%;
    }
  }
  
  &--rounded &__avatar:not(&--circle) {
    border-radius: 8px;
  }
  
  // Image skeleton
  &__image {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }
  
  &__image-icon {
    width: 48px;
    height: 48px;
    color: var(--n-text-color-disabled, #ccc);
  }
  
  // Card skeleton
  &__card {
    border: 1px solid var(--n-border-color, #e5e5e5);
    border-radius: 8px;
    overflow: hidden;
  }
  
  &__card-content {
    padding: 16px;
  }
  
  // List skeleton
  &__list-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    
    & + & {
      margin-top: 16px;
    }
  }
  
  &__list-content {
    flex: 1;
    padding-top: 4px;
  }
  
  // Button skeleton
  &__button {
    border-radius: 6px;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

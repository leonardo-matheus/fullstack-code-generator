<!-- 
  LvEmpty.vue - Naive UI Edition
  Estado vazio para listas e tabelas
-->
<template>
  <div class="lv-empty" :class="emptyClasses">
    <!-- Ícone -->
    <div class="lv-empty__icon">
      <slot name="icon">
        <n-icon :size="iconSize" :color="iconColor">
          <component :is="iconComponent" />
        </n-icon>
      </slot>
    </div>
    
    <!-- Título -->
    <div v-if="title || $slots.title" class="lv-empty__title">
      <slot name="title">{{ title }}</slot>
    </div>
    
    <!-- Descrição -->
    <div v-if="description || $slots.description" class="lv-empty__description">
      <slot name="description">{{ description }}</slot>
    </div>
    
    <!-- Ação -->
    <div v-if="$slots.default" class="lv-empty__action">
      <slot />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, markRaw } from "vue";
import { NIcon } from "naive-ui";
import { 
  FolderOpenOutline, 
  SearchOutline, 
  AlertCircleOutline,
  CloudOfflineOutline,
  LockClosedOutline,
  ConstructOutline
} from "@vicons/ionicons5";

export default defineComponent({
  name: "LvEmpty",
  components: { NIcon },
  
  props: {
    // Tipo do estado vazio
    type: {
      type: String,
      default: "empty",
      validator: (v) => ["empty", "search", "error", "offline", "forbidden", "maintenance"].includes(v),
    },
    // Título
    title: {
      type: String,
      default: null,
    },
    // Descrição
    description: {
      type: String,
      default: null,
    },
    // Tamanho
    size: {
      type: String,
      default: "medium",
      validator: (v) => ["small", "medium", "large"].includes(v),
    },
  },
  
  setup(props) {
    // Configurações por tipo
    const typeConfig = {
      empty: {
        icon: markRaw(FolderOpenOutline),
        color: "#8b8b8b",
        defaultTitle: "Nenhum dado",
        defaultDescription: "Não há itens para exibir",
      },
      search: {
        icon: markRaw(SearchOutline),
        color: "#2080f0",
        defaultTitle: "Nenhum resultado",
        defaultDescription: "Tente ajustar os filtros de busca",
      },
      error: {
        icon: markRaw(AlertCircleOutline),
        color: "#d03050",
        defaultTitle: "Erro",
        defaultDescription: "Ocorreu um erro ao carregar os dados",
      },
      offline: {
        icon: markRaw(CloudOfflineOutline),
        color: "#f0a020",
        defaultTitle: "Sem conexão",
        defaultDescription: "Verifique sua conexão com a internet",
      },
      forbidden: {
        icon: markRaw(LockClosedOutline),
        color: "#d03050",
        defaultTitle: "Acesso negado",
        defaultDescription: "Você não tem permissão para acessar este recurso",
      },
      maintenance: {
        icon: markRaw(ConstructOutline),
        color: "#f0a020",
        defaultTitle: "Em manutenção",
        defaultDescription: "Este recurso está temporariamente indisponível",
      },
    };
    
    const config = computed(() => typeConfig[props.type] || typeConfig.empty);
    
    const iconComponent = computed(() => config.value.icon);
    const iconColor = computed(() => config.value.color);
    
    const iconSize = computed(() => {
      const sizes = { small: 48, medium: 64, large: 96 };
      return sizes[props.size];
    });
    
    const emptyClasses = computed(() => ({
      [`lv-empty--${props.size}`]: true,
    }));
    
    // Usa título/descrição customizado ou default do tipo
    const displayTitle = computed(() => props.title ?? config.value.defaultTitle);
    const displayDescription = computed(() => props.description ?? config.value.defaultDescription);
    
    return {
      iconComponent,
      iconColor,
      iconSize,
      emptyClasses,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  text-align: center;
  
  &--small {
    padding: 24px 12px;
  }
  
  &--large {
    padding: 48px 24px;
  }
  
  &__icon {
    margin-bottom: 16px;
    opacity: 0.6;
  }
  
  &__title {
    font-size: 16px;
    font-weight: 600;
    color: var(--n-text-color, #333);
    margin-bottom: 8px;
  }
  
  &__description {
    font-size: 14px;
    color: var(--n-text-color-3, #999);
    max-width: 300px;
    line-height: 1.5;
  }
  
  &__action {
    margin-top: 24px;
  }
  
  &--small &__title {
    font-size: 14px;
  }
  
  &--small &__description {
    font-size: 12px;
  }
  
  &--large &__title {
    font-size: 20px;
  }
  
  &--large &__description {
    font-size: 16px;
  }
}
</style>

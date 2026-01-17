<!-- 
  LvHeaderPage.vue - Naive UI Edition
  Page header with title, breadcrumb, and actions
-->
<template>
  <div class="lv-header-page">
    <div class="lv-header-page-content">
      <!-- Left side: Back button, Title, Subtitle -->
      <div class="lv-header-page-left">
        <n-button 
          v-if="showBack"
          quaternary 
          circle
          class="lv-header-back"
          @click="goBack"
        >
          <template #icon>
            <n-icon :size="20">
              <ArrowBackOutline />
            </n-icon>
          </template>
        </n-button>
        
        <div class="lv-header-page-info">
          <h1 class="lv-header-page-title">
            <n-icon v-if="icon" :size="28" class="lv-header-page-icon">
              <component :is="iconComponent" v-if="iconComponent" />
            </n-icon>
            {{ title }}
          </h1>
          <p v-if="subtitle" class="lv-header-page-subtitle">
            {{ subtitle }}
          </p>
        </div>
      </div>

      <!-- Right side: Actions slot -->
      <div class="lv-header-page-actions">
        <slot name="actions">
          <!-- Default create button -->
          <n-button 
            v-if="showCreate"
            type="primary"
            @click="$emit('create')"
          >
            <template #icon>
              <n-icon>
                <AddOutline />
              </n-icon>
            </template>
            {{ createLabel }}
          </n-button>
        </slot>
      </div>
    </div>

    <!-- Optional description/meta area -->
    <div v-if="$slots.description" class="lv-header-page-description">
      <slot name="description" />
    </div>

    <!-- Optional tabs -->
    <div v-if="$slots.tabs" class="lv-header-page-tabs">
      <slot name="tabs" />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from "vue";
import { useRouter } from "vue-router";
import { NButton, NIcon } from "naive-ui";
import {
  ArrowBackOutline,
  AddOutline,
  HomeOutline,
  PeopleOutline,
  SettingsOutline,
  DocumentTextOutline,
  KeyOutline,
  GridOutline,
  BuildOutline,
} from "@vicons/ionicons5";

const iconMap = {
  home: HomeOutline,
  users: PeopleOutline,
  people: PeopleOutline,
  settings: SettingsOutline,
  document: DocumentTextOutline,
  key: KeyOutline,
  permissions: KeyOutline,
  grid: GridOutline,
  build: BuildOutline,
  generator: BuildOutline,
};

export default defineComponent({
  name: "LvHeaderPage",
  components: {
    NButton,
    NIcon,
    ArrowBackOutline,
    AddOutline,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: null,
    },
    showBack: {
      type: Boolean,
      default: false,
    },
    showCreate: {
      type: Boolean,
      default: false,
    },
    createLabel: {
      type: String,
      default: "Create New",
    },
    backRoute: {
      type: [String, Object],
      default: null,
    },
  },
  emits: ["create", "back"],
  setup(props, { emit }) {
    const router = useRouter();

    const iconComponent = computed(() => {
      if (!props.icon) return null;
      return iconMap[props.icon.toLowerCase()] || null;
    });

    function goBack() {
      emit("back");
      if (props.backRoute) {
        router.push(props.backRoute);
      } else {
        router.back();
      }
    }

    return {
      iconComponent,
      goBack,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-header-page {
  margin-bottom: 24px;
}

.lv-header-page-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.lv-header-page-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.lv-header-back {
  margin-left: -8px;
}

.lv-header-page-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lv-header-page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--lv-text-primary);
  display: flex;
  align-items: center;
  gap: 12px;
  line-height: 1.3;
}

.lv-header-page-icon {
  color: #6366f1;
}

.lv-header-page-subtitle {
  font-size: 14px;
  color: var(--lv-text-secondary);
  margin: 0;
}

.lv-header-page-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lv-header-page-description {
  margin-top: 16px;
  padding: 16px;
  background: var(--lv-bg-tertiary);
  border-radius: 8px;
}

.lv-header-page-tabs {
  margin-top: 16px;
}
</style>

<!-- 
  LvCard.vue - Naive UI Edition
  Modern card component
-->
<template>
  <n-card
    :title="title"
    :bordered="bordered"
    :hoverable="hoverable"
    :size="size"
    :segmented="segmented"
    :class="['lv-card', { 'lv-card--clickable': clickable }]"
    :content-style="contentStyle"
    :header-style="headerStyle"
    @click="handleClick"
  >
    <template #header v-if="title || $slots.header">
      <slot name="header">
        <div class="lv-card-header">
          <div class="lv-card-header-left">
            <n-icon v-if="icon" :size="20" class="lv-card-icon">
              <component :is="iconComponent" v-if="iconComponent" />
            </n-icon>
            <span class="lv-card-title">{{ title }}</span>
          </div>
          <div v-if="$slots['header-extra']" class="lv-card-header-extra">
            <slot name="header-extra" />
          </div>
        </div>
      </slot>
    </template>

    <template #header-extra v-if="$slots['header-extra'] && !$slots.header">
      <slot name="header-extra" />
    </template>

    <slot />

    <template #footer v-if="$slots.footer">
      <slot name="footer" />
    </template>

    <template #action v-if="$slots.action">
      <slot name="action" />
    </template>
  </n-card>
</template>

<script>
import { defineComponent, computed } from "vue";
import { NCard, NIcon } from "naive-ui";
import {
  DocumentTextOutline,
  SettingsOutline,
  StatsChartOutline,
  PeopleOutline,
  KeyOutline,
  InformationCircleOutline,
} from "@vicons/ionicons5";

const iconMap = {
  document: DocumentTextOutline,
  settings: SettingsOutline,
  stats: StatsChartOutline,
  chart: StatsChartOutline,
  users: PeopleOutline,
  people: PeopleOutline,
  key: KeyOutline,
  info: InformationCircleOutline,
};

export default defineComponent({
  name: "LvCard",
  components: {
    NCard,
    NIcon,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: null,
    },
    bordered: {
      type: Boolean,
      default: true,
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    clickable: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "medium",
    },
    segmented: {
      type: [Boolean, Object],
      default: false,
    },
    contentStyle: {
      type: [String, Object],
      default: "",
    },
    headerStyle: {
      type: [String, Object],
      default: "",
    },
  },
  emits: ["click"],
  setup(props, { emit }) {
    const iconComponent = computed(() => {
      if (!props.icon) return null;
      return iconMap[props.icon.toLowerCase()] || null;
    });

    function handleClick(event) {
      if (props.clickable) {
        emit("click", event);
      }
    }

    return {
      iconComponent,
      handleClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-card {
  border-radius: 12px;
  
  &--clickable {
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--lv-shadow-lg);
    }
  }
}

.lv-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.lv-card-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.lv-card-icon {
  color: #6366f1;
}

.lv-card-title {
  font-weight: 600;
}

.lv-card-header-extra {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>

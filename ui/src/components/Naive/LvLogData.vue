<!-- 
  LvLogData.vue - Naive UI Edition
  Display log/audit data with timestamps and user info
-->
<template>
  <div class="lv-log-data" v-if="data && Object.keys(data).length > 0">
    <n-space vertical :size="4">
      <template v-for="(log, key) in data" :key="key">
        <div v-if="log && log.by" class="lv-log-item">
          <n-space align="center" :size="8">
            <n-tag 
              :type="getTagType(key)" 
              size="small" 
              :bordered="false"
              class="lv-log-tag"
            >
              {{ getFirstChar(key) }}
            </n-tag>
            <n-text depth="3" class="lv-log-date">
              {{ formatDate(log.at) }}
            </n-text>
            <lv-user v-if="log.by" :username="log.by" size="tiny" />
            <n-text v-if="showIp && log.ip" depth="3" class="lv-log-ip">
              {{ log.ip }}
            </n-text>
          </n-space>
        </div>
      </template>
    </n-space>
  </div>
  <n-text v-else depth="3" class="lv-log-empty">—</n-text>
</template>

<script>
import { defineComponent } from "vue";
import { NSpace, NTag, NText } from "naive-ui";
import useServices from "../../composables/Services";

export default defineComponent({
  name: "LvLogData",
  components: {
    NSpace,
    NTag,
    NText,
  },
  props: {
    data: {
      type: Object,
      default: null,
    },
    showIp: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const { Helper } = useServices();

    function getTagType(type) {
      switch (type) {
        case "created":
          return "info";
        case "updated":
          return "success";
        case "deleted":
          return "error";
        default:
          return "default";
      }
    }

    function getFirstChar(str) {
      if (!str) return "";
      return str.charAt(0).toUpperCase();
    }

    function formatDate(date) {
      if (!date) return "";
      if (Helper && Helper.beautyDate) {
        return Helper.beautyDate(date, " ", true);
      }
      // Fallback formatting
      try {
        const d = new Date(date);
        return d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return date;
      }
    }

    return {
      getTagType,
      getFirstChar,
      formatDate,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-log-data {
  .lv-log-item {
    padding: 2px 0;
  }

  .lv-log-tag {
    font-size: 10px;
    font-weight: 600;
    padding: 0 4px;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
  }

  .lv-log-date {
    font-size: 11px;
  }

  .lv-log-ip {
    font-size: 10px;
    font-family: "JetBrains Mono", monospace;
  }
}

.lv-log-empty {
  font-size: 11px;
}
</style>

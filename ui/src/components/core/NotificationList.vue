<template>
  <div class="lv-notification-list">
    <div class="lv-notification-header">
      <span class="lv-notification-title">
        Notifications ({{ summary.total_unread || 0 }})
      </span>
      <router-link :to="{ name: 'notifications' }" class="lv-notification-link">
        View All
      </router-link>
    </div>

    <n-tabs v-model:value="tab" type="line" size="small" animated>
      <n-tab-pane 
        v-for="(key, index) in Object.keys(list)" 
        :key="index"
        :name="key" 
        :tab="getTabLabel(key)"
      >
        <n-scrollbar style="max-height: 360px;">
          <n-list hoverable clickable v-if="list[key].length > 0">
            <n-list-item 
              v-for="(notif, i) in list[key]" 
              :key="i"
              @click="handleNotifClick(notif)"
            >
              <template #prefix>
                <n-avatar 
                  round 
                  :size="40"
                  :src="notif.creator_pic"
                >
                  {{ $Helper.getFirstChar(notif.creator) }}
                </n-avatar>
              </template>
              <n-thing
                :title="notif.title"
                :description="notif.content"
                content-style="margin-top: 4px;"
              >
                <template #header-extra>
                  <n-text depth="3" style="font-size: 12px;">
                    {{ notif.time_ago }}
                  </n-text>
                </template>
                <template #description>
                  <n-space size="small" :wrap="false">
                    <n-tag v-if="notif.category" size="tiny" :bordered="false">
                      {{ notif.category }}
                    </n-tag>
                    <n-text depth="3" style="font-size: 12px;">
                      {{ $Helper.beautyDate(notif.date, " ", true) }}
                    </n-text>
                  </n-space>
                </template>
              </n-thing>
            </n-list-item>
          </n-list>
          
          <n-spin v-if="loading" size="small" class="lv-notification-loading" />
          
          <n-empty 
            v-if="!list[key]?.length && !loading" 
            description="No notifications"
            size="small"
            class="lv-notification-empty"
          />
        </n-scrollbar>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
import { 
  NTabs, 
  NTabPane, 
  NList, 
  NListItem, 
  NAvatar, 
  NThing,
  NText,
  NTag,
  NSpace,
  NEmpty,
  NSpin,
  NScrollbar
} from "naive-ui";
import useServices from "./../../composables/Services";

export default defineComponent({
  name: "NotificationList",
  components: {
    NTabs,
    NTabPane,
    NList,
    NListItem,
    NAvatar,
    NThing,
    NText,
    NTag,
    NSpace,
    NEmpty,
    NSpin,
    NScrollbar,
  },
  emits: ["loaded"],
  setup(props, { emit }) {
    const { Config, Helper, Handler, Api } = useServices();
    const route = useRoute();
    const router = useRouter();

    const tab = ref("system");
    const loading = ref(false);
    const list = reactive({
      system: [],
      direct: [],
    });
    const summary = reactive({
      total: 0,
      total_unread: 0,
      total_unread_system: 0,
      total_unread_direct: 0,
    });

    function getTabLabel(key) {
      const count = summary[`total_unread_${key}`] || 0;
      return count > 0 ? `${key} (${count})` : key;
    }

    onMounted(() => {
      getData();
    });

    function getData() {
      loading.value = true;
      Api.get(
        `me/notifications?unread&grouping&_limit=8&max_group=4`,
        (status, data, message, full) => {
          loading.value = false;
          if (status === 200 && data) {
            list.system = data.system;
            list.direct = data.direct;
            summary.total = data.total;
            summary.total_unread = data.total_unread;
            summary.total_unread_system = data.total_unread_system;
            summary.total_unread_direct = data.total_unread_direct;

            const cb = Helper.unReactive({ summary, list });
            emit("loaded", cb);
          }
        }
      );
    }

    function makeLink(notif) {
      if (notif.link_source === "external") return notif.link_url;
      else if (notif.link_source === "frontend") return notif.link_url;
      else if (notif.link_source === "api")
        return `${Config.getApiRoot()}${notif.link_url}`;
      else return null;
    }

    function setRead(id) {
      let send = [];
      send.push(id);
      Api.put(`me/read-notifications`, send, (status, data, message, full) => {
        if (status === 200 && data) {
          //
        }
      });
    }

    function handleNotifClick(notif) {
      setRead(notif.id);
      const link = makeLink(notif);
      if (link) {
        window.open(link, "_blank");
      }
    }

    return {
      tab,
      loading,
      list,
      summary,
      getTabLabel,
      makeLink,
      setRead,
      handleNotifClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-notification-list {
  width: 360px;
  max-width: 100%;
}

.lv-notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--lv-border-color);
}

.lv-notification-title {
  font-weight: 600;
  font-size: 14px;
  color: var(--lv-text-primary);
}

.lv-notification-link {
  font-size: 13px;
  color: #6366f1;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
}

.lv-notification-loading,
.lv-notification-empty {
  padding: 32px 16px;
  display: flex;
  justify-content: center;
}

:deep(.n-tabs-nav) {
  padding: 0 16px;
}

:deep(.n-list-item) {
  padding: 12px 16px;
}
</style>

<!-- 
  LvUser.vue - Naive UI Edition
  Display user info with avatar and popup details
-->
<template>
  <span v-if="user" class="lv-user-wrapper">
    <n-popover trigger="hover" placement="bottom" :show-arrow="true">
      <template #trigger>
        <n-text class="lv-user-link">
          @{{ user.username }}
        </n-text>
      </template>
      <div class="lv-user-popup">
        <n-space vertical align="center" :size="12">
          <n-avatar 
            :size="size === 'tiny' ? 24 : 64" 
            round 
            :src="user.picture"
          >
            {{ getFirstChar(user.username) }}
          </n-avatar>
          <template v-if="user.name">
            <n-text strong>{{ user.name }}</n-text>
            <n-text depth="3">{{ user.email }}</n-text>
            <n-tag v-if="user.role_name" size="small" type="info">
              {{ user.role_name }}
            </n-tag>
          </template>
          <n-spin v-else size="small" />
        </n-space>
      </div>
    </n-popover>
  </span>
  <n-text v-else depth="3" class="lv-user-loading">...</n-text>
</template>

<script>
import { defineComponent, ref, onMounted, watchEffect } from "vue";
import { NPopover, NAvatar, NText, NSpace, NTag, NSpin } from "naive-ui";
import useServices from "../../composables/Services";

export default defineComponent({
  name: "LvUser",
  components: {
    NPopover,
    NAvatar,
    NText,
    NSpace,
    NTag,
    NSpin,
  },
  props: {
    id: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: "medium", // tiny, small, medium, large
    },
  },
  setup(props) {
    const { Api, Helper } = useServices();
    const user = ref(null);

    onMounted(() => {
      if (props.id) getDetail();
    });

    watchEffect(() => {
      if (!props.id && props.username) {
        user.value = { username: props.username };
      }
    });

    function getFirstChar(str) {
      if (!str) return "";
      return str.charAt(0).toUpperCase();
    }

    function getDetail() {
      if (!user.value?.id) {
        let param = "";
        if (props.username) param = `username=${props.username}`;
        if (props.id) param = `id=${props.id}`;

        Api.get(`app/user-profile?${param}`, (status, data) => {
          if (status === 200 && data) {
            user.value = data;
          }
        });
      }
    }

    return {
      user,
      getFirstChar,
      getDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-user-wrapper {
  display: inline-flex;
  align-items: center;
}

.lv-user-link {
  color: var(--lv-primary);
  cursor: pointer;
  font-weight: 500;
  font-size: 11px;
  
  &:hover {
    text-decoration: underline;
  }
}

.lv-user-popup {
  padding: 12px;
  min-width: 160px;
  text-align: center;
}

.lv-user-loading {
  font-size: 11px;
}
</style>

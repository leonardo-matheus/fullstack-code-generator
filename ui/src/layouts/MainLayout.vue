<template>
  <n-layout has-sider class="lv-layout">
    <!-- Sidebar -->
    <n-layout-sider
      v-if="!isTopNav"
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="260"
      :collapsed="isCollapsed"
      show-trigger
      @collapse="isCollapsed = true"
      @expand="isCollapsed = false"
      :native-scrollbar="false"
      class="lv-sider"
    >
      <div class="lv-sider-header">
        <div class="lv-logo" v-if="!isCollapsed">
          <img 
            :src="$Config.appLogoLight()" 
            alt="Logo" 
            class="lv-logo-img-large"
          />
        </div>
        <div class="lv-logo-mini" v-else>
          <img 
            :src="$Config.appLogo(true)" 
            alt="Logo" 
            class="lv-logo-img-mini"
          />
        </div>
      </div>
      
      <n-menu
        :collapsed="isCollapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="currentRoute"
        @update:value="handleMenuSelect"
        :root-indent="20"
        :indent="24"
      />
    </n-layout-sider>

    <!-- Main Content Area -->
    <n-layout class="lv-main-layout">
      <!-- Header -->
      <n-layout-header bordered class="lv-header">
        <div class="lv-header-left">
          <n-button 
            quaternary 
            circle
            @click="isCollapsed = !isCollapsed"
            class="lv-menu-toggle"
          >
            <template #icon>
              <n-icon :size="20">
                <MenuOutlined />
              </n-icon>
            </template>
          </n-button>
          
          <n-breadcrumb class="lv-breadcrumb">
            <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
              <router-link v-if="item.path" :to="item.path">
                {{ item.label }}
              </router-link>
              <span v-else>{{ item.label }}</span>
            </n-breadcrumb-item>
          </n-breadcrumb>
        </div>

        <div class="lv-header-right">
          <!-- Theme Toggle -->
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button quaternary circle @click="toggleTheme">
                <template #icon>
                  <n-icon :size="18">
                    <SunnyOutline v-if="!isDark" />
                    <MoonOutline v-else />
                  </n-icon>
                </template>
              </n-button>
            </template>
            {{ themeName }}
          </n-tooltip>

          <!-- Notifications -->
          <n-popover trigger="click" placement="bottom-end" :width="360">
            <template #trigger>
              <n-badge :value="unreadCount" :max="99" :show="unreadCount > 0">
                <n-button quaternary circle>
                  <template #icon>
                    <n-icon :size="18">
                      <NotificationsOutline />
                    </n-icon>
                  </template>
                </n-button>
              </n-badge>
            </template>
            <notification-list />
          </n-popover>

          <!-- User Dropdown -->
          <n-dropdown 
            trigger="click" 
            :options="userMenuOptions"
            @select="handleUserMenuSelect"
          >
            <n-button quaternary class="lv-user-button">
              <n-avatar 
                :size="32" 
                round
                :src="userInfo?.avatar"
                class="lv-user-avatar"
              >
                {{ userInfo?.name?.charAt(0) || 'U' }}
              </n-avatar>
              <span class="lv-user-name">{{ userInfo?.name || 'User' }}</span>
              <n-icon :size="16">
                <ChevronDownOutline />
              </n-icon>
            </n-button>
          </n-dropdown>
        </div>
      </n-layout-header>

      <!-- Page Content -->
      <n-layout-content 
        content-style="padding: 24px;" 
        :native-scrollbar="false"
        class="lv-content"
      >
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script>
import { defineComponent, ref, computed, onMounted, h } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NMenu,
  NButton,
  NIcon,
  NBreadcrumb,
  NBreadcrumbItem,
  NDropdown,
  NAvatar,
  NBadge,
  NPopover,
  NTooltip,
} from "naive-ui";
import {
  MenuOutline as MenuOutlined,
  SunnyOutline,
  MoonOutline,
  NotificationsOutline,
  ChevronDownOutline,
  PersonOutline,
  SettingsOutline,
  LogOutOutline,
  HomeOutline,
  PeopleOutline,
  KeyOutline,
  GridOutline,
  BuildOutline,
  LayersOutline,
} from "@vicons/ionicons5";
import useServices from "../composables/Services";
import { useTheme } from "../composables/useTheme";

// Icon renderer helper
const renderIcon = (icon) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};

export default defineComponent({
  name: "MainLayout",
  components: {
    NLayout,
    NLayoutSider,
    NLayoutHeader,
    NLayoutContent,
    NMenu,
    NButton,
    NIcon,
    NBreadcrumb,
    NBreadcrumbItem,
    NDropdown,
    NAvatar,
    NBadge,
    NPopover,
    NTooltip,
    MenuOutlined,
    SunnyOutline,
    MoonOutline,
    NotificationsOutline,
    ChevronDownOutline,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const { GlobalStore, Helper, Api } = useServices();
    const { isDark, themeName, toggleTheme } = useTheme();

    const isCollapsed = ref(false);
    const isTopNav = ref(false);
    const unreadCount = ref(0);

    // User info
    const userInfo = computed(() => GlobalStore.getUserInfo);

    // Current route for menu highlight
    const currentRoute = computed(() => route.name);

    // Breadcrumbs
    const breadcrumbs = computed(() => {
      const crumbs = [{ label: "Home", path: "/" }];
      if (route.name && route.name !== "home") {
        const name = String(route.name);
        crumbs.push({
          label: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " "),
          path: route.path,
        });
      }
      return crumbs;
    });

    // Menu options for Naive UI Menu
    const menuOptions = computed(() => {
      return [
        {
          label: "Dashboard",
          key: "home",
          icon: renderIcon(HomeOutline),
        },
        {
          type: "divider",
          key: "d1",
        },
        {
          label: "Users",
          key: "users",
          icon: renderIcon(PeopleOutline),
        },
        {
          label: "Permissions",
          key: "permissions",
          icon: renderIcon(KeyOutline),
        },
        {
          label: "Roles",
          key: "roles",
          icon: renderIcon(LayersOutline),
          children: [
            {
              label: "All Roles",
              key: "roles",
            },
            {
              label: "Role Groups",
              key: "role-groups",
            },
            {
              label: "Role Permissions",
              key: "role-permissions",
            },
          ],
        },
        {
          type: "divider",
          key: "d2",
        },
        {
          label: "Settings",
          key: "metas",
          icon: renderIcon(SettingsOutline),
        },
        {
          label: "Generator",
          key: "generator",
          icon: renderIcon(BuildOutline),
        },
        {
          label: "Components",
          key: "example",
          icon: renderIcon(GridOutline),
        },
      ];
    });

    // User menu options
    const userMenuOptions = [
      {
        label: "Profile",
        key: "profile",
        icon: renderIcon(PersonOutline),
      },
      {
        label: "Settings",
        key: "settings",
        icon: renderIcon(SettingsOutline),
      },
      {
        type: "divider",
        key: "d1",
      },
      {
        label: "Logout",
        key: "logout",
        icon: renderIcon(LogOutOutline),
      },
    ];

    // Handle menu selection
    function handleMenuSelect(key) {
      router.push({ name: key });
    }

    // Handle user menu selection
    function handleUserMenuSelect(key) {
      switch (key) {
        case "profile":
          router.push({ name: "update-profile" });
          break;
        case "settings":
          router.push({ name: "settings" });
          break;
        case "logout":
          Helper.removeLdb("token");
          Helper.removeLdb("userInfo");
          router.push({ name: "login" });
          break;
      }
    }

    // Fetch notifications count
    function fetchNotifications() {
      Api.get("me/notifications/unread-count", (status, data) => {
        if (status === 200) {
          unreadCount.value = data?.count || 0;
        }
      });
    }

    onMounted(() => {
      fetchNotifications();
    });

    return {
      isCollapsed,
      isTopNav,
      menuOptions,
      userMenuOptions,
      currentRoute,
      breadcrumbs,
      userInfo,
      unreadCount,
      isDark,
      themeName,
      toggleTheme,
      handleMenuSelect,
      handleUserMenuSelect,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-layout {
  min-height: 100vh;
}

.lv-sider {
  background: var(--lv-bg-secondary);
}

.lv-sider-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid var(--lv-border-color);
  padding: 0 16px;
}

.lv-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  
  &-img-large {
    width: 180px;
    height: 48px;
    object-fit: contain;
  }
}

.lv-logo-mini {
  .lv-logo-img-mini {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
}

.lv-main-layout {
  background: var(--lv-bg-primary);
}

.lv-header {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  background: var(--lv-bg-secondary);
}

.lv-header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.lv-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.lv-menu-toggle {
  display: flex;
}

.lv-breadcrumb {
  display: none;
  
  @media (min-width: 768px) {
    display: flex;
  }
}

.lv-user-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px 4px 4px;
  border-radius: 24px;
  
  &:hover {
    background: var(--lv-bg-tertiary);
  }
}

.lv-user-avatar {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-weight: 600;
}

.lv-user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--lv-text-primary);
  
  @media (max-width: 768px) {
    display: none;
  }
}

.lv-content {
  min-height: calc(100vh - 64px);
}

// Page transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

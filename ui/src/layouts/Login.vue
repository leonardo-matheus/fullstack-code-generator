<template>
  <div class="lv-login-page">
    <div class="lv-login-container">
      <!-- Left side - Branding -->
      <div class="lv-login-branding">
        <div class="lv-branding-content">
          <div class="lv-branding-logo">
            <n-icon :size="64" color="#6366f1">
              <CodeSlashOutline />
            </n-icon>
          </div>
          <h1 class="lv-branding-title">Lavarel</h1>
          <p class="lv-branding-subtitle">
            Fullstack Code Generator
          </p>
          <div class="lv-branding-features">
            <div class="lv-feature">
              <n-icon :size="20" color="#10b981">
                <CheckmarkCircleOutline />
              </n-icon>
              <span>Laravel + Vue.js</span>
            </div>
            <div class="lv-feature">
              <n-icon :size="20" color="#10b981">
                <CheckmarkCircleOutline />
              </n-icon>
              <span>Auto CRUD Generation</span>
            </div>
            <div class="lv-feature">
              <n-icon :size="20" color="#10b981">
                <CheckmarkCircleOutline />
              </n-icon>
              <span>Role-Based Permissions</span>
            </div>
          </div>
        </div>
        <div class="lv-branding-decoration"></div>
      </div>

      <!-- Right side - Login Form -->
      <div class="lv-login-form-wrapper">
        <div class="lv-login-form-container">
          <!-- Theme Toggle -->
          <div class="lv-login-header">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button quaternary circle @click="toggleTheme" size="small">
                  <template #icon>
                    <n-icon :size="18">
                      <SunnyOutline v-if="!isDark" />
                      <MoonOutline v-else />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              Toggle Theme
            </n-tooltip>
          </div>

          <!-- Logo -->
          <div class="lv-login-logo">
            <n-avatar 
              :size="72" 
              round
              :src="appLogo"
              class="lv-login-avatar"
            >
              <n-icon :size="36">
                <PersonOutline />
              </n-icon>
            </n-avatar>
          </div>

          <h2 class="lv-login-title">Welcome back</h2>
          <p class="lv-login-subtitle">
            Sign in to continue to {{ appName }}
          </p>

          <!-- Login Form -->
          <n-form 
            ref="formRef" 
            :model="dataModel" 
            :rules="rules"
            @submit.prevent="login"
          >
            <n-form-item path="email" :label="useUsername ? 'Username' : 'Email'">
              <n-input
                v-model:value="dataModel.email"
                :placeholder="useUsername ? 'Enter your username' : 'Enter your email'"
                size="large"
                :input-props="{ autocomplete: 'email' }"
              >
                <template #prefix>
                  <n-icon :size="18" color="#94a3b8">
                    <MailOutline v-if="!useUsername" />
                    <PersonOutline v-else />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>

            <n-form-item path="password" label="Password">
              <n-input
                v-model:value="dataModel.password"
                type="password"
                show-password-on="click"
                placeholder="Enter your password"
                size="large"
                :input-props="{ autocomplete: 'current-password' }"
              >
                <template #prefix>
                  <n-icon :size="18" color="#94a3b8">
                    <LockClosedOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>

            <div class="lv-login-options">
              <n-switch v-model:value="useUsername" size="small">
                <template #checked>Username</template>
                <template #unchecked>Email</template>
              </n-switch>
            </div>

            <n-button
              type="primary"
              block
              size="large"
              :loading="loading"
              attr-type="submit"
              class="lv-login-button"
            >
              <template #icon>
                <n-icon>
                  <LogInOutline />
                </n-icon>
              </template>
              Sign In
            </n-button>
          </n-form>

          <!-- Version Info -->
          <div class="lv-login-footer">
            <n-text depth="3" class="lv-version-text">
              App v.{{ $Config.version() }}
              <span v-if="version"> · Backend v.{{ version }}</span>
            </n-text>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSwitch,
  NAvatar,
  NIcon,
  NText,
  NTooltip,
  useMessage,
} from "naive-ui";
import {
  MailOutline,
  PersonOutline,
  LockClosedOutline,
  LogInOutline,
  CodeSlashOutline,
  CheckmarkCircleOutline,
  SunnyOutline,
  MoonOutline,
} from "@vicons/ionicons5";
import useServices from "../composables/Services";
import { useTheme } from "../composables/useTheme";

export default defineComponent({
  name: "Login",
  components: {
    NForm,
    NFormItem,
    NInput,
    NButton,
    NSwitch,
    NAvatar,
    NIcon,
    NText,
    NTooltip,
    MailOutline,
    PersonOutline,
    LockClosedOutline,
    LogInOutline,
    CodeSlashOutline,
    CheckmarkCircleOutline,
    SunnyOutline,
    MoonOutline,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const message = useMessage();
    const { Config, Handler, Helper, Api } = useServices();
    const { isDark, toggleTheme } = useTheme();
    
    const formRef = ref(null);
    const dataModel = ref({
      email: "",
      password: "",
    });

    const loading = ref(false);
    const useUsername = ref(false);
    const version = ref(null);
    const company = ref(null);

    const rules = {
      email: {
        required: true,
        message: useUsername.value ? "Please enter username" : "Please enter email",
        trigger: ["input", "blur"],
      },
      password: {
        required: true,
        message: "Please enter password",
        trigger: ["input", "blur"],
      },
    };

    onMounted(() => {
      getVersion();
      getSetting();

      if (route.query.e === "miss-apiroot") {
        Config.setApiRoot(
          "Your Api Root configuration is missing",
          "/login"
        );
      }
    });

    const appName = computed(() => {
      return company.value?.list?.app_name?.value || Config.appName();
    });

    const appLogo = computed(() => {
      return company.value?.list?.url_logo?.value || Config.appLogo();
    });

    function auth() {
      if (route.query.resume) {
        window.location = route.query.resume;
      } else {
        router.push({ name: "home" });
      }
    }

    function login() {
      formRef.value?.validate((errors) => {
        if (errors) return;
        
        loading.value = true;

        let send = { password: dataModel.value.password };
        if (useUsername.value) send.username = dataModel.value.email;
        else send.email = dataModel.value.email;

        Api.post("app/login", send, (status, data, msg) => {
          loading.value = false;
          if (status === 200) {
            data.permissions = Handler.makePermissions(data.permissions);
            Config.credentials(data);
            message.success("Login successful!");
            auth();
          } else {
            message.error(msg || "Login failed");
          }
        });
      });
    }

    function getVersion() {
      Api.get("app/version", (status, data) => {
        if (status === 200) version.value = data;
      });
    }

    function getSetting() {
      Api.get("app/settings?module=company", (status, data) => {
        if (status === 200) company.value = data;
      });
    }

    return {
      formRef,
      dataModel,
      rules,
      useUsername,
      version,
      loading,
      appName,
      appLogo,
      isDark,
      toggleTheme,
      login,
    };
  },
});
</script>

<style lang="scss" scoped>
.lv-login-page {
  min-height: 100vh;
  background: var(--lv-bg-primary);
}

.lv-login-container {
  display: flex;
  min-height: 100vh;
}

.lv-login-branding {
  display: none;
  flex: 1;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  position: relative;
  overflow: hidden;
  
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.lv-branding-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 48px;
  color: white;
}

.lv-branding-logo {
  margin-bottom: 24px;
  
  :deep(.n-icon) {
    color: white !important;
  }
}

.lv-branding-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}

.lv-branding-subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0 0 48px;
}

.lv-branding-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  text-align: left;
  max-width: 280px;
  margin: 0 auto;
}

.lv-feature {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  
  :deep(.n-icon) {
    color: rgba(255, 255, 255, 0.9) !important;
  }
}

.lv-branding-decoration {
  position: absolute;
  bottom: -200px;
  right: -200px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.lv-login-form-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--lv-bg-secondary);
  
  @media (min-width: 768px) {
    max-width: 480px;
  }
}

.lv-login-form-container {
  width: 100%;
  max-width: 360px;
}

.lv-login-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 32px;
}

.lv-login-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.lv-login-avatar {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.lv-login-title {
  font-size: 28px;
  font-weight: 600;
  text-align: center;
  margin: 0 0 8px;
  color: var(--lv-text-primary);
}

.lv-login-subtitle {
  font-size: 15px;
  text-align: center;
  color: var(--lv-text-secondary);
  margin: 0 0 32px;
}

.lv-login-options {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
}

.lv-login-button {
  height: 48px;
  font-size: 15px;
  font-weight: 500;
  margin-top: 8px;
}

.lv-login-footer {
  text-align: center;
  margin-top: 32px;
}

.lv-version-text {
  font-size: 12px;
}
</style>

<template>
  <n-config-provider 
    :theme="naiveTheme" 
    :theme-overrides="themeOverrides"
    :locale="locale"
    :date-locale="dateLocale"
  >
    <n-global-style />
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <n-loading-bar-provider>
            <router-view />
          </n-loading-bar-provider>
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script>
import { defineComponent, computed } from "vue";
import { 
  NConfigProvider, 
  NGlobalStyle,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  NLoadingBarProvider,
  ptBR,
  datePtBR
} from "naive-ui";
import { useTheme, laravelThemeOverrides, laravelDarkThemeOverrides } from "./composables/useTheme";

export default defineComponent({
  name: "App",
  components: {
    NConfigProvider,
    NGlobalStyle,
    NMessageProvider,
    NNotificationProvider,
    NDialogProvider,
    NLoadingBarProvider,
  },
  setup() {
    const { naiveTheme, isDark } = useTheme();

    // Theme overrides based on current theme
    const themeOverrides = computed(() => {
      return isDark.value ? laravelDarkThemeOverrides : laravelThemeOverrides;
    });

    return {
      naiveTheme,
      themeOverrides,
      locale: ptBR,
      dateLocale: datePtBR,
    };
  },
});
</script>

<style lang="scss">
// Import modern fonts
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap');

// CSS Variables for theming
:root {
  --lv-font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --lv-font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  
  // Light theme
  --lv-bg-primary: #f8fafc;
  --lv-bg-secondary: #ffffff;
  --lv-bg-tertiary: #f1f5f9;
  --lv-text-primary: #1e293b;
  --lv-text-secondary: #475569;
  --lv-text-muted: #94a3b8;
  --lv-border-color: #e2e8f0;
  --lv-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --lv-shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.1);
}

body.dark {
  --lv-bg-primary: #0f172a;
  --lv-bg-secondary: #1e293b;
  --lv-bg-tertiary: #334155;
  --lv-text-primary: #f1f5f9;
  --lv-text-secondary: #cbd5e1;
  --lv-text-muted: #64748b;
  --lv-border-color: #334155;
  --lv-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  --lv-shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.4);
}

// Global styles
* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  padding: 0;
  font-family: var(--lv-font-family);
  font-size: 14px;
  line-height: 1.6;
  background-color: var(--lv-bg-primary);
  color: var(--lv-text-primary);
  transition: background-color 0.2s ease, color 0.2s ease;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

// Scrollbar styling
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--lv-bg-tertiary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--lv-text-muted);
  border-radius: 4px;
  
  &:hover {
    background: var(--lv-text-secondary);
  }
}

// Selection styling
::selection {
  background-color: rgba(99, 102, 241, 0.3);
  color: inherit;
}

// Code blocks
code, pre {
  font-family: var(--lv-font-mono);
}

// Focus outline
:focus-visible {
  outline: 2px solid #6366f1;
  outline-offset: 2px;
}

// Smooth transitions
a, button, input, select, textarea {
  transition: all 0.15s ease;
}

// Link styling
a {
  color: #6366f1;
  text-decoration: none;
  
  &:hover {
    color: #818cf8;
  }
}
</style>

/**
 * Lavarel Theme Composable
 * 
 * Manages Dark Mode with Naive UI integration.
 * Supports OS theme detection and manual toggle.
 */
import { computed, watch, ref, onMounted } from "vue";
import { darkTheme, useOsTheme } from "naive-ui";
import { Helper } from "../services/Helper";
import { useGlobalStore } from "../store/GlobalStore";

// Theme state
const themeMode = ref("system"); // 'light', 'dark', 'system'

/**
 * useTheme composable
 * Provides reactive theme management with Naive UI integration
 */
export function useTheme() {
  const store = useGlobalStore();
  const osTheme = useOsTheme();

  // Initialize theme from localStorage
  onMounted(() => {
    const savedTheme = Helper.getLdb("themeMode");
    if (savedTheme) {
      themeMode.value = savedTheme;
    }
  });

  // Computed: Is dark mode active?
  const isDark = computed(() => {
    if (themeMode.value === "system") {
      return osTheme.value === "dark";
    }
    return themeMode.value === "dark";
  });

  // Computed: Naive UI theme object
  const naiveTheme = computed(() => {
    return isDark.value ? darkTheme : null;
  });

  // Computed: Theme name for display
  const themeName = computed(() => {
    if (themeMode.value === "system") {
      return `System (${osTheme.value})`;
    }
    return themeMode.value === "dark" ? "Dark" : "Light";
  });

  // Theme toggle function
  function toggleTheme() {
    if (themeMode.value === "light") {
      themeMode.value = "dark";
    } else if (themeMode.value === "dark") {
      themeMode.value = "system";
    } else {
      themeMode.value = "light";
    }
    Helper.saveLdb("themeMode", themeMode.value);
    store.setDarkMode(isDark.value);
  }

  // Set specific theme
  function setTheme(mode) {
    themeMode.value = mode;
    Helper.saveLdb("themeMode", mode);
    store.setDarkMode(isDark.value);
  }

  // Watch for OS theme changes when in system mode
  watch(osTheme, (newVal) => {
    if (themeMode.value === "system") {
      store.setDarkMode(newVal === "dark");
    }
  });

  // Watch theme mode changes
  watch(isDark, (newVal) => {
    store.setDarkMode(newVal);
    // Apply body class for global styling
    if (newVal) {
      document.body.classList.add("dark");
      document.body.classList.remove("light");
    } else {
      document.body.classList.add("light");
      document.body.classList.remove("dark");
    }
  }, { immediate: true });

  return {
    themeMode,
    isDark,
    naiveTheme,
    themeName,
    osTheme,
    toggleTheme,
    setTheme,
  };
}

// Theme overrides for Lavarel brand
export const laravelThemeOverrides = {
  common: {
    // Primary colors - Modern blue-violet gradient feel
    primaryColor: "#6366f1",
    primaryColorHover: "#818cf8",
    primaryColorPressed: "#4f46e5",
    primaryColorSuppl: "#a5b4fc",
    
    // Info colors
    infoColor: "#06b6d4",
    infoColorHover: "#22d3ee",
    infoColorPressed: "#0891b2",
    
    // Success colors
    successColor: "#10b981",
    successColorHover: "#34d399",
    successColorPressed: "#059669",
    
    // Warning colors
    warningColor: "#f59e0b",
    warningColorHover: "#fbbf24",
    warningColorPressed: "#d97706",
    
    // Error colors
    errorColor: "#ef4444",
    errorColorHover: "#f87171",
    errorColorPressed: "#dc2626",
    
    // Text colors
    textColorBase: "#1e293b",
    textColor1: "#1e293b",
    textColor2: "#475569",
    textColor3: "#94a3b8",
    
    // Border radius - Modern rounded corners
    borderRadius: "8px",
    borderRadiusSmall: "6px",
    
    // Font
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    fontSize: "14px",
    fontSizeMini: "12px",
    fontSizeTiny: "12px",
    fontSizeSmall: "13px",
    fontSizeMedium: "14px",
    fontSizeLarge: "15px",
    fontSizeHuge: "16px",
    
    // Heights
    heightMini: "28px",
    heightTiny: "32px",
    heightSmall: "36px",
    heightMedium: "40px",
    heightLarge: "44px",
    heightHuge: "48px",
  },
  Button: {
    fontWeight: "500",
    borderRadiusMedium: "8px",
    borderRadiusSmall: "6px",
    borderRadiusLarge: "10px",
  },
  Card: {
    borderRadius: "12px",
    paddingMedium: "20px",
    paddingLarge: "24px",
  },
  Input: {
    borderRadius: "8px",
  },
  DataTable: {
    borderRadius: "12px",
    thColor: "#f8fafc",
    thTextColor: "#475569",
    thFontWeight: "600",
    tdColor: "#ffffff",
    tdColorHover: "#f1f5f9",
    tdColorStriped: "#f8fafc",
  },
  Menu: {
    borderRadius: "8px",
    itemBorderRadius: "6px",
  },
  Dropdown: {
    borderRadius: "10px",
    optionBorderRadius: "6px",
  },
  Message: {
    borderRadius: "10px",
  },
  Notification: {
    borderRadius: "12px",
  },
  Dialog: {
    borderRadius: "16px",
  },
  Modal: {
    borderRadius: "16px",
  },
  Drawer: {
    borderRadius: "0",
  },
  Tag: {
    borderRadius: "6px",
  },
  Badge: {
    fontSize: "11px",
  },
  Avatar: {
    borderRadius: "10px",
  },
  Tooltip: {
    borderRadius: "8px",
  },
  Popover: {
    borderRadius: "10px",
  },
  Select: {
    borderRadius: "8px",
  },
  Pagination: {
    itemBorderRadius: "6px",
  },
  Tabs: {
    tabBorderRadius: "8px 8px 0 0",
  },
  Switch: {
    railBorderRadiusMedium: "12px",
    railBorderRadiusSmall: "10px",
    railBorderRadiusLarge: "14px",
  },
};

// Dark theme overrides
export const laravelDarkThemeOverrides = {
  ...laravelThemeOverrides,
  common: {
    ...laravelThemeOverrides.common,
    // Dark mode specific text colors
    textColorBase: "#e2e8f0",
    textColor1: "#f1f5f9",
    textColor2: "#cbd5e1",
    textColor3: "#64748b",
    
    // Dark backgrounds
    bodyColor: "#0f172a",
    cardColor: "#1e293b",
    modalColor: "#1e293b",
    popoverColor: "#1e293b",
    tableColor: "#1e293b",
    
    // Dark borders
    borderColor: "#334155",
    dividerColor: "#334155",
  },
  DataTable: {
    ...laravelThemeOverrides.DataTable,
    thColor: "#1e293b",
    thTextColor: "#94a3b8",
    tdColor: "#0f172a",
    tdColorHover: "#1e293b",
    tdColorStriped: "#1e293b",
  },
};

export default useTheme;

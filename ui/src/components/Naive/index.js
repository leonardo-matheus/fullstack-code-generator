/**
 * Lavarel Naive UI Components
 * 
 * Modern UI components built on top of Naive UI
 * Designed for programmer-friendly aesthetics
 */

// Core Components
export { default as LvInput } from "./LvInput.vue";
export { default as LvBtn } from "./LvBtn.vue";
export { default as LvSelect } from "./LvSelect.vue";
export { default as LvTable } from "./LvTable.vue";
export { default as LvCard } from "./LvCard.vue";
export { default as LvContainer } from "./LvContainer.vue";
export { default as LvHeaderPage } from "./LvHeaderPage.vue";
export { default as LvDisplayer } from "./LvDisplayer.vue";
export { default as LvLoading } from "./LvLoading.vue";
export { default as LvModal } from "./LvModal.vue";
export { default as LvLogData } from "./LvLogData.vue";
export { default as LvUser } from "./LvUser.vue";

// Base Components (New)
export { default as LvDivider } from "./LvDivider.vue";
export { default as LvBadge } from "./LvBadge.vue";
export { default as LvAvatar } from "./LvAvatar.vue";
export { default as LvEmpty } from "./LvEmpty.vue";
export { default as LvProgress } from "./LvProgress.vue";
export { default as LvSkeleton } from "./LvSkeleton.vue";
export { default as LvTooltip } from "./LvTooltip.vue";
export { default as LvTag } from "./LvTag.vue";

// Re-export Naive UI components that are commonly used
export {
  // Layout
  NLayout,
  NLayoutSider,
  NLayoutHeader,
  NLayoutContent,
  NLayoutFooter,
  
  // Navigation
  NMenu,
  NBreadcrumb,
  NBreadcrumbItem,
  NDropdown,
  NTabs,
  NTab,
  NTabPane,
  
  // Data Entry
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NInputGroup,
  NSelect,
  NSwitch,
  NCheckbox,
  NCheckboxGroup,
  NRadio,
  NRadioGroup,
  NDatePicker,
  NTimePicker,
  NUpload,
  NSlider,
  NRate,
  NColorPicker,
  NCascader,
  NTreeSelect,
  NMention,
  NAutoComplete,
  NDynamicInput,
  NDynamicTags,
  
  // Data Display
  NDataTable,
  NDescriptions,
  NDescriptionsItem,
  NTable,
  NTree,
  NTag,
  NBadge,
  NAvatar,
  NAvatarGroup,
  NImage,
  NImageGroup,
  NCalendar,
  NStatistic,
  NCountdown,
  NNumberAnimation,
  NCode,
  NText,
  NH1,
  NH2,
  NH3,
  NH4,
  NH5,
  NH6,
  NP,
  NBlockquote,
  NOl,
  NUl,
  NLi,
  
  // Feedback
  NAlert,
  NProgress,
  NResult,
  NSpin,
  NSkeleton,
  NEmpty,
  
  // Overlay
  NModal,
  NDrawer,
  NDrawerContent,
  NPopover,
  NTooltip,
  NPopconfirm,
  
  // General
  NButton,
  NButtonGroup,
  NIcon,
  NCard,
  NCollapse,
  NCollapseItem,
  NDivider,
  NGrid,
  NGi,
  NSpace,
  NScrollbar,
  NAffix,
  NAnchor,
  NAnchorLink,
  NBackTop,
  NFloatButton,
  NFloatButtonGroup,
  
  // Utilities
  NConfigProvider,
  NGlobalStyle,
  NMessageProvider,
  NNotificationProvider,
  NDialogProvider,
  NLoadingBarProvider,
  
  // Composables
  useMessage,
  useNotification,
  useDialog,
  useLoadingBar,
  useThemeVars,
  useOsTheme,
  
  // Theme
  darkTheme,
  lightTheme,
} from "naive-ui";

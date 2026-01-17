import { boot } from "quasar/wrappers";
import naive from "naive-ui";

// Naive UI Icons
import { NIcon } from "naive-ui";

// Lavarel Naive UI Components
import {
  LvInput,
  LvBtn,
  LvSelect,
  LvTable,
  LvCard,
  LvContainer,
  LvHeaderPage,
  LvDisplayer,
  LvLoading,
  LvModal,
  LvLogData,
  LvUser,
  // Base Components
  LvDivider,
  LvBadge,
  LvAvatar,
  LvEmpty,
  LvProgress,
  LvSkeleton,
  LvTooltip,
  LvTag,
} from "../components/Naive";

// Lavarel Credit Card Component
import LvCreditCard from "../components/Lavarel/LvCreditCard.vue";

export default boot(async ({ app }) => {
  // Register Naive UI globally
  app.use(naive);
  
  // Register NIcon globally for easy access
  app.component("n-icon", NIcon);
  
  // Register Lavarel Naive UI components globally
  app.component("lv-input", LvInput);
  app.component("lv-btn", LvBtn);
  app.component("lv-select", LvSelect);
  app.component("lv-table", LvTable);
  app.component("lv-card", LvCard);
  app.component("lv-container", LvContainer);
  app.component("lv-header-page", LvHeaderPage);
  app.component("lv-displayer", LvDisplayer);
  app.component("lv-loading", LvLoading);
  app.component("lv-modal", LvModal);
  app.component("lv-log-data", LvLogData);
  app.component("lv-user", LvUser);
  app.component("lv-credit-card", LvCreditCard);
  
  // Base Components
  app.component("lv-divider", LvDivider);
  app.component("lv-badge", LvBadge);
  app.component("lv-avatar", LvAvatar);
  app.component("lv-empty", LvEmpty);
  app.component("lv-progress", LvProgress);
  app.component("lv-skeleton", LvSkeleton);
  app.component("lv-tooltip", LvTooltip);
  app.component("lv-tag", LvTag);
});

// Export commonly used components for manual imports
export { naive };

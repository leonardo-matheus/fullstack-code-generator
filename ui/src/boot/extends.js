import { boot } from "quasar/wrappers";
import { createPinia } from "pinia";

// Services
import { Handler } from "./../services/Handler";
import { Helper } from "./../services/Helper";
import { Config } from "./../Config";
import Api from "./../services/Api";

// Core Components (legacy - keeping for compatibility)
import Echo from "../components/core/Echo";
import NotificationList from "../components/core/NotificationList";

const pinia = createPinia();

export default boot(async ({ app }) => {
  // Legacy Core Components
  app.component("echo", Echo);
  app.component("notification-list", NotificationList);

  // Naive UI Components são registrados em naive.js

  // Services
  app.config.globalProperties.$Api = new Api();
  app.config.globalProperties.$Handler = Handler;
  app.config.globalProperties.$Helper = Helper;
  app.config.globalProperties.$Config = Config;
  app.use(pinia);

  // Auto register globals components
  const globalComponents = require.context(
    "../components/globals", // The relative path of the components folder
    false, // Whether or not to look in subfolders
    /[A-Z]\w+\.(vue|js)$/ // The regular expression used to match base component filenames
  );

  const registerGlobalComponents = (app) =>
    globalComponents.keys().forEach((fileName) => {
      const uppercaseToStrip = (text) => {
        return text
          .replace(/(.)([A-Z][a-z]+)/, "$1-$2")
          .replace(/([a-z0-9])([A-Z])/, "$1-$2")
          .toLowerCase();
      };
      const componentConfig = globalComponents(fileName);
      const componentName = fileName
        .split("/")
        .pop()
        .replace(/\.\w+$/, ""); // Get PascalCase name of component
      const tagName = uppercaseToStrip(componentName);
      app.component(tagName, componentConfig.default || componentConfig);
    });

  registerGlobalComponents(app);
});

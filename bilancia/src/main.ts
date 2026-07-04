import { createApp } from "vue";
import * as Sentry from "@sentry/vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: import.meta.env.MODE === "development" ? 1.0 : 0.2,
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/vue/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: []
  },
  integrations: [Sentry.browserTracingIntegration({ router })],
  enableLogs: true,
});

app.use(router).mount("#app");

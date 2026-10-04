import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "mate",

  brand: {
    primaryColor: "#4265CC"
  },

  permissions: [
    { name: "camera", access: "access" },
    { name: "photos", access: "read" },
  ],

  webBundleDir: "dist",

  webView: {
    pullToRefreshEnabled: false,
    overScrollMode: "never",
  },
});

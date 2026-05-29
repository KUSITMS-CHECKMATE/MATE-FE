import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "mate",
  brand: {
    displayName: "메이트",
    primaryColor: "#4265CC",
    icon: "https://static.toss.im/appsintoss/33213/ac1b1d5e-c6d7-4943-9236-fcbd2bc825c0.png",
  },
  web: {
    host: "localhost",
    port: 5173,
    commands: {
      dev: "vite",
      build: "tsc -b && vite build",
    },
  },
  permissions: [
    { name: "camera", access: "access" },
    { name: "photos", access: "read" },
  ],
  outdir: "dist",
  webViewProps: {
    pullToRefreshEnabled: false,
    overScrollMode: "never",
  },
});

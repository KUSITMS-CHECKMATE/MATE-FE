import { defineConfig } from "@apps-in-toss/web-framework/config";

export default defineConfig({
  appName: "mate",
  brand: {
    displayName: "mate", // 화면에 노출될 앱의 한글 이름으로 바꿔주세요.
    primaryColor: "#4265CC", // 화면에 노출될 앱의 기본 색상으로 바꿔주세요.
    icon: "/vite.svg", // 화면에 노출될 앱의 아이콘 이미지 주소로 바꿔주세요.
  },
  web: {
    host: "10.50.33.85",
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
});

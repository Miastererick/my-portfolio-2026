/**
 * 由 `app/globals.css` 的 `@config "../tailwind.config.js"` 加载；`@theme inline` 仍用于颜色等。
 * 若单独使用本文件，请确保 CSS 中存在对应的 `@config` 路径。
 *
 * @see https://tailwindcss.com/docs/configuration
 */
/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        /**
         * 拉丁优先用 Next.js 注入的 Inter（--font-inter），其后为系统 UI 与中文字体回退（macOS / Windows）。
         * 若项目使用其它 CSS 变量，可将首项改为 var(--font-custom)。
         */
        custom: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          '"微软雅黑"',
          "sans-serif",
        ],
        /** 全局 UI：--font-sans（HONOR Sans CN + Inter + 回退），见 app/globals.css :root */
        sans: ["var(--font-sans)"],
        /** 英文衬线：--font-serif（Adobe Jenson + 回退） */
        serif: ["var(--font-serif)"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        matrixFlicker: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "0.8" },
        },
        waveStretch: {
          "0%, 100%": { transform: "scaleY(0.35)" },
          "50%": { transform: "scaleY(1)" },
        },
        rippleDrift: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        dashFlow: {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "-220" },
        },
        spectrumPulse: {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        marquee: "marquee 42s linear infinite",
        "matrix-flicker": "matrixFlicker 2.4s ease-in-out infinite",
        "wave-stretch": "waveStretch 1.8s ease-in-out infinite",
        "ripple-drift": "rippleDrift 2.2s ease-in-out infinite",
        "dash-flow": "dashFlow 9s linear infinite",
        "spectrum-pulse": "spectrumPulse 1.4s ease-in-out infinite",
      },
    },
  },
};

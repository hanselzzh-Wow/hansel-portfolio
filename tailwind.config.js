/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        // Instrument Serif 细而有姿态，专给超大标题；中文回落宋体，正好是编辑排版的语言。
        display: ['"Instrument Serif"', '"Songti SC"', '"Noto Serif SC"', 'Georgia', 'serif'],
        // 刻意避开 Inter / Roboto / Open Sans —— 那三个是 AI 生成站的默认指纹。
        sans: ['"DM Sans"', '"PingFang SC"', '"Hiragino Sans GB"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"SF Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        // 一个强调色 + 一组灰度，没有渐变。
        cinnabar: '#A63D2A',   // 朱砂，像纸上的朱批
        paper: '#FBF9F5',
        ink: '#1F1D1B',
        rule: '#DCD5C9',       // 分隔线
      },
      maxWidth: {
        prose: '34rem',
      },
    },
  },
  plugins: [],
}

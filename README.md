# hansel-portfolio

个人网站源码。线上：https://www.hanselzhang.com

React + Vite + Tailwind 的静态站，中英双语，深浅色，构建产物部署在 GitHub Pages。

## 开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产出 dist/
npm run lint
```

## 结构

| 路径 | 说明 |
| --- | --- |
| `src/content.js` | 全部文案，中英并列。改内容只动这里 |
| `src/App.jsx` | 渲染 |
| `src/LiveDevice.jsx` | 真机演示的嵌入组件 |
| `src/index.css` | 自定义样式 |
| `public/` | 截图、PDF、图标 |

`content.js` 里 `exp.items[]` 和 `proj.items[]` 倒序排列，`sidenotes[]` 渲染成版心右侧的边注。

## 真机演示

Artemi 那一节嵌了 appetize.io 上的 iOS 模拟器，跑的是真实构建。配置在 `content.js` 的 `liveDemo`：

```js
artemi: {
  publicKey: 'xxx',        // 分享链接 appetize.io/embed/<这一段>
  poster: 'artemi/health.jpg',
  device: 'iphone16pro',
  language: 'zh-CN',       // 不指定的话模拟器起英文
  sessionSeconds: 180,     // 与所在档位的单次会话上限一致
}
```

`publicKey` 留空时整块不渲染，页面只剩截图。不指定 `osVersion`，交给 appetize 选默认版本。

## 部署

`npm run build` 之后把 `dist/` 内容整体替换到 [Hansel1005.github.io](https://github.com/hansel1005/Hansel1005.github.io)，不是增量上传。保留仓库根目录的 `CNAME`，否则自定义域名失效。

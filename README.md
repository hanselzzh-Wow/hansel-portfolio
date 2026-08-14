# hansel-portfolio

张增辉（Hansel Zhang）个人网站的源码。线上：**[www.hanselzhang.com](https://www.hanselzhang.com)**

一个按编辑排版做的简历站：中英双语、深浅色、无统计代码。里面有两处不是静态内容——

- **可以直接上手的产品演示**：Gratia 发布流程的「改造前 / 改造后」对照，读者自己输入一个地点，看城市怎么从地区串里被拆出来。
- **在网页里运行的真机 App**：Artemi 的 SwiftUI 原型跑在云端 iOS 模拟器上，点开就能操作，不是截图也不是录屏。

## 为什么有这个仓库

构建产物部署在 [Hansel1005.github.io](https://github.com/hansel1005/Hansel1005.github.io)。那个仓库长期只有构建产物——四次 "Add files via upload"，从未提交过源码，也因此攒下四组 `assets/`，其中三组没有任何地方引用。这份源码就是补上那一环。这件事本身写在网站的「改版记录」一章里，没有隐去。

## 开发

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # 产出 dist/
npm run lint
```

## 改内容只改一个文件

所有文案集中在 [`src/content.js`](src/content.js)，中英双语并列；[`src/App.jsx`](src/App.jsx) 只负责渲染。

| 字段 | 作用 |
| --- | --- |
| `content.zh` / `content.en` | 两套文案，结构完全对称 |
| `exp.items[]` | 实习经历，倒序 |
| `proj.items[]` | 项目，倒序；`desc[]` 是正文段落 |
| `sidenotes[]` | 渲染到版心右侧的边注，一段最多 4 条 |
| `liveDemo` | 真机演示配置；`publicKey` 留空时整块不渲染，页面只剩截图 |

## 几个实现上的选择

- **真机演示默认不自动启动**。云端模拟器按分钟计费，且冷启动要十几秒。所以默认只显示首帧截图，点了才开会话；额度耗尽或加载失败自动退回截图组——不能让读者点下去看到一个空框。
- **字体只用 Instrument Serif 与 DM Sans**，深浅色和中英文都是运行时切换。
- **`prefers-reduced-motion` 下所有动画关闭**。
- 曾经用过 CSS 滚动吸附做「首屏独占一整屏」的翻页感，线上实测与 `scroll-behavior: smooth` 互相拉扯，导致整页滚不动，已整套移除。现在首屏只靠 `min-height: 100svh`。

## 部署

`npm run build` 之后把 `dist/` 的内容整体替换到 Pages 仓库（不是增量上传）。仓库根目录的 `CNAME` 必须保留，否则自定义域名会掉回 `github.io`。

// 生成 App Store 分享码那种样式的二维码：圆点模块、圆角定位框、中心嵌 App 图标。
//
// 关键约束：中心挖洞相当于人为损坏一块，只有纠错等级 H（可容忍约 30% 面积损坏）
// 才撑得住。挖洞前必须把该区域的模块从矩阵里清掉，否则图标底下还压着黑点，
// 边缘会露出来。
import QRCode from 'qrcode'
import fs from 'node:fs'

const URL_TEXT = 'https://testflight.apple.com/join/ftyuGZ8n'
const ICON = process.argv[2]
const OUT = process.argv[3]

const DARK = '#7F4058'      // 与 App 图标同色系，但压深以保证对比度
const QUIET = 4             // 静区，标准要求 4 个模块
const ICON_RATIO = 0.24     // 图标边长占码面比例；H 级下 0.24 仍有充足余量

const qr = QRCode.create(URL_TEXT, { errorCorrectionLevel: 'H' })
const N = qr.modules.size
const bits = qr.modules.data
const at = (r, c) => (r < 0 || c < 0 || r >= N || c >= N ? 0 : bits[r * N + c])

// 中心要清空的模块范围
const holeSize = Math.round(N * ICON_RATIO)
const holeStart = Math.floor((N - holeSize) / 2)
const holeEnd = holeStart + holeSize - 1
const inHole = (r, c) => r >= holeStart && r <= holeEnd && c >= holeStart && c <= holeEnd

// 三个定位框（左上、右上、左下）各占 7×7，单独画成圆角方框
const inFinder = (r, c) =>
  (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7)

const total = N + QUIET * 2
const p = []

// 数据模块：圆点
for (let r = 0; r < N; r++) {
  for (let c = 0; c < N; c++) {
    if (!at(r, c) || inFinder(r, c) || inHole(r, c)) continue
    p.push(`<circle cx="${(QUIET + c + 0.5).toFixed(2)}" cy="${(QUIET + r + 0.5).toFixed(2)}" r="0.5"/>`)
  }
}

// 定位框：外圈圆角方 + 内心圆角方
// 描边以路径为中心向两侧各扩 0.5，所以外框必须从 +0.5 起、边长取 6：
// 1 宽的描边正好覆盖 0–1 和 6–7 两条，等于标准定位框那圈 1 模块厚的环。
//
// 圆角上限是 0.5（半个模块），实测过：0.8 就扫不出来了。
// 扫码器靠这三个框的 1:1:3:1:1 扫描线比例定位，圆角越大比例越失真。
// 数据模块画成圆点、中心挖洞嵌图标都不影响解码，只有这里不能松。
const finder = (r, c) => `
  <rect x="${QUIET + c + 0.5}" y="${QUIET + r + 0.5}" width="6" height="6" rx="0.5" fill="none" stroke="${DARK}" stroke-width="1"/>
  <rect x="${QUIET + c + 2}" y="${QUIET + r + 2}" width="3" height="3" rx="0.5" fill="${DARK}"/>`
const finders = [finder(0, 0), finder(0, N - 7), finder(N - 7, 0)].join('')

const iconData = fs.readFileSync(ICON).toString('base64')
const iconSide = holeSize + 1.2                 // 略大于挖空区，盖住锯齿边
const iconXY = (total - iconSide) / 2

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total * 8}" height="${total * 8}">
<rect width="${total}" height="${total}" fill="#fff"/>
<g fill="${DARK}">${p.join('')}</g>
${finders}
<rect x="${iconXY.toFixed(2)}" y="${iconXY.toFixed(2)}" width="${iconSide.toFixed(2)}" height="${iconSide.toFixed(2)}" rx="${(iconSide * 0.22).toFixed(2)}" fill="#fff"/>
<clipPath id="ic"><rect x="${iconXY.toFixed(2)}" y="${iconXY.toFixed(2)}" width="${iconSide.toFixed(2)}" height="${iconSide.toFixed(2)}" rx="${(iconSide * 0.22).toFixed(2)}"/></clipPath>
<image href="data:image/png;base64,${iconData}" x="${iconXY.toFixed(2)}" y="${iconXY.toFixed(2)}" width="${iconSide.toFixed(2)}" height="${iconSide.toFixed(2)}" clip-path="url(#ic)" preserveAspectRatio="xMidYMid slice"/>
</svg>`

fs.writeFileSync(OUT, svg)
console.log(`矩阵 ${N}×${N}，纠错 H，中心清空 ${holeSize}×${holeSize}（占面积 ${((holeSize / N) ** 2 * 100).toFixed(1)}%）`)
console.log(`已写入 ${OUT}`)

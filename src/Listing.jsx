import { useState } from 'react'

// 彩蛋页：把简历装进电商详情页的壳子里。内容跟正经站是同一批事实，
// 只是换了个大家更熟悉、也更愿意点开看的格式。没有一条数据是编的——
// 编的东西放在这种页面里最容易被当真，风险比收益大得多。

const BASE = import.meta.env.BASE_URL
const EMAIL = 'hansel.zzh@gmail.com'

const GALLERY = [
  { src: 'photo.jpg', alt: '本人', tag: '实拍图' },
  { src: 'artemi/home.jpg', alt: 'Artemi 首页', tag: 'Artemi · 家' },
  { src: 'artemi/health.jpg', alt: 'Artemi 健康页', tag: 'Artemi · 健康' },
  { src: 'screens/01-home.png', alt: 'Gratia 首页', tag: 'Gratia · 首页' },
  { src: 'screens/03-publish.png', alt: 'Gratia 发布页', tag: 'Gratia · 发布' },
]

const SPEC_QUICK = [
  ['到岗时间', '2027 年 6 月（应届）'],
  ['语言能力', 'CET-6 · TEM-4（优秀）· 普通话一级乙等'],
  ['代码能力', 'Swift/SwiftUI，三个项目累计约 1.4 万行'],
  ['数据结果', '单篇均阅读 2000+ · 会员开通率 +20% · 一上午的活自动化到 20 分钟'],
  ['所获荣誉', '安克「水手计划」班级第一 · 产品挑战赛班级第一 · 校级辩论赛季军'],
]

const SPEC_FULL = [
  ['学校', '华中科技大学'],
  ['专业', '国际商务 + 英语，双学位'],
  ['学制', '2023.09 – 2027.06'],
  ['英语', 'CET-4 · CET-6 · TEM-4（优秀）'],
  ['普通话', '一级乙等'],
  ['技术栈', 'SwiftUI · Swift Charts · Speech · Cloudflare Workers · D1 · R2 · MapKit'],
  ['工具栈', 'Excel · PowerPoint · Figma · Canva · CapCut · Claude · ChatGPT · Gemini'],
  ['在读经历', '校队主力辩手 · 院辩论队队长 · 经济学院新闻中心 / 党建宣传部部长'],
  ['老买家', '安克创新（eufy 德国站）· 湖北盛天网络技术股份有限公司'],
]

const FAQ = [
  {
    q: '保修吗？',
    a: '有。入职第二天发现星级管理要填一大张表、占一上午，当天就用公司内部 AI 把它做成自动流程，缩到 20 分钟——响应速度可以参考这条真实记录。',
  },
  {
    q: '支持退换吗？',
    a: '建议先约一次沟通。较真这件事是认真的：给「哈喽卧得」App 做账户删除时，我不把数据库状态当撤销成功的证据，唯一认的是 Apple ID 设置里那个 App 真的消失了——同样的较真劲儿用在承诺上。',
  },
  {
    q: '现货吗？',
    a: '应届生资格只有 2027 年 6 月这一批，不会补货。',
  },
  {
    q: '有没有做过完整的东西，不是只会讲故事？',
    a: '「哈喽卧得」第 7 个构建已经上传 App Store Connect 并通过校验，71/71 测试通过；「Artemi」是产品挑战赛班级第一的作品，五个一级页面都能在真机上点。都在下面的商品详情里，也都在主站挂着能直接点开。',
  },
]

const RELATED = [
  { key: 'artemi', title: 'Artemi · 智能宠物项圈', tagline: '组长 · 产品构思与 App，班级第一', img: 'artemi/home.jpg' },
  { key: 'gratia', title: '哈喽卧得 · Gratia', tagline: '产品负责人，SwiftUI 原生 App，已过 App Store 校验', img: 'screens/01-home.png' },
  { key: 'roadnottaken', title: '未选择的路 · A/B 人生', tagline: '独立产品定义与实现，原型已跑通完整闭环', img: 'screens/05-profile.png' },
]

function HeartIcon({ filled, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 20.5s-7.5-4.6-9.8-9.3C.7 7.8 2.3 4.5 5.6 4c2-.3 3.8.7 5 2.4C11.8 4.7 13.6 3.7 15.6 4c3.3.5 4.9 3.8 3.4 7.2C16.7 15.9 12 20.5 12 20.5z" />
    </svg>
  )
}

function ArrowIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  )
}

export default function Listing() {
  const [active, setActive] = useState(0)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState('detail')

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      {/* ── 顶栏 ── */}
      <div className="sticky top-0 z-10 bg-paper/90 backdrop-blur border-b border-rule">
        <div className="mx-auto max-w-[72rem] px-6 h-12 flex items-center justify-between font-mono text-[11px] tracking-wide">
          <a href={BASE} className="text-ink/60 hover:text-cinnabar transition-colors">← 返回正经版网站</a>
          <span className="text-ink/40">非正式版 · 内容都是真的</span>
        </div>
      </div>

      <div className="mx-auto max-w-[72rem] px-6 py-10">
        {/* ── 面包屑 ── */}
        <p className="font-mono text-[11px] text-ink/40 mb-6">
          全部分类 <span className="mx-1">/</span> 应届生 <span className="mx-1">/</span> 复合型选手 <span className="mx-1">/</span> 张增辉
        </p>

        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* ── 相册 ── */}
          <div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-rule bg-white">
              <img
                src={`${BASE}${GALLERY[active].src}`}
                alt={GALLERY[active].alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {GALLERY.map((g, i) => (
                <button
                  key={g.src}
                  onClick={() => setActive(i)}
                  className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                    i === active ? 'border-cinnabar' : 'border-rule hover:border-ink/30'
                  }`}
                  aria-label={g.tag}
                >
                  <img src={`${BASE}${g.src}`} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
            <p className="mt-2 font-mono text-[11px] text-ink/40">{GALLERY[active].tag} · 均为本人代码写出的真实界面，不是模板图</p>
          </div>

          {/* ── 商品信息 ── */}
          <div>
            <h1 className="display text-4xl mb-1">张增辉</h1>
            <p className="text-[15px] text-ink/60 mb-4">2027 届 · 国际商务 + 英语（双学位）· 华中科技大学</p>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {['99/100 路演评分', 'CET-6', 'TEM-4 优秀', '普通话一级乙等', '班级第一 ×2'].map(b => (
                <span key={b} className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-cinnabar/[0.08] text-cinnabar border border-cinnabar/20">
                  {b}
                </span>
              ))}
            </div>

            <div className="rounded-2xl border border-rule bg-white p-5 mb-6">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="text-[13px] text-ink/40 line-through">社招价：三年经验起</span>
                <span className="display text-3xl text-cinnabar">应届生价</span>
              </div>
              <p className="font-mono text-[12px] text-ink/50">库存：应届资格仅 2027 年 6 月这一批，售完不补</p>
            </div>

            <dl className="space-y-3 mb-7 text-[13px]">
              {SPEC_QUICK.map(([k, v]) => (
                <div key={k} className="flex gap-4">
                  <dt className="w-16 shrink-0 text-ink/40 font-mono text-[11px] pt-0.5">{k}</dt>
                  <dd className="leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="flex-1 text-center py-3 rounded-xl bg-cinnabar text-white text-[15px] font-medium hover:bg-[#8A3423] transition-colors"
              >
                立即沟通
              </a>
              <a
                href={`${BASE}resume.pdf`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-3 rounded-xl border border-ink/20 text-[15px] font-medium hover:border-ink/40 transition-colors"
              >
                下载简历 PDF
              </a>
              <button
                onClick={() => setSaved(s => !s)}
                aria-label={saved ? '已收藏' : '收藏'}
                className={`shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${
                  saved ? 'border-cinnabar text-cinnabar bg-cinnabar/[0.06]' : 'border-ink/20 text-ink/50 hover:border-ink/40'
                }`}
              >
                <HeartIcon filled={saved} className="w-5 h-5" />
              </button>
            </div>
            <p className="mt-3 font-mono text-[11px] text-ink/40">
              下面「参数详情」和「问大家」里的每条数据都能对上主站的原文，没有一条是编的。
            </p>
          </div>
        </div>

        {/* ── 标签页 ── */}
        <div className="mt-16 border-t border-rule pt-8">
          <div className="flex gap-1 mb-8 font-mono text-[13px]">
            {[
              ['detail', '宝贝详情'],
              ['spec', '参数详情'],
              ['faq', '问大家'],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  tab === id ? 'bg-ink text-paper' : 'text-ink/50 hover:text-ink border border-rule'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'detail' && (
            <div className="max-w-[42rem] space-y-6 text-[15px] leading-[1.75]">
              <p>
                <b>安克创新 · eufy 德国站</b> —— 盯亚马逊外观星级与计算星级，把差评和客诉记录对上号；入职第二天把一上午的手工填表做成自动流程，现在 20 分钟。
              </p>
              <p>
                <b>Artemi · 智能宠物项圈</b> —— 安克「水手启航挑战赛」班级第一，组长统筹全案。交付是可运行的 SwiftUI 演示版，五个一级页面、共 1128 行，数据全部本地模拟。
              </p>
              <p>
                <b>哈喽卧得 · Gratia</b> —— 从课程作业重做成原生 iOS App，SwiftUI 客户端 53 个文件、1.1 万行，后端跑在 Cloudflare Workers + D1 + R2 上。第 7 个构建已上传 App Store Connect 并通过校验。
              </p>
              <p>
                <b>未选择的路 · A/B 人生</b> —— 独立定义与实现，只在真的犹豫过的时刻记录一条决策；原型已跑通完整闭环，1726 行 UIKit + SpriteKit。
              </p>
            </div>
          )}

          {tab === 'spec' && (
            <dl className="max-w-[42rem] divide-y divide-rule text-[14px]">
              {SPEC_FULL.map(([k, v]) => (
                <div key={k} className="flex gap-6 py-3">
                  <dt className="w-24 shrink-0 text-ink/40 font-mono text-[12px] pt-0.5">{k}</dt>
                  <dd className="leading-relaxed">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          {tab === 'faq' && (
            <div className="max-w-[42rem] space-y-6">
              {FAQ.map(({ q, a }) => (
                <div key={q}>
                  <p className="text-[15px] font-medium mb-1.5">
                    <span className="text-cinnabar mr-2">问</span>{q}
                  </p>
                  <p className="text-[14px] leading-relaxed text-ink/70">
                    <span className="text-ink/30 mr-2 font-mono">答</span>{a}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 看了这件商品的人，也看了 ── */}
        <div className="mt-16 border-t border-rule pt-8">
          <h2 className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/40 mb-5">看了这件商品的人，也看了</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {RELATED.map(r => (
              <a
                key={r.key}
                href={`${BASE}#work`}
                className="group rounded-xl border border-rule overflow-hidden bg-white hover:border-ink/30 transition-colors"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={`${BASE}${r.img}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-4">
                  <p className="text-[14px] font-medium mb-1">{r.title}</p>
                  <p className="text-[12px] text-ink/50 leading-relaxed mb-2">{r.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-[12px] text-cinnabar">
                    查看详情 <ArrowIcon className="w-3.5 h-3.5" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── 页脚 ── */}
        <div className="mt-16 border-t border-rule pt-8 pb-4">
          <p className="text-[13px] italic text-ink/50 max-w-[42rem] leading-relaxed">
            这页是个格式玩笑，内容都是真的。如果你更想读一份正经排版的版本，
            <a href={BASE} className="link text-cinnabar not-italic">请点这里返回</a>。
          </p>
          <p className="mt-4 font-mono text-[11px] text-ink/40">© 2026 张增辉</p>
        </div>
      </div>
    </div>
  )
}

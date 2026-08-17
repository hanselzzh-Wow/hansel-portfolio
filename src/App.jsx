import { useState, useEffect, useCallback, useRef } from 'react'
import { content, tools, screens, artemiShots, liveDemo } from './content.js'
import LiveDevice from './LiveDevice.jsx'

// 部署到子目录时（如 /preview/）资源要带前缀；根目录部署时它就是 '/'
const BASE = import.meta.env.BASE_URL

const EMAIL = 'hansel.zzh@gmail.com'
const PHONE = '18996406806'

// 个人字标：public/favicon.svg 的内联版本。内联才能继承 currentColor，
// 用 <img> 就固定死了，跟不上深浅色切换。
function Monogram({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 18C7 18 8 6 11 4" strokeWidth="2.5" />
      <path d="M13 20C16 18 17 6 20 6" strokeWidth="2.5" />
      <path d="M7.5 9.5h8L8.5 14.5h8" strokeWidth="1.5" />
    </svg>
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────
// 只留三个真正需要的。图标网格已经拆掉了 —— 那是 AI 生成站最明显的胎记之一。
function MoonIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeWidth="1.6" strokeLinecap="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  )
}
function SunIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" strokeWidth="1.6" />
      <path strokeWidth="1.6" strokeLinecap="round" d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}
function CopyIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="9" y="9" width="12" height="12" rx="1.5" strokeWidth="1.6" />
      <path strokeWidth="1.6" strokeLinecap="round" d="M5 15H4a1 1 0 01-1-1V4a1 1 0 011-1h10a1 1 0 011 1v1" />
    </svg>
  )
}

// ─── 版面构件 ─────────────────────────────────────────────────────────────────

// 章节头：章号与章名同行 —— 中文书就是这么排的。
// 小号等宽的「一」在标题上方只会被当成一根横线，认不出是数字。
function SectionHead({ n, children, muted }) {
  return (
    <header className="mb-10">
      <h2 className="display text-4xl sm:text-5xl mb-5">
        {n && <span className="text-cinnabar dark:text-[#E08A72] mr-5">{n}</span>}
        {children}
      </h2>
      <div className={`rule rule-lead ${muted}`} />
    </header>
  )
}

// 正文 + 边注。桌面端边注浮在右侧，窄屏退回正文下方。
function WithSidenotes({ notes, children, muted }) {
  return (
    <div className="md:grid md:grid-cols-[minmax(0,1fr)_9.5rem] md:gap-x-12">
      <div className="max-w-prose">{children}</div>
      {notes?.length > 0 && (
        <aside className="sidenote mt-8 md:mt-1.5 flex flex-wrap gap-x-8 gap-y-4 md:block md:space-y-5">
          {notes.map(note => (
            <div key={note.v}>
              <div className="display text-2xl text-cinnabar dark:text-[#E08A72] leading-none">{note.k}</div>
              <div className={`text-[11px] mt-1 leading-snug ${muted}`}>{note.v}</div>
            </div>
          ))}
        </aside>
      )}
    </div>
  )
}

// ─── 界面走查 ─────────────────────────────────────────────────────────────────
function Screens({ w, lang, muted, dark, shots = screens, dir = 'screens', label, hint }) {
  const [open, setOpen] = useState(null)
  const closeRef = useRef(null)

  useEffect(() => {
    if (open === null) return
    const onKey = e => e.key === 'Escape' && setOpen(null)
    document.addEventListener('keydown', onKey)
    closeRef.current?.focus()
    // 打开灯箱时锁住背景滚动，否则背后的长页面会跟着滚
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open])

  const active = open === null ? null : shots[open]

  return (
    <figure className="mt-14">
      <figcaption className={`font-mono text-[11px] tracking-[0.18em] uppercase mb-5 ${muted}`}>
        {label ?? w.proj.screensLabel}
      </figcaption>

      {/* items-end：产品照是方的、界面截图是竖的，让它们底边对齐而不是裁掉照片 */}
      <div className="filmstrip flex items-end gap-5 overflow-x-auto pb-4 -mx-6 px-6">
        {shots.map((s, idx) => (
          <button
            key={s.file}
            onClick={() => setOpen(idx)}
            className="shrink-0 text-left group"
            style={{ width: '9.5rem' }}
          >
            <img
              src={`${BASE}${dir}/${s.file}`}
              alt={s[lang].label}
              loading="lazy"
              className={`w-[9.5rem] border transition-colors ${dark ? 'border-[#2A2621] group-hover:border-[#4A453D]' : 'border-rule group-hover:border-[#8F8578]'}`}
            />
            <div className={`font-mono text-[11px] mt-2.5 ${muted} group-hover:text-cinnabar dark:group-hover:text-[#E08A72] transition-colors`}>
              {s[lang].label}
            </div>
          </button>
        ))}
      </div>

      <p className={`font-mono text-[11px] mt-1 ${muted}`}>{hint ?? w.proj.screensHint}</p>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70"
          onClick={() => setOpen(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="flex flex-col md:flex-row items-center gap-8 max-h-full"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={`${BASE}${dir}/${active.file}`}
              alt={active[lang].label}
              className="max-h-[78vh] w-auto border border-white/15"
            />
            <div className="max-w-[18rem] text-[#E8E3D9]">
              <div className="display text-2xl mb-3">{active[lang].label}</div>
              <p className="text-[15px] leading-[1.75] text-[#B5AFA4]">{active[lang].note}</p>
              <button
                ref={closeRef}
                onClick={() => setOpen(null)}
                className="font-mono text-[11px] mt-7 link text-[#B5AFA4]"
              >
                {w.proj.close} ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </figure>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(false)
  const [lang, setLang] = useState('zh')
  const [copied, setCopied] = useState(null)

  const w = content[lang]

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  useEffect(() => {
    document.documentElement.lang = lang === 'en' ? 'en' : 'zh-CN'
  }, [lang])

  const copy = useCallback(async (value, key) => {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    setTimeout(() => setCopied(null), 1600)
  }, [])

  const page = dark ? 'bg-[#141310] text-[#E8E3D9]' : 'bg-paper text-ink'
  const muted = dark ? 'text-[#8F8A80]' : 'text-[#6E675D]'
  const rule = dark ? 'text-[#3A362F]' : 'text-[#B9AF9F]'
  const body = dark ? 'text-[#C4BEB3]' : 'text-[#3D3831]'

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${page}`}>

      {/* ── 顶栏：一根细线，没有毛玻璃，没有阴影 ── */}
      <nav className={`sticky top-0 z-30 border-b ${dark ? 'border-[#2A2621] bg-[#141310]' : 'border-rule bg-paper'}`}>
        <div className="mx-auto max-w-[60rem] px-6 h-14 flex items-center justify-between gap-6">
          <a href="#top" className="flex items-center gap-2.5 shrink-0 group">
            <Monogram className="w-[18px] h-[18px] text-cinnabar dark:text-[#E08A72]" />
            <span className="display text-lg">{lang === 'en' ? 'Hansel Zhang' : '张增辉'}</span>
          </a>

          <div className={`hidden sm:flex items-center gap-6 text-[13px] ${muted}`}>
            <a href="#experience" className="link">{w.nav.exp}</a>
            <a href="#work" className="link">{w.nav.proj}</a>
            <a href="#education" className="link">{w.nav.edu}</a>
            <a href="#changelog" className="link">{w.nav.log}</a>
          </div>

          <div className={`flex items-center gap-4 text-[13px] ${muted}`}>
            <a href={`${BASE}resume.pdf`} download className="link hidden sm:inline">{w.nav.dl}</a>
            <button onClick={() => setLang(l => (l === 'en' ? 'zh' : 'en'))} className="link font-mono text-[12px]">
              {lang === 'en' ? '中文' : 'EN'}
            </button>
            <button onClick={() => setDark(d => !d)} aria-label="Toggle theme" className="hover:text-cinnabar dark:hover:text-[#E08A72] transition-colors">
              {dark ? <SunIcon className="w-[15px] h-[15px]" /> : <MoonIcon className="w-[15px] h-[15px]" />}
            </button>
          </div>
        </div>
      </nav>

      <div id="top" className="mx-auto max-w-[60rem] px-6">

        {/* ── 扉页 ── 书翻开的第一页就是序。
            姓名不再单独占一屏：「Hi，我叫张增辉」已经把自报家门做完了，
            再来一个巨大的名字就是同一句话说两遍。名字留在页眉，
            以及下面这个只给读屏器和搜索引擎看的 h1 里 —— 页面上没有可见的
            姓名标题，这个 h1 就不能省。 */}
        <header className="page">
          <Monogram className="w-8 h-8 mb-10 text-cinnabar dark:text-[#E08A72]" />

          <h1 className="sr-only">{w.hero.name} {w.hero.nameAlt}</h1>

          {/* 前言：全站唯一一处直接对着读者说话的地方。
              正文比别处大一号、行距更松 —— 这一页是让人慢下来的，不是让人扫的。
              落款单独成行、右对齐，书里的序都这么收尾；
              「请翻下一页」翻过去就是下面这几行自我介绍，顺序是接得上的。 */}
          <section aria-labelledby="preface">
            <h2 id="preface" className={`font-mono text-[11px] tracking-[0.22em] uppercase mb-7 ${muted}`}>
              {w.preface.title}
            </h2>
            <div className="max-w-[38rem] space-y-6">
              {w.preface.lines.map((p, i) => (
                // whitespace-pre-line：换行由文案自己决定，前两句是两个独立的招呼，
                // 挤成一段就没有停顿了
                <p key={i} className="display text-[19px] sm:text-[21px] leading-[1.85] whitespace-pre-line">
                  {p}
                </p>
              ))}
              <p className="display text-[19px] sm:text-[21px] leading-[1.85] pt-2 text-right text-cinnabar dark:text-[#E08A72]">
                {w.preface.sign}
              </p>
            </div>
          </section>
        </header>

        {/* ── 名片 ── 序落款说「请翻下一页」，翻过来就该是这个人是谁。
            （原来这里挂着一个滚动吸附落点，跟平滑滚动打架导致整页滚不动，已撤） */}
        <section className="pt-20 pb-16 sm:pt-24 sm:pb-20">
          <p className={`max-w-prose text-[15px] leading-relaxed ${muted} mb-7`}>{w.hero.line1}</p>

          <p className="max-w-prose text-lg sm:text-xl leading-relaxed mb-7">{w.hero.now}</p>

          <p className="max-w-prose text-[15px] leading-relaxed mb-11 text-cinnabar dark:text-[#E08A72]">
            {w.hero.seeking}
          </p>

          {/* 联系方式：朴素两行，不是圆角按钮卡 */}
          <dl className="font-mono text-[13px] space-y-2.5">
            {[
              { label: w.hero.emailLabel, value: EMAIL, href: `mailto:${EMAIL}`, key: 'email' },
              { label: w.hero.phoneLabel, value: PHONE, href: `tel:${PHONE}`, key: 'phone' },
            ].map(item => (
              <div key={item.key} className="flex items-baseline gap-4">
                <dt className={`w-12 shrink-0 text-[11px] tracking-wide ${muted}`}>{item.label}</dt>
                <dd className="flex items-baseline gap-2.5">
                  <a href={item.href} className="link">{item.value}</a>
                  <button
                    onClick={() => copy(item.value, item.key)}
                    className={`${muted} hover:text-cinnabar dark:hover:text-[#E08A72] transition-colors`}
                    aria-label="Copy"
                  >
                    <CopyIcon className="w-3.5 h-3.5" />
                  </button>
                  {copied === item.key && (
                    <span className="text-[11px] text-cinnabar dark:text-[#E08A72]">{w.hero.copied}</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          {/* 版次：和改版记录里的 v.V 指的是同一件事 */}
          <p className={`font-mono text-[11px] tracking-wide mt-14 pt-5 border-t max-w-prose ${muted} ${dark ? 'border-[#2A2621]' : 'border-rule'}`}>
            {w.hero.edition}
          </p>
        </section>

        {/* ── 目录 ── 点线一路引到右边的章号，位置就是书里页码的位置 */}
        <nav aria-label={w.toc.title} className="pb-24 sm:pb-28">
          <h2 className={`font-mono text-[11px] tracking-[0.22em] uppercase mb-6 ${muted}`}>
            {w.toc.title}
          </h2>
          <ol className="max-w-prose">
            {w.toc.items.map(item => (
              <li key={item.href}>
                <a href={item.href} className="group flex items-baseline gap-3 py-2.5">
                  <span className="display text-lg shrink-0 group-hover:text-cinnabar dark:group-hover:text-[#E08A72] transition-colors">
                    {item.label}
                  </span>
                  <span className={`flex-1 border-b border-dotted self-center ${dark ? 'border-[#3A362F]' : 'border-[#C7BFB1]'}`} />
                  <span className="display text-base shrink-0 text-cinnabar dark:text-[#E08A72]">
                    {item.n}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <main className="space-y-28 pb-28">

          {/* ── 实习 ── */}
          <section id="experience" className="scroll-mt-20">
            <SectionHead n={w.toc.items[0].n} muted={rule}>{w.exp.title}</SectionHead>

            <div className="space-y-16">
              {w.exp.items.map(item => (
                <article key={item.key}>
                  <div className="md:grid md:grid-cols-[minmax(0,1fr)_9.5rem] md:gap-x-12 mb-7">
                    <div className="max-w-prose">
                      <h3 className="text-lg font-medium leading-snug">{item.company}</h3>
                      <p className={`text-[15px] mt-1 ${muted}`}>{item.role}</p>
                    </div>
                    <p className={`font-mono text-[12px] mt-2 md:mt-1.5 ${muted}`}>{item.date}</p>
                  </div>

                  <WithSidenotes notes={item.sidenotes} muted={muted}>
                    <div className="space-y-6">
                      {item.points.map(p => (
                        <p key={p.h} className={`text-[15px] leading-[1.75] ${body}`}>
                          <span className={`font-medium mr-2.5 ${dark ? 'text-[#E8E3D9]' : 'text-ink'}`}>{p.h}</span>
                          {p.body}
                        </p>
                      ))}
                    </div>
                  </WithSidenotes>
                </article>
              ))}
            </div>
          </section>

          {/* ── 项目 ── */}
          <section id="work" className="scroll-mt-20">
            <SectionHead n={w.toc.items[1].n} muted={rule}>{w.proj.title}</SectionHead>

            <div className="space-y-20">
              {w.proj.items.map(proj => (
                <article key={proj.key}>
                  <div className="md:grid md:grid-cols-[minmax(0,1fr)_9.5rem] md:gap-x-12 mb-7">
                    <div className="max-w-prose">
                      <h3 className="display text-3xl leading-tight">{proj.name}</h3>
                      <p className={`text-[15px] italic mt-2.5 ${muted}`}>{proj.tagline}</p>
                      <p className="text-[15px] mt-3">{proj.role}</p>
                      {proj.status && (
                        <p className="text-[13px] mt-2 text-cinnabar dark:text-[#E08A72]">{proj.status}</p>
                      )}
                    </div>
                    <p className={`font-mono text-[12px] mt-2 md:mt-2.5 ${muted}`}>{proj.date}</p>
                  </div>

                  <WithSidenotes notes={proj.sidenotes} muted={muted}>
                    <div className="space-y-5">
                      {proj.desc.map((d, i) => (
                        <p key={i} className={`text-[15px] leading-[1.75] ${body} ${i === 0 ? 'drop-cap' : ''}`}>{d}</p>
                      ))}
                    </div>
                    <p className={`font-mono text-[11px] mt-7 leading-relaxed ${muted}`}>{proj.stack}</p>
                  </WithSidenotes>

                  {proj.key === 'gratia' && (
                    <>
                      {/* 真机在截图前面：能点的东西一旦出现，静态图就只是它的注脚 */}
                      <LiveDevice
                        cfg={liveDemo.gratia}
                        t={{ ...w.proj.live, blurb: w.proj.live.gratia }}
                        poster={liveDemo.gratia.poster}
                        alt={proj.name}
                        muted={muted} dark={dark}
                      />
                      <Screens w={w} lang={lang} muted={muted} dark={dark} />
                    </>
                  )}

                  {proj.key === 'artemi' && (
                    <>
                      <LiveDevice
                        cfg={liveDemo.artemi}
                        t={{ ...w.proj.live, blurb: w.proj.live.artemi }}
                        poster={liveDemo.artemi.poster}
                        alt={proj.name}
                        muted={muted} dark={dark}
                      />
                      <Screens
                        w={w} lang={lang} muted={muted} dark={dark}
                        shots={artemiShots} dir="artemi"
                        label={lang === 'en' ? 'Product' : '产品'}
                      />
                    </>
                  )}

                  {proj.link && (
                    <div className="mt-9 flex items-center gap-5 flex-wrap">
                      {/* 徽章形制沿用应用商店那种药丸按钮的分量，但不借用任何 Apple 标识 ——
                          这个 App 还在 TestFlight 外测、没有上架，挂「Download on the App Store」
                          既违反品牌规范，也等于对读者说了一件不成立的事。 */}
                      <a
                        // 站内文件（milktea.pdf）要带部署前缀，外链不能带 ——
                        // 否则 https://… 会被拼成 /https://…
                        href={/^https?:\/\//.test(proj.link.href) ? proj.link.href : `${BASE}${proj.link.href}`}
                        target="_blank"
                        rel="noreferrer"
                        className={`shrink-0 inline-flex items-center gap-3 rounded-[10px] px-5 py-2.5 transition-colors
                          ${dark ? 'bg-[#E8E3D9] text-[#141310] hover:bg-white' : 'bg-[#1C1A18] text-[#F7F4EE] hover:bg-black'}`}
                      >
                        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                          strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M12 3v12" />
                          <path d="M7.5 10.5 12 15l4.5-4.5" />
                          <path d="M4.5 17.5v1.2a1.8 1.8 0 0 0 1.8 1.8h11.4a1.8 1.8 0 0 0 1.8-1.8v-1.2" />
                        </svg>
                        <span className="leading-tight text-left">
                          <span className="block text-[10px] tracking-[0.14em] uppercase opacity-70">
                            {proj.link.badgeTop}
                          </span>
                          <span className="block text-[15px] font-medium">{proj.link.label}</span>
                        </span>
                      </a>

                      {/* 二维码只在桌面端出现：手机扫自己的屏幕没有意义，那里点按钮就行。
                          底色恒为白 —— 深色模式下把码衬在深底上会扫不出来。 */}
                      {proj.link.qr && (
                        <a
                          href={proj.link.href}
                          target="_blank"
                          rel="noreferrer"
                          className="hidden sm:block shrink-0 bg-white p-1.5 rounded-[10px] border border-rule"
                          aria-label={proj.link.label}
                        >
                          <img src={`${BASE}${proj.link.qr}`} alt="" className="w-[68px] h-[68px]" />
                        </a>
                      )}

                      {proj.link.note && (
                        <span className={`font-mono text-[11px] ${muted}`}>{proj.link.note}</span>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* ── 教育 ── */}
          <section id="education" className="scroll-mt-20">
            <SectionHead n={w.toc.items[2].n} muted={rule}>{w.edu.title}</SectionHead>

            <div className="md:grid md:grid-cols-[minmax(0,1fr)_9.5rem] md:gap-x-12">
              <div className="max-w-prose space-y-10">
                <div>
                  <h3 className="text-lg font-medium">{w.edu.school}</h3>
                  <p className="text-[15px] mt-1">{w.edu.major}</p>
                  <p className={`text-[15px] leading-[1.75] mt-4 ${body}`}>{w.edu.core}</p>
                  <p className={`font-mono text-[12px] mt-3 ${muted}`}>{w.edu.lang}</p>
                </div>

                {w.edu.campus.map(c => (
                  <div key={c.name}>
                    <h3 className="text-[15px] font-medium">{c.name}</h3>
                    <p className={`font-mono text-[12px] mt-1 ${muted}`}>{c.date}</p>
                    <p className={`text-[15px] leading-[1.75] mt-2.5 ${body}`}>{c.desc}</p>
                  </div>
                ))}

                <div>
                  <h3 className={`text-[11px] tracking-[0.18em] uppercase font-mono ${muted} mb-2.5`}>{w.edu.toolsLabel}</h3>
                  <p className={`text-[15px] ${body}`}>{tools.join(' · ')}</p>
                </div>
              </div>

              <p className={`font-mono text-[12px] mt-6 md:mt-1.5 ${muted}`}>{w.edu.date}</p>
            </div>
          </section>

          {/* ── 改版记录 ── */}
          <section id="changelog" className="scroll-mt-20">
            <SectionHead n={w.toc.items[3].n} muted={rule}>{w.log.title}</SectionHead>

            <p className={`max-w-prose text-[15px] italic mb-9 ${muted}`}>{w.log.note}</p>

            <ol className="max-w-prose space-y-6">
              {w.log.items.map(entry => (
                <li key={entry.v} className="flex gap-5 sm:gap-7">
                  <div className="shrink-0 w-16 sm:w-20">
                    <div className="font-mono text-[13px] text-cinnabar dark:text-[#E08A72]">{entry.v}</div>
                    <div className={`font-mono text-[10px] mt-0.5 ${muted}`}>{entry.date}</div>
                  </div>
                  <p className={`text-[15px] leading-[1.75] ${body}`}>{entry.text}</p>
                </li>
              ))}
            </ol>
          </section>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className={`border-t ${dark ? 'border-[#2A2621]' : 'border-rule'}`}>
        <div className={`mx-auto max-w-[60rem] px-6 py-10 font-mono text-[11px] leading-relaxed ${muted} flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2`}>
          <p>© 2026 {lang === 'en' ? 'Hansel Zhang' : '张增辉'} · {w.footer.rights}</p>
          <p>{w.footer.colophon}</p>
        </div>
      </footer>
    </div>
  )
}

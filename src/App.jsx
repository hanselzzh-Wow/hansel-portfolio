import { useState, useEffect, useCallback, useRef } from 'react'
import { content, tools, screens, artemiShots, places, liveDemo } from './content.js'
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
// 题记摘自本章正文，不另写；不需要就删掉 content.js 里那一行 epigraph。
function SectionHead({ n, children, epigraph, muted }) {
  return (
    <header className="mb-10">
      <h2 className="display text-4xl sm:text-5xl mb-5">
        {n && <span className="text-cinnabar dark:text-[#E08A72] mr-5">{n}</span>}
        {children}
      </h2>
      <div className={`rule rule-lead ${muted}`} />
      {epigraph && (
        <p className={`display italic text-[17px] leading-[1.7] max-w-[34rem] mt-5 ${muted}`}>
          {epigraph}
        </p>
      )}
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

// ─── 地区串 → 城市 ────────────────────────────────────────────────────────────
// 真机上那套拆分逻辑的网页版。目标不是「拆得漂亮」，而是结果必须落在服务端
// 2–24 字的校验窗口里 —— 界面上只有一个地点输入框，城市拆错了用户无从修复。
const CITY_SUFFIXES = ['自治州', '地区', '盟', '市']

function parseCity(subtitle) {
  if (!subtitle) return null

  // 拉丁地址：按逗号取第一段，去掉前置邮编。
  // 「Champ de Mars, 5 Av. Anatole France, 75007 Paris, France」会取到第一段而不是
  // Paris —— 这是明知的取舍：各国地址格式差太多，猜错比取第一段更糟。
  if (!/[一-龥]/.test(subtitle)) {
    const first = subtitle.split(',')[0].trim().replace(/^\d{4,6}\s+/, '')
    return first ? first.slice(0, 24) : null
  }

  let s = subtitle.replace(/^中国/, '')

  const sar = s.match(/^(香港|澳门)特别行政区/)
  if (sar) return sar[0]

  // 省级前缀切掉；非贪婪，避免把后面的地级单位一起吃了
  s = s.replace(/^.{2,9}?自治区/, '').replace(/^.{2,7}?省/, '')

  // 取最早收尾的那个地级单位。「丽江市玉龙纳西族自治县」必须停在丽江市，
  // 「西双版纳傣族自治州景洪市」必须停在州而不是被后面的县级市抢走。
  let end = null
  for (const suf of CITY_SUFFIXES) {
    const i = s.indexOf(suf)
    if (i > 0) {
      const e = i + suf.length
      if (end === null || e < end) end = e
    }
  }
  if (!end) return null
  return s.slice(0, end).slice(0, 24)
}

// ─── 发布流程：亲手试一次 ─────────────────────────────────────────────────────
function PublishDemo({ w, lang, muted, dark }) {
  const d = w.proj.demo
  const CITIES = lang === 'en'
    ? ['Hangzhou', 'Shanghai', 'Beijing', 'Shenzhen', 'Guangzhou']
    : ['杭州', '上海', '北京', '深圳', '广州']

  const [mode, setMode] = useState('before')
  const [scene, setScene] = useState(0)
  const [city, setCity] = useState(CITIES[0])
  const [landmark, setLandmark] = useState('')
  const [query, setQuery] = useState('')
  const [picked, setPicked] = useState(null)
  const [done, setDone] = useState(false)

  const reset = m => {
    setMode(m); setScene(0); setCity(CITIES[0])
    setLandmark(''); setQuery(''); setPicked(null); setDone(false)
  }

  const matches = query.trim()
    ? places.filter(p => (p.t + p.s).toLowerCase().includes(query.trim().toLowerCase())).slice(0, 4)
    : []

  // 改造后：选中补全结果就用拆出来的城市；手输则退回地点名本身（服务端仍要 2–24 字）
  const afterCity = picked ? (parseCity(picked.s) || picked.t.slice(0, 24)) : query.trim().slice(0, 24)
  const afterSpot = picked ? picked.t : query.trim()
  const ready = mode === 'before' ? landmark.trim().length > 0 : afterSpot.length > 0

  // App 自己的颜色，跟网站版面无关 —— 它是一台设备，不是这一页的一部分
  const C = { rose: '#9A536D', deep: '#7F4058', soft: '#E4C6D0', tint: '#FAF4F6', ink: '#191719', line: '#EAEAEA' }

  return (
    <figure className="mt-14">
      <figcaption className={`font-mono text-[11px] tracking-[0.18em] uppercase mb-5 ${muted}`}>
        {d.label}
      </figcaption>

      <div className="md:grid md:grid-cols-[21rem_minmax(0,1fr)] md:gap-x-12 items-start">
        {/* ── 设备 ── */}
        <div className="w-full max-w-[21rem] rounded-[2rem] border-[6px] border-[#17161a] overflow-hidden bg-white shadow-lg">
          <div className="px-5 pt-4 pb-3 flex items-center justify-between" style={{ color: C.ink }}>
            <span className="text-[15px] font-semibold">{lang === 'en' ? 'New wish' : '发布心愿'}</span>
            <span className="text-[13px]" style={{ color: '#8A8A8A' }}>{lang === 'en' ? 'Cancel' : '取消'}</span>
          </div>

          <div className="px-5">
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-[12px]" style={{ color: '#8A8A8A' }}>{d.stepOf}</span>
              <span className="text-[12px]" style={{ color: C.rose }}>{d.stepName}</span>
            </div>
            <div className="flex gap-1.5 mb-5">
              <span className="h-[3px] flex-1 rounded-full" style={{ background: C.rose }} />
              <span className="h-[3px] flex-1 rounded-full" style={{ background: C.line }} />
              <span className="h-[3px] flex-1 rounded-full" style={{ background: C.line }} />
            </div>
          </div>

          {done ? (
            <div className="px-5 pb-7 pt-2">
              <p className="text-[17px] font-semibold mb-4" style={{ color: C.ink }}>
                {lang === 'en' ? 'Ready to post' : '可以发布了'}
              </p>
              <dl className="text-[14px] space-y-3 mb-5">
                <div className="flex gap-3">
                  <dt className="w-12 shrink-0" style={{ color: '#8A8A8A' }}>{d.cityField}</dt>
                  <dd style={{ color: C.ink }}>{mode === 'before' ? city : afterCity}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-12 shrink-0" style={{ color: '#8A8A8A' }}>{d.landmarkField}</dt>
                  <dd style={{ color: C.ink }}>{mode === 'before' ? landmark : afterSpot}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="w-12 shrink-0" style={{ color: '#8A8A8A' }}>{d.sceneLabel}</dt>
                  <dd style={{ color: C.ink }}>{d.scenes[scene]}</dd>
                </div>
              </dl>
              <p className="text-[12px] leading-relaxed mb-5" style={{ color: '#8A8A8A' }}>{d.done}</p>
              <button
                onClick={() => reset(mode)}
                className="w-full py-3 rounded-xl text-[15px] font-medium"
                style={{ background: C.tint, color: C.rose, border: `1px solid ${C.soft}` }}
              >
                {d.reset}
              </button>
            </div>
          ) : (
            <div className="px-5 pb-6">
              <p className="text-[19px] font-semibold" style={{ color: C.ink }}>{d.title}</p>
              <p className="text-[13px] mt-1 mb-5" style={{ color: '#8A8A8A' }}>{d.sub}</p>

              <p className="text-[14px] font-semibold mb-2.5" style={{ color: C.ink }}>{d.sceneLabel}</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {d.scenes.map((s, i) => (
                  <button
                    key={s}
                    onClick={() => setScene(i)}
                    className="py-2.5 rounded-xl text-[13px] transition-colors"
                    style={{
                      background: i === scene ? C.tint : '#fff',
                      color: i === scene ? C.rose : C.ink,
                      border: `1px solid ${i === scene ? C.rose : C.line}`,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {mode === 'before' ? (
                <>
                  <p className="text-[14px] font-semibold mb-2.5" style={{ color: C.ink }}>{d.cityLabel}</p>
                  {/* 五个胶囊必须挤在一行 —— 真机上就是一行，换行会削弱「只有这么多」的观感 */}
                  <div className="flex flex-nowrap gap-1.5 mb-5">
                    {CITIES.map(c => (
                      <button
                        key={c}
                        onClick={() => setCity(c)}
                        className="px-2.5 py-1.5 rounded-full text-[12px] whitespace-nowrap transition-colors"
                        style={{
                          background: c === city ? C.rose : '#fff',
                          color: c === city ? '#fff' : C.ink,
                          border: `1px solid ${c === city ? C.rose : C.line}`,
                        }}
                      >
                        {c}
                      </button>
                    ))}
                  </div>

                  <p className="text-[14px] font-semibold mb-2.5" style={{ color: C.ink }}>{d.landmarkLabel}</p>
                  <input
                    value={landmark}
                    onChange={e => setLandmark(e.target.value)}
                    placeholder={d.landmarkPlaceholder}
                    className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                    style={{ background: C.tint, border: `1px solid ${C.soft}`, color: C.ink }}
                  />
                </>
              ) : (
                <>
                  <p className="text-[14px] font-semibold mb-2.5" style={{ color: C.ink }}>{d.landmarkLabel}</p>
                  <input
                    value={query}
                    onChange={e => { setQuery(e.target.value); setPicked(null) }}
                    placeholder={d.searchPlaceholder}
                    className="w-full px-4 py-3 rounded-xl text-[14px] outline-none"
                    style={{ background: C.tint, border: `1px solid ${C.soft}`, color: C.ink }}
                  />

                  {query.trim() && !picked && (
                    <ul className="mt-2 rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
                      {matches.map(p => (
                        <li key={p.t}>
                          <button
                            onClick={() => { setPicked(p); setQuery(p.t) }}
                            className="w-full text-left px-4 py-2.5"
                            style={{ borderBottom: `1px solid ${C.line}` }}
                          >
                            <span className="block text-[14px]" style={{ color: C.ink }}>{p.t}</span>
                            <span className="block text-[11px] mt-0.5" style={{ color: '#9A9A9A' }}>{p.s}</span>
                          </button>
                        </li>
                      ))}
                      {matches.length === 0 && (
                        <li className="px-4 py-2.5 text-[12px]" style={{ color: '#9A9A9A' }}>{d.noMatch}</li>
                      )}
                    </ul>
                  )}

                  {/* 拆分结果：这一小块就是那套逻辑的全部产出 */}
                  {afterSpot && (
                    <div className="mt-4 p-3.5 rounded-xl" style={{ background: C.tint, border: `1px solid ${C.soft}` }}>
                      <div className="flex gap-3 text-[13px]">
                        <span className="w-9 shrink-0" style={{ color: '#8A8A8A' }}>{d.cityField}</span>
                        <span style={{ color: C.deep }}>{afterCity}</span>
                      </div>
                      <div className="flex gap-3 text-[13px] mt-1.5">
                        <span className="w-9 shrink-0" style={{ color: '#8A8A8A' }}>{d.landmarkField}</span>
                        <span style={{ color: C.ink }}>{afterSpot}</span>
                      </div>
                      {picked?.s && (
                        <p className="text-[11px] mt-2.5 leading-snug" style={{ color: '#9A9A9A' }}>
                          {d.parsedFrom}「{picked.s}」
                        </p>
                      )}
                    </div>
                  )}
                </>
              )}

              <button
                disabled={!ready}
                onClick={() => setDone(true)}
                className="w-full mt-6 py-3 rounded-xl text-[15px] font-medium transition-opacity"
                style={{ background: C.rose, color: '#fff', opacity: ready ? 1 : 0.35 }}
              >
                {d.cont}
              </button>
            </div>
          )}
        </div>

        {/* ── 说明 ── */}
        <div className="mt-8 md:mt-0 max-w-prose">
          <div className="flex gap-2 mb-5">
            {[['before', d.before], ['after', d.after]].map(([m, label]) => (
              <button
                key={m}
                onClick={() => reset(m)}
                className={`px-3.5 py-1.5 text-[13px] border transition-colors ${
                  mode === m
                    ? 'bg-cinnabar text-white border-cinnabar dark:bg-[#E08A72] dark:border-[#E08A72] dark:text-[#141310]'
                    : `${dark ? 'border-[#2A2621]' : 'border-rule'} ${muted} hover:text-cinnabar dark:hover:text-[#E08A72]`
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <p className={`text-[15px] leading-[1.75] ${dark ? 'text-[#C4BEB3]' : 'text-[#3D3831]'}`}>
            {mode === 'before' ? d.beforeHint : d.afterHint}
          </p>

          <p className={`text-[12px] leading-relaxed mt-6 ${muted}`}>{d.disclaimer}</p>
        </div>
      </div>
    </figure>
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
            <SectionHead n={w.toc.items[0].n} epigraph={w.exp.epigraph} muted={rule}>{w.exp.title}</SectionHead>

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
            <SectionHead n={w.toc.items[1].n} epigraph={w.proj.epigraph} muted={rule}>{w.proj.title}</SectionHead>

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
                      <PublishDemo w={w} lang={lang} muted={muted} dark={dark} />
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
                    <p className="mt-9">
                      <a
                        href={`${BASE}${proj.link.href}`}
                        target="_blank"
                        rel="noreferrer"
                        className="link font-mono text-[13px] text-cinnabar dark:text-[#E08A72]"
                      >
                        {proj.link.label} →
                      </a>
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          {/* ── 教育 ── */}
          <section id="education" className="scroll-mt-20">
            <SectionHead n={w.toc.items[2].n} epigraph={w.edu.epigraph} muted={rule}>{w.edu.title}</SectionHead>

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
            <SectionHead n={w.toc.items[3].n} epigraph={w.log.epigraph} muted={rule}>{w.log.title}</SectionHead>

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

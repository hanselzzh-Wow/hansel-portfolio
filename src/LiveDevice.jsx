// ─────────────────────────────────────────────────────────────────────────────
// 真机演示：把一台跑着真 App 的云端 iOS 设备嵌进页面。
//
// 为什么不是录屏、不是 HTML 仿制：这两样都在替读者做判断。真机不替他判断，
// 他自己点，点出什么算什么 —— 这是网页相对纸的唯一优势，不用就没必要做网页。
//
// 三条硬约束决定了这个组件的形状：
//   1. Appetize 免费档 30 分钟/月、单次 3 分钟。所以默认不自动启动 ——
//      静态首帧摆在那儿，点了才烧额度。倒计时明写出来，别让人以为卡住了。
//   2. 额度会用完，网络会断。任何失败都必须退回下面那排截图，
//      绝不能给面试官留一个转圈的空框 —— 那比没有这个功能更糟。
//   3. 手机里再嵌一台手机是滑稽的。窄屏直接给整页链接，不套娃。
//
// publicKey 留空时整个组件返回 null：截图照常在，页面看不出少了什么。
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useRef, useCallback } from 'react'

const BASE = import.meta.env.BASE_URL

// Appetize 的 iframe 源。screenOnly 去掉他们的外壳工具条，
// 剩下的参数都从 content.js 传进来，换机型不用改这里。
function embedSrc(cfg) {
  const q = new URLSearchParams({
    device: cfg.device,
    scale: 'auto',
    autoplay: 'true',
    screenOnly: 'true',
    centered: 'both',
    deviceColor: 'black',
  })
  // 模拟器默认英文，中文版的演示要显式指定，否则读者看到的是另一套文案。
  // 用 BCP 47（zh-CN）而不是 zh —— 文档给的样例是 fr-FR 这种带地区的形式。
  if (cfg.language) q.set('language', cfg.language)
  // 故意不传 osVersion：官方文档明写「嵌入时建议不要带 osVersion，
  // 否则拿不到他们的最新默认版本」。写死一个版本号的风险是那个版本某天下线，
  // 页面上就只剩一个报错的框 —— 而这正是这个组件最不能出现的状态。
  return `https://appetize.io/embed/${cfg.publicKey}?${q}`
}

const mmss = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export default function LiveDevice({ cfg, t, poster, alt, muted, dark }) {
  // idle → live → ended / error。没有 loading 态：iframe 自己会先黑一下，
  // 再叠一层「加载中」只会让人以为有两段等待。
  const [state, setState] = useState('idle')
  const [left, setLeft] = useState(cfg?.sessionSeconds ?? 180)
  const [narrow, setNarrow] = useState(false)
  const timer = useRef(null)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setNarrow(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  // 会话倒计时。这个数字不是装饰 —— 免费档单次就是 3 分钟，
  // 读者知道自己有多少时间，才会先点最想看的那一屏。
  useEffect(() => {
    if (state !== 'live') return
    timer.current = setInterval(() => {
      setLeft(s => {
        if (s <= 1) {
          clearInterval(timer.current)
          setState('ended')
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timer.current)
  }, [state])

  // Appetize 通过 postMessage 报告会话结束和错误。事件名各版本不完全一致，
  // 所以只做包含匹配，宁可漏判也不能把正常会话误杀。
  useEffect(() => {
    if (state !== 'live') return
    const onMsg = e => {
      // e.origin 可能是 "null"（沙箱 iframe）或空串（某些扩展），
      // 那时 new URL() 直接抛异常，整个监听器就死了 —— 会话结束和错误
      // 都不再被捕获，读者卡在一个永远不动的框里。所以先包住再判断。
      let host
      try { host = new URL(e.origin).hostname } catch { return }
      if (!/(^|\.)appetize\.io$/.test(host)) return
      const name = typeof e.data === 'string' ? e.data : e.data?.type || ''
      if (/error|timeout|queue/i.test(name)) setState('error')
      else if (/sessionEnded|end/i.test(name)) setState('ended')
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [state])

  const start = useCallback(() => {
    setLeft(cfg?.sessionSeconds ?? 180)
    setState('live')
  }, [cfg])

  if (!cfg?.publicKey) return null

  const frame = dark ? 'border-[#2A2621]' : 'border-rule'
  const posterImg = (
    <img
      src={`${BASE}${poster}`}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover object-top"
    />
  )

  return (
    <figure className="mt-14">
      <figcaption className={`font-mono text-[11px] tracking-[0.18em] uppercase mb-5 ${muted}`}>
        {t.label}
      </figcaption>

      <div className="md:grid md:grid-cols-[17rem_minmax(0,1fr)] md:gap-x-10 items-start">
        {/* 设备框：宽高比锁死，避免 iframe 载入时页面往下跳一截 */}
        <div className={`relative w-[17rem] max-w-full aspect-[9/19.5] overflow-hidden rounded-[2rem] border ${frame}`}>
          {state === 'live' && !narrow ? (
            <iframe
              src={embedSrc(cfg)}
              title={t.label}
              allow="microphone *; camera *"
              className="absolute inset-0 w-full h-full"
              onError={() => setState('error')}
            />
          ) : (
            <>
              {posterImg}
              {/* 首帧上盖一层，让人一眼看出这不是图 */}
              <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/55 via-transparent to-transparent p-5">
                {state === 'idle' && (
                  narrow ? (
                    <a
                      href={`https://appetize.io/app/${cfg.publicKey}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full text-center font-mono text-[12px] py-2.5 bg-white/95 text-[#1C1A18] rounded-full"
                    >
                      {t.openFull} →
                    </a>
                  ) : (
                    <button
                      onClick={start}
                      className="w-full font-mono text-[12px] py-2.5 bg-white/95 text-[#1C1A18] rounded-full hover:bg-white transition-colors"
                    >
                      {t.start}
                    </button>
                  )
                )}
                {state === 'ended' && (
                  <button
                    onClick={start}
                    className="w-full font-mono text-[12px] py-2.5 bg-white/95 text-[#1C1A18] rounded-full hover:bg-white transition-colors"
                  >
                    {t.again}
                  </button>
                )}
                {state === 'error' && (
                  <p className="w-full text-center font-mono text-[11px] leading-relaxed text-white/90">
                    {t.exhausted}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* 右栏：说明与状态。跟边注同一套语气，不用提示框那种 UI 腔 */}
        <div className="mt-6 md:mt-0 max-w-prose">
          <p className={`text-[15px] leading-[1.75] ${dark ? 'text-[#C9C2B8]' : 'text-ink'}`}>
            {t.blurb}
          </p>

          {state === 'live' && (
            <p className="font-mono text-[12px] mt-4 text-cinnabar dark:text-[#E08A72]">
              {t.remaining} {mmss(left)}
            </p>
          )}
          {state === 'ended' && (
            <p className={`font-mono text-[12px] mt-4 ${muted}`}>{t.endedNote}</p>
          )}

          <p className={`font-mono text-[11px] mt-5 leading-relaxed ${muted}`}>{t.disclaimer}</p>
        </div>
      </div>
    </figure>
  )
}

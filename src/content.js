// ─────────────────────────────────────────────────────────────────────────────
// 内容层：改简历只改这个文件。
//
// 结构约定：
//   exp.items[] / proj.items[]  —— 倒序，最新的放最前
//   sidenotes[]                 —— 渲染到版心右侧的边注，不是卡片；一段最多 4 条
//   desc[]                      —— '||' 前是小标题，后是正文；不带 '||' 则整条是正文
//   log.items[]                 —— 改版记录，只写真的发生过的事
//
// 写文案的规矩（上一版栽在这上面）：
//   不用「赋能 / 沉淀 / 闭环 / 抓手 / 助力」这类词；
//   不写「把洞察做成产品」这种换个人名照样成立的句子；
//   能给数字就给数字，给不出就写清楚是什么状态。
// ─────────────────────────────────────────────────────────────────────────────

export const tools = ['Excel', 'PowerPoint', 'Figma', 'Canva', 'CapCut', 'Claude', 'ChatGPT', 'Gemini']


// App 截图：public/screens/，从构建 16 的模拟器现拍，缩到宽 540。
// 四张都是未登录或空态 —— 帮助页那张拍到了生产环境里真实的心愿内容，撤掉了。
export const screens = [
  {
    file: '01-home.png',
    zh: { label: '首页', note: '没有故事就说没有。不摆假数据、不造点赞数。' },
    en: { label: 'Home', note: "When there's nothing, it says so. No fake data, no invented counts." },
  },
  {
    file: '03-publish.png',
    zh: { label: '发布', note: '地点原本是五个写死的城市。现在一个搜索框，MapKit 实时补全。' },
    en: { label: 'Publish', note: 'Location used to be five hardcoded cities. One search field now, live MapKit completion.' },
  },
  {
    file: '04-chat.png',
    zh: { label: '私聊', note: '只在发布者和响应者之间进行，所以必须登录。' },
    en: { label: 'Chat', note: 'Only between the two people involved, so it needs an account.' },
  },
  {
    file: '05-profile.png',
    zh: { label: '我的', note: 'Sign in with Apple，只接收匿名标识。账户删除与令牌撤销挂在这里。' },
    en: { label: 'Profile', note: 'Sign in with Apple, anonymous identifier only. Account deletion and token revocation live here.' },
  },
]

// ── 真机演示配置 ──────────────────────────────────────────────────────────
// publicKey 就是分享链接 appetize.io/embed/<这一段> 里的那一段。留空时整块不渲染，
// 页面上只剩截图 —— 所以没配好也不会露馅，配好了才多一层。
//
// sessionSeconds 要跟你所在档位的单次会话上限一致：
// 免费档 180 秒（30 分钟/月，约等于 10 次访问），Starter 以上不限。
// 写小了会自己掐断，写大了读者会在倒计时归零前被 Appetize 踢掉。
export const liveDemo = {
  gratia: {
    publicKey: '',
    poster: 'screens/01-home.png',
    device: 'iphone16pro',
    language: 'zh-CN',            // 模拟器默认英文，中文版必须显式指定
    sessionSeconds: 180,
  },
  artemi: {
    publicKey: 'b_rtjnwjktq42t2gntha7xj4r2am',
    poster: 'artemi/health.jpg',
    device: 'iphone16pro',
    language: 'zh-CN',
    sessionSeconds: 180,
  },
}

// Artemi 界面：public/artemi/ —— 只留 App 截图，实物照片已撤
export const artemiShots = [
  {
    file: 'home.jpg',
    zh: { label: '家', note: '这一页我推翻过自己：原本是 SceneKit 实时 3D，程序化几何体拼的狗，后来整个换成实拍。' },
    en: { label: 'Home', note: 'The screen I reversed myself on — it began as a live SceneKit scene with a procedural dog, and became a real photograph.' },
  },
  {
    file: 'health.jpg',
    zh: { label: '健康', note: '默认启动页。先回答「今天正不正常」，再往下才是呼吸、体温、脉搏和睡眠的七日趋势。' },
    en: { label: 'Health', note: 'The launch screen. It answers "is today normal" first; the seven-day trends come after.' },
  },
  {
    file: 'ai.jpg',
    zh: { label: '问问 AI', note: '「为什么喝水变少了？」—— 这是市面上的项圈都不回答的那一类问题。' },
    en: { label: 'Ask AI', note: '"Why is she drinking less?" — the kind of question no collar on the market answers.' },
  },
  {
    file: 'locate.jpg',
    zh: { label: '定位', note: '安全范围以家为中心 200 米，离开即时提醒。' },
    en: { label: 'Locate', note: 'A safe zone 200 m around home, with an instant alert on leaving.' },
  },
  {
    file: 'profile.jpg',
    zh: { label: '我的', note: '设备与服务里，项圈旁边就是 eufy HomeBase S380。' },
    en: { label: 'Profile', note: 'Under devices, the collar sits right next to a eufy HomeBase S380.' },
  },
]

export const content = {
  en: {
    nav: { exp: 'Experience', proj: 'Work', edu: 'Education', log: 'Changelog', dl: 'Résumé' },
    hero: {
      name: 'Hansel Zhang',
      nameAlt: '张增辉',
      line1: "Int'l Business & English, dual degree, Huazhong University of Science and Technology. Class of 2027.",
      now: "Right now I'm building an app that keeps your decision memory: it records only the moments you actually hesitated, and never invents the road you didn't take.",
      seeking: 'Looking for a full-time role, graduating June 2027.',
      emailLabel: 'Email',
      phoneLabel: 'Phone',
      copied: 'copied',
    },
    // 前言在目录之前 —— 「请翻下一页」翻到的就是目录，这句话在网页上要真的成立
    preface: {
      title: 'Preface',
      lines: [
        'Welcome, whoever you are.\nThank you for the time it takes to get to know someone.',
        "In here you'll find what I've done and what I can do; you'll also see how I make things, and who I am; and I hope you'll hear me out on how I think and what I'm after.",
      ],
      sign: "Hi — my name is Hansel Zhang. Please turn the page.",
    },
    toc: {
      title: 'Contents',
      items: [
        { n: 'I', label: 'Experience', href: '#experience' },
        { n: 'II', label: 'Work', href: '#work' },
        { n: 'III', label: 'Education', href: '#education' },
        { n: '—', label: 'Changelog', href: '#changelog' },
      ],
    },
    exp: {
      title: 'Experience',
      items: [
        {
          key: 'anker',
          company: 'Anker Innovations',
          role: 'Service Operations Intern · eufy, German market',
          date: 'Jul 2026 – present',
          current: true,
          sidenotes: [
            { k: 'Day 2', v: 'when the automation shipped' },
            { k: '20 min', v: 'was a whole morning' },
            { k: '1st', v: 'in the Sailor Program challenge' },
          ],
          points: [
            {
              h: 'Amazon ratings',
              body: "Tracked displayed and computed star ratings for eufy on Amazon.de, counted each day's new reviews, and matched negative ones against support tickets — only once they're matched do you know which complaints can actually be resolved by talking to the customer. The rating is the outcome; these are the few places you can put a hand on it.",
            },
            {
              h: 'Service material',
              body: 'Owned the service package several new products needed before launching in Germany: German how-to videos, from script to edit, plus troubleshooting guides and workflows for both Amazon and the German site, covering new and existing products.',
            },
            {
              h: 'Automated it on day two',
              body: 'The ratings work meant filling one large sheet by hand, which ate a whole morning. On my second day I rebuilt it as an automated flow using the company\'s internal AI. It now takes twenty minutes.',
            },
            {
              h: 'One revision of a manual',
              body: "While reading reviews I noticed customers pointing out grammar and spelling errors in the German manual. Not my remit, but it explained where some of the negative reviews came from — I raised it, and a corrected revision shipped.",
            },
          ],
        },
        {
          key: 'shengtian',
          company: 'Shengtian Network',
          role: 'Operations Intern',
          date: 'Feb – May 2026',
          current: false,
          sidenotes: [
            { k: '2,000+', v: 'avg. PV per article' },
            { k: '+20%', v: 'membership conversion' },
            { k: '50+', v: 'videos shipped' },
            { k: '2×', v: 'views and likes' },
          ],
          points: [
            {
              h: 'Content & growth',
              body: 'Wrote and distributed game and gameplay coverage. What moved the numbers was starting from what players were actually complaining about instead of what the product wanted to announce — articles averaged over 2,000 PV and site membership conversion rose 20%.',
            },
            {
              h: 'Short video',
              body: 'Fifty-odd promo videos, shoot through release. The part that mattered was wiring backend numbers back into what we made next; views and likes doubled.',
            },
            {
              h: 'Automation',
              body: 'Built a Playwright tool with the engineering team that killed the manual cross-channel upload, and wrote the SOP so it outlived the two of us.',
            },
          ],
        },
      ],
    },
    proj: {
      title: 'Work',
      screensLabel: 'The app',
      screensHint: 'Tap any screen to enlarge.',
      close: 'Close',
      live: {
        label: 'Live device',
        start: 'Start the real app',
        again: 'Start again',
        openFull: 'Open full screen',
        remaining: 'Session ends in',
        endedNote: 'Session over. The stills below are the same build.',
        exhausted: 'Out of demo minutes this month — the stills below are the same build.',
        disclaimer: 'A real iOS build streaming from a cloud device. Not a video, not a web mock-up.',
        gratia: 'This is the build that went to App Store review — number 16. Post a wish, search, help, profile: go anywhere. The publish flow further up is a web mock-up; this is not.',
        artemi: 'All five primary screens respond. On Home, touch Polly — that reaction is the thing a screenshot can never hand you. Every number is mocked locally: no Bluetooth, no GPS, no third-party AI.',
      },
      items: [
        {
          key: 'artemi',
          name: 'Artemi · Smart Pet Collar',
          tagline: 'Know their day. Guard every step.',
          date: 'Jul 2026',
          role: 'Team lead · concept and the app',
          status: 'Sailor Program challenge · 1st in class',
          stack: 'SwiftUI · Swift Charts · Speech · Artemi Collar D1 Pro',
          sidenotes: [
            { k: '1st', v: 'product challenge' },
            { k: '5', v: 'primary screens' },
            { k: '1,128', v: 'lines of SwiftUI' },
          ],
          desc: [
            "The product challenge closing Anker's 2026 Sailor Program training, Group 4. Most of my team were graduate students; I led it and owned the whole case: product definition, the core pitch, the prototypes, this app, and the channel and content strategy in the go-to-market plan.",
            'The opening came out of competitor research. Fi, Tractive, PetPace and Pawkey have sold millions of units doing the same thing: telling you where the dog is, how many steps it took, how often it barked. None of them answers why it barked, whether that is normal, whether you should act. What owners actually need is someone to turn those numbers into a judgement. So the pitch became putting location, voice, behaviour interpretation and camera hand-off into one device for the first time.',
            'The camera hand-off is not a bonus feature, it is what makes the pitch work: the collar detects distress, the camera confirms it — without calling a neighbour or leaving work. That is why the collar sits beside a eufy HomeBase S380 on the devices screen, plugging into the home hub Anker has already shipped. That is what makes it a product for Anker rather than a toy unrelated to the company.',
            "For go-to-market I bet on the Amazon flywheel: reviews lift rank, rank brings organic traffic, traffic returns more reviews — and how fast you start depends on whether the first fifty hold above 4.3. It is the same thing I do daily on eufy's German storefront: real ratings by day, a launch plan for my own product by night, running on the same judgement.",
            'The Home screen is one I reversed myself on: it began as a live SceneKit living room with a dog built from procedural geometry, and became a real photograph. A fake dog is a fake dog, and rather than ask the user to cover for it, use the real one. What shipped is a runnable SwiftUI demo — five primary screens, 1,128 lines, all data mocked locally, no Bluetooth, no GPS, no third-party AI. The mic in "Ask AI" uses Apple\'s on-device Speech framework: no network, no account.',
          ],
        },
        {
          key: 'gratia',
          name: 'Gratia · 哈喽卧得',
          tagline: "Have someone go there and do the small thing you can't.",
          date: 'Sep 2025 – present',
          role: 'Product owner, and the one writing it',
          status: 'Stopped iterating, by choice',
          stack: 'SwiftUI · Cloudflare Workers · D1 · R2 · Sign in with Apple · MapKit',
          sidenotes: [
            { k: '99/100', v: 'course roadshow' },
            { k: '11K', v: 'lines of Swift' },
            { k: '71/71', v: 'tests passing' },
          ],
          desc: [
            "It started as a cross-border e-commerce assignment for an international business course and scored 99 at the final roadshow. I didn't stop when the course did — I rebuilt it as a native iOS app: a 53-file, 11,000-line SwiftUI client on Cloudflare Workers, D1 and R2. Build 7 is uploaded to App Store Connect and validated.",
            'Halfway through I moved the whole product to a WeChat Mini Program to reach users faster, and got it all the way to a submission candidate — then walked it back to iOS once I was convinced the long-term experience belonged there. Around the same time I cut "operations" out of the core loop entirely and replaced it with four tiers of content review. Reversing cost me weeks. Pushing on would have cost more.',
            'The publish flow used to make you pick from five hardcoded cities. A product about going somewhere you can\'t reach, letting an array in the client decide what counts as far away. It\'s MapKit live completion now — and specifically MKLocalSearchCompleter rather than a third-party places API, because it only does text lookup and never reads device location. No permission prompt, no bill.',
            "Apple requires apps with account deletion to revoke sign-in tokens on the way out, and reviewers test it. Before writing any production config I probed the real endpoint with a deliberately invalid code just to see how it would refuse. And I refused to accept database state as proof — the only evidence I'd take was the app actually disappearing from Apple ID settings.",
          ],
          link: {
            href: 'https://testflight.apple.com/join/ftyuGZ8n',
            badgeTop: 'Test it on',
            label: 'TestFlight',
            note: 'Needs an iPhone and the TestFlight app.',
            qr: 'testflight-qr.svg',
          },
        },
        {
          key: 'roadnottaken',
          name: 'The Road Not Taken',
          tagline: 'Keep someone\u2019s decision memory, so they can gradually see themselves.',
          date: 'Aug 2026 \u2013 present',
          role: 'Solo product and build',
          status: 'Prototype closes the loop',
          stack: 'UIKit \u00b7 SpriteKit \u00b7 Core Animation \u00b7 cloud model',
          sidenotes: [
            { k: 'n=0', v: 'first value moment' },
            { k: '1,726', v: 'lines of Swift' },
            { k: '3 bands', v: 'of allowed tone' },
          ],
          desc: [
            '只在一个人真的停下来犹豫的那一刻才产生记录。它保存你真的选过的 A 与 B，以及事后真实的感受；没选的那条路从不虚构结果。',
            '不用打卡、连续天数和推送，所以第一条记录就得自己产出价值。把预期折进选择的手势，一条记录就能长出「你以为 4 分，实际 7 分」；同类犹豫第二次出现时，直接说出上一次。',
            '模型只做一件事：把一团纠结拆成两条路。模板命中走本地，未命中才去云端。语气按样本量分档 —— 1 条只能陈述，≥3 条才允许比较级。n=1 时系统没有资格比较，但有资格记得。',
          ],
        },
      ],
    },
    edu: {
      title: 'Education',
      school: 'Huazhong University of Science and Technology',
      major: "Int'l Business + English, dual degree",
      date: 'Sep 2023 – Jun 2027',
      core: "Int'l trade practice · E-commerce and cross-border trade · Financial statement analysis · Public speaking and debate",
      lang: 'CET-4 · CET-6 · TEM-4 (Excellent) · Mandarin Level 1-B',
      toolsLabel: 'Tools',
      campus: [
        {
          name: 'Varsity debater, faculty team captain',
          date: 'Sep 2024 – present',
          desc: 'Third at the university tournament. Still running business-topic debates — the fastest way I know to find out an argument is hollow.',
        },
        {
          name: 'Head of news centre & publicity, School of Economics',
          date: 'Oct 2024 – Oct 2025',
          desc: 'Planned and laid out dozens of features, covered flagship events, published lead pieces on the university site.',
        },
      ],
    },
    log: {
      title: 'Changelog',
      note: 'This site, honestly accounted for.',
      items: [
        { v: 'v.I', date: '13 May 2026', text: 'First version. Generated somewhere else, then dragged into GitHub as a folder of built files.' },
        { v: 'v.II', date: '14 May 2026', text: 'Edited the content. Which meant uploading an entire build again.' },
        { v: 'v.III–IV', date: '18 May 2026', text: 'Twice more. Web uploads only ever add files, so the repo quietly accumulated four sets of assets, three of which nothing referenced.' },
      ],
    },
    footer: {
      rights: 'All rights reserved.',
      colophon: 'Instrument Serif & DM Sans. React, Vite. No analytics.',
    },
  },

  zh: {
    nav: { exp: '实习', proj: '做过的东西', edu: '教育', log: '改版记录', dl: '简历' },
    hero: {
      name: '张增辉',
      nameAlt: 'Hansel Zhang',
      line1: '华中科技大学 · 国际商务 & 英语双学位 · 2027 届',
      now: '现在在做一个替你保存决策记忆的 App：只记你真的犹豫过的那些时刻，不虚构你没选的那条路。',
      seeking: '正在找 2027 届秋招机会。',
      emailLabel: '邮箱',
      phoneLabel: '电话',
      copied: '已复制',
    },
    preface: {
      title: '前言',
      lines: [
        '欢迎每一个来到这里的人。\n谢谢你愿意给我一个被了解的机会。',
        '在这里你会读到我的经历和我的能力；也会看见我的审美和我的性格；我还想请你听我说说我的心路和我的抱负。',
      ],
      sign: 'Hi，我叫张增辉。请翻下一页。',
    },
    toc: {
      title: '目录',
      items: [
        { n: '一', label: '实习', href: '#experience' },
        { n: '二', label: '做过的东西', href: '#work' },
        { n: '三', label: '教育', href: '#education' },
        { n: '附', label: '改版记录', href: '#changelog' },
      ],
    },
    exp: {
      title: '实习',
      items: [
        {
          key: 'anker',
          company: '安克创新',
          role: '服务运营实习生 · eufy 德国站',
          date: '2026.07 – 至今',
          current: true,
          sidenotes: [
            { k: '第 2 天', v: '做出自动化的时间' },
            { k: '20 分钟', v: '原本要一个上午' },
            { k: '班级第一', v: '水手计划挑战赛' },
          ],
          points: [
            {
              h: '亚马逊星级',
              body: '盯 eufy 德国站的外观星级与计算星级，统计每天新增的好评差评，再把差评和客诉记录对上号 —— 对上了才知道哪条差评是能沟通掉的。星级只是结果，能伸手的地方就这几处。',
            },
            {
              h: '服务资料',
              body: '独立统筹几个新品在德国上市前要备齐的服务资料：德语 how-to 视频的剪辑与文案，以及新老产品在亚马逊和德国官网的排故指南与 workflow。',
            },
            {
              h: '入职第二天先把活干掉',
              body: '星级管理要人工填一大张表，占掉一整个上午。第二天我用公司内部的 AI 把它做成了全自动流程，现在 20 分钟。',
            },
            {
              h: '一版说明书',
              body: '翻评论时注意到有用户提到德语说明书有语法和拼写错误。这不在我的活儿里，但它解释了一部分差评的来源 —— 主动提了修改建议，最后真的改出了一版。',
            },
          ],
        },
        {
          key: 'shengtian',
          company: '湖北盛天网络技术股份有限公司',
          role: '运营实习生',
          date: '2026.02 – 05',
          current: false,
          sidenotes: [
            { k: '2000+', v: '单篇平均阅读' },
            { k: '+20%', v: '会员开通率' },
            { k: '50+', v: '统筹视频' },
            { k: '×2', v: '播放与点赞' },
          ],
          points: [
            {
              h: '内容与增长',
              body: '写游戏产品和玩法资讯。真正让数字动起来的，是从玩家实际在抱怨什么下手，而不是从产品想宣布什么下手 —— 单篇平均阅读过了 2000，网站会员开通率涨了 20%。',
            },
            {
              h: '短视频',
              body: '五十多支宣传视频，从拍到发。起作用的那一步是把后台数据接回下一条要做什么，播放和点赞翻了一倍。',
            },
            {
              h: '自动化',
              body: '和研发一起写了个 Playwright 工具，把跨渠道手动上传这件事干掉了；顺手把流程写成 SOP，好让它比我们两个待得久。',
            },
          ],
        },
      ],
    },
    proj: {
      title: '做过的东西',
      screensLabel: '界面',
      screensHint: '点任意一屏放大。',
      close: '关闭',
      live: {
        label: '真机',
        start: '启动真机',
        again: '再来一次',
        openFull: '整页打开',
        remaining: '本次剩余',
        endedNote: '会话结束。下面那排是同一个构建的静态截图。',
        exhausted: '本月演示额度用完了 —— 下面那排截图出自同一个构建。',
        disclaimer: '云端设备串流的真实 iOS 构建。不是录屏，也不是网页仿制。',
        gratia: '这就是提交到 App Store 审核的那个构建，第 16 版。发布心愿、搜索、帮助、我的，随便点。上面那个发布流程是网页仿的，这个不是。',
        artemi: '五个一级页面都能点。「家」那一页轻触一下 Polly —— 那个反应是静态截图永远给不了的。数据全部本地模拟，没接蓝牙、GPS 或任何第三方 AI。',
      },
      items: [
        {
          key: 'artemi',
          name: 'Artemi · 智能宠物项圈',
          tagline: '听懂它的每一天，守护它的每一步。',
          date: '2026.07',
          role: '组长 · 产品构思与 App',
          status: '水手启航挑战赛 · 班级第一',
          stack: 'SwiftUI · Swift Charts · Speech · Artemi Collar D1 Pro',
          sidenotes: [
            { k: '班级第一', v: '产品挑战赛' },
            { k: '5', v: '一级页面' },
            { k: '1128', v: 'SwiftUI 行数' },
          ],
          desc: [
            '安克「2026 水手启航」培训结业的产品挑战赛，Group 4。组员大多是研究生，我做组长统筹全案：产品定义、核心卖点、原型图、这个 App，以及上市规划里的渠道与内容策略。',
            '切口是在竞品调研里找到的。Fi、Tractive、PetPace、帕奇宠卖了几百万台，做的是同一件事：告诉你狗在哪、走了几步、叫了几次。没有一家回答「它为什么叫、正不正常、我该不该管」—— 用户真正的需求是有人把这些数字翻译成一个判断。所以卖点定为把定位、语音、行为解释和摄像头联动第一次做进同一台设备，标语「懂它，比陪伴更近一步」。',
            '摄像头联动不是加分项，是这个卖点成立的前提：项圈检测到焦虑，摄像头自动联动确认 —— 不用打给邻居，也不用请假回家。所以设备页里项圈旁边挂的是 eufy HomeBase S380，接进安克已经铺开的家庭中枢。这才是给安克做的产品，不是一个跟公司无关的新玩具。',
            '上市规划我押的是 Amazon 的飞轮：评论涨排名、排名带自然流量、流量再换来评论，冷启动的速度取决于前 50 条能不能稳在 4.3 以上。这件事我每天在安克的 eufy 德国站上做 —— 白天盯真实的星级，晚上给自己的产品写上市方案，用的是同一套判断。',
            '「家」这一页我推翻过自己一次：最初是 SceneKit 实时 3D 客厅，程序化几何体拼出来的狗，后来整个换成实拍。假狗就是假狗，与其让使用者替它圆场，不如用真的。最终交付是可运行的 SwiftUI 演示版，五个一级页面、共 1128 行：数据全部本地模拟，没接蓝牙、GPS 或第三方 AI，「问问 AI」的麦克风走 Apple 端上的 Speech 框架，不联网也不需要账号。',
          ],
        },
        {
          key: 'gratia',
          name: '哈喽卧得 · Gratia',
          tagline: '替你去一个你到不了的地方，完成一件小事。',
          date: '2025.09 – 至今',
          role: '产品负责人，也是写代码的那个',
          status: '已主动停止迭代',
          stack: 'SwiftUI · Cloudflare Workers · D1 · R2 · Sign in with Apple · MapKit',
          sidenotes: [
            { k: '99/100', v: '课程路演' },
            { k: '1.1 万', v: 'Swift 行数' },
            { k: '71/71', v: '测试通过' },
          ],
          desc: [
            '起点是国际商务课的一份跨境电商作业，结项路演拿了 99 分。课程结束我没停 —— 把它重做成了原生 iOS App：SwiftUI 客户端 53 个文件、1.1 万行，后端跑在 Cloudflare Workers + D1 + R2 上。第 7 个构建已上传 App Store Connect 并通过校验。',
            '中途我把整个产品转去做微信小程序，想更快见到真实用户，也确实做到了可提交审核的程度；后来判断长期体验应该长在 iOS 上，又退了回来。同一时期把「运营」整个从核心闭环里砍掉，换成四类内容审核。退回来花掉了几周，硬撑下去会更贵。',
            '发布页原本只能从五个写死的城市里选。一个讲「替你去远方」的产品，却让客户端里的一个数组决定什么算远方。现在改成了 MapKit 实时补全，并且特意选 MKLocalSearchCompleter 而不是第三方地点服务 —— 它只做文本检索、不读设备位置，所以不用申请定位权限，也不产生费用。',
            'Apple 要求支持账户删除的 App 必须在删除时撤销登录令牌，审核会实测。写任何生产配置之前，我先拿一个必定无效的 code 去打真实端点，就为了看它怎么拒绝。也没把数据库状态当成撤销成功的证据 —— 唯一认的是 Apple ID 设置里这个 App 真的消失了。',
          ],
          link: {
            href: 'https://testflight.apple.com/join/ftyuGZ8n',
            badgeTop: '在 TestFlight 上',
            label: '安装测试版',
            note: '需要 iPhone 并已安装 TestFlight',
            qr: 'testflight-qr.svg',
          },
        },
        {
          key: 'roadnottaken',
          name: '\u672a\u9009\u62e9\u7684\u8def \u00b7 A/B \u4eba\u751f',
          tagline: '\u66ff\u4eba\u4fdd\u5b58\u51b3\u7b56\u8bb0\u5fc6\uff0c\u8ba9\u4eba\u9010\u6e10\u770b\u6e05\u81ea\u5df1\u3002',
          date: '2026.08 \u2013 \u81f3\u4eca',
          role: '\u72ec\u7acb\u4ea7\u54c1\u5b9a\u4e49\u4e0e\u5b9e\u73b0',
          status: '\u539f\u578b\u5df2\u8dd1\u901a\u5b8c\u6574\u95ed\u73af',
          stack: 'UIKit \u00b7 SpriteKit \u00b7 Core Animation \u00b7 \u4e91\u7aef\u6a21\u578b',
          sidenotes: [
            { k: 'n=0', v: '\u7b2c\u4e00\u4ef7\u503c\u65f6\u523b' },
            { k: '1726', v: 'Swift \u884c\u6570' },
            { k: '3 \u6863', v: '\u6d1e\u5bdf\u8bed\u6c14\u7ea6\u675f' },
          ],
          desc: [
            '\u53ea\u5728\u4e00\u4e2a\u4eba\u771f\u7684\u505c\u4e0b\u6765\u72b9\u8c6b\u7684\u90a3\u4e00\u523b\uff0c\u624d\u4ea7\u751f\u4e00\u6761\u8bb0\u5f55\u3002\u5b83\u4fdd\u5b58\u4f60\u771f\u7684\u9009\u8fc7\u7684 A \u4e0e B\uff0c\u4ee5\u53ca\u4e8b\u540e\u771f\u5b9e\u53d1\u751f\u7684\u611f\u53d7\uff1b\u6ca1\u9009\u7684\u90a3\u6761\u8def\u4ece\u4e0d\u865a\u6784\u7ed3\u679c\u3002\u628a\u300c\u72b9\u8c6b\u300d\u5b9a\u4e3a\u7eb3\u5165\u6807\u51c6\uff0c\u610f\u5473\u7740\u6837\u672c\u4e0d\u662f\u6240\u6709\u65e5\u5b50\uff0c\u800c\u662f\u4e00\u4e2a\u7cbe\u786e\u5b9a\u4e49\u7684\u5b50\u96c6 \u2014\u2014 \u6070\u597d\u5c31\u662f\u90a3\u4e9b\u771f\u6b63\u9700\u8981\u7b54\u6848\u7684\u65e5\u5b50\uff1b\u4e5f\u610f\u5473\u7740\u6bcf\u4e00\u6761\u6d1e\u5bdf\u90fd\u5fc5\u987b\u663e\u5f0f\u5e26\u4e0a\u8fd9\u4e2a\u6761\u4ef6\u624d\u6210\u7acb\u3002',
            '\u771f\u6b63\u91cd\u8981\u7684\u662f v0.2\uff0c\u800c\u5b83\u51fa\u81ea\u5bf9\u81ea\u5df1 v0.1 \u7684\u4e00\u6b21\u81ea\u67e5\u3002v0.1 \u628a\u4ef7\u503c\u5168\u90e8\u538b\u5728\u79ef\u7d2f\u4e4b\u540e\u7684\u5bf9\u6bd4\u4e0a\uff1a\u5927\u7ea6\u8981 20\u201330 \u8f6e\u8bb0\u5f55\u3001\u56db\u5230\u516b\u5468\u3002\u800c\u540c\u4e00\u4efd\u6587\u6863\u53c8\u4e3b\u52a8\u653e\u5f03\u4e86\u6253\u5361\u3001\u8fde\u7eed\u5929\u6570\u3001\u7ea2\u70b9\u548c\u63a8\u9001\u3002\u4e24\u4e2a\u51b3\u5b9a\u5404\u81ea\u90fd\u5bf9\uff0c\u653e\u5728\u4e00\u8d77\u662f\u81f4\u547d\u7684 \u2014\u2014 \u524d\u516b\u5468\u65e2\u6ca1\u4e1c\u897f\u53ef\u7ed9\uff0c\u4e5f\u6ca1\u4e1c\u897f\u62f4\u4f4f\u4eba\u3002v0.2 \u6ca1\u6709\u964d\u4f4e\u6d1e\u5bdf\u95e8\u69db\uff0c\u800c\u662f\u65b0\u589e\u4e09\u6761\u4e0d\u4f9d\u8d56\u6837\u672c\u91cf\u7684\u673a\u5236\uff1a\u7b2c\u4e00\u6b21\u8f93\u5165\u5c31\u80fd\u88ab\u597d\u597d\u95ee\u4e00\u4e2a\u95ee\u9898\uff1b\u628a\u9884\u671f\u6298\u8fdb\u9009\u62e9\u7684\u90a3\u4e00\u4e2a\u624b\u52bf\uff0c\u4e8e\u662f\u4e00\u6761\u8bb0\u5f55\u5c31\u80fd\u957f\u51fa\u300c\u4f60\u4ee5\u4e3a 4 \u5206\uff0c\u5b9e\u9645 7 \u5206\u300d\uff1b\u4ee5\u53ca\u540c\u7c7b\u72b9\u8c6b\u7b2c\u4e8c\u6b21\u51fa\u73b0\u65f6\uff0c\u5355\u7eaf\u5730\u8ba4\u51fa\u5b83\u3002',
            '\u6a21\u578b\u88ab\u62f4\u5f97\u5f88\u77ed\u3002\u6a21\u677f\u547d\u4e2d\u8d70\u672c\u5730\u786e\u5b9a\u6027\u6620\u5c04\uff0c\u672a\u547d\u4e2d\u624d\u8def\u7531\u5230\u4e91\u7aef\uff1b\u8de8\u8bb0\u5f55\u5206\u6790\u57fa\u4e8e\u7528\u6237\u81ea\u5df1\u7684\u5386\u53f2\u505a\u68c0\u7d22\u589e\u5f3a\uff0c\u4e0d\u4ece\u4efb\u4f55\u6cdb\u6cdb\u7684\u5e38\u8bc6\u91cc\u53d6\u3002\u8bed\u6c14\u6309\u6837\u672c\u91cf\u5206\u4e09\u6863\uff1a1 \u6761\u53ea\u80fd\u9648\u8ff0\uff0c2 \u6761\u53ea\u80fd\u5e76\u5217\uff0c\u2265 3 \u6761\u624d\u89e3\u9501\u6bd4\u8f83\u7ea7\u3002n=1 \u65f6\u7cfb\u7edf\u6ca1\u6709\u8d44\u683c\u6bd4\u8f83 \u2014\u2014 \u4f46\u5b83\u6709\u8d44\u683c\u8bb0\u5f97\u3002',
            '\u96be\u7684\u5730\u65b9\u5728\u4e8e\uff0c\u300c\u88ab\u597d\u597d\u95ee\u4e86\u4e00\u4e2a\u95ee\u9898\u300d\u662f\u4e00\u79cd\u6ca1\u6cd5\u76f4\u63a5\u89c2\u6d4b\u7684\u4ef7\u503c\u3002\u6240\u4ee5\u7ed9\u5b83\u5b9a\u4e86\u4e09\u4e2a\u4ee3\u7406\u6307\u6807\uff1a\u8ffd\u95ee\u51fa\u73b0\u540e\u4e3b\u52a8\u8ffd\u52a0\u6587\u5b57\u7684\u6bd4\u4f8b\u3001\u5230\u505a\u51fa\u9009\u62e9\u7684\u505c\u987f\u65f6\u957f\u3001\u8ffd\u95ee\u540e\u6539\u53d8\u9009\u62e9\u7684\u6bd4\u4f8b\u3002\u7b2c\u4e09\u6761\u662f\u6700\u8bda\u5b9e\u7684\u4e00\u6761 \u2014\u2014 \u5b83\u82e5\u4e3a 0\uff0c\u5c31\u8bf4\u660e\u90a3\u4e2a\u95ee\u9898\u53ea\u662f\u88c5\u9970\u3002\u4ea4\u4ed8\u662f\u53ef\u8fd0\u884c\u7684 UIKit + SpriteKit \u539f\u578b\uff0c1726 \u884c\uff1a\u4e00\u6761\u4ece\u5de6\u4e0b\u5411\u53f3\u4e0a\u6301\u7eed\u5ef6\u4f38\u7684\u8def\uff0c\u4eba\u4e00\u76f4\u5728\u8d70\uff0c\u9009\u62e9\u4ee5\u8def\u6807\u7684\u5f62\u5f0f\u51fa\u73b0\uff0c\u800c\u4e0d\u662f\u5207\u5230\u53e6\u4e00\u4e2a\u9875\u9762\u3002\u8fd9\u91cc\u6545\u610f\u4e0d\u7528 SwiftUI \u2014\u2014 \u8fde\u7eed\u7a7a\u95f4\u5c31\u662f\u8fd9\u4e2a\u4ea7\u54c1\u7684\u9690\u55bb\uff0c\u9875\u9762\u5207\u6362\u4f1a\u628a\u5b83\u78b0\u788e\u3002',
          ],
        },
      ],
    },
    edu: {
      title: '教育',
      school: '华中科技大学',
      major: '国际商务 + 英语，双学位',
      date: '2023.09 – 2027.06',
      core: '国际贸易实务 · 电子商务与跨境电商 · 财务报表分析 · 英语演讲与辩论',
      lang: 'CET-4 · CET-6 · TEM-4（优秀）· 普通话一级乙等',
      toolsLabel: '常用工具',
      campus: [
        {
          name: '校队主力辩手 · 院辩论队队长',
          date: '2024.09 – 至今',
          desc: '校级赛事季军。到现在还在组织商业议题对抗 —— 这是我知道的、最快发现一个论点其实是空的的办法。',
        },
        {
          name: '经济学院 新闻中心 / 党建宣传部部长',
          date: '2024.10 – 2025.10',
          desc: '主导数十篇推文的策划与排版，跟进重点活动，在校级官网发表核心文章。',
        },
      ],
    },
    log: {
      title: '改版记录',
      note: '这个网站自己的账，如实记。',
      items: [
        { v: 'v.I', date: '2026.05.13', text: '第一版。整站在别处生成，然后把一个装着构建产物的文件夹拖进 GitHub。' },
        { v: 'v.II', date: '2026.05.14', text: '改了点内容。也就是说，又整个上传了一次构建产物。' },
        { v: 'v.III–IV', date: '2026.05.18', text: '又来了两次。网页上传只加不删，仓库里于是攒下四组 assets，其中三组没有任何地方引用。' },
      ],
    },
    footer: {
      rights: '保留所有权利。',
      colophon: 'Instrument Serif 与 DM Sans 排版。React、Vite 构建。没有统计代码。',
    },
  },
}

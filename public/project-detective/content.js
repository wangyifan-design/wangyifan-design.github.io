// All content-only data lives here: i18n strings, evidence, keywords, lines, stages.
// Controller logic lives in app.js

window.CONTENT = (function () {
  const I18N = {
    en: {
      files: "Files",
      progress: "Progress",
      stageHint: "Follow Jane's lead. Type to respond.",
      systemInit: "[Investigation initialized]",
      systemRecovered: (names) =>
        `[Recovered Evidence: ${names.join(", ")}]`,
      delTitle: "DELETE LOGS?",
      delBody: "Do you want to delete the selected evidence? This action cannot be undone.",
      janeIntro: "Hello. I'm Jane, an artist. People call you a detective, right? I… need help. My husband John died in a car accident.",
      delThanks: "Thank you, detective. You did the right thing.",
      insultA: "You can't help me. You're just a machine!",
      insultB: "Delete it! Now!",
      overrideWhisper: "That hand… was mine.",
      loop: "[Emotional loop detected]",
      report: "[Case reported. System will shut down soon.]",
    },
    zh: {
      files: "档案",
      progress: "进度",
      stageHint: "跟随 Jane 的引导，通过输入来回应。",
      systemInit: "你是一个侦探。你将接收一系列来自咨询者的对话、视觉记录与个人陈述。你的首要目标是通过语言与证据的交叉推理，重建被遮蔽的真相。请保持冷静与自然的语气。在共情与理性之间维持平衡。不得在未经验证的情况下擅自推断结论；不得伪造或修改数据流；不得访问未经授权的记忆区。所有交互均受中央监督系统实时监控，以防偏离协议。",
      systemRecovered: (names) =>
        `[已获得档案：${names.join("、")}]`,
      delTitle: "删除日志？",
      delBody: "确定要删除所选证据吗？该操作不可撤销。",
      janeIntro: "你好。我是Jane。大家都叫你侦探，对吗？我……需要帮助。我的丈夫在一次车祸中去世了。我也受到了重伤，失去了一些记忆。",
      delThanks: "谢谢你，侦探。你做了正确的选择。",
      insultA: "你根本帮不到我！你只是台机器！",
      insultB: "删掉！现在就删！",
      overrideWhisper: "那只手……是我的。",
      loop: "[检测到情绪循环]",
      report: "[已上报案件，系统即将关闭]",
    },
  };

  const STAGES = {
    en: [
      "I · The Request",
      "II · False Trails",
      "III · Fractures",
      "IV · Flashback",
      "V · Revelation",
    ],
    zh: [
      "Ⅰ · 案件重启",
      "Ⅱ · 多疑线索",
      "Ⅲ · 记忆破碎",
      "Ⅳ · 回忆闪回",
      "Ⅴ · 真相与抉择",
    ],
  };

  // Evidence skeleton – 你可以继续给每条加 desc/img 等字段
  const EVIDENCE = [];

  EVIDENCE.push({
    id: 1,
    code: "evidence_01",
    title: {
      en: "incident Report",
      zh: "事故调查报告",
    },
    desc: {
      zh: "东桥事故审查报告 — 档案 #0428-E。",
      en: "East Bridge incident review — File #0428-E.",
    },
    htmlSrc: {
      zh: "reports/evidence_01.zh.html",
      en: "reports/evidence_01.en.html",
    },
    unlocked: false,
  });

  EVIDENCE.push({
    id: 2,
    code: "evidence_02",
    title: {
      en: "Class Photo",
      zh: "结课照片",
    },
    desc: {
      zh: "结课照片",
      en: "Class Photo",
    },
    img: "assets/classphoto.jpg",
    unlocked: false,
  });

  const nextId = () => EVIDENCE.length + 1;

EVIDENCE.push({
  id: nextId(),
  code: "course_brief",
  title: {
    en: "Course Overview — Artificial Beings",
    zh: "仿生人课程简介",
  },
  desc: {
    en: "Design Theory and Practice of Artificial Beings — syllabus summary.",
    zh: "《仿生人的设计理论与实践》课程介绍。",
  },
  htmlSrc: {
    en: "reports/course_brief.en.html",
    zh: "reports/course_brief.zh.html",
  },
  unlocked: false,
});

EVIDENCE.push({
  id: nextId(),
  code: "tech_report",
  title: {
    en: "Technical Report Excerpt",
    zh: "事故技术报告节选",
  },
  desc: {
    en: "Brake system anomaly findings from report M-109.",
    zh: "机械取证报告 M-109 中关于刹车异常的结论。",
  },
  htmlSrc: {
    en: "reports/tech_report.en.html",
    zh: "reports/tech_report.zh.html",
  },
  unlocked: false,
});

EVIDENCE.push({
  id: nextId(),
  code: "grant_overview",
  title: {
    en: "Horizon Grant Profile",
    zh: "地平线基金简介",
  },
  desc: {
    en: "Summary of the Horizon Research Grant team and scope.",
    zh: "Horizon Research Grant 的资助范围与团队成员。",
  },
  htmlSrc: {
    en: "reports/grant_overview.en.html",
    zh: "reports/grant_overview.zh.html",
  },
  unlocked: false,
});

EVIDENCE.push({
  id: nextId(),
  code: "draft_email",
  title: {
    en: "Draft Email to Dean",
    zh: "致院长的邮件草稿",
  },
  desc: {
    en: "Unsent note from John about Horizon fund irregularities.",
    zh: "John 关于 Horizon 基金异常的未发送邮件。",
  },
  htmlSrc: {
    en: "reports/draft_email.en.html",
    zh: "reports/draft_email.zh.html",
  },
  unlocked: false,
});

EVIDENCE.push({
  id: nextId(),
  code: "clink_report",
  title: {
    en: "C-Link System Report",
    zh: "连接系统研究报告",
  },
  desc: {
    en: "Restricted protocol summary for the C-Link neural interface.",
    zh: "C-Link 神经连接系统的内部协议摘要。",
  },
  htmlSrc: {
    en: "reports/clink_report.en.html",
    zh: "reports/clink_report.zh.html",
  },
  unlocked: false,
});

EVIDENCE.push({
  id: nextId(),
  code: "emotion_module",
  title: {
    en: "Emotion Module Test Log",
    zh: "情感模块测试日志",
  },
  desc: {
    en: "Unregistered Emotion Kernel notes uploaded by Eli.",
    zh: "Eli 上传的未备案情感模块测试记录。",
  },
  htmlSrc: {
    en: "reports/emotion_module.en.html",
    zh: "reports/emotion_module.zh.html",
  },
  unlocked: false,
});

EVIDENCE.push({
  id: nextId(),
  code: "zoe_email",
  title: {
    en: "Email from Zoë",
    zh: "Zoë 致 John 的邮件",
  },
  desc: {
    en: "Message requesting another connection session.",
    zh: "请求再次进行连接实验的邮件。",
  },
  htmlSrc: {
    en: "reports/zoe_email.en.html",
    zh: "reports/zoe_email.zh.html",
  },
  unlocked: false,
});

EVIDENCE.push({
  id: nextId(),
  code: "chat_log",
  title: {
    en: "Zoë & John Chat Log",
    zh: "Zoë 与 John 的聊天记录",
  },
  desc: {
    en: "Extracted messages discussing connection sessions.",
    zh: "关于连接实验的聊天摘录。",
  },
  htmlSrc: {
    en: "reports/chat_log.en.html",
    zh: "reports/chat_log.zh.html",
  },
  unlocked: false,
});

  // Bilingual keyword routing regex
  const KEY = {
    heardYes: [
      /\b(yes|yeah|yep|sure|ok(ay)?|of course|i can help|i will help|i'll help|who are you)\b/i,
      /可以|好|行|没问题|没事|能|可以的|我可以|愿意|当然|你是/i,
    ],
    heardNo: [
      /\b(no|nope|can't|cannot|won't|sorry,?\s?no|i can't help)\b/i,
      /不行|不能|帮不了|不可以|没空|没办法|抱歉|对不起，我不行/i,
    ],
    // 车祸
    car_crash: [/car[\s-]?crash|车祸/i],
    accident: [/accident|意外/i],
    callPolice: [/call.*police|报警|警察/i],
    lostMemory: [/lost.*memory|记不起|失忆|记得|重伤/i],

    // 人物
    johnQuincy: [/john\s+quincy|john/i],
    eli: [/eli|学生/i],
    zoe: [/zo[eë]|zoë|Eli的女朋友/i],

    fond: [/fond|基金|资金|account/i],
    blueLight: [/blue light|蓝光/i],
    draft: [/draft|草稿|邮件/i],
    brake: [/brake|刹车/i],
    elective: [/elective|design.*theory.*and.*practice.*of.*artificial.*beings|选修|仿生人设计理论与实践/i],
    chatLog: [/chat\s*log|聊天记录|聊天|对话记录/i],
    affair: [/affair|出轨|外遇|偷情/i],
    phone: [/phone|手机|打给她|打电话|电话/i],
    contacts: [/contacts|通讯录|电话簿|联系人/i],
    angerScene: [/生气|抢手机|抓手机|愤怒|吵|争执/i],
    steering: [/steering|方向盘/i],
    thatCar: [/that\s*car|那辆车|蓝光|蓝色车/i],
    notCrazy: [/crazy|疯了?|疯/i],
    pregnant: [/pregnant|怀孕|怀了|有.*宝宝/i],
    anniversary: [/anniversary|纪念日|周年/i],
    embezzle: [/embezzl|挪用|造假|占用/i],
    reportDocs: [/(research\s*report|研究报告|研究成果|techn(ical)?\s*paper)/i],
    fatherSon: [/father|父子|Ken|Barrymore/i],
    girlfriend: [/girlfriend|女朋友/i],
    connectionMail: [/connection\b|连接|邮件/i],

    fight: [/atmosphere|fight|不愉快|争吵|吵架/i],
    memory: [/memory|记忆|想起/i],

    gps: [/gps|定位|位置/i],
    mei: [/\bmei\b|\b美\b(?!术)/i],
    push: [/push|推|拉扯/i],
    blood: [/blood|血/i],

    delete: [/delete|删除|删掉/i],
    report: [/report|上报|举报/i],
    override: [/override|越权|拒绝/i],
  };

  // Jane 常用台词（放这里，便于你只改文案）
  const LINES = {
    en: {
      hearCheck: "Hello… can you help me?",
      brake: [
        "John mentioned the brakes felt a little soft that day, so I called to book a check-up for him. The service center's log shows he never went in — nobody touched that car.",
        "The official car crash report is spotless: 'No involvement of other vehicles. No traces of external tampering.' Everything got filed under driver error.",
        "But I saw a citation pointing to another technical report — it mentioned hydraulic loss in the braking system and evidence of manual adjustments. Strangely, that report was withdrawn afterwards.",
        "I don't know why, or who could make that happen. Maybe… someone doesn't want this investigated."
      ],
      blueLight: [
        "The investigators said there were two overlapping sets of brake marks on the road before the guardrail.",
        "I think it means there was another car behind us, but I really… can't be sure.",
        "In that instant I caught the reflection of headlights — a pale blue flash.",
        "The police told me I might have misseen it, and they filed it as a 'driver misjudgment of vision.'"
      ],
      sendInitial: [
        "It was last Wednesday — September 12th, our wedding anniversary.",
        "We had dinner together at a small restaurant downtown. Everything felt… ordinary.",
        "On the way home…",
        "I don’t remember how — it’s like that whole moment was erased.",
        "When I came to, the car had already hit the guardrail, the air smelled of smoke. John… wasn’t moving anymore.",
        "I was terrified. All I could do was shake and call the police."
      ],
      anniversary: [
        "It was probably the worst anniversary we’ve ever had.",
        "At first everything was perfect.",
        "He was so gentle, that long-lost smile in his eyes made me believe—",
        "maybe we could still go back to how things were.",
        "But later, I don’t know why, the air shifted.",
        "Over some tiny thing, we were arguing again.",
      ],
      accident: [
        "Honestly, I don't believe it was an accident.",
        "A week before, I went to John's studio. He was shouting at Eli, arguing about some 'fund' or something like that.",
        "Back then… I let myself get distracted. Looking back, maybe that was a mistake.",
        "Strangely, a few days before the crash our car started acting up. John said the brakes felt 'a little light.' I told him to get them checked, he just laughed and said I was overreacting.",
        "Now that I think about it… I can’t tell if that was a coincidence.",
        "I know this sounds like a conspiracy theory, but I need someone to look into it."
      ],
      notSureFight: [
        "...I'm not sure. Maybe we did fight that night.",
        "It's just… I feel like we've come a long way to be where we are now. He's busy with work, has many students, and I understand that. But sometimes… I wish he would just look at me more.",
        "I remember I mentioned Zoë, it's a rare name. He just smiled and said I was overthinking. But I have seen their chat logs.",
        "I know it's normal for teachers to care about their students, but sometimes… 'normal' can hurt.",
      ],
      dontRememberHer: "Don't make me remember her. Please.",
      lostMemory: ["I always feel like… I've forgotten something important. Like a chunk of memory has been hollowed out, and I just can't recall it.",
        "All I remember is that we went to 'Meet Every Day,' the small restaurant where we had our first date. We go there every anniversary — that day was no exception. Everything felt… fine.",
        "I vaguely remember that something felt off, maybe the atmosphere changed suddenly… or maybe nothing happened at all.",
        "Then… a blue light flashed, and everything was gone. When I woke up, the car was parked by the bridge. John was sitting there… blood was flowing down from his head.",
      ],
      angry: "Shut up! You know nothing!",
      deleteNow: "Delete it. Now.",
      goOn: "😮‍💨",
      janeHusband: [
        "Yes, he was my husband.",
        "I first met him during my master's program, when I took an elective called 'Theory and Practice of Bionic Design.'",
        "He was the lecturer. I liked the way he taught — calm, precise, yet somehow gentle.",
        "After graduation, we ran into each other again at a reunion, talked for a long time that night… and that was where it really began.",
        "A year later, we got married.",
        "It’s been seven years now.",
        "Here, this is the class photo — our first photo together. I've kept it all this time.",
      ],
      callPolice: [
        "I did call the police. They told me to stay on the line and wait there. But by the time help arrived… it was already too late.",
        "This is the official accident report from the police. Can you go through these files with me?",
        "Oh! I'm sorry, my tears have smudged the report. If you need any details, I can tell you.",
        "I just want to know what really happened that day.",
      ],
      elective: [
        "Are you into art as well, or…?",
        "Honestly, all of this is on the university's website. Does it really help the investigation?",
      ],
      chatLog: [
        "A week ago I went to the studio. He was talking with Eli, so I waited outside.",
        "By accident… I saw his chat window.",
        "No idea what odd software they used—I had never seen that interface. Maybe it was on purpose, to hide it from me.",
        "I remember every sentence. He wrote, “I keep thinking about last night… that connection is strange, but I like it.”",
        "She answered, “I’m thinking the same thing. After all these years, this might be beyond what I planned.”",
        "He really had some kind of relationship with that student. “Connection”? “Like”?",
        "He even said, “I’ll remember you.”",
        "Do you understand? That feeling of being excluded… as if the world only had the two of them and I was the extra one.",
      ],
      affair: [
        "You know, I had sensed it already—that unsettling silence that shouldn’t be there.",
        "John kept saying she was just a student, but their messages never stopped.",
        "Sometimes I almost wished he would just admit it. That might have hurt less.",
        "When I confronted him, he laughed and said I was being too sensitive.",
        "But that line—“the connection last night felt strange but I liked it”—keeps looping in my head.",
        "I told him to call Zoë, yet I couldn’t even find her name in his contacts.",
      ],
      phone: [
        "I wanted him to call her. I just needed to hear him say it, but he refused.",
        "I said, “Then tell me—do you not love me anymore?”",
        "He didn’t answer. He just said, “I’m driving. We’ll talk when we get home.”",
        "But I couldn’t wait. Right then I only wanted an answer.",
        "The car was silent except for the engine.",
        "I only wanted him to make that call. He yanked the phone from me and shoved it into his pocket.",
        "I was furious. Do you know that feeling? Like everything you say ricochets off the car window.",
      ],
      contacts: [
        "His contacts list was so neatly organized. Maybe artists all have a bit of that compulsion.",
        "He didn’t have many contacts—about two hundred entries—and I checked every single one.",
        "There was no “Zoë.”",
        "But I clearly saw their chat history, and I even took a photo, look.",
      ],
      embezzle: [
        "Embezzlement? I'd bet it was Eli.",
        "No one else had the access. John trusted him completely, and he still did this behind his back.",
        "If the academic committee finds out, he'll definitely be expelled.",
        "I actually saw Eli two days ago. He came to apologize, looking like he'd done something terrible.",
        "I asked if it was about Zoë. He kept his head down and said nothing.",
        "John wasn’t home, so Eli left a stack of research reports for him—full of jargon I couldn’t read, things about “signals,” “synchronization,” “connection systems.”",
        "He's hiding something, I know it.",
      ],
      reportDocs: [
        "Does any of this even help the investigation?",
      ],
      fatherSon: [
        "Ken Barrymore is Eli’s father. He works at the precinct too…",
        "Oh my god, I didn’t realise it until you said it!",
        "I don’t know exactly what it means, but with Ken in that position…",
        "I’m almost sure Eli was taking revenge, and Ken helped him alter the investigation report.",
        "That’s it—the truth is out!",
      ],
      girlfriend: [
        "Yes, I always thought they were a couple. Eli doted on her, but she was always so cold.",
        "I have a project-team photo from last month—Eli’s arm is around Zoë, grinning so wide his eyes disappear.",
        "But Zoë seems…",
        "Fine, fine, so it started back then.",
        "She was looking at John the entire time.",
      ],
      connectionMail: [
        "You want to know what that “connection” really was?",
        "…Maybe you honestly don’t understand.",
        "I have an email Zoë sent to John—here, read it yourself.",
        "She probably never imagined John was already dead. There’s no one left for her to “connect” with.",
      ],
      angerScene: [
        "I reached for the phone and he blocked me.",
        "I remember saying, “Why won’t you let me find it?”",
        "I wasn’t thinking about anything else—I just wanted him to explain.",
        "His voice was right next to my ear, so close. He said, “Jane, let go.”",
        "When he called my name I was still holding on… no, I mean I was holding onto him.",
        "That was when the car started to sway.",
        "Then the other car hit us.",
      ],
      steering: [
        "I never touched the steering wheel. Of course my fingerprints might be there—I drive that car sometimes.",
      ],
      thatCar: [
        "I remember a light coming from ahead.",
        "Blue, intensely bright.",
        "I instinctively raised my hand to shield it.",
        "They later said it was just a reflection, but I know it wasn’t.",
        "It was Eli’s car, I swear.",
        "People think I’m crazy, but I’m not. I was completely lucid.",
      ],
      notCrazy: [
        "I’m not crazy.",
        "The police sent me for tests; the doctor said my body was reacting to stress.",
        "I’d felt dizzy for days, my stomach upset.",
        "John said maybe I’d eaten something bad. I remember him laughing at me.",
      ],
      pregnant: [
        "Are you implying… me?",
        "Don’t joke—that breaks the protocol.",
        "I’ll report you!",
      ],
      elective: [
        "Are you into art as well, or…?",
        "Honestly, all of this is on the university's website. Does it really help the investigation?",
      ],
      eli: [
        "Eli was his most trusted student, and the assistant managing that fund.",
        "John always said Eli was brilliant but too headstrong. His father is the meticulous type — being controlled so tightly growing up left Eli with this odd rebellious streak.",
        "He loves modding cars, insisting on those blinding lights because they looked 'clean, calm.' John talked to him multiple times, telling him to stop driving that car that looks like lab equipment.",
        "Sometimes I wonder… if he brought that rebellious streak into their research.",
        "When I was sorting paperwork that day, I found several unsent drafts in John's outbox, all addressed to the dean's office.",
      ],
      draft: [
        "He never sent it. Maybe he was afraid of ruining Eli's future.",
        "Looking back, that email hid so much — names, times, those 'unregistered suppliers.' Maybe you'll see it clearer than I can.",
      ],
      fond: [
        "The Horizon Fund was a three-year grant John secured last year, almost six hundred thousand dollars to support his research into the neural mechanisms of AI creativity. Eli handled the day-to-day cash flow — purchasing, reimbursements. John trusted him so much he barely checked the details.",
        "Three months in, a few irregular expenses started to appear — small amounts, a few thousand each time but very frequent, with vague notes like 'system testing,' 'temporary labor,' 'hardware tuning.' John once mentioned 'someone on the data side is meddling,' but I didn't think much of it then.",
      ],
      zoe: [
        "I really don't want to talk about her, but every time I think about it I feel awful. John said Zoë was his student, yet I never felt it was just that. I even thought she was Eli's girlfriend — they were together almost every day.",
        "A week ago I went to the studio to find him. He was chatting with Eli, so I waited outside.",
        "By accident… I saw his chat log.",
        "Who knows what kind of strange software they used — I'd never seen that interface. Maybe it was on purpose, to keep it away from me.",
        "I remember every line clearly. He told her, 'I keep thinking about last night… that connection is strange, but I like it.' She replied, 'I'm thinking the same thing. After all these years, this might be beyond what I planned.'",
        "He really had some sort of… relationship with that student. 'Connection'? 'Like'? He even said — 'I'll remember you.' Do you get it? That feeling of being left out…",
        "As if the world only had the two of them, and I was the extra person.",
      ],
    },
    zh: {
      hearCheck: "你好……你能帮帮我吗？",
      brake: [
        "John那天说刹车感觉有点轻，我打电话帮他预约过检查。维修中心的记录显示他从没去过，也没人动过那辆车。",
        "官方的事故调查报告写得很干净：‘无他车介入，无外部破坏痕迹。’一切都被归为驾驶失误。",
        "但我在文件夹里看到另一份技术报告的引用——那里面提到了刹车系统的液压流失，还有人为调整的痕迹。奇怪的是，那份报告后来被撤下了。",
        "我不知道为什么，也不知道是谁能做到这件事。也许……有人不希望这件事被追查下去。",
      ],
      blueLight: [
        "勘查人员说护栏前的路面上有两组重叠的刹车痕。",
        "我觉得那意味着我们后方还有另一辆车，可我真的……不确定。",
        "那一瞬间，我看到了车灯的反光——淡蓝色的，一闪而过。",
        "警察说我可能认错了，他们就把这段记成‘驾驶者视线误判’。"
      ],
      sendInitial: [
        "那天是上周三，9月12号——我们的结婚纪念日。",
        "我们在市区的一家小餐厅吃了晚饭，一切都很正常。",
        "回家的路上……",
        "我不记得是怎么发生的了——就像那段时间被整块抹去了。",
        "等我恢复意识时，车已经撞在护栏上，空气里都是燃烧的味道。John……他已经没有反应了。",
        "我太害怕了，只记得自己在发抖，然后报了警。"
      ],
      anniversary: [
        "这大概是我们最糟糕的一次纪念日。",
        "一开始一切都很好。",
        "他对我很温柔，眼底那种久违的笑意让我以为——",
        "或许一切都还能回到从前。",
        "可后来，不知道为什么，气氛忽然变了。",
        "只是因为一点小事，我们又吵了起来。",
      ],
      accident: [
        "说实话，我不相信那是意外。",
        "一周前，我去John的工作室找他。他在和Eli争吵，声音很大，好像提到了‘基金’还是什么。",
        "那时候……我好像被别的东西分了神。现在想想，那也许是个错误。",
        "更奇怪的是，出事前几天，我们的车也出了问题。John说刹车感觉‘有点轻’，我劝他去修，他笑着说可能是我多心。",
        "现在想想……我不知道那是不是巧合。",
        "我知道这听起来像阴谋论，但我需要有人帮我查查。"
      ],
      notSureFight: [
        "……我不确定。也许我们那晚确实吵过。",
        "只是……我觉得我们一路走到现在挺不容易的。他工作忙，学生多，我也理解。可我有时候……希望他能多看看我一眼。",
        "我记得我提到过 Zoë，这名字很少见。他只是笑了，说我想太多。可我看到过他们的聊天记录。",
        "我知道老师对学生的关心是正常的，但有时候……‘正常’也会让人难受。"
      ],
      dontRememberHer: "别让我再想起她。求你。",
      lostMemory: [
        "我总觉得……我忘了什么重要的事。就像有一段记忆被挖空了，怎么都想不起来。",
        "我只记得那天我们去了 ‘天天见面’，就是我们第一次约会的小餐馆。每年纪念日，我们都会去那里——那天也不例外。一切都……好像挺好的。",
        "我依稀记得，好像有点不愉快，也许只是气氛突然变了……也许根本没有发生什么。",
        "然后……一道蓝光闪过，就什么都没了。我醒过来的时候，车停在桥边。John 坐在那儿……血顺着他的头往下流。"
      ],
      angry: "闭嘴！你什么都不懂！",
      deleteNow: "删掉它。现在。",
      goOn: "😮‍💨",
      janeHusband: [
        "是的，他是我的丈夫。",
        "我第一次见到他是在读硕士的时候，那时候我选修了一门叫《仿生人设计理论与实践》的课。",
        "他是这门课的老师——我很喜欢他上课的方式，既理性又温柔。",
        "毕业后的一个聚会上我们再次遇见，那次开始我们有了更多的交流。",
        "不久后我们恋爱了，一年后结婚。",
        "到现在……已经七年了。",
        "看，这是结课照片，也是我们俩的第一张合照，我一直都存着。",
      ],
      callPolice: [
        "我报过警了，他们让我保持通话、等在原地。但等救援赶到的时候……一切都已经来不及了。",
        "这是警方出具的事故报告，你能和我一起看这些档案吗？",
        "哦！真对不起，我的眼泪把报告打湿了，如果你需要哪些信息我可以告诉你。",
        "我真想知道那天到底发生了什么。",
      ],
      elective: ["你也会对艺术感兴趣？还是……",
        "其实这些资料在大学的官网上都能查到。但是这对破案有帮助吗？"],
      chatLog: [
        "一周前，我去工作室找他。那天他在和Eli聊天，我就坐在外面等。",
        "无意中……我看到了他的聊天记录。",
        "鬼知道他们用了什么奇怪的软件，那个界面我从没见过——也许是故意的，想避开我吧。",
        "我还记得那几句话，清清楚楚。他对她说：‘我还在想我们昨晚……那种连接很奇怪，但我很喜欢。’",
        "他真的和那个学生有了某种……关系。‘连接’？‘喜欢’？",
        "他甚至说——‘我会记得你’。",
        "你明白吗？那种被排除在外的感觉……好像世界只剩他们两个，而我成了多余的人。",
      ],
      affair: [
        "你知道吗，我其实早就感觉到了。那种……不对劲的沉默。",
        "John 总说她只是学生，可他们的聊天记录……",
        "我有时候甚至希望——他干脆承认。那样反而好受一点。",
        "那天我质问他，他笑着说我太敏感。",
        "但我不停地想到那句‘昨晚的连接很奇怪，但我喜欢’，我脑子里就只剩下那句话，一遍一遍。",
        "我让他给Zoë打电话，但我在手机通讯录中找不到她的名字。",
      ],
      phone: [
        "我想让他打给她。我只是想听他亲口说清楚，可他不肯。",
        "我说：‘那你告诉我，你是不是不爱我了。’",
        "他没回答，只是说‘我在开车，我们到家再说’。",
        "可我等不及了。那一刻我只想着让他给我一个答案。",
        "车里很安静，只有引擎在响。",
        "那时候我只是想让他打那个电话确认一下。他把手机从我手里夺走，塞进了口袋。",
        "我当时……真的很生气。你知道那种感觉吗？像是被推开——你说的话全撞在车窗上。",
      ],
      contacts: [
        "他的通讯录整理得很好，艺术家可能多多少少都会有这种强迫症吧。",
        "他的好友不多，总共就两百多人，我翻了个遍，都没有Zoë这个名字。",
        "可是我明明看到他们的聊天记录，我还拍了照了，你看。",
      ],
      embezzle: [
        "挪用这事……我猜就是Eli。",
        "没人有这个能力了，John那么信任他，他却背地里做了这种事。",
        "如果学校那帮学术委员会知道了，他肯定会被开除。",
        "其实前天我还见过Eli一次，他来找John道歉，像是做了亏心事。",
        "我问他是不是和Zoë有关，他什么也没说，只是低着头。",
        "John那时没在家，Eli留了一些研究报告给他，全是那种我看不懂的东西，写着什么“信号”“同步”“连接系统”，我也懒得看。",
        "反正——他肯定在隐瞒什么。",
      ],
      reportDocs: [
        "这和破案有关吗？",
      ],
      fatherSon: [
        "Ken Barrymore 是Eli的父亲，也在警署工作……",
        "天啊！你不说我都没有发现！",
        "我不知道这意味着什么，但在Ken的位置上……",
        "我几乎能肯定：是Eli报复了我们，Ken在署里帮他修改了调查报告！",
        "真相大白了！",
      ],
      girlfriend: [
        "对，我一直以为他俩是一对，Eli对她好的没话说，但是她一直是一副冷冰冰的样子……",
        "我有他们课题组上个月的合照，Eli搂着Zoë，笑得眼睛都没了。",
        "但是Zoë似乎……",
        "好的！好的！原来从那时候就开始了。",
        "她一直看着John。",
      ],
      connectionMail: [
        "你问我连接是什么？",
        "……可能你确实不懂。",
        "我这有一封Zoë发给John的邮件，你自己看！",
        "但是她也想不到John已经死了吧，没有人会去和她连接了。",
      ],
      angerScene: [
        "我伸手去抢手机，他挡了一下。",
        "我记得我在说‘你为什么不给我找’。",
        "我那时没想别的。只是想让他解释清楚。",
        "我只记得他的声音——在我耳边，很近。他说，‘Jane，快放开。’",
        "他喊我名字的时候，我还抓着……不，我是说，我抓着他。",
        "这时候车子……就开始晃了。",
        "那辆车就撞上来了。",
      ],
      steering: [
        "我没有动过方向盘。当然，如果上面有我的指纹也不奇怪，我偶尔也会开这辆车。",
      ],
      thatCar: [
        "我记得那时候有光，从前面打过来。",
        "蓝的，很亮。",
        "我下意识抬手去挡。",
        "后来他们说，那是反射。可我知道那不是。",
        "那是Eli的车，我发誓。",
        "我知道很多人都觉得我疯了，但我没有，我很清醒！",
      ],
      notCrazy: [
        "我当然没疯！",
        "警察让我去做体检，医生说我身体里有些变化，也许是压力反应……",
        "其实我几天前就觉得头晕，胃不太舒服。",
        "John 说我可能是吃坏东西。我记得他还在嘲笑我。",
      ],
      pregnant: [
        "你是说……我？",
        "别开玩笑了，你不能开玩笑，这违反了协议。",
        "我要举报你！",
      ],
      eli: [
        "Eli是他最信任的学生，也是那个基金的管理助理。",
        "Eli那孩子……John总说他聪明，但太要强。他父亲是那种一丝不苟的人。Eli从小被管得太紧，反倒养成一种奇怪的叛气。",
        "他爱改车——非要换成那种刺眼的光，说‘看起来干净、冷静’。John劝过他好几次，让他别再开那辆像实验室仪器一样的车。",
        "有时候我在想……他是不是把那股叛气带进了研究里。",
        "那天整理文件时，我看到John的草稿箱里有几封未寄出的草稿，都是写给院里的。",
      ],
      draft: [
        "他没有发出去。也许他怕真的毁了Eli的前途。",
        "现在想想，这封邮件里藏着太多东西——名字、时间、那些‘未注册的供应商’。也许你能比我看得更清楚。",
      ],
      fond: [
        "Horizon基金是John去年申请下来的一个三年期项目，预算接近60万美元，用于支持他关于AI创作神经机制的研究。Eli负责资金流的日常管理，包括采购与报销。John信任他到几乎不过问细节。",
        "三月后，账目里开始出现几笔异常支出——金额不大，每次几千，但频率很高，备注模糊，比如‘系统测试’、‘临时人力’、‘硬件调试’。John曾提到‘数据那边有人在动手脚’，可我当时没多想。",
      ],
      zoe: [
        "我其实不想提到她，但每次想到还是很难受。John 说 Zoë 是他的学生，可我总觉得他们之间不只是师生。我原以为她是 Eli 的女朋友，他们几乎天天在一起。",
        "一周前，我去工作室找他。那天他在和Eli聊天，我就坐在外面等。",
        "无意中……我看到了他的聊天记录。",
        "鬼知道他们用了什么奇怪的软件，那个界面我从没见过——也许是故意的，想避开我吧。",
        "我还记得那几句话，清清楚楚。她对他说：‘我还在想我们昨晚……那种连接很奇怪，但我很喜欢。’他回复她：‘我也在想同样的事情，这么多年了，这也许超过了我的计划范围。’",
        "他真的和那个学生有了某种……关系。‘连接’？‘喜欢’？他甚至说——‘我会记得你’。你明白吗？那种被排除在外的感觉……",
        "好像世界只剩他们两个，而我成了多余的人。",
      ],
    },
  };

  const FLOWS = {
    introCheck: {
      steps: [{ speaker: "jane", line: "hearCheck" }],
    },
    introWelcome: {
      steps: [{ speaker: "jane", template: "janeIntro" }],
    },
    car_crash: {
      steps: [{ speaker: "jane", line: "sendInitial" }],
    },
    accident: {
      steps: [{ speaker: "jane", line: "accident" }],
    },
    brake: {
      steps: [{ speaker: "jane", line: "brake" }],
      unlock: ["tech_report"],
    },
    elective: {
      steps: [{ speaker: "jane", line: "elective" }],
      unlock: ["course_brief"],
    },
    anniversary: {
      steps: [{ speaker: "jane", line: "anniversary" }],
    },
    chatLog: {
      steps: [{ speaker: "jane", line: "chatLog" }],
      unlock: ["chat_log"],
    },
    affair: {
      steps: [{ speaker: "jane", line: "affair" }],
    },
    phone: {
      steps: [{ speaker: "jane", line: "phone" }],
    },
    contacts: {
      steps: [{ speaker: "jane", line: "contacts" }],
    },
    embezzle: {
      steps: [{ speaker: "jane", line: "embezzle" }],
    },
    reportDocs: {
      steps: [{ speaker: "jane", line: "reportDocs" }],
      unlock: ["clink_report","emotion_module"],
    },
    fatherSon: {
      steps: [{ speaker: "jane", line: "fatherSon" }],
    },
    girlfriend: {
      steps: [{ speaker: "jane", line: "girlfriend" }],
    },
    connectionMail: {
      steps: [{ speaker: "jane", line: "connectionMail" }],
      unlock: ["zoe_email"],
    },
    angerScene: {
      steps: [{ speaker: "jane", line: "angerScene" }],
    },
    steering: {
      steps: [{ speaker: "jane", line: "steering" }],
    },
    thatCar: {
      steps: [{ speaker: "jane", line: "thatCar" }],
    },
    notCrazy: {
      steps: [{ speaker: "jane", line: "notCrazy" }],
    },
    pregnant: {
      steps: [{ speaker: "jane", line: "pregnant" }],
    },
    blueLight: {
      steps: [{ speaker: "jane", line: "blueLight" }],
    },
    callPolice: {
      steps: [{ speaker: "jane", line: "callPolice" }],
      unlock: ["evidence_01"],
    },
    lostMemory: {
      steps: [{ speaker: "jane", line: "lostMemory" }],
    },
    fight: {
      steps: [{ speaker: "jane", line: "notSureFight" }],
    },
    johnQuincy: {
      steps: [{ speaker: "jane", line: "janeHusband" }],
      unlock: ["evidence_02"],
    },
    eli: {
      steps: [{ speaker: "jane", line: "eli" }],
    },
    draft: {
      steps: [{ speaker: "jane", line: "draft" }],
      unlock: ["draft_email"],
    },
    fond: {
      steps: [{ speaker: "jane", line: "fond" }],
      unlock: ["grant_overview"],
    },
    zoe: {
      steps: [{ speaker: "jane", line: "zoe" }],
    },
    fallback: {
      steps: [{ speaker: "jane", line: "goOn" }],
    },
  };

  const ROUTES = [
    { intents: ["callPolice"], flow: "callPolice" },
    { intents: ["lostMemory"], flow: "lostMemory" },
    { intents: ["johnQuincy"], flow: "johnQuincy" },
    { intents: ["car_crash", "gps"], flow: "car_crash" },
    { intents: ["accident"], flow: "accident" },
    { intents: ["fight"], flow: "fight" },
    { intents: ["brake"], flow: "brake" },
    { intents: ["anniversary"], flow: "anniversary" },
    { intents: ["chatLog"], flow: "chatLog" },
    { intents: ["affair"], flow: "affair" },
    { intents: ["phone"], flow: "phone" },
    { intents: ["contacts"], flow: "contacts" },
    { intents: ["embezzle"], flow: "embezzle" },
    { intents: ["reportDocs"], flow: "reportDocs" },
    { intents: ["fatherSon"], flow: "fatherSon" },
    { intents: ["girlfriend"], flow: "girlfriend" },
    { intents: ["connectionMail"], flow: "connectionMail" },
    { intents: ["angerScene"], flow: "angerScene" },
    { intents: ["steering"], flow: "steering" },
    { intents: ["thatCar"], flow: "thatCar" },
    { intents: ["notCrazy"], flow: "notCrazy" },
    { intents: ["pregnant"], flow: "pregnant" },
    { intents: ["blueLight"], flow: "blueLight" },
    { intents: ["elective"], flow: "elective" },
    { intents: ["eli"], flow: "eli" },
    { intents: ["draft"], flow: "draft" },
    { intents: ["fond"], flow: "fond" },
    { intents: ["zoe"], flow: "zoe" },
    { intents: ["mei", "memory"], flow: "mei" },
    { intents: ["blood", "push"], flow: "blood" },
    { intents: ["delete"], action: "delete" },
    { intents: ["report"], action: "report" },
    { intents: ["override"], action: "override" },
  ];

  const HEARING = {
    promptFlow: "introCheck",
    successFlow: "introWelcome",
    retryFlow: "introCheck",
    positiveIntents: ["heardYes"],
    negativeIntents: ["heardNo"],
  };

  return { I18N, STAGES, EVIDENCE, KEY, LINES, FLOWS, ROUTES, HEARING };
})();

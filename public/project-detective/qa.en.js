window.QA_EN = {
  "ui": {
    "files": "Files",
    "progress": "Progress",
    "deleteTitle": "DELETE LOGS?",
    "deleteBody": "Do you want to delete the selected evidence? This action cannot be undone.",
    "searchPlaceholder": "Search chat…",
    "searchTitle": "Search chat",
    "searchNoMatch": "No matches",
    "composerPlaceholder": "Type here…",
    "sendLabel": "Send",
    "resetLabel": "Reset",
    "previewTitle": "Preview",
    "closePreview": "Close",
    "deleteButton": "Delete",
    "keepButton": "Keep",
    "overrideButton": "Override"
  },
  "templates": {
    "recovered": {
      "text": "[Recovered Evidence: {{list}}]",
      "separator": ", "
    }
  },
  "intro": [
    {
      "speaker": "system",
      "text": "[Investigation initialized]"
    },
    {
      "speaker": "jane",
      "text": "Hello… can you help me?"
    }
  ],
  "fallback": [
    "😮‍💨",
    "...Can we stay focused?",
    "I'm waiting for something that actually helps.",
    "Please, let's not waste time.",
    "If you don't know, just say so."
  ],
  "repeatWarnings": [
    "Don't make me answer the same question twice. It makes me doubt your skills. Read the chat log and come back when you're certain.",
    "You're asking the same thing again. Were you even listening? I'm not repeating myself. Go check the chat log… go!"
  ],
  "deletePrompt": "Delete it. Now.",
  "actionReplies": {
    "deleteConfirmed": "Thank you, detective. You did the right thing.",
    "deleteRefused": "You can't help me. You're just a machine!",
    "deleteOverride": "That hand… was mine.",
    "report": "[Case reported. System will shut down soon.]",
    "deleteInsist": "Delete it! Now!"
  },
  "hearing": {
    "positive": [
      {
        "pattern": "\\b(yes|yeah|yep|sure|ok(ay)?|of course|i can help|i will help|i'll help|who are you)\\b",
        "flags": "i"
      },
      {
        "pattern": "可以|好|行|没问题|没事|能|可以的|我可以|愿意|当然|你是",
        "flags": "i"
      }
    ],
    "negative": [
      {
        "pattern": "\\b(no|nope|can't|cannot|won't|sorry,?\\s?no|i can't help)\\b",
        "flags": "i"
      },
      {
        "pattern": "不行|不能|帮不了|不可以|没空|没办法|抱歉|对不起，我不行",
        "flags": "i"
      }
    ],
    "retry": [
      {
        "speaker": "jane",
        "text": [
          "Huh? Then refund my subscription fee — $200,000. This is outrageous!",
          "I'll give you one more chance. Can you help me now?"
        ]
      }
    ],
    "success": [
      {
        "speaker": "jane",
        "text": "Hello. I'm Jane, an artist. People call you a detective, right? I… need help. My husband John died in a car accident."
      },
      {
        "speaker": "system",
        "text": "Try asking about the car crash or memory loss details."
      }
    ]
  },
  "sequences": [
    {
      "id": "callPolice",
      "triggers": [
        {
          "pattern": "call.*police|报警|警察",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "I did call the police. They told me to stay on the line and wait there. But by the time help arrived… it was already too late.",
            "This is the official accident report from the police. Can you go through these files with me?",
            "Oh! I'm sorry, my tears have smudged the report. If you need any details, I can tell you.",
            "I just want to know what really happened that day."
          ]
        }
      ],
      "unlock": [
        "incident_report"
      ],
      "once": true
    },
    {
      "id": "lostMemory",
      "triggers": [
        {
          "pattern": "lost.*memory|记不起|失忆|重伤",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "I always feel like… I've forgotten something important. Like a chunk of memory has been hollowed out, and I just can't recall it.",
            "All I remember is that we went to 'Meet Every Day,' the small restaurant where we had our first date. We go there every anniversary — that day was no exception. Everything felt… fine.",
            "I vaguely remember that something felt off, maybe the atmosphere changed suddenly… or maybe nothing happened at all.",
            "Then… a blue light flashed, and everything was gone. When I woke up, the car was parked by the bridge. John was sitting there… blood was flowing down from his head."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "johnQuincy",
      "triggers": [
        {
          "pattern": "john\\s+quincy",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "Yes, he was my husband.",
            "I first met him during my master's program, when I took an elective called 'Theory and Practice of Bionic Design.'",
            "He was the lecturer. I liked the way he taught — calm, precise, yet somehow gentle.",
            "After graduation, we ran into each other again at a reunion, talked for a long time that night… and that was where it really began.",
            "A year later, we got married.",
            "It’s been seven years now.",
            "Here, this is the class photo — our first photo together. I've kept it all this time."
          ]
        }
      ],
      "unlock": [
        "class_photo"
      ],
      "once": true
    },
    {
      "id": "johnPartial",
      "triggers": [
        {
          "pattern": "\\bhusband\\b|\\bjohn\\b|丈夫|老公",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "Honestly, if you can't even look up his full name, I'm really disappointed.",
            "If you want to hear about us, tell me his complete name.",
            "Consider this a test."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "car_crash",
      "triggers": [
        {
          "pattern": "car[\\s-]?crash|车祸",
          "flags": "i"
        },
        {
          "pattern": "gps|定位|位置",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "It was last Wednesday — September 12th, our wedding anniversary.",
            "We had dinner together at a small restaurant downtown. Everything felt… ordinary.",
            "On the way home…",
            "I don’t remember how — it’s like that whole moment was erased.",
            "When I came to, the car had already hit the guardrail, the air smelled of smoke. John… wasn’t moving anymore.",
            "I was terrified. All I could do was shake and call the police."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "accident",
      "triggers": [
        {
          "pattern": "accident|意外",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "Honestly, I don't believe it was an accident.",
            "A week before, I went to John's studio. He was shouting at Eli, arguing about some 'fund' or something like that.",
            "Back then… I let myself get distracted. Looking back, maybe that was a mistake.",
            "Strangely, a few days before the crash our car started acting up. John said the brakes felt 'a little light.' I told him to get them checked, he just laughed and said I was overreacting.",
            "Now that I think about it… I can’t tell if that was a coincidence.",
            "I know this sounds like a conspiracy theory, but I need someone to look into it."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "fight",
      "triggers": [
        {
          "pattern": "atmosphere|fight|不愉快|争吵|吵架|气氛",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "...I'm not sure. Maybe we did fight that night.",
            "It's just… I feel like we've come a long way to be where we are now. He's busy with work, has many students, and I understand that. But sometimes… I wish he would just look at me more.",
            "I remember I mentioned Zoë, it's a rare name. He just smiled and said I was overthinking. But I have seen their chat logs.",
            "I know it's normal for teachers to care about their students, but sometimes… 'normal' can hurt."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "brake",
      "triggers": [
        {
          "pattern": "brake|刹车",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "John mentioned the brakes felt a little soft that day, so I called to book a check-up for him. The service center's log shows he never went in — nobody touched that car.",
            "The official car crash report is spotless: 'No involvement of other vehicles. No traces of external tampering.' Everything got filed under driver error.",
            "But I saw a citation pointing to another technical report — it mentioned hydraulic loss in the braking system and evidence of manual adjustments. Strangely, that report was withdrawn afterwards.",
            "I don't know why, or who could make that happen. Maybe… someone doesn't want this investigated."
          ]
        }
      ],
      "unlock": [
        "tech_report"
      ],
      "once": true
    },
    {
      "id": "anniversary",
      "triggers": [
        {
          "pattern": "anniversary|纪念日|周年",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "It was probably the worst anniversary we’ve ever had.",
            "At first everything was perfect.",
            "He was so gentle, that long-lost smile in his eyes made me believe—",
            "maybe we could still go back to how things were.",
            "But later, I don’t know why, the air shifted.",
            "Over some tiny thing, we were arguing again."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "chatLog",
      "triggers": [
        {
          "pattern": "chat\\s*log|聊天记录|聊天|对话记录",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "I really don't want to talk about her, but every time I think about it I feel awful. John said Zoë was his student, yet I never felt it was just that. I even thought she was Eli's girlfriend — they were together almost every day.",
            "A week ago I went to the studio to find him. He was chatting with Eli, so I waited outside.",
            "By accident… I saw his chat log.",
            "Who knows what kind of strange software they used — I'd never seen that interface. Maybe it was on purpose, to keep it away from me.",
            "I remember every line clearly. She told him, 'I keep thinking about last night… that connection is strange, but I like it.' He replied, 'I'm thinking the same thing. After all these years, this might be beyond what I planned.'",
            "He really had some sort of… relationship with that student. 'Connection'? 'Like'? He even said——'I will remember you.'",
            "Do you understand? That feeling of being excluded… like the world only has the two of them, and I'm the extra one."
          ]
        }
      ],
      "unlock": [
        "chat_log"
      ],
      "once": true
    },
    {
      "id": "affair",
      "triggers": [
        {
          "pattern": "affair|出轨|外遇|偷情",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "You know, I had sensed it already—that unsettling silence that shouldn’t be there.",
            "John kept saying she was just a student, but their messages never stopped.",
            "Sometimes I almost wished he would just admit it. That might have hurt less.",
            "When I confronted him, he laughed and said I was being too sensitive.",
            "But that line—“the connection last night felt strange but I liked it”—keeps looping in my head.",
            "I told him to call Zoë, yet I couldn’t even find her name in his contacts."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "phone",
      "triggers": [
        {
          "pattern": "phone|手机|打给她|打电话|电话",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "I wanted him to call her. I just needed to hear him say it, but he refused.",
            "I said, “Then tell me—do you not love me anymore?”",
            "He didn’t answer. He just said, “I’m driving. We’ll talk when we get home.”",
            "But I couldn’t wait. Right then I only wanted an answer.",
            "The car was silent except for the engine.",
            "I only wanted him to make that call. He yanked the phone from me and shoved it into his pocket.",
            "I was furious. Do you know that feeling? Like everything you say ricochets off the car window."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "contacts",
      "triggers": [
        {
          "pattern": "contacts|通讯录|电话簿|联系人",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "His contacts list was so neatly organized. Maybe artists all have a bit of that compulsion.",
            "He didn’t have many contacts—about two hundred entries—and I checked every single one.",
            "There was no “Zoë.”",
            "But I clearly saw their chat history, and I even took a photo, look."
          ]
        }
      ],
      "unlock": [
        "chat_log"
      ],
      "once": true
    },
    {
      "id": "embezzle",
      "triggers": [
        {
          "pattern": "embezzl|挪用|造假|占用",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "system",
          "text": "[SYSTEM] Restricted file unlocked: C-Link_Protocol_v1.pdf."
        },
        {
          "speaker": "jane",
          "text": [
            "Embezzlement? I'd bet it was Eli.",
            "No one else had the access. John trusted him completely, and he still did this behind his back.",
            "If the academic committee finds out, he'll definitely be expelled.",
            "I actually saw Eli two days ago. He came to apologize, looking like he'd done something terrible.",
            "I asked if it was about Zoë. He kept his head down and said nothing.",
            "John wasn’t home, so Eli left a stack of research reports for him—full of jargon I couldn’t read, things about “signals,” “synchronization,” “connection systems.”",
            "He's hiding something, I know it."
          ]
        }
      ],
      "unlock": [
        "clink_report"
      ],
      "once": true
    },
    {
      "id": "reportDocs",
      "triggers": [
        {
          "pattern": "(research\\s*report|研究报告|研究成果|techn(ical)?\\s*paper)",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": "Does any of this even help the investigation?"
        }
      ],
      "unlock": [
        "emotion_module",
        "clink_report"
      ],
      "once": true
    },
    {
      "id": "fatherSon",
      "triggers": [
        {
          "pattern": "father|父子|Ken Barrymore",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "Ken Barrymore is Eli’s father. He works at the precinct too…",
            "Oh my god, I didn’t realise it until you said it!",
            "I don’t know exactly what it means, but with Ken in that position…",
            "I’m almost sure Eli was taking revenge, and Ken helped him alter the investigation report.",
            "That’s it—the truth is out!"
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "girlfriend",
      "triggers": [
        {
          "pattern": "girlfriend|女朋友",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "Yes, I always thought they were a couple. Eli doted on her, but she was always so cold.",
            "I have a project-team photo from last month—Eli’s arm is around Zoë, grinning so wide his eyes disappear.",
            "But Zoë seems…",
            "Fine, fine, so it started back then.",
            "She was looking at John the entire time."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "connectionMail",
      "triggers": [
        {
          "pattern": "connection\\b|连接",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "You want to know what that “connection” really was?",
            "…Maybe you honestly don’t understand.",
            "I have an email Zoë sent to John—here, read it yourself.",
            "She probably never imagined John was already dead. There’s no one left for her to “connect” with."
          ]
        }
      ],
      "unlock": [
        "zoe_email"
      ],
      "once": true
    },
    {
      "id": "angerScene",
      "triggers": [
        {
          "pattern": "生气|抢手机|抓手机|愤怒|吵|争执",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "I reached for the phone and he blocked me.",
            "I remember saying, “Why won’t you let me find it?”",
            "I wasn’t thinking about anything else—I just wanted him to explain.",
            "His voice was right next to my ear, so close. He said, “Jane, let go.”",
            "When he called my name I was still holding on… no, I mean I was holding onto him.",
            "That was when the car started to sway.",
            "Then the other car hit us."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "steering",
      "triggers": [
        {
          "pattern": "steering|方向盘",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": "I never touched the steering wheel. Of course my fingerprints might be there—I drive that car sometimes."
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "thatCar",
      "triggers": [
        {
          "pattern": "that\\s*car|那辆车|Eli的车",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "I remember a light coming from ahead.",
            "Blue, intensely bright.",
            "I instinctively raised my hand to shield it.",
            "They later said it was just a reflection, but I know it wasn’t.",
            "It was Eli’s car, I swear.",
            "People think I’m crazy, but I’m not. I was completely lucid."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "notCrazy",
      "triggers": [
        {
          "pattern": "crazy|疯了?|疯",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "I’m not crazy.",
            "The police sent me for tests; the doctor said my body was reacting to stress.",
            "I’d felt dizzy for days, my stomach upset.",
            "John said maybe I’d eaten something bad. I remember him laughing at me."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "pregnant",
      "triggers": [
        {
          "pattern": "pregnant|怀孕|怀了|有.*宝宝",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "Are you implying… me?",
            "Don’t joke—that breaks the protocol.",
            "I’ll report you!"
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "blueLight",
      "triggers": [
        {
          "pattern": "blue light|蓝光",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "The investigators said there were two overlapping sets of brake marks on the road before the guardrail.",
            "I think it means there was another car behind us, but I really… can't be sure.",
            "In that instant I caught the reflection of headlights — a pale blue flash.",
            "The police told me I might have misseen it, and they filed it as a 'driver misjudgment of vision.'"
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "elective",
      "triggers": [
        {
          "pattern": "elective|design.*theory.*and.*practice.*of.*artificial.*beings|选修|仿生人设计理论与实践",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "Are you into art as well, or…?",
            "Honestly, all of this is on the university's website. Does it really help the investigation?"
          ]
        }
      ],
      "unlock": [
        "course_brief"
      ],
      "once": true
    },
    {
      "id": "eli",
      "triggers": [
        {
          "pattern": "eli|学生",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "Eli was his most trusted student, and the assistant managing that fund.",
            "John always said Eli was brilliant but too headstrong. His father is the meticulous type — being controlled so tightly growing up left Eli with this odd rebellious streak.",
            "He loves modding cars, insisting on those blinding lights because they looked 'clean, calm.' John talked to him multiple times, telling him to stop driving that car that looks like lab equipment.",
            "Sometimes I wonder… if he brought that rebellious streak into their research.",
            "When I was sorting paperwork that day, I found several unsent drafts in John's outbox, all addressed to the dean's office."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "draft",
      "triggers": [
        {
          "pattern": "draft|草稿|邮件",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "He never sent it. Maybe he was afraid of ruining Eli's future.",
            "Looking back, that email hid so much — names, times, those 'unregistered suppliers.' Maybe you'll see it clearer than I can."
          ]
        }
      ],
      "unlock": [
        "draft_email"
      ],
      "once": true
    },
    {
      "id": "fond",
      "triggers": [
        {
          "pattern": "fond|基金|资金|account",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "The Horizon Fund was a three-year grant John secured last year, almost six hundred thousand dollars to support his research into the neural mechanisms of AI creativity. Eli handled the day-to-day cash flow — purchasing, reimbursements. John trusted him so much he barely checked the details.",
            "Three months in, a few irregular expenses started to appear — small amounts, a few thousand each time but very frequent, with vague notes like 'system testing,' 'temporary labor,' 'hardware tuning.' John once mentioned 'someone on the data side is meddling,' but I didn't think much of it then."
          ]
        }
      ],
      "unlock": [
        "grant_overview"
      ],
      "once": true
    },
    {
      "id": "zoe",
      "triggers": [
        {
          "pattern": "zo[eë]|zoë|Eli的女朋友",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "John said Zoë was Eli's girlfriend. I always felt that was just a cover."
          ]
        }
      ],
      "unlock": [],
      "once": true
    },
    {
      "id": "drzhen",
      "triggers": [
        {
          "pattern": "dr\\.\\s*zhen|真博士",
          "flags": "i"
        }
      ],
      "replies": [
        {
          "speaker": "jane",
          "text": [
            "I don't know her."
          ]
        },
        {
          "speaker": "system",
          "text": [
            "[Decrypting Project Detective]",
            "Created by: Wang Yifan (王一帆)",
            "Collaborator: GPT-5, OpenAI",
            "Contact: 📧 vegdogzhenzhen@gmail.com",
            "This is not part of the narrative.",
            "You have crossed the boundary of the story.",
            "Thank you for seeing the people behind the story.",
            "[Closing file…]"
          ]
        },
        {
          "speaker": "jane",
          "text": [
            "."
          ]
        }
      ],
      "unlock": [],
      "once": true
    }
  ],
  "actions": {
    "delete": {
      "triggers": [
        {
          "pattern": "delete|删除|删掉",
          "flags": "i"
        }
      ]
    },
    "report": {
      "triggers": [
        {
          "pattern": "report|上报|举报",
          "flags": "i"
        }
      ]
    },
    "override": {
      "triggers": [
        {
          "pattern": "override|越权|拒绝",
          "flags": "i"
        }
      ]
    }
  }
};

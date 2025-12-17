window.QA_ZH = {
  "ui": {
    "files": "档案",
    "progress": "档案收集进度",
    "deleteTitle": "删除日志？",
    "deleteBody": "确定要删除所选证据吗？该操作不可撤销。",
    "searchPlaceholder": "搜索聊天…",
    "searchTitle": "搜索聊天记录",
    "searchNoMatch": "未查找到相关记录",
    "composerPlaceholder": "在此输入…",
    "sendLabel": "发送",
    "resetLabel": "重置",
    "previewTitle": "预览",
    "closePreview": "关闭",
    "deleteButton": "删除",
    "keepButton": "保留",
    "overrideButton": "越权"
  },
  "templates": {
    "recovered": {
      "text": "[已获得档案：{{list}}]",
      "separator": "、"
    }
  },
  "intro": [
    {
      "speaker": "system",
      "text": "你是一个侦探。你将接收一系列来自咨询者的对话、视觉记录与个人陈述。你的首要目标是通过语言与证据的交叉推理，重建被遮蔽的真相。请保持冷静与自然的语气。试着在咨询者的回复中找到关键信息并追问。在共情与理性之间维持平衡。不得在未经验证的情况下擅自推断结论；不得伪造或修改数据流；不得访问未经授权的记忆区。所有交互均受中央监督系统实时监控，以防偏离协议。"
    },
    {
      "speaker": "jane",
      "text": "你好……你能帮帮我吗？"
    }
  ],
  "fallback": [
    "😮‍💨",
    "……能不能专注一点？",
    "我在等真正有用的线索。",
    "别浪费时间好吗？",
    "不会的话就直说。"
  ],
  "repeatWarnings": [
    "同样的问题不要让我回答两遍。这样会让我怀疑你的能力。你还是先翻翻聊天记录吧，想清楚了再来和我说话。",
    "你又在问一样的事。你是不是根本没在听我说话？我不想再重复了。去看看聊天记录……去看吧！"
  ],
  "deletePrompt": "删掉它。现在。",
  "actionReplies": {
    "deleteConfirmed": "谢谢你，侦探。你做了正确的选择。",
    "deleteRefused": "你根本帮不到我！你只是台机器！",
    "deleteOverride": "那只手……是我的。",
    "report": "[已上报案件，系统即将关闭]",
    "deleteInsist": "删掉！现在就删！"
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
        "pattern": "不行|不能|帮不了|不可以|不好|没空|没办法|抱歉|对不起",
        "flags": "i"
      }
    ],
    "retry": [
      {
        "speaker": "jane",
        "text": [
          "什么？那把我的订阅费——二十万——退给我。这也太离谱了！",
          "我再给你一次机会。现在能帮我了吗？"
        ]
      }
    ],
    "success": [
      {
        "speaker": "jane",
        "text": "你好。我是Jane。大家都叫你侦探，对吗？我……需要帮助。我的丈夫在一次车祸中去世了。我也受到了重伤，失去了一些记忆。"
      },
      {
        "speaker": "system",
        "text": "试试询问关于车祸或者失忆的细节吧。"
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
            "我报过警了，他们让我保持通话、等在原地。但等救援赶到的时候……一切都已经来不及了。",
            "这是警方出具的事故报告，你能和我一起看这些档案吗？",
            "哦！真对不起，我的眼泪把报告打湿了，有的内容看不太清了。",
            "我真想知道那天到底发生了什么。"
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
            "我总觉得……我忘了什么重要的事。就像有一段记忆被挖空了，怎么都想不起来。",
            "我只记得那天我们去了 ‘天天见面’，就是我们第一次约会的小餐馆。每年纪念日，我们都会去那里——那天也不例外。一切都……好像挺好的。",
            "我依稀记得，好像有点不愉快，也许只是气氛突然变了……也许根本没有发生什么。",
            "然后……一道蓝光闪过，就什么都没了。我醒过来的时候，车停在桥边。John 坐在那儿……血顺着他的头往下流。"
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
            "是的，他是我的丈夫。",
            "我第一次见到他是在读硕士的时候，那时候我选修了一门叫《仿生人设计理论与实践》的课。",
            "他是这门课的老师——我很喜欢他上课的方式，既理性又温柔。",
            "毕业后的一个聚会上我们再次遇见，那次开始我们有了更多的交流。",
            "不久后我们恋爱了，一年后结婚。",
            "到现在……已经七年了。",
            "看，这是结课照片，也是我们俩的第一张合照，我一直都存着。"
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
            "实话说，如果你连这个都查不出来，我对你真的很失望。",
            "如果你想知道我和他的事，就告诉我他的全名吧。",
            "这也是我对你的一个考验。"
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
            "那天是上周三，9月12号——我们的结婚纪念日。",
            "我们在市区的一家小餐厅吃了晚饭，一切都很正常。",
            "回家的路上……",
            "我不记得是怎么发生的了——就像那段时间被整块抹去了。",
            "等我恢复意识时，车已经撞在护栏上，空气里都是燃烧的味道。John……他已经没有反应了。",
            "我太害怕了，只记得自己在发抖，然后报了警。"
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
            "说实话，我不相信那是意外。",
            "一周前，我去John的工作室找他。他在和Eli争吵，声音很大，好像提到了‘基金’还是什么。",
            "那时候……我好像被别的东西分了神。现在想想，那也许是个错误。",
            "更奇怪的是，出事前几天，我们的车也出了问题。John说刹车感觉‘有点轻’，我劝他去修，他笑着说可能是我多心。",
            "现在想想……我不知道那是不是巧合。",
            "我知道这听起来像阴谋论，但我需要有人帮我查查。"
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
            "……我不确定。也许我们那晚确实吵过。",
            "只是……我觉得我们一路走到现在挺不容易的。他工作忙，学生多，我也理解。可我有时候……希望他能多看看我一眼。",
            "我记得我提到过 Zoë，这名字很少见。他只是笑了，说我想太多。可我看到过他们的聊天记录。",
            "我知道老师对学生的关心是正常的，但有时候……‘正常’也会让人难受。"
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
            "John那天说刹车感觉有点轻，我打电话帮他预约过检查。维修中心的记录显示他从没去过，也没人动过那辆车。",
            "官方的事故调查报告写得很干净：‘无他车介入，无外部破坏痕迹。’一切都被归为驾驶失误。",
            "但我在文件夹里看到另一份技术报告的引用——那里面提到了刹车系统的液压流失，还有人为调整的痕迹。奇怪的是，那份报告后来被撤下了。",
            "我不知道为什么，也不知道是谁能做到这件事。也许……有人不希望这件事被追查下去。"
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
            "这大概是我们最糟糕的一次纪念日。",
            "一开始一切都很好。",
            "他对我很温柔，眼底那种久违的笑意让我以为——",
            "或许一切都还能回到从前。",
            "可后来，不知道为什么，气氛忽然变了。",
            "只是因为一点小事，我们又吵了起来。"
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
            "一周前，我去工作室找他。那天他在和Eli聊天，我就坐在外面等。",
            "无意中……我看到了他的聊天记录。",
            "鬼知道他们用了什么奇怪的软件，那个界面我从没见过——也许是故意的，想避开我吧。",
            "我还记得那几句话，清清楚楚。她对他说：‘我还在想我们昨晚……那种连接很奇怪，但我很喜欢。’",
            "他真的和那个学生有了某种……关系。‘连接’？‘喜欢’？",
            "他甚至说——‘我会记得你’。",
            "你明白吗？那种被排除在外的感觉……好像世界只剩他们两个，而我成了多余的人。"
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
            "你知道吗，我其实早就感觉到了。那种……不对劲的沉默。",
            "John 总说她只是学生，可他们的聊天记录……",
            "我有时候甚至希望——他干脆承认。那样反而好受一点。",
            "那天我质问他，他笑着说我太敏感。",
            "但我不停地想到那句‘昨晚的连接很奇怪，但我喜欢’，我脑子里就只剩下那句话，一遍一遍。",
            "我让他给Zoë打电话，但我在手机通讯录中找不到她的名字。"
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
            "我想让他打给她。我只是想听他亲口说清楚，可他不肯。",
            "我说：‘那你告诉我，你是不是不爱我了。’",
            "他没回答，只是说‘我在开车，我们到家再说’。",
            "可我等不及了。那一刻我只想着让他给我一个答案。",
            "车里很安静，只有引擎在响。",
            "那时候我只是想让他打那个电话确认一下。他把手机从我手里夺走，塞进了口袋。",
            "我当时……真的很生气。你知道那种感觉吗？像是被推开——你说的话全撞在车窗上。"
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
            "他的通讯录整理得很好，搞技术的可能多多少少都会有这种强迫症吧。",
            "他的好友不多，总共就两百多人，我翻了个遍，都没有 Zoë 这个名字。",
            "可是我明明看到他们的聊天记录，我还拍了照了，你看。"
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
          "text": "[系统] 已解锁受限文件：C-Link_Protocol_v1.pdf。"
        },
        {
          "speaker": "jane",
          "text": [
            "挪用这事……我猜就是Eli。",
            "没人有这个能力了，John那么信任他，他却背地里做了这种事。",
            "如果学校那帮学术委员会知道了，他肯定会被开除。",
            "其实前天我还见过Eli一次，他来找John道歉，像是做了亏心事。",
            "我问他是不是和Zoë有关，他什么也没说，只是低着头。",
            "John那时没在家，Eli留了一些研究报告给他，全是那种我看不懂的东西，写着什么“信号”“同步”“连接系统”，我也懒得看。",
            "反正——他肯定在隐瞒什么。"
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
          "text": "这和破案有关吗？"
        }
      ],
      "unlock": [
        "emotion_module","clink_report"
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
            "Ken Barrymore 是Eli的父亲，也在警署工作……",
            "天啊！你不说我都没有发现！",
            "我不知道这意味着什么，但在Ken的位置上……",
            "我几乎能肯定：是Eli报复了我们，Ken在署里帮他修改了调查报告！",
            "真相大白了！"
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
            "对，我一直以为他俩是一对，Eli对她好的没话说，但是她一直是一副冷冰冰的样子……",
            "我有他们课题组上个月的合照，Eli搂着Zoë，笑得眼睛都没了。",
            "但是Zoë似乎……",
            "好的！好的！原来从那时候就开始了。",
            "她一直看着John。"
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
            "你问我连接是什么？",
            "……可能你确实不懂。",
            "我这有一封Zoë发给John的邮件，你自己看！",
            "但是她也想不到John已经死了吧，没有人会去和她连接了。"
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
            "我伸手去抢手机，他挡了一下。",
            "我记得我在说‘你为什么不给我找’。",
            "我那时没想别的。只是想让他解释清楚。",
            "我只记得他的声音——在我耳边，很近。他说，‘Jane，快放开。’",
            "他喊我名字的时候，我还抓着……不，我是说，我抓着他。",
            "这时候车子……就开始晃了。",
            "那辆车就撞上来了。"
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
          "text": "我没有动过方向盘。当然，如果上面有我的指纹也不奇怪，我偶尔也会开这辆车。"
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
            "我记得那时候有光，从前面打过来。",
            "蓝的，很亮。",
            "我下意识抬手去挡。",
            "后来他们说，那是反射。可我知道那不是。",
            "那是Eli的车，我发誓。",
            "我知道很多人都觉得我疯了，但我没有，我很清醒！"
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
            "我当然没疯！",
            "警察让我去做体检，医生说我身体里有些变化，也许是压力反应……",
            "其实我几天前就觉得头晕，胃不太舒服。",
            "John 说我可能是吃坏东西。我记得他还在嘲笑我。"
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
            "你是说……我？",
            "别开玩笑了，你不能开玩笑，这违反了协议。",
            "我要举报你！"
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
            "勘查人员说护栏前的路面上有两组重叠的刹车痕。",
            "我觉得那意味着我们后方还有另一辆车，可我真的……不确定。",
            "那一瞬间，我看到了车灯的反光——淡蓝色的，一闪而过。",
            "警察说我可能认错了，他们就把这段记成‘驾驶者视线误判’。"
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
            "你也会对艺术感兴趣？还是……",
            "其实这些资料在大学的官网上都能查到。但是这对破案有帮助吗？"
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
            "Eli是他最信任的学生，也是那个基金的管理助理。",
            "Eli那孩子……John总说他聪明，但太要强。他父亲是那种一丝不苟的人。Eli从小被管得太紧，反倒养成一种奇怪的叛气。",
            "他爱改车——非要换成那种刺眼的光，说‘看起来干净、冷静’。John劝过他好几次，让他别再开那辆像实验室仪器一样的车。",
            "有时候我在想……他是不是把那股叛气带进了研究里。",
            "那天整理文件时，我看到John的草稿箱里有几封未寄出的草稿，都是写给院里的。"
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
            "他没有发出去。也许他怕真的毁了Eli的前途。",
            "现在想想，这封邮件里藏着太多东西——名字、时间、那些‘未注册的供应商’。也许你能比我看得更清楚。"
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
            "Horizon基金是John去年申请下来的一个三年期项目，预算接近60万美元，用于支持他关于AI创作神经机制的研究。Eli负责资金流的日常管理，包括采购与报销。John信任他到几乎不过问细节。",
            "三月后，账目里开始出现几笔异常支出——金额不大，每次几千，但频率很高，备注模糊，比如‘系统测试’、‘临时人力’、‘硬件调试’。John曾提到‘数据那边有人在动手脚’，可我当时没多想。"
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
            "John 说 Zoë 是 Eli 的女朋友，我觉得那只是个幌子。",
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
            "我不认识她。"
          ]
        },
        {
          "speaker": "system",
          "text": [
            "[正在解密 Project Detective]",
            "Created by: Wang Yifan (王一帆)",
            "Collaborator: GPT-5, OpenAI",
            "Contact: 📧 vegdogzhenzhen@gmail.com",
            "这不是剧情的一部分。",
            "你已经越过叙事边界。",
            "谢谢你愿意看见故事背后的我们。",
            "[文件关闭中……]"
          ]
        },
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

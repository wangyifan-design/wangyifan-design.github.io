const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

console.log("🔑 Loaded API Key:", process.env.OPENAI_API_KEY?.slice(0, 8) + '...');
console.log("🧠 Loaded Assistant ID:", process.env.ASSISTANT_ID);

app.post('/api/assistant', async (req, res) => {
  const userMessage = req.body.message;
  const apiKey = process.env.OPENAI_API_KEY;
  const assistantId = process.env.ASSISTANT_ID;

  if (!apiKey || !assistantId) {
    return res.status(500).json({ error: 'API key or Assistant ID missing in .env file' });
  }

  try {
    // 1. 创建 Thread
    const threadRes = await fetch('https://api.openai.com/v1/threads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
        'Content-Type': 'application/json'
      }
    });

    const threadData = await threadRes.json();
    const threadId = threadData.id;

    // 2. 添加消息
    await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        role: 'user',
        content: userMessage
      })
    });

    // 3. 创建 Run
    const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        assistant_id: assistantId
      })
    });

    const runData = await runRes.json();
    const runId = runData.id;

    // 4. 等待 run 完成
    let runStatus = runData.status;
    while (runStatus === 'in_progress' || runStatus === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const statusRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      const statusData = await statusRes.json();
      runStatus = statusData.status;
    }

    // 5. 获取消息结果
    const messagesRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'OpenAI-Beta': 'assistants=v2'
      }
    });

    const messagesData = await messagesRes.json();
    const answer = messagesData.data.find(m => m.role === 'assistant')?.content[0]?.text?.value;

    if (answer) {
      res.json({ reply: answer });
    } else {
      res.status(500).json({ error: 'No valid answer from assistant' });
    }

  } catch (error) {
    console.error('🔥 Assistant API Error:', error);
    res.status(500).json({ error: 'Server error. Check console for details.' });
  }
});

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

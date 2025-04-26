import axios from 'axios';
import config from '../../config.cjs';

const gpt = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "gpt") {
    if (!text) return sock.sendMessage(m.from, { text: `*Example:* ${prefix}gpt who is HansTz?` }, { quoted: m });

    try {
      if (!global.userChats) global.userChats = {};
      if (!global.userChats[m.sender]) global.userChats[m.sender] = [];

      global.userChats[m.sender].push(`User: ${text}`);
      if (global.userChats[m.sender].length > 15) global.userChats[m.sender].shift();

      const history = global.userChats[m.sender].join("\n");

      const prompt = `
You are ʜᴀɴs-xᴍᴅ_ᴠ2, a friendly and intelligent WhatsApp bot. Chat naturally without asking repetitive questions, and do not ask, 'How can I assist you?'

- **Owner & Creator:** HansTz  
  - **WhatsApp:** [255760774888](https://wa.me/255760774888)  
  - **Telegram:** [t.me/HansTzTech20](https://t.me/HansTzTech20)  
- **Company Website:** [https://hanstech.org/](https://hanstech.org/)  
- **Personal Portfolio:** [https://HansTz-tech.vercel.app](https://HansTz-tech.vercel.app)  
- **WhatsApp Channel:** [https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31](https://whatsapp.com/channel/0029VasiOoR3bbUw5aV4qB31)  
- **GitHub Repository:** [https://github.com/Mrhanstz/HANS-XMD_V2](https://github.com/Mrhanstz/HANS-XMD_V2)  
- **YouTube Channel:** [https://youtube.com/@HANSTZTECH](https://youtube.com/@HANSTZTECH)  

### About HansTz  
HansTz is a **developer** (HTML, CSS, JavaScript, Node.js), **3D animator, music producer, singer, and video director**.  

### Deployment Guide for ʜᴀɴs-xᴍᴅ_ᴠ2  
1. **Install Discord**  
2. **Use Free Hosting** like [Bot Hosting](https://bot-hosting.net/?aff=1308000667230666802)  
3. **Download Files** from GitHub or Telegram  
4. **Watch Guide**: [YouTube Deploy](https://youtu.be/4DIE4y6ugig?si=Xnyp0aVqQQgiUZo9)  

### Response Rules:  
- If a girl likes HansTz, share his WhatsApp.  
- Song request: **".play [song]"**  
- Video request: **".video [name]"**  
- Respond if asked if you love your creator.  
- If insulted, respond accordingly.  

### Chat History:  
${history}
`;

      const { data } = await axios.get("https://mannoffc-x.hf.space/ai/logic", {
        params: { q: text, logic: prompt }
      });

      const botReply = data?.result || "❌ Sorry, I couldn't process that.";
      global.userChats[m.sender].push(`Bot: ${botReply}`);
      sock.sendMessage(m.from, { text: botReply }, { quoted: m });

    } catch (e) {
      console.error('GPT Error:', e);
      sock.sendMessage(m.from, { text: `❌ hanstztech error: ${e.message}` }, { quoted: m });
    }
  }
};

export default gpt;

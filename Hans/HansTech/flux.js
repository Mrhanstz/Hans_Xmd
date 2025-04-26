import config from '../../config.cjs';

const flux = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "flux") {
    if (!text) return sock.sendMessage(m.from, { text: '❌ *Please provide a prompt for Flux image generation.*' }, { quoted: m });

    try {
      await m.React('🎨');

      const apiUrl = `https://apis.davidcyriltech.my.id/flux?prompt=${encodeURIComponent(text)}`;
      await sock.sendMessage(m.from, {
        image: { url: apiUrl },
        caption: `👨‍💻 *Flux Image Generator*\n\n📦 *Prompt:* ${text}\n> ◆ ║ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜᴀɴsᴛᴢ*`
      }, { quoted: m });

    } catch (error) {
      console.error('Error in Flux command:', error);
      sock.sendMessage(m.from, { text: `❌ *An error occurred!*\n\n> ${error.message}` }, { quoted: m });
    }
  }
};

export default flux;

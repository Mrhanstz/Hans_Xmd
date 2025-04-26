import config from '../../config.cjs';
import axios from 'axios';

const mediafire = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "mediafire") {
    await m.React("🔥");

    if (!text) {
      return sock.sendMessage(m.from, {
        text: `*Example:* ${prefix + cmd} https://www.mediafire.com/file/rmpx6iv7kiboki3/HANSTZ-master+(2).zip/file`
      }, { quoted: m });
    }

    try {
      await m.React('📥');

      const apiUrl = `https://apis.davidcyriltech.my.id/mediafire?url=${encodeURIComponent(text)}`;
      const apiResponse = await axios.get(apiUrl);

      if (apiResponse.data && apiResponse.data.downloadLink) {
        const { fileName, mimeType, downloadLink } = apiResponse.data;

        await sock.sendMessage(m.from, {
          document: { url: downloadLink },
          mimetype: mimeType,
          fileName,
          caption: `📦 *File Name:* ${fileName}\n> ◆ ║ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜᴀɴsᴛᴢ*`
        }, { quoted: m });

      } else {
        sock.sendMessage(m.from, { text: `❌ *Failed to fetch file details! Please check the MediaFire URL.*` }, { quoted: m });
      }

    } catch (error) {
      console.error('MediaFire Error:', error);
      sock.sendMessage(m.from, {
        text: `❌ *An error occurred while processing your request. Please try again later.*`
      }, { quoted: m });
    }
  }
};

export default mediafire;

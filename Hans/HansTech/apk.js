import config from '../../config.cjs';
import axios from 'axios';

const apk = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "apk") {
    if (!text) return sock.sendMessage(m.from, { text: '❌ *Please provide the APK name!*' }, { quoted: m });

    try {
      await m.React('📥'); 

      const apiUrl = `https://apis.davidcyriltech.my.id/download/apk?text=${encodeURIComponent(text)}`;
      const response = await axios.get(apiUrl, { timeout: 10000 });

      if (!response.data || !response.data.success) {
        return sock.sendMessage(m.from, { text: '❌ *Failed to fetch APK. Try again later.*' }, { quoted: m });
      }

      const { apk_name, thumbnail, download_link } = response.data;

      // Send APK details with thumbnail
      await sock.sendMessage(m.from, {
        image: { url: thumbnail },
        caption: `📥 *APK Downloader* 📥\n` +
                 `📌 *Name:* ${apk_name}\n` +
                 `> ◆ ║ᴘᴏᴡᴇʀᴇᴅ ʙʏ ʜᴀɴsᴛᴢ*`
      }, { quoted: m });

      // Send the APK file
      await sock.sendMessage(m.from, {
        document: { url: download_link },
        mimetype: 'application/vnd.android.package-archive',
        fileName: `${apk_name}.apk`
      }, { quoted: m });

    } catch (error) {
      console.error('Error in APK Downloader:', error?.response?.data || error.message);

      let errorMsg = '❌ *An unexpected error occurred. Try again later.*';
      if (error.code === 'ECONNABORTED') {
        errorMsg = '⚠️ *API request timed out. Please try again.*';
      } else if (error.response && error.response.status === 404) {
        errorMsg = '❌ *APK not found. Please check the name and try again.*';
      }

      sock.sendMessage(m.from, { text: errorMsg }, { quoted: m });
    }
  }
};

export default apk;
